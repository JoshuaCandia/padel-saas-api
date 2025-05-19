import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @Roles('ADMIN')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

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
}
