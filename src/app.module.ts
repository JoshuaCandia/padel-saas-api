import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { PrismaModule } from '@/common/infraestructure/prisma/prisma.module';
import { ReservationsModule } from '@/modules/reservations/reservations.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { CourtsModule } from '@/modules/courts/courts.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    PrismaModule,
    ReservationsModule,
    UsersModule,
    CourtsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
