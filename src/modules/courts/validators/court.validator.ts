import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateCourtDto } from '../dto/create-court.dto';
import { CourtRepository } from '../repositories/court.repository';

@Injectable()
export class CourtValidatorService {
  constructor(private readonly repo: CourtRepository) {}

  async validateCreate(dto: CreateCourtDto): Promise<void> {
    const name = dto.name.trim();

    if (name.length < 3 || name.length > 50) {
      throw new BadRequestException(
        'El nombre debe tener entre 3 y 50 caracteres',
      );
    }

    const exists = await this.repo.findByName(name);
    if (exists) {
      throw new ConflictException(`La cancha "${name}" ya existe`);
    }

    if (dto.hourlyRate <= 0) {
      throw new BadRequestException('El precio por hora debe ser mayor a 0');
    }
  }
}
