import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryService } from './user.repository.service'; // Assuming you have a repo
import { IUserProfile } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnboardUserDto } from './dto/onboard-user.dto';

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
      gender: user.gender,
      age: user.age,
      isOnboarded: user.isOnboarded,
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

  async onboardUser(
    userId: string,
    onboardData: OnboardUserDto,
  ): Promise<IUserProfile> {
    const user = await this.userRepositorySer.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const dataToUpdate = {
      ...onboardData,
      isOnboarded: true,
    };

    // Check if email is provided and different from current email
    if (onboardData.email && user.email !== onboardData.email) {
      const isEmailExist = await this.userRepositorySer.findOneByEmail(
        onboardData.email,
      );
      if (isEmailExist) {
        throw new ConflictException(`${onboardData.email} already exists`);
      }
      dataToUpdate['isEmailVerified'] = false;
    }

    const updatedUser = await this.userRepositorySer.updateUser(
      userId,
      dataToUpdate,
    );

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    return this.getProfile(userId);
  }
}
