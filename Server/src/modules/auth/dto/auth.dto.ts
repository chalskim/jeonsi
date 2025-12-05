import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Zod 스키마 정의
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9-+().\s]+$/, 'Invalid phone number format'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// DTO 클래스들
export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User phone number', example: '+82-10-1234-5678' })
  phone: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password', example: 'oldpassword123' })
  currentPassword: string;

  @ApiProperty({ description: 'New password', example: 'newpassword123' })
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token', example: 'reset-token-string' })
  token: string;

  @ApiProperty({ description: 'New password', example: 'newpassword123' })
  newPassword: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    name: string;
  };
}
