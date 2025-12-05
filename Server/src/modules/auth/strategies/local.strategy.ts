import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { code_state_enum } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const userCount = await this.prisma.user.count({
      where: {
        user_email: email,
        user_state: 'active' as code_state_enum,
        user_deleted_at: null,
      },
    });

    if (userCount === 0) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
}
