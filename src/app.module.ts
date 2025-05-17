import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ReservationsModule } from '@/reservations/reservations.module';
import { AdminModule } from '@/admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    PrismaModule,
    ReservationsModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
