import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create company profile' })
  @ApiResponse({ status: 201, description: 'Company profile created successfully' })
  create(@Body() createCompanyDto: any) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'Return all companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search companies by criteria' })
  @ApiResponse({ status: 200, description: 'Return filtered companies' })
  @ApiQuery({ name: 'industry', required: false, type: String })
  @ApiQuery({ name: 'size', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  searchCompanies(
    @Query('industry') industry?: string,
    @Query('size') size?: string,
    @Query('location') location?: string,
  ) {
    return this.companiesService.searchCompanies({
      industry,
      size,
      location,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Return company by ID' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({ status: 200, description: 'Company profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  update(@Param('id') id: string, @Body() updateCompanyDto: any) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company profile' })
  @ApiResponse({ status: 200, description: 'Company profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
