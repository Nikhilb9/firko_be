import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../common/services/jwt.service';
import { UserRepositoryService } from '../user/user.repository.service'; // UserService to interact with DB
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto'; // DTO for login data
import { User } from '../user/schemas/user.schema';
import { IAuthData } from './interface/auth.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepoService: UserRepositoryService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<IAuthData> {
    const { email, password, phone } = loginDto;

    let user: User | null = null;
    // Check if the user exists
    if (email) {
      user = await this.usersRepoService.findOneByEmail(email);
    } else if (phone) {
      user = await this.usersRepoService.findOneByPhone(phone);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT token if the password is valid
    const payload = { id: user?._id?.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      token: accessToken,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      id: String(user._id),
    };
  }

  async register(registerDto: RegisterDto): Promise<IAuthData> {
    const { phone, password, firstName, lastName, email } = registerDto;

    let existingUser: User | null = null;
    const userUniqueValue: { phone?: string; email?: string } = {};
    // Check if the user exists
    if (email) {
      existingUser = await this.usersRepoService.findOneByEmail(email);
      userUniqueValue['email'] = email;
    } else if (phone) {
      existingUser = await this.usersRepoService.findOneByPhone(phone);
      userUniqueValue['phone'] = phone;
    }

    if (existingUser) {
      throw new ConflictException(`${phone ? phone : email} already exists`);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the repository method to create and save the user
    const user = await this.usersRepoService.createUser({
      ...userUniqueValue,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Create JWT token if the password is valid
    const payload = { id: user?._id?.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      token: accessToken,
      ...userUniqueValue,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      id: String(user._id),
    };
  }
}
