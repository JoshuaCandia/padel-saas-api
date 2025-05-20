// src/users/users-validator.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersValidatorService {
  constructor(private usersRepository: UsersRepository) {}

  async validateUniqueUser(phone: string, email?: string) {
    const userByPhone = await this.usersRepository.findByPhone(phone);
    if (userByPhone) {
      throw new ConflictException('El teléfono ya está registrado');
    }

    if (email) {
      const userByEmail = await this.usersRepository.findByEmail(email);
      if (userByEmail) {
        throw new ConflictException('El email ya está registrado');
      }
    }
  }
}
