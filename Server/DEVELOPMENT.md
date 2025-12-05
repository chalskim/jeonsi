# SuperSlice Backend 개발 가이드

이 문서는 SuperSlice 백엔드 개발을 위한 상세한 가이드를 제공합니다.

## 📋 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [코딩 컨벤션](#코딩-컨벤션)
3. [아키텍처 가이드](#아키텍처-가이드)
4. [데이터베이스 가이드](#데이터베이스-가이드)
5. [API 개발 가이드](#api-개발-가이드)
6. [테스트 가이드](#테스트-가이드)
7. [배포 가이드](#배포-가이드)

## 🛠️ 개발 환경 설정

### 필수 도구 설치

```bash
# Node.js (v18 이상)
nvm install 18
nvm use 18

# PostgreSQL 설치 (macOS)
brew install postgresql
brew services start postgresql

# 또는 Docker 사용
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### IDE 설정

#### VS Code 권장 확장

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "Prisma.prisma",
    "ms-vscode.vscode-jest"
  ]
}
```

#### VS Code 설정

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 📝 코딩 컨벤션

### 파일 및 폴더 명명 규칙

```
# 파일명: kebab-case
user-profile.service.ts
auth-guard.ts

# 클래스명: PascalCase
class UserProfileService {}
class AuthGuard {}

# 변수/함수명: camelCase
const userName = 'john';
function getUserProfile() {}

# 상수: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024;
```

### TypeScript 스타일 가이드

```typescript
// ✅ 좋은 예
interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // 구현
  }
}

// ❌ 나쁜 예
interface createUserDto {
  Email: string;
  Password: string;
}

class userService {
  createUser(dto: any) {
    // any 타입 사용 금지
  }
}
```

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경

예시:
feat: 사용자 인증 API 추가
fix: 비밀번호 해싱 버그 수정
docs: API 문서 업데이트
```

## 🏗️ 아키텍처 가이드

### 모듈 구조

```typescript
// 모듈 구조 예시
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### 의존성 주입 패턴

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to find user ${id}`, error);
      throw new InternalServerErrorException('User lookup failed');
    }
  }
}
```

### 에러 처리

```typescript
// 커스텀 예외 클래스
export class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`User with ID ${id} not found`);
  }
}

// 서비스에서 사용
async findUserById(id: string): Promise<User> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  
  if (!user) {
    throw new UserNotFoundException(id);
  }
  
  return user;
}
```

## 🗄️ 데이터베이스 가이드

### Prisma 스키마 작성

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 관계 정의
  expert   Expert?
  company  Company?

  @@map("users")
}

model Expert {
  id     String @id @default(cuid())
  userId String @unique
  
  // 외래키 관계
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("experts")
}
```

### 마이그레이션 관리

```bash
# 새 마이그레이션 생성
npx prisma migrate dev --name add_user_table

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# 스키마 동기화 (개발 중에만 사용)
npx prisma db push
```

### 쿼리 최적화

```typescript
// ✅ 좋은 예: 필요한 필드만 선택
async findUsers(): Promise<UserSummary[]> {
  return this.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

// ✅ 좋은 예: 관계 데이터 포함
async findUserWithProfile(id: string): Promise<UserWithProfile> {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      expert: true,
      company: true,
    },
  });
}

// ❌ 나쁜 예: 모든 필드 조회
async findUsers() {
  return this.prisma.user.findMany(); // 모든 필드 조회
}
```

## 🔌 API 개발 가이드

### 컨트롤러 작성

```typescript
@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '사용자 목록 조회' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(
    @Query() query: FindUsersDto,
  ): Promise<UserResponseDto[]> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 상세 조회' })
  @ApiParam({ name: 'id', description: '사용자 ID' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }
}
```

### DTO 및 Validation

```typescript
// Zod 스키마 정의
export const CreateUserSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  role: z.nativeEnum(UserRole),
});

// DTO 클래스
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

// 컨트롤러에서 사용
@Post()
@UsePipes(new ZodValidationPipe(CreateUserSchema))
async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
  return this.usersService.create(dto);
}
```

### 페이지네이션

```typescript
// 페이지네이션 DTO
export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit?: number = 10;
}

// 서비스에서 구현
async findAll(pagination: PaginationDto) {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.user.findMany({
      skip,
      take: limit,
    }),
    this.prisma.user.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

## 🧪 테스트 가이드

### 단위 테스트

```typescript
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
```

### E2E 테스트

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });
});
```

## 🚀 배포 가이드

### Docker 설정

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/superslice_dev
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=superslice_dev
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 환경별 배포

```bash
# 개발 환경
npm run start:dev

# 스테이징 환경
NODE_ENV=staging npm run start:prod

# 프로덕션 환경
NODE_ENV=production npm run start:prod
```

## 🔧 유용한 스크립트

```json
{
  "scripts": {
    "db:reset": "npx prisma migrate reset --force",
    "db:seed": "npx prisma db seed",
    "db:studio": "npx prisma studio",
    "test:watch": "jest --watch",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  }
}
```

## 📚 추가 리소스

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [Zod 공식 문서](https://zod.dev/)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)

---

이 가이드는 지속적으로 업데이트됩니다. 질문이나 개선사항이 있으면 이슈를 생성해 주세요.
