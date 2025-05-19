// auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
