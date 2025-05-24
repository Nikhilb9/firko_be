import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryService } from './user.repository.service'; // Assuming you have a repo
import { IUpdatePassword, IUserProfile } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepositorySer: UserRepositoryService) {}

  async getProfile(userId: string): Promise<IUserProfile> {
    const user: User | null = await this.userRepositorySer.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      latitude: user.latitude,
      longitude: user.longitude,
      profileImage: user.profileImage,
      languages: user.languages,
      phone: user.phone,
      email: user.email,
      experience: user.experience,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileData: UpdateProfileDto,
  ): Promise<void> {
    const user = await this.userRepositorySer.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const dataToUpdate = updateProfileData;

    if (updateProfileData.phone && user.phone !== updateProfileData.phone) {
      const isPhoneExist: User | null =
        await this.userRepositorySer.findOneByPhone(updateProfileData.phone);
      if (isPhoneExist) {
        throw new ConflictException(
          `${updateProfileData.phone} already exists`,
        );
      }
      dataToUpdate['isPhoneVerified'] = false;
    }
    if (updateProfileData.email && user.email !== updateProfileData.email) {
      const isEmailExist: User | null =
        await this.userRepositorySer.findOneByEmail(updateProfileData.email);
      if (isEmailExist) {
        throw new ConflictException(
          `${updateProfileData.email} already exists`,
        );
      }
      dataToUpdate['isEmailVerified'] = false;
    }

    await this.userRepositorySer.updateUser(userId, { ...dataToUpdate });
  }

  async updatePassword(
    userId: string,
    changePasswordDto: IUpdatePassword,
  ): Promise<void> {
    const user = await this.userRepositorySer.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    // Change to new password
    await this.userRepositorySer.updatePassword(userId, hashedPassword);
  }
}
