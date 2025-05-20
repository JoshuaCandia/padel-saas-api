// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UsersValidatorService } from '../validators/users-validator.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersValidator: UsersValidatorService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { phone, email, password } = createUserDto;

    await this.usersValidator.validateUniqueUser(phone, email);

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      ...createUserDto,
      hashedPassword,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado por email');
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado por id');
    }
    return user;
  }
}
