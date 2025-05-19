import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { PrismaService } from '@/common/infraestructure/prisma/prisma.service';
import { AdminRepository } from './repositories/admin.repository';
import { AdminValidatorService } from './validators/admin-validator.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    PrismaService,
    AdminValidatorService,
  ],
})
export class AdminModule {}
