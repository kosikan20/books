import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<{ message: string }> {
    await this.authService.register(body);
    return { message: 'User registered successfully' };
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { email: string; username: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(
      body.email,
      body.username,
      body.password,
    );
    return { accessToken };
  }
}
