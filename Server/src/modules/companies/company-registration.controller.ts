import { Controller, Post, Body, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyRegistrationService, CompanyRegistrationDto } from './company-registration.service';

@ApiTags('Company Registration')
@Controller('company-registration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyRegistrationController {
  constructor(private readonly companyRegistrationService: CompanyRegistrationService) {}

  @Post()
  @ApiOperation({ summary: '기업 자격 등록' })
  @ApiResponse({ status: 201, description: '기업 자격 등록 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async createCompanyRegistration(
    @Request() req,
    @Body() createCompanyRegistrationDto: CompanyRegistrationDto,
  ) {
    try {
      const userId = req.user?.userId || req.user?.id || req.user?.sub;
      if (!userId) {
        throw new Error('User ID not found in request');
      }

      const result = await this.companyRegistrationService.createCompanyRegistration(
        userId,
        createCompanyRegistrationDto,
      );

      return {
        success: true,
        message: '기업 자격 등록이 완료되었습니다.',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '기업 자격 등록에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get('my')
  @ApiOperation({ summary: '내 기업 자격 등록 정보 조회' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  async getMyCompanyRegistration(@Request() req) {
    try {
      const userId = req.user?.userId || req.user?.id || req.user?.sub;
      if (!userId) {
        throw new Error('User ID not found in request');
      }

      const result = await this.companyRegistrationService.getCompanyRegistrationByUserId(userId);

      if (!result) {
        return {
          success: false,
          message: '등록된 기업 정보가 없습니다.',
          data: null,
        };
      }

      return {
        success: true,
        message: '기업 정보 조회 성공',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '기업 정보 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: '기업 자격 등록 정보 수정' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '정보를 찾을 수 없음' })
  async updateCompanyRegistration(
    @Param('id') id: string,
    @Body() updateCompanyRegistrationDto: Partial<CompanyRegistrationDto>,
  ) {
    try {
      const result = await this.companyRegistrationService.updateCompanyRegistration(
        id,
        updateCompanyRegistrationDto,
      );

      if (!result) {
        return {
          success: false,
          message: '수정할 기업 정보를 찾을 수 없습니다.',
          data: null,
        };
      }

      return {
        success: true,
        message: '기업 정보 수정 성공',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: '기업 정보 수정에 실패했습니다.',
        error: error.message,
      };
    }
  }
}
