// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { phone, name, surname, email } = createUserDto;

    const userExists = await this.prisma.user.findUnique({ where: { phone } });
    if (userExists) {
      return userExists;
    }

    // Crear nuevo usuario
    const user = await this.prisma.user.create({
      data: {
        phone,
        name,
        surname,
        email: email ?? null,
        role: 'USER',
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
