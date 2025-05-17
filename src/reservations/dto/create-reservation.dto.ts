// src/reservations/dto/create-reservation.dto.ts
import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  isPermanent: boolean;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  courtId: string;
}
