import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email, password, name, surname, phone } = createAdminDto;

    const adminExists = await this.prisma.user.findUnique({ where: { email } });
    if (adminExists)
      throw new ConflictException('Admin email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        phone,
        role: 'ADMIN',
      },
    });

    return admin;
  }

  // Métodos para administrar reservas

  async findAllReservations() {
    return this.prisma.reservation.findMany();
  }

  async updateReservation(id: string, dto: UpdateReservationDto) {
    const exists = await this.prisma.reservation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Reservation not found');
    return this.prisma.reservation.update({
      where: { id },
      data: dto,
    });
  }

  async deleteReservation(id: string) {
    const exists = await this.prisma.reservation.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Reservation not found');
    return this.prisma.reservation.delete({ where: { id } });
  }

  async markAsAbsent(id: string) {
    return this.updateReservation(id, { isAbsent: true });
  }

  async suspendCourt(courtId: string, date: string) {
    return this.prisma.reservation.create({
      data: {
        time: '00:00',
        courtId,
        date,
        phone: 'ADMIN',
        name: 'SUSPENDIDO',
        surname: '',
        email: 'suspendido@admin.com',
        isPermanent: false,
        isAbsent: false,
      },
    });
  }
}
