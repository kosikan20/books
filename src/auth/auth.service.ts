import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(createUserDro: CreateUserDto): Promise<void> {
    const { email, firstname, lastname, username, password } = createUserDro;

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error('User already exists');
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

  async login(username: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(user.password, password);

    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.username, userId: user.id };

    const secret = '';
    const options: jwt.SignOptions = { expiresIn: '1h' };
    const jwtToken = await this.signJwt(payload, secret, options);
    return jwtToken;
  }

  async verifyJwt(accessToken: string): Promise<boolean> {
    if (!accessToken) {
      throw new Error('Invalid access token');
    }
    try {
      // Verify the JWT token
      const decoded = jwt.verify(accessToken, 'your-secret-key'); // Replace with your secret key
      return !!decoded; // Return true if the token is valid
    } catch (error) {
      console.error('JWT verification failed:', error);
      return false; // Return false if the token is invalid
    }
  }

  async signJwt(
    payload: Record<string, any>,
    secret: string,
    options?: jwt.SignOptions,
  ): Promise<string> {
    return jwt.sign(payload, secret, options);
  }
}
