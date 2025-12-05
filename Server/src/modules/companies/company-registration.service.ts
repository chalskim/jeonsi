import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CompanyRegistrationDto {
  // 기본 정보
  companyName: string;
  bizRegNo: string;
  ceoName: string;
  establishDate: string;
  industry: string;
  employees: string;
  postcode?: string;
  address: string;
  detailAddress?: string;

  // 담당자 정보
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  contactPersons: Array<{
    name: string;
    email: string;
    phone: string;
    position: string;
  }>;

  // 산업분야 (다중 선택)
  industryFields: string[];

  // 관심 분야 (인증 종류)
  selectedCertTypes: string[];

  // 인증 정보
  certifications: Array<{
    id: string;
    certType: string;
    certLevel?: string;
    certScope?: string;
    desiredDate: string;
    auditType?: string;
    files: Array<{
      name: string;
      uri: string;
      size?: number;
      mimeType?: string;
    }>;
  }>;

  // 약관 동의
  terms1: boolean;
  terms2: boolean;
  terms3: boolean;
}

@Injectable()
export class CompanyRegistrationService {
  constructor(private prisma: PrismaService) {}

  async createCompanyRegistration(userId: string, data: CompanyRegistrationDto) {
    // 트랜잭션으로 관련 테이블들 함께 생성
    return await this.prisma.$transaction(async tx => {
      // 1. 기업 정보 생성 (user_company 테이블)
      const company = await tx.$executeRaw`
        INSERT INTO user_company (
          user_id,
          comp_name,
          comp_biz_reg_no,
          comp_ceo_name,
          comp_establish_date,
          comp_industry_gb,
          comp_industry_key,
          comp_employees_gb,
          comp_employees_key,
          comp_postcode,
          comp_address,
          comp_address_detail,
          comp_contact_person,
          comp_contact_email,
          comp_contact_phone,
          comp_contact_persons_json,
          comp_industry_tags_json,
          comp_selected_cert_types_json,
          comp_cert_infos_json,
          comp_terms1,
          comp_terms2,
          comp_terms3,
          comp_terms_agreed_at,
          comp_profile_state
        ) VALUES (
          ${userId},
          ${data.companyName},
          ${data.bizRegNo},
          ${data.ceoName},
          ${data.establishDate},
          'INDUSTRY',
          ${data.industry},
          'EMP_SIZE',
          ${data.employees},
          ${data.postcode || null},
          ${data.address},
          ${data.detailAddress || null},
          ${data.contactPerson},
          ${data.contactEmail},
          ${data.contactPhone},
          ${JSON.stringify(data.contactPersons)},
          ${JSON.stringify(data.industryFields)},
          ${JSON.stringify(data.selectedCertTypes)},
          ${JSON.stringify(data.certifications)},
          ${data.terms1},
          ${data.terms2},
          ${data.terms3},
          NOW(),
          'submitted'
        )
        RETURNING comp_id
      `;

      const companyId = (company as any)[0]?.comp_id;

      if (!companyId) {
        throw new Error('Failed to create company registration');
      }

      // 2. 담당자 정보 저장 (user_company_contact_person 테이블)
      if (data.contactPersons && data.contactPersons.length > 0) {
        for (let i = 0; i < data.contactPersons.length; i++) {
          const person = data.contactPersons[i];
          await tx.$executeRaw`
            INSERT INTO user_company_contact_person (
              comp_id,
              cper_name,
              cper_position,
              cper_email,
              cper_phone,
              cper_is_primary,
              cper_seq
            ) VALUES (
              ${companyId},
              ${person.name},
              ${person.position},
              ${person.email},
              ${person.phone},
              ${i === 0}, // 첫 번째 담당자를 대표 담당자로 설정
              ${i + 1}
            )
          `;
        }
      }

      // 3. 인증 정보 저장 (user_company_certification 테이블)
      if (data.certifications && data.certifications.length > 0) {
        for (let i = 0; i < data.certifications.length; i++) {
          const cert = data.certifications[i];
          await tx.$executeRaw`
            INSERT INTO user_company_certification (
              comp_id,
              ccert_type_gb,
              ccert_type_key,
              ccert_type_label,
              ccert_level_gb,
              ccert_level_key,
              ccert_level_label,
              ccert_audit_type_gb,
              ccert_audit_type_key,
              ccert_audit_type_label,
              ccert_scope,
              ccert_desired_date,
              ccert_seq
            ) VALUES (
              ${companyId},
              'CERT_TYPE',
              ${cert.certType},
              ${cert.certType},
              'CERT_LEVEL',
              ${cert.certLevel || null},
              ${cert.certLevel || null},
              'AUDIT_TYPE',
              ${cert.auditType || null},
              ${cert.auditType || null},
              ${cert.certScope || null},
              ${cert.desiredDate},
              ${i + 1}
            )
          `;
        }
      }

      // 생성된 기업 정보 반환
      const result = await tx.$queryRaw`
        SELECT * FROM user_company WHERE comp_id = ${companyId}
      `;

      return (result as any)[0];
    });
  }

  async getCompanyRegistrationByUserId(userId: string) {
    const result = await this.prisma.$queryRaw`
      SELECT
        uc.*,
        json_agg(
          json_build_object(
            'id', cper.cper_id,
            'name', cper.cper_name,
            'position', cper.cper_position,
            'email', cper.cper_email,
            'phone', cper.cper_phone,
            'isPrimary', cper.cper_is_primary,
            'seq', cper.cper_seq
          ) ORDER BY cper.cper_seq
        ) as contact_persons
      FROM user_company uc
      LEFT JOIN user_company_contact_person cper ON uc.comp_id = cper.comp_id AND cper.cper_deleted_at IS NULL
      WHERE uc.user_id = ${userId}
      GROUP BY uc.comp_id
      ORDER BY uc.comp_created_at DESC
      LIMIT 1
    `;

    return (result as any)[0] || null;
  }

  async updateCompanyRegistration(companyId: string, data: Partial<CompanyRegistrationDto>) {
    return await this.prisma.$transaction(async tx => {
      // 기업 정보 업데이트
      const updateFields = [];
      const updateValues = [];

      if (data.companyName) {
        updateFields.push('comp_name = $' + (updateValues.length + 1));
        updateValues.push(data.companyName);
      }
      // ... 다른 필드들도 동일하게 처리

      if (updateFields.length > 0) {
        updateFields.push('comp_updated_at = NOW()');
        const query = `
          UPDATE user_company
          SET ${updateFields.join(', ')}
          WHERE comp_id = $${updateValues.length + 1}
        `;
        updateValues.push(companyId);

        await tx.$executeRawUnsafe(query, ...updateValues);
      }

      // 업데이트된 정보 반환
      const result = await tx.$queryRaw`
        SELECT * FROM user_company WHERE comp_id = ${companyId}
      `;

      return (result as any)[0];
    });
  }
}
