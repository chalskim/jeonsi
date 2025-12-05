import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  async login(@Request() req) {
    // Check if we have a specific error message from the LocalStrategy
    if (req.user && req.user.message) {
      if (req.user.message === 'User not found. Please register first.') {
        throw new UnauthorizedException('User not found. Please register first.');
      } else if (req.user.message === 'Invalid password') {
        throw new UnauthorizedException('Invalid password');
      }
    }

    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        name: { type: 'string', example: 'John Doe' },
        phone: { type: 'string', example: '010-1234-5678' },
        role: {
          type: 'string',
          enum: ['company', 'person', 'admin', 'master'],
          example: 'person',
        },
      },
      required: ['email', 'password', 'name'],
    },
  })
  async register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }
}
