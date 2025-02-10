import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
