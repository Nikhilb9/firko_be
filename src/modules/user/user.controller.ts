import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { IUserProfile } from './interfaces/user.interface';
import { GetProfileResponseDto } from './dto/get-profile.dto';
import { UpdatePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';
import { IAuthData } from '../auth/interface/auth.interface';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(GetProfileResponseDto)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('/profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  async updateProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<GetProfileResponseDto>> {
    await this.userService.updateProfile(req.user.id, updateProfileData);
    return new ApiResponseDto(
      200,
      'SUCCESS',
      'User profile updated successfully',
    );
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: ApiResponseDto<GetProfileResponseDto>,
  })
  async getProfile(
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<GetProfileResponseDto>> {
    console.log(req.user);
    const profile: IUserProfile = await this.userService.getProfile(
      req.user.id,
    );
    return new ApiResponseDto<GetProfileResponseDto>(
      200,
      'SUCCESS',
      'User profile',
      profile,
    );
  }

  @Put('/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
  })
  async updatePassword(
    @Body() updatePasswordData: UpdatePasswordDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<''>> {
    await this.userService.updatePassword(req.user.id, updatePasswordData);
    return new ApiResponseDto(200, 'SUCCESS', 'Password updated successfully');
  }
}
