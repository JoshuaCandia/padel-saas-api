import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  phone: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    if (!email) throw new UnauthorizedException('Email is required');

    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.comparePasswords(pass, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async comparePasswords(
    plainText: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  async login(user: { id: string; phone: string; role: string }) {
    const payload: JwtPayload = {
      phone: user.phone,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
