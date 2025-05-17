import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from '@/reservations/dto/create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  isAbsent?: boolean;
}
