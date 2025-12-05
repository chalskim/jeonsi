import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '전시 Backend API is running! 🚀';
  }
}
