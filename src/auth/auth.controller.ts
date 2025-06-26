import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string }> {
    await this.authService.register(body.email, body.password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(body.email, body.password);
    return { accessToken };
  }

  @Post('logout')
  async logout(
    @Body() body: { accessToken: string },
  ): Promise<{ message: string }> {
    await this.authService.logout(body.accessToken);
    return { message: 'User logged out successfully' };
  }
}
