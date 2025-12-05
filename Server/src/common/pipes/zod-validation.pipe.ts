import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new BadRequestException({
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

// 데코레이터 함수
export function UsePipes(_schema: ZodSchema) {
  return function (_target: any, _propertyName: string, _descriptor: PropertyDescriptor) {
    // 이 데코레이터는 컨트롤러 메서드에서 사용할 수 있습니다
    // 실제 구현은 NestJS의 @UsePipes 데코레이터와 함께 사용됩니다
  };
}
