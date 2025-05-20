import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  IsPositive,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

enum CourtFeature {
  LIGHTING = 'LIGHTING',
  COVERED = 'COVERED',
}

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isIndoor: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  hourlyRate: number;

  @IsArray()
  @IsOptional()
  features?: CourtFeature[];
}
