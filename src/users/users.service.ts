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

    // Verificar si existe usuario por teléfono
    const userExists = await this.prisma.user.findUnique({ where: { phone } });
    if (userExists) {
      // Podés retornar el usuario existente o lanzar error si querés
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

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }
}
