import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cart: {
      create: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.cart.create.mockResolvedValue({ id: 1 });
      mockPrismaService.session.create.mockResolvedValue({ id: 1 });
      mockJwtService.sign.mockReturnValue('test_token');

      const result = await service.register(registerDto);

      expect(result.access_token).toBe('test_token');
      expect(result.user.email).toBe(registerDto.email);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password:
          '$2b$10$UHaZ2QPf6ptM1twnzMnqb.PvIhULm3PSZB1x01RR3Mob1hqd2lGN2', // bcrypt hash of 'password123'
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.session.deleteMany.mockResolvedValue({});
      mockPrismaService.session.create.mockResolvedValue({ id: 1 });
      mockJwtService.sign.mockReturnValue('test_token');

      const result = await service.login(loginDto);

      expect(result.access_token).toBeDefined();
      expect(mockPrismaService.session.deleteMany).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateSession', () => {
    it('should return true for valid session', async () => {
      const userId = 1;
      const mockSession = {
        id: 1,
        userId,
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.session.findFirst.mockResolvedValue(mockSession);
      mockPrismaService.session.update.mockResolvedValue(mockSession);

      const result = await service.validateSession(userId);

      expect(result).toBe(true);
      expect(mockPrismaService.session.update).toHaveBeenCalled();
    });

    it('should return false for expired session', async () => {
      const userId = 1;

      mockPrismaService.session.findFirst.mockResolvedValue(null);

      const result = await service.validateSession(userId);

      expect(result).toBe(false);
    });
  });
});
