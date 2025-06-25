import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { IAuthData } from './interface/auth.interface';
import { ResponseMessage } from 'src/common/utils/api-response-message.util';
import { RequestOtpDto, VerifyOtpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for phone number' })
  @ApiBody({ type: RequestOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sent successfully',
    type: ApiResponseDto<{ message: string }>,
  })
  async requestOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<ApiResponseDto<{ message: string }>> {
    const result = await this.authService.requestOtp(requestOtpDto);
    return new ApiResponseDto<{ message: string }>(
      HttpStatus.OK,
      'SUCCESS',
      'OTP sent successfully',
      { message: result },
    );
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and login/register user' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    type: ApiResponseDto<IAuthData>,
  })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<ApiResponseDto<IAuthData>> {
    const user = await this.authService.verifyOtp(verifyOtpDto);
    const message = user.isNewUser
      ? ResponseMessage.registeredSuccessfully()
      : ResponseMessage.loggedInSuccessfully();

    return new ApiResponseDto<IAuthData>(
      HttpStatus.OK,
      'SUCCESS',
      message,
      user,
    );
  }
}
