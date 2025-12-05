import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Zod 스키마 정의
export const CreateCompanySchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
  size: z.string().min(1, 'Company size is required'),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  address: z.string().optional(),
});

export const UpdateCompanySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  industry: z.string().min(2, 'Industry must be at least 2 characters').optional(),
  size: z.string().min(1, 'Company size is required').optional(),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL').optional(),
  address: z.string().optional(),
});

export const CompanyQuerySchema = z.object({
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
});

// DTO 클래스들
export class CreateCompanyDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Company name', example: 'Tech Solutions Inc.' })
  companyName: string;

  @ApiProperty({ description: 'Industry', example: 'Technology' })
  industry: string;

  @ApiProperty({ description: 'Company size', example: '50-100' })
  size: string;

  @ApiProperty({
    description: 'Company description',
    example: 'Leading technology solutions provider',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Company website',
    example: 'https://techsolutions.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Tech Street, Seoul, South Korea',
    required: false,
  })
  address?: string;
}

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Company name', example: 'Tech Solutions Inc.', required: false })
  companyName?: string;

  @ApiProperty({ description: 'Industry', example: 'Technology', required: false })
  industry?: string;

  @ApiProperty({ description: 'Company size', example: '50-100', required: false })
  size?: string;

  @ApiProperty({
    description: 'Company description',
    example: 'Leading technology solutions provider',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Company website',
    example: 'https://techsolutions.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Tech Street, Seoul, South Korea',
    required: false,
  })
  address?: string;
}

export class CompanyQueryDto {
  @ApiProperty({ description: 'Filter by industry', example: 'Technology', required: false })
  industry?: string;

  @ApiProperty({ description: 'Filter by company size', example: '50-100', required: false })
  size?: string;

  @ApiProperty({ description: 'Filter by location', example: 'Seoul', required: false })
  location?: string;
}

export class CompanyResponseDto {
  @ApiProperty({ description: 'Company ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Company name', example: 'Tech Solutions Inc.' })
  companyName: string;

  @ApiProperty({ description: 'Industry', example: 'Technology' })
  industry: string;

  @ApiProperty({ description: 'Company size', example: '50-100' })
  size: string;

  @ApiProperty({
    description: 'Company description',
    example: 'Leading technology solutions provider',
  })
  description: string;

  @ApiProperty({ description: 'Company website', example: 'https://techsolutions.com' })
  website: string;

  @ApiProperty({ description: 'Company address', example: '123 Tech Street, Seoul, South Korea' })
  address: string;

  @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
}
