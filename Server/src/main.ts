import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cors from 'cors';
import * as net from 'net';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as express from 'express';

// Function to check if a port is available
async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();

    server.listen(port, () => {
      server.close();
      resolve(true);
    });

    server.on('error', () => {
      resolve(false);
    });
  });
}

async function bootstrap() {
  const port = parseInt(process.env.PORT || '3001');

  // Check if port is available
  const portAvailable = await isPortAvailable(port);
  if (!portAvailable) {
    console.error(`\n❌ Error: Port ${port} is already in use.`);
    console.error(`Please stop the existing process or use a different port.`);
    console.error(`You can find the process using: lsof -i :${port}`);
    console.error(`And kill it with: kill -9 <PID>\n`);
    process.exit(1);
  }

  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Security middleware
    app.use(helmet());

    // Enable CORS with configuration
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://clklnrw-anonymous-8081.exp.direct',
      'https://clklnrw-anonymous-8082.exp.direct',
      'http://localhost:8081',
      'http://localhost:8082',
      'exp://*', // Expo development server
      'https://*', // Allow HTTPS versions of Expo domains
    ];

    app.use(
      cors({
        origin: function (origin, callback) {
          // Allow requests with no origin (like mobile apps, curl requests)
          if (!origin) return callback(null, true);

          // Check if the origin is in our allowed list
          if (
            allowedOrigins.some(
              allowedOrigin =>
                allowedOrigin === '*' ||
                origin === allowedOrigin ||
                (allowedOrigin.endsWith('*') && origin.startsWith(allowedOrigin.slice(0, -1))),
            )
          ) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      }),
    );

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Enable static file serving for uploaded files
    app.use('/uploads', (req, res, next) => {
      // Set CORS headers for static files
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('전시 API')
      .setDescription('전문가와 기업을 연결하는 인증 매칭 플랫폼 API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization' })
      .addServer(`http://localhost:${port}`)
      .addServer(`http://localhost:${port}/api/v1`)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start server
    await app.listen(port);

    console.log(`🚀 전시 Backend is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  } catch (error) {
    console.error('Failed to start 전시 Backend:', error);
    process.exit(1);
  }
}

bootstrap();
