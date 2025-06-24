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

// Hardcoded OTP for development
const HARDCODED_OTP = '1234';

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
  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    const { phone } = requestOtpDto;

    // Set OTP expiration time (5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Find user by phone or create a new user record
    let user = await this.usersRepoService.findOneByPhone(phone);

    if (!user) {
      // Create a minimal user record with just the phone number
      user = await this.usersRepoService.createUser({
        phone,
        firstName: 'User', // Temporary name until user completes registration
        lastName: '',
      });
    }

    // Ensure user is of type User

    // Update user with OTP
    await this.usersRepoService.updateOtp(
      String(user._id),
      HARDCODED_OTP,
      expiresAt,
    );

    // In production, we would send the OTP via SMS here
    // For development, we return the OTP in the response
    return {
      message: `OTP sent to ${phone}. For development, use: ${HARDCODED_OTP}`,
    };
  }

  /**
   * Verify OTP and authenticate/register the user
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<IAuthData> {
    const { phone, otp, firstName, lastName, email } = verifyOtpDto;

    // Find user by phone
    const user = await this.usersRepoService.findOneByPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure user is of type User
    const typedUser = user as unknown as User;

    // Check if OTP exists and is valid
    if (
      !typedUser.otp ||
      typedUser.otp !== otp ||
      !typedUser.otpExpiresAt ||
      typedUser.otpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Determine if this is a first-time user or returning user
    const isNewUser = !typedUser.isPhoneVerified;

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
    const updatedUser = await this.usersRepoService.updateUser(
      String(typedUser._id),
      updateData,
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    // Ensure updatedUser is of type User
    const typedUpdatedUser = updatedUser as unknown as User;

    // Create JWT token
    const updatedUserId = String(typedUpdatedUser._id);
    const payload = { id: updatedUserId, phone: typedUpdatedUser.phone };
    const accessToken = this.jwtService.sign(payload);

    return {
      token: accessToken,
      phone: typedUpdatedUser.phone || '',
      firstName: typedUpdatedUser.firstName,
      lastName: typedUpdatedUser.lastName,
      address: typedUpdatedUser.address || '',
      email: typedUpdatedUser.email || '',
      id: updatedUserId,
      isNewUser,
    };
  }
}
