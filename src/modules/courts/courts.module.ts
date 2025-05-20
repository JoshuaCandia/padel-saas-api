import { Module } from '@nestjs/common';
import { CourtsService } from './services/courts.service';
import { CourtRepository } from './repositories/court.repository';
import { CourtValidatorService } from './validators/court.validator';
import { CourtsController } from './controllers/courts.controller';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourtsController],
  providers: [CourtsService, CourtRepository, CourtValidatorService],
  exports: [CourtsService],
})
export class CourtsModule {}
