// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    const token = this.jwtService.sign({ sub: user._id });
    return {
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user._id, isAdmin: user.isAdmin || false });
    return {
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin || false },
      token,
    };
  }

  async adminLogin(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isAdmin) {
      throw new UnauthorizedException('Access denied. Admin privileges required.');
    }
    const token = this.jwtService.sign({ sub: user._id, isAdmin: true });
    return {
      message: 'Admin login successful',
      user: { id: user._id, name: user.name, email: user.email, isAdmin: true },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt,
    };
  }
}