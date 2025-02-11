import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * generate token provider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,

    /**
     * inject userservise
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using jwtservice
      const { email } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'email'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      // fetch user from the database
      const user = await this.usersService.findOneByEmail(email);

      // generate the token
      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
