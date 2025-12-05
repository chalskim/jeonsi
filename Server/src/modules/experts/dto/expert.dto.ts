import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  Length,
  IsInt,
  Min,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

// Zod 스키마 정의
export const CreateExpertSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  specialty: z.string().optional(),
  experienceYears: z.number().int().min(0, 'Experience must be a non-negative number').optional(),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  dailyRate: z.number().positive('Daily rate must be positive').optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  availability: z.string().optional(),
});

export const UpdateExpertSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().optional(),
  specialty: z.string().optional(),
  experienceYears: z.number().int().min(0, 'Experience must be a non-negative number').optional(),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  dailyRate: z.number().positive('Daily rate must be positive').optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  availability: z.string().optional(),
});

export const ExpertQuerySchema = z.object({
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  minRating: z.number().int().min(0).optional(),
});

// DTO 클래스들
export class CreateExpertDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Consultant name', example: 'Jane Doe' })
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'Expert biography',
    example: 'Experienced consultant in ISMS and ISO27001',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Specialty (JSON or string)',
    example: '{"areas": ["ISMS-P", "ISO27001"]}',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ description: 'Years of experience', example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  experienceYears?: number;

  @ApiProperty({ description: 'Hourly rate', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  hourlyRate?: number;

  @ApiProperty({ description: 'Daily rate', example: 800, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dailyRate?: number;

  @ApiProperty({ description: 'Location', example: 'Seoul', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Languages', example: ['Korean', 'English'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    description: 'Availability as JSON or string',
    example: '{"monday": "9-17"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  availability?: string;
}

export class UpdateExpertDto {
  @ApiProperty({ description: 'Consultant name', example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 255)
  name?: string;

  @ApiProperty({
    description: 'Expert biography',
    example: 'Experienced consultant in ISMS and ISO27001',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Specialty (JSON or string)',
    example: '{"areas": ["ISMS-P", "ISO27001"]}',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ description: 'Years of experience', example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  experienceYears?: number;

  @ApiProperty({ description: 'Hourly rate', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  hourlyRate?: number;

  @ApiProperty({ description: 'Daily rate', example: 800, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dailyRate?: number;

  @ApiProperty({ description: 'Location', example: 'Seoul', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Languages', example: ['Korean', 'English'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    description: 'Availability as JSON or string',
    example: '{"monday": "9-17"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  availability?: string;
}

export class ExpertQueryDto {
  @ApiProperty({ description: 'Filter by location', example: 'Seoul', required: false })
  location?: string;

  @ApiProperty({ description: 'Filter by languages', example: ['Korean'], required: false })
  languages?: string[];

  @ApiProperty({ description: 'Minimum rating', example: 4, required: false })
  minRating?: number;
}

export class ExpertResponseDto {
  @ApiProperty({ description: 'Expert ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Consultant name', example: 'Jane Doe' })
  name: string;

  @ApiProperty({
    description: 'Specialty (JSON as string)',
    example: '{"areas": ["ISMS-P", "ISO27001"]}',
  })
  specialty: string;

  @ApiProperty({ description: 'Years of experience', example: 5 })
  experienceYears: number;

  @ApiProperty({
    description: 'Expert biography',
    example: 'Experienced consultant in ISMS and ISO27001',
  })
  bio: string;

  @ApiProperty({ description: 'Hourly rate', example: 100 })
  hourlyRate: number;

  @ApiProperty({ description: 'Daily rate', example: 800 })
  dailyRate: number;

  @ApiProperty({ description: 'Location', example: 'Seoul' })
  location: string;

  @ApiProperty({ description: 'Languages', example: ['Korean', 'English'] })
  languages: string[];

  @ApiProperty({ description: 'Availability (JSON as string)', example: '{"monday": "9-17"}' })
  availability: string;

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
