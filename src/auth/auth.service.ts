import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDro: CreateUserDto): Promise<void> {
    const { email, firstname, lastname, username, password } = createUserDro;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        username,
        password: hashedPassword,
      },
    });
  }

  async login(
    email: string,
    username: string,
    password: string,
  ): Promise<string> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email }, { username }],
      },
    });

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '1h',
    });
  }

  async verifyJwt(accessToken: string): Promise<boolean> {
    if (!accessToken) {
      throw new Error('Invalid access token');
    }
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not set in environment variables');
      }
      const decoded = this.jwtService.verify(accessToken, {
        secret,
      });
      return !!decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return false;
    }
  }

  async signJwt(payload: Record<string, any>, secret: string): Promise<string> {
    if (!secret) {
      throw new Error('JWT secret is not provided');
    }
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: '1h',
    });
  }
}
