import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * inject userservise
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * inject hashprovider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * generate token provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    //find the user using email ID
    // throw an exception user not password
    const user = await this.usersService.findOneByEmail(signInDto.email);

    //compare password to the hash
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    return await this.generateTokenProvider.generateTokens(user);
  }
}
