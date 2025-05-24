import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { IAuthData } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user with email or phone' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: ApiResponseDto<IAuthData>,
  })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<IAuthData>> {
    const user = await this.authService.login(loginDto);
    return new ApiResponseDto<IAuthData>(
      HttpStatus.OK,
      'SUCCESS',
      'User logged in successfully',
      user,
    );
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: ApiResponseDto<IAuthData>,
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponseDto<IAuthData>> {
    const user = await this.authService.register(registerDto);
    return new ApiResponseDto<IAuthData>(
      HttpStatus.OK,
      'SUCCESS',
      'User registered successfully',
      user,
    );
  }
}
