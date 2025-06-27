import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { IUserProfile } from './interfaces/user.interface';
import { GetProfileResponseDto } from './dto/get-profile.dto';
import { UserService } from './user.service';
import { IAuthData } from '../auth/interface/auth.interface';
import { ResponseMessage } from '../../common/utils/api-response-message.util';
import { OnboardUserDto } from './dto/onboard-user.dto';

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
    status: HttpStatus.OK,
    description: ResponseMessage.updated('User profile'),
  })
  async updateProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<GetProfileResponseDto>> {
    await this.userService.updateProfile(req.user.id, updateProfileData);
    return new ApiResponseDto(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.updated('User profile'),
    );
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessage.fetchedSuccessfully('User profile'),
    type: ApiResponseDto<GetProfileResponseDto>,
  })
  async getProfile(
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<GetProfileResponseDto>> {
    const profile: IUserProfile = await this.userService.getProfile(
      req.user.id,
    );
    return new ApiResponseDto<GetProfileResponseDto>(
      HttpStatus.OK,
      'SUCCESS',
      ResponseMessage.fetchedSuccessfully('User profile'),
      profile,
    );
  }

  @Post('/onboard')
  @ApiOperation({ summary: 'Onboard user with additional information' })
  @ApiBody({ type: OnboardUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User onboarded successfully',
    type: ApiResponseDto<GetProfileResponseDto>,
  })
  async onboardUser(
    @Body() onboardData: OnboardUserDto,
    @Request() req: Request & { user: IAuthData },
  ): Promise<ApiResponseDto<GetProfileResponseDto>> {
    const profile: IUserProfile = await this.userService.onboardUser(
      req.user.id,
      onboardData,
    );
    return new ApiResponseDto<GetProfileResponseDto>(
      HttpStatus.OK,
      'SUCCESS',
      'User onboarded successfully',
      profile,
    );
  }
}
