// src/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto & { hashedPassword: string }) {
    return this.prisma.user.create({
      data: {
        phone: data.phone,
        name: data.name,
        surname: data.surname,
        email: data.email ?? null,
        password: data.hashedPassword,
        role: 'USER',
      },
    });
  }

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
