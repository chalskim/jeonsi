import { Injectable, Logger } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  // 파일 업로드 디렉토리 경로
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly profileDir = path.join(this.uploadDir, 'profiles');
  private readonly resumeDir = path.join(this.uploadDir, 'resumes');
  private readonly certificationDir = path.join(this.uploadDir, 'certifications');
  private readonly selfIntroductionDir = path.join(this.uploadDir, 'selfIntroductions');

  // 암호화 키 (환경 변수에서 가져오거나 기본값 사용)
  private readonly encryptionKey =
    process.env.FILE_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

  constructor() {
    // 업로드 디렉토리 생성
    this.ensureDirectoryExists(this.uploadDir);
    this.ensureDirectoryExists(this.profileDir);
    this.ensureDirectoryExists(this.resumeDir);
    this.ensureDirectoryExists(this.certificationDir);
    this.ensureDirectoryExists(this.selfIntroductionDir);
  }

  // 디렉토리 존재 확인 및 생성
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }

  // 프로필 사진용 multer 설정
  getProfilePhotoConfig(): multer.Options {
    return {
      storage: this.createDiskStorage('profiles'),
      limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
      },
      fileFilter: (req, file, callback) => {
        if (this.isImageFile(file)) {
          callback(null, true);
        } else {
          callback(new Error('Only image files (jpg, jpeg, png) are allowed'));
        }
      },
    };
  }

  // 이력서용 multer 설정 (암호화)
  getResumeConfig(): multer.Options {
    return {
      storage: this.createEncryptedDiskStorage('resumes'),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (this.isDocumentFile(file)) {
          callback(null, true);
        } else {
          callback(new Error('Only document files (pdf, doc, docx) are allowed'));
        }
      },
    };
  }

  // 자격증용 multer 설정
  getCertificationConfig(): multer.Options {
    return {
      storage: this.createDiskStorage('certifications'),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (this.isImageOrPdfFile(file)) {
          callback(null, true);
        } else {
          callback(new Error('Only image files (jpg, jpeg, png) and PDF are allowed'));
        }
      },
    };
  }

  // 자기소개서용 multer 설정 (암호화)
  getSelfIntroductionConfig(): multer.Options {
    return {
      storage: this.createEncryptedDiskStorage('selfIntroductions'),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        if (this.isDocumentOrHwpFile(file)) {
          callback(null, true);
        } else {
          callback(new Error('Only document files (pdf, doc, docx, hwp) are allowed'));
        }
      },
    };
  }

  // 디스크 스토리지 생성
  private createDiskStorage(type: string): multer.StorageEngine {
    let targetDir: string;

    switch (type) {
      case 'profiles':
        targetDir = this.profileDir;
        break;
      case 'resumes':
        targetDir = this.resumeDir;
        break;
      case 'certifications':
        targetDir = this.certificationDir;
        break;
      case 'selfIntroductions':
        targetDir = this.selfIntroductionDir;
        break;
      default:
        targetDir = this.uploadDir;
    }

    return multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, targetDir);
      },
      filename: (req, file, callback) => {
        // 파일명 중복 방지를 위해 타임스탬프 추가
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        callback(null, `${name}-${uniqueSuffix}${ext}`);
      },
    });
  }

  // 이미지 파일 확인
  private isImageFile(file: Express.Multer.File): boolean {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExts = ['.jpg', '.jpeg', '.png'];

    return (
      allowedMimes.includes(file.mimetype) ||
      allowedExts.includes(path.extname(file.originalname).toLowerCase())
    );
  }

  // PDF/문서 파일 확인
  private isDocumentFile(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx'];

    return (
      allowedMimes.includes(file.mimetype) ||
      allowedExts.includes(path.extname(file.originalname).toLowerCase())
    );
  }

  // 이미지 또는 PDF 파일 확인
  private isImageOrPdfFile(file: Express.Multer.File): boolean {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];

    return (
      allowedMimes.includes(file.mimetype) ||
      allowedExts.includes(path.extname(file.originalname).toLowerCase())
    );
  }

  // 문서 또는 HWP 파일 확인
  private isDocumentOrHwpFile(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/haansofthwp',
      'application/x-hwp',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx', '.hwp'];

    return (
      allowedMimes.includes(file.mimetype) ||
      allowedExts.includes(path.extname(file.originalname).toLowerCase())
    );
  }

  // 파일 삭제
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Deleted file: ${fullPath}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      return false;
    }
  }

  // 파일 존재 여부 확인
  fileExists(filePath: string): boolean {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.existsSync(fullPath);
  }

  // 파일 정보 가져오기
  getFileInfo(filePath: string) {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return {
        path: fullPath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    }
    return null;
  }

  // 파일 암호화
  encryptFile(filePath: string): boolean {
    try {
      const fileData = fs.readFileSync(filePath);
      const encryptedData = CryptoJS.AES.encrypt(
        fileData.toString('base64'),
        this.encryptionKey,
      ).toString();

      // 암호화된 파일 저장 (.enc 확장자 추가)
      const encryptedPath = filePath + '.enc';
      fs.writeFileSync(encryptedPath, encryptedData);

      // 원본 파일 삭제
      fs.unlinkSync(filePath);

      this.logger.log(`🔐 File encrypted: ${filePath} -> ${encryptedPath}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error encrypting file ${filePath}:`, error);
      return false;
    }
  }

  // 파일 복호화
  decryptFile(encryptedFilePath: string): Buffer | null {
    try {
      const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = Buffer.from(decryptedBytes.toString(CryptoJS.enc.Utf8), 'base64');

      this.logger.log(`🔓 File decrypted: ${encryptedFilePath}`);
      return decryptedData;
    } catch (error) {
      this.logger.error(`❌ Error decrypting file ${encryptedFilePath}:`, error);
      return null;
    }
  }

  // 암호화된 파일명 가져오기
  getEncryptedFileName(originalFileName: string): string {
    return originalFileName + '.enc';
  }

  // 원본 파일명 가져오기
  getOriginalFileName(encryptedFileName: string): string {
    if (encryptedFileName.endsWith('.enc')) {
      return encryptedFileName.slice(0, -4);
    }
    return encryptedFileName;
  }

  // 파일이 암호화되어 있는지 확인
  isFileEncrypted(filePath: string): boolean {
    return filePath.endsWith('.enc');
  }

  // 암호화된 파일 저장을 위한 디스크 스토리지 생성
  createEncryptedDiskStorage(type: string): multer.StorageEngine {
    let targetDir: string;

    switch (type) {
      case 'resumes':
        targetDir = this.resumeDir;
        break;
      case 'selfIntroductions':
        targetDir = this.selfIntroductionDir;
        break;
      default:
        targetDir = this.uploadDir;
    }

    return multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, targetDir);
      },
      filename: (req, file, callback) => {
        // 파일명 중복 방지를 위해 타임스탬프 추가
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);

        // 암호화된 파일명 (.enc 확장자 추가)
        const encryptedFileName = `${name}-${uniqueSuffix}${ext}.enc`;
        callback(null, encryptedFileName);
      },
    });
  }

  // 파일 저장 후 자동 암호화
  async encryptFileAfterUpload(filePath: string): Promise<boolean> {
    return new Promise(resolve => {
      // 잠시 딜레이를 주어 파일 저장이 완료되도록 함
      setTimeout(() => {
        const success = this.encryptFile(filePath);
        resolve(success);
      }, 100);
    });
  }
}
