import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateCourtDto } from '../dto/create-court.dto';
import { CourtsRepository } from '../repositories/court.repository';

@Injectable()
export class CourtValidatorService {
  constructor(private readonly repo: CourtsRepository) {}

  async validateCreateCourt(dto: CreateCourtDto) {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('El nombre de la cancha es obligatorio.');
    }
    if (name.length < 3 || name.length > 50) {
      throw new BadRequestException(
        'El nombre debe tener entre 3 y 50 caracteres.',
      );
    }
    const exists = await this.repo.findByName(name);
    if (exists) {
      throw new ConflictException(`Ya existe una cancha con nombre "${name}".`);
    }
  }
}
