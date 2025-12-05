import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// 기본 ID 스키마
export const IdSchema = z.string().uuid('Invalid UUID format');

// 페이지네이션 스키마
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// 기본 응답 스키마
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().datetime(),
});

// 페이지네이션 응답 스키마
export const PaginatedResponseSchema = BaseResponseSchema.extend({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// 기본 DTO 클래스들
export class IdDto {
  @ApiProperty({ description: 'UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
}

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1, default: 1 })
  page: number = 1;

  @ApiProperty({ description: 'Items per page', example: 10, default: 10 })
  limit: number = 10;
}

export class BaseResponseDto {
  @ApiProperty({ description: 'Success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
    required: false,
  })
  message?: string;

  @ApiProperty({ description: 'Timestamp', example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;
}

export class PaginatedResponseDto<T> extends BaseResponseDto {
  @ApiProperty({ description: 'Data array' })
  data: T[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
