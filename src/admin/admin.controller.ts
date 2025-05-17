import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '@/auth/roles.ward';
import { Roles } from '../auth/roles.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @Roles('ADMIN')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // Rutas de administración para reservas

  @Get('reservations')
  @Roles('ADMIN')
  findAllReservations() {
    return this.adminService.findAllReservations();
  }

  @Patch('reservations/:id')
  @Roles('ADMIN')
  updateReservation(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.adminService.updateReservation(id, dto);
  }

  @Delete('reservations/:id')
  @Roles('ADMIN')
  deleteReservation(@Param('id') id: string) {
    return this.adminService.deleteReservation(id);
  }

  @Patch('reservations/:id/absent')
  @Roles('ADMIN')
  markAsAbsent(@Param('id') id: string) {
    return this.adminService.markAsAbsent(id);
  }

  @Post('reservations/suspend')
  @Roles('ADMIN')
  suspendCourt(@Body() body: { courtId: string; date: string }) {
    return this.adminService.suspendCourt(body.courtId, body.date);
  }
}
