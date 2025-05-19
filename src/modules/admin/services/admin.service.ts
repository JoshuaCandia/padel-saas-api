import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { AdminValidatorService } from '../validators/admin-validator.service';
import { AdminRepository } from '../repositories/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly validator: AdminValidatorService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    this.validator.validateCreateAdmin(createAdminDto);

    const { email, password, name, surname, phone } = createAdminDto;
    const exists = await this.repo.findUserByEmail(email);
    if (exists) throw new ConflictException('El email ya está registrado.');

    const hashed = await bcrypt.hash(password, 10);
    try {
      const admin = await this.repo.createUser({
        email,
        password: hashed,
        name,
        surname,
        phone,
        role: 'ADMIN',
      });

      const { password: _, ...rest } = admin;
      return rest;
    } catch (err) {
      throw new InternalServerErrorException('Error al crear el admin.');
    }
  }

  async findAllReservations() {
    try {
      return await this.repo.findAllReservations();
    } catch (err) {
      throw new InternalServerErrorException('Error al obtener las reservas');
    }
  }

  async updateReservation(id: string, dto: UpdateReservationDto) {
    if (!id) throw new BadRequestException('ID es requerido');

    const exists = await this.repo.findReservationById(id);
    if (!exists) throw new NotFoundException('Reserva no encontrada');

    try {
      return await this.repo.updateReservation(id, dto);
    } catch (err) {
      throw new InternalServerErrorException('Error al actualizar la reserva');
    }
  }

  async deleteReservation(id: string) {
    if (!id) throw new BadRequestException('ID es requerido');

    const exists = await this.repo.findReservationById(id);
    if (!exists) throw new NotFoundException('Reserva no encontrada');

    try {
      return await this.repo.deleteReservation(id);
    } catch (err) {
      throw new InternalServerErrorException('Error al eliminar la reserva');
    }
  }

  async markAsAbsent(id: string) {
    if (!id) throw new BadRequestException('ID es requerido');
    return this.updateReservation(id, { isAbsent: true });
  }
}
