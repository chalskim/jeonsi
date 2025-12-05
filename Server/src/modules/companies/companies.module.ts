import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompanyRegistrationController } from './company-registration.controller';
import { CompanyRegistrationService } from './company-registration.service';

@Module({
  controllers: [CompaniesController, CompanyRegistrationController],
  providers: [CompaniesService, CompanyRegistrationService],
  exports: [CompaniesService, CompanyRegistrationService],
})
export class CompaniesModule {}
