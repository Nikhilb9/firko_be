import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../common/services/jwt.service';
import { UserRepositoryService } from '../user/user.repository.service';
import { IAuthData } from './interface/auth.interface';
import { RequestOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { User } from '../user/schemas/user.schema';
import { DEVELOPMENT_HARD_CODED_OTP } from 'src/config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepoService: UserRepositoryService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Request OTP for a phone number
   * In production, this would send an SMS
   */
  async requestOtp(requestOtpDto: RequestOtpDto): Promise<string> {
    const { phone } = requestOtpDto;

    // Set OTP expiration time (5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Find user by phone or create a new user record
    let user: User | null = await this.usersRepoService.findOneByPhone(phone);

    // Create a minimal user record with just the phone number
    user ??= await this.usersRepoService.createUser({
      phone,
      firstName: 'User', // Temporary name until user completes registration
      lastName: '',
    });

    // Update user with OTP
    await this.usersRepoService.updateOtp(
      String(user._id),
      DEVELOPMENT_HARD_CODED_OTP,
      expiresAt,
    );

    // In production, we would send the OTP via SMS here
    // For development, we return the OTP in the response

    return `OTP sent to ${phone}. For development, use: ${DEVELOPMENT_HARD_CODED_OTP}`;
  }

  /**
   * Verify OTP and authenticate/register the user
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<IAuthData> {
    const { phone, otp, firstName, lastName, email } = verifyOtpDto;

    // Find user by phone
    const user: User | null = await this.usersRepoService.findOneByPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if OTP exists and is valid
    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Update user profile
    const updateData: Record<string, any> = {
      isPhoneVerified: true,
      otp: null,
      otpExpiresAt: null,
    };

    // Add optional fields if provided
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    // Update user
    const updatedUser: User | null = await this.usersRepoService.updateUser(
      String(user._id),
      updateData,
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    // Create JWT token
    const updatedUserId = String(updatedUser._id);
    const payload = { id: updatedUserId, phone: updatedUser.phone };
    const accessToken = this.jwtService.sign(payload);

    return {
      token: accessToken,
      phone: updatedUser.phone ?? '',
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName ?? '',
      address: updatedUser.address ?? '',
      email: updatedUser.email ?? '',
      id: updatedUserId,
      isNewUser: !user.isPhoneVerified,
    };
  }
}
