import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
  Delete,
  Param,
  Get,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileUploadService } from '../services/file-upload.service';
import { Express } from 'express';
import { Response } from 'express';
import * as fs from 'fs';

interface FileUploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
    encrypted?: boolean;
    created?: Date;
    modified?: Date;
  };
  files?: any[];
}

@ApiTags('File Upload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('file', new FileUploadService().getProfilePhotoConfig()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '프로필 사진 업로드' })
  @ApiResponse({ status: 200, description: '프로필 사진 업로드 성공' })
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      return {
        success: true,
        message: 'Profile photo uploaded successfully',
        data: {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: `uploads/profiles/${file.filename}`,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('file', new FileUploadService().getResumeConfig()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '이력서 업로드 (암호화 저장)' })
  @ApiResponse({ status: 200, description: '이력서 업로드 성공' })
  async uploadResume(@UploadedFile() file: Express.Multer.File): Promise<FileUploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // 파일 업로드 후 암호화 진행
      const filePath = `uploads/resumes/${file.filename}`;
      await this.fileUploadService.encryptFileAfterUpload(filePath);

      return {
        success: true,
        message: 'Resume uploaded and encrypted successfully',
        data: {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: `uploads/resumes/${file.filename}`,
          encrypted: true,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('certifications')
  @UseInterceptors(FilesInterceptor('files', 3, new FileUploadService().getCertificationConfig()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '자격증 이미지 업로드 (최대 3개)' })
  @ApiResponse({ status: 200, description: '자격증 업로드 성공' })
  async uploadCertifications(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FileUploadResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const uploadedFiles = files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: `uploads/certifications/${file.filename}`,
      }));

      return {
        success: true,
        message: `${files.length} certification(s) uploaded successfully`,
        files: uploadedFiles,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('self-introduction')
  @UseInterceptors(FileInterceptor('file', new FileUploadService().getSelfIntroductionConfig()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '자기소개서 업로드 (암호화 저장)' })
  @ApiResponse({ status: 200, description: '자기소개서 업로드 성공' })
  async uploadSelfIntroduction(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // 파일 업로드 후 암호화 진행
      const filePath = `uploads/selfIntroductions/${file.filename}`;
      await this.fileUploadService.encryptFileAfterUpload(filePath);

      return {
        success: true,
        message: 'Self introduction uploaded and encrypted successfully',
        data: {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: `uploads/selfIntroductions/${file.filename}`,
          encrypted: true,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':type/:filename')
  @ApiOperation({ summary: '파일 삭제' })
  @ApiResponse({ status: 200, description: '파일 삭제 성공' })
  async deleteFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ): Promise<FileUploadResponse> {
    try {
      const filePath = `uploads/${type}/${filename}`;
      const deleted = await this.fileUploadService.deleteFile(filePath);

      if (deleted) {
        return {
          success: true,
          message: 'File deleted successfully',
        };
      } else {
        return {
          success: false,
          message: 'File not found',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':type/:filename')
  @ApiOperation({ summary: '파일 정보 조회' })
  @ApiResponse({ status: 200, description: '파일 정보 조회 성공' })
  async getFileInfo(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ): Promise<FileUploadResponse> {
    try {
      const filePath = `uploads/${type}/${filename}`;
      const fileInfo = this.fileUploadService.getFileInfo(filePath);

      if (fileInfo && fileInfo.isFile) {
        return {
          success: true,
          message: 'File information retrieved successfully',
          data: {
            filename: filename,
            originalName: filename, // 파일 정보 조회시에는 원본 파일명을 모르므로 filename 사용
            size: fileInfo.size,
            mimetype: 'application/octet-stream', // 기본 mimetype
            created: fileInfo.created,
            modified: fileInfo.modified,
            path: filePath,
          },
        };
      } else {
        return {
          success: false,
          message: 'File not found',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':type/:filename/download')
  @ApiOperation({ summary: '파일 다운로드 (암호화된 파일은 복호화)' })
  @ApiResponse({ status: 200, description: '파일 다운로드 성공' })
  async downloadFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      const filePath = `uploads/${type}/${filename}`;

      // 암호화된 파일인지 확인
      if (this.fileUploadService.isFileEncrypted(filePath)) {
        // 파일 복호화
        const decryptedData = this.fileUploadService.decryptFile(filePath);

        if (!decryptedData) {
          throw new InternalServerErrorException('Failed to decrypt file');
        }

        // 원본 파일명 가져오기
        const originalFileName = this.fileUploadService.getOriginalFileName(filename);

        // 응답 헤더 설정
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${originalFileName}"`,
          'Content-Length': decryptedData.length.toString(),
        });

        return new StreamableFile(decryptedData);
      } else {
        // 암호화되지 않은 파일은 직접 스트리밍
        const fileInfo = this.fileUploadService.getFileInfo(filePath);

        if (!fileInfo || !fileInfo.isFile) {
          throw new BadRequestException('File not found');
        }

        const fileStream = fs.createReadStream(fileInfo.path);

        // 응답 헤더 설정
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileInfo.size.toString(),
        });

        return new StreamableFile(fileStream);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
