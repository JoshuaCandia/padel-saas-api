// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersValidatorService } from './validators/users-validator.service';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';

@Module({
  providers: [
    UsersService,
    UsersRepository,
    UsersValidatorService,
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
