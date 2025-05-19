import {
  IsDateString,
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsBoolean()
  isPermanent: boolean;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  courtId: string;
}
