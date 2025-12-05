import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, user_expert_professional_info, expert_rate_type_enum } from '@prisma/client';
import { CreateExpertDto, UpdateExpertDto } from './dto/expert.dto';

@Injectable()
export class ExpertsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpertDto): Promise<user_expert_professional_info> {
    const {
      userId,
      name,
      bio,
      specialty,
      experienceYears,
      hourlyRate,
      dailyRate,
      location,
      languages,
      availability,
    } = dto;

    // Parse JSON-like strings for specialty and availability if provided
    const specialtyJson = specialty ? safeJsonParse(specialty) : undefined;
    const availabilityJson = availability ? safeJsonParse(availability) : undefined;

    return this.prisma.user_expert_professional_info.create({
      data: {
        users: { connect: { id: userId } },
        expf_name: name,
        expf_introduction: bio ?? undefined,
        expf_expertise: specialtyJson ?? undefined,
        expf_experience_years_text: experienceYears != null ? String(experienceYears) : undefined,
        expf_rate_type: 'hourly' as expert_rate_type_enum,
        expf_hourly_rate: hourlyRate as any,
        expf_daily_rate: dailyRate as any,
        expf_regions: location ? ([location] as any) : undefined,
        expf_languages: Array.isArray(languages) ? (languages as any) : undefined,
        expf_time_slots: availabilityJson ?? undefined,
      },
      include: {
        users: {
          select: { id: true, user_email: true, user_display_name: true },
        },
      },
    });
  }

  async findAll(): Promise<user_expert_professional_info[]> {
    return this.prisma.user_expert_professional_info.findMany({
      include: {
        users: { select: { id: true, user_email: true, user_display_name: true } },
      },
    });
  }

  async findOne(expf_id: string): Promise<user_expert_professional_info | null> {
    return this.prisma.user_expert_professional_info.findUnique({
      where: { expf_id },
      include: {
        users: { select: { id: true, user_email: true, user_display_name: true } },
      },
    });
  }

  async findByUserId(userId: string): Promise<user_expert_professional_info | null> {
    return this.prisma.user_expert_professional_info.findUnique({
      where: { user_id: userId },
      include: {
        users: { select: { id: true, user_email: true, user_display_name: true } },
      },
    });
  }

  async update(expf_id: string, dto: UpdateExpertDto): Promise<user_expert_professional_info> {
    const {
      name,
      bio,
      specialty,
      experienceYears,
      hourlyRate,
      dailyRate,
      location,
      languages,
      availability,
    } = dto;

    const specialtyJson = specialty ? safeJsonParse(specialty) : undefined;
    const availabilityJson = availability ? safeJsonParse(availability) : undefined;

    return this.prisma.user_expert_professional_info.update({
      where: { expf_id },
      data: {
        expf_name: name,
        expf_introduction: bio ?? undefined,
        expf_expertise: specialtyJson ?? undefined,
        expf_experience_years_text: experienceYears != null ? String(experienceYears) : undefined,
        expf_hourly_rate: hourlyRate as any,
        expf_daily_rate: dailyRate as any,
        expf_regions: location ? ([location] as any) : undefined,
        expf_languages: Array.isArray(languages) ? (languages as any) : undefined,
        expf_time_slots: availabilityJson ?? undefined,
      },
      include: {
        users: { select: { id: true, user_email: true, user_display_name: true } },
      },
    });
  }

  async remove(expf_id: string): Promise<user_expert_professional_info> {
    return this.prisma.user_expert_professional_info.delete({
      where: { expf_id },
    });
  }

  async searchExperts(query: {
    location?: string;
    languages?: string[] | string;
  }): Promise<user_expert_professional_info[]> {
    const where: Prisma.user_expert_professional_infoWhereInput = {} as any;

    if (query.location) {
      (where as any).expf_regions = { array_contains: [query.location] } as any;
    }

    const langs = Array.isArray(query.languages)
      ? query.languages
      : typeof query.languages === 'string' && query.languages.length > 0
        ? query.languages
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [];

    if (langs.length > 0) {
      (where as any).expf_languages = { array_contains: langs } as any;
    }

    return this.prisma.user_expert_professional_info.findMany({
      where,
      include: {
        users: { select: { id: true, user_email: true, user_display_name: true } },
      },
      orderBy: { updated_at: 'desc' } as any,
    });
  }
}

function safeJsonParse(value: string): Prisma.InputJsonValue | undefined {
  try {
    return JSON.parse(value);
  } catch {
    return value as unknown as Prisma.InputJsonValue;
  }
}
