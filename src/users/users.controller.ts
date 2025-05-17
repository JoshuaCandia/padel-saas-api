import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Get('by-email/:email')
  async getByPhone(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException();
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
