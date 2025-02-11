import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    // injecting Auth Service
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'User sign-in',
  })
  @ApiResponse({
    status: 200,
    description: 'Users sign-in successfully',
  })
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
