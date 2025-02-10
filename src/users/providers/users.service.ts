import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** inject auth service */
  constructor(
    /**
     * injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    //inject auth service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * inject find one user by email provider
     */
    private readonly findOneUserEmailProvider: FindUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /** The method to get all the users from the database */
  public async findAll() {
    return await this.usersRepository.find();
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserEmailProvider.findOneByEmail(email);
  }
}
