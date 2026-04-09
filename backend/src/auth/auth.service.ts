import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists. Please use a different email.',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
    });

    // Create cart for new user
    await this.prismaService.cart.create({
      data: {
        userId: user.id,
      },
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await this.prismaService.session.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    const access_token = this.generateToken(user.id, user.email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials.',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials.',
      );
    }

    // Invalidate old sessions
    await this.prismaService.session.deleteMany({
      where: { userId: user.id },
    });

    // Create new session
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await this.prismaService.session.create({
      data: {
        userId: user.id,
        expiresAt,
      },
    });

    const access_token = this.generateToken(user.id, user.email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: { userId },
    });
  }

  async validateSession(userId: number): Promise<boolean> {
    const session = await this.prismaService.session.findFirst({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      return false;
    }

    // Update session expiry to extend 30 minutes from now
    const newExpiresAt = new Date();
    newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 30);

    await this.prismaService.session.update({
      where: { id: session.id },
      data: { expiresAt: newExpiresAt },
    });

    return true;
  }

  private generateToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '30m',
      secret: process.env.JWT_SECRET || 'default-secret-key',
    });
  }
}
