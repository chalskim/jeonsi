import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Zod 스키마 정의
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9-+().\s]+$/, 'Invalid phone number format'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z
    .string()
    .regex(/^[0-9-+().\s]+$/, 'Invalid phone number format')
    .optional(),
  isActive: z.boolean().optional(),
});

export const UserQuerySchema = z.object({
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

// DTO 클래스들
export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User phone number', example: '+82-10-1234-5678' })
  phone: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ description: 'User phone number', example: '+82-10-1234-5678', required: false })
  phone?: string;

  @ApiProperty({ description: 'User active status', example: true, required: false })
  isActive?: boolean;
}

export class UserQueryDto {
  @ApiProperty({ description: 'Filter by active status', example: true, required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'Search by name or email', example: 'john', required: false })
  search?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User phone number', example: '+82-10-1234-5678' })
  phone: string;

  @ApiProperty({ description: 'User active status', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
