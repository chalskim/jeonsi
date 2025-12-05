import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 10;
  private readonly retryDelayMs = 1000;
  private readonly dbUrl: string;

  constructor() {
    const envPath = path.resolve(process.cwd(), '.env');
    let dbUrl = '';
    try {
      const raw = fs.readFileSync(envPath, 'utf8');
      const line = raw
        .split(/\r?\n/)
        .map(s => s.trim())
        .find(s => s.startsWith('DATABASE_URL='));
      if (line) {
        dbUrl = line.slice('DATABASE_URL='.length).trim();
      }
    } catch {}
    if (!dbUrl) {
      dbUrl = process.env.DATABASE_URL || '';
    }
    super({ datasources: { db: { url: dbUrl } } });
    this.dbUrl = dbUrl;
  }

  async onModuleInit() {
    const dbUrl = this.dbUrl;
    if (!dbUrl) {
      this.logger.error(
        'DATABASE_URL 가 설정되어 있지 않습니다. Server/.env 에 올바른 값을 설정하세요.',
      );
      throw new Error('DATABASE_URL is required');
    }

    const isPostgres = /^postgres(?:ql)?:\/\//i.test(dbUrl);
    if (!isPostgres) {
      this.logger.error(
        'DATABASE_URL 은 PostgreSQL 연결 문자열이어야 합니다. 예: postgresql://user:pass@host:5432/db',
      );
      throw new Error('DATABASE_URL must be a PostgreSQL URL');
    }

    await this.connectWithRetry(true);
  }

  private async connectWithRetry(failOnError = false) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.$connect();
        this.logger.log('Prisma가 데이터베이스에 연결되었습니다.');
        return;
      } catch (err: any) {
        const code = err?.code || err?.errorCode;
        const message = err?.message || String(err);
        this.logger.warn(
          `Prisma 연결 시도 ${attempt}/${this.maxRetries} 실패${code ? ` [${code}]` : ''}: ${message}`,
        );
        if (attempt === this.maxRetries) {
          this.logger.error('여러 번의 재시도 후에도 DB에 연결하지 못했습니다.');
          if (failOnError) {
            throw new Error('Failed to connect to PostgreSQL database');
          }
          return;
        }
        await new Promise(res => setTimeout(res, this.retryDelayMs * attempt));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
