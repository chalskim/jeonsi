import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, user_company } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.user_companyCreateInput): Promise<user_company> {
    return this.prisma.user_company.create({
      data,
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<user_company[]> {
    return this.prisma.user_company.findMany({
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
      },
    });
  }

  async findOne(comp_id: string): Promise<user_company | null> {
    return this.prisma.user_company.findUnique({
      where: { comp_id },
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
        // Remove invalid includes that don't exist in the schema
      },
    });
  }

  async findByUserId(userId: string): Promise<user_company | null> {
    // Use findFirst instead of findUnique since userId is not a unique field
    return this.prisma.user_company.findFirst({
      where: { user_id: userId },
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
      },
    });
  }

  async update(comp_id: string, data: Prisma.user_companyUpdateInput): Promise<user_company> {
    return this.prisma.user_company.update({
      where: { comp_id },
      data,
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
      },
    });
  }

  async remove(comp_id: string): Promise<user_company> {
    return this.prisma.user_company.delete({
      where: { comp_id },
    });
  }

  async searchCompanies(query: {
    industry?: string;
    size?: string;
    location?: string;
  }): Promise<user_company[]> {
    const where: Prisma.user_companyWhereInput = {} as any;

    if (query.industry) {
      (where as any).comp_industry_key = {
        contains: query.industry,
        mode: 'insensitive',
      };
    }

    // Fix the size field to match the enum type
    if (query.size) {
      (where as any).comp_employees_key = query.size as any;
    }

    if (query.location) {
      (where as any).comp_address = {
        contains: query.location,
        mode: 'insensitive',
      };
    }

    return this.prisma.user_company.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            user_email: true,
            user_display_name: true,
          },
        },
      },
      orderBy: {
        comp_name: 'asc',
      },
    });
  }
}
