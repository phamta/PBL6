import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaExtensionDocument, DocumentType } from './entities/visa-extension-document.entity';
import { VisaExtensionService } from './visa-extension.service';
import { User } from '../../identity/user/entities/user.entity';
import { UserRole } from '../../../common/enums/user.enum';
import { UserUtils } from '../../../common/utils/user.utils';
import * as fs from 'fs';
import * as path from 'path';

interface CreateDocumentDto {
  visaExtensionId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  isRequired: boolean;
}

@Injectable()
export class VisaExtensionDocumentService {
  constructor(
    @InjectRepository(VisaExtensionDocument)
    private documentRepository: Repository<VisaExtensionDocument>,
    @Inject(forwardRef(() => VisaExtensionService))
    private visaExtensionService: VisaExtensionService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, user: User): Promise<VisaExtensionDocument> {
    // Verify user has access to the visa extension
    await this.visaExtensionService.findOne(createDocumentDto.visaExtensionId);

    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  async findByVisaExtension(visaExtensionId: string, user: User): Promise<VisaExtensionDocument[]> {
    // Verify user has access to the visa extension
    await this.visaExtensionService.findOne(visaExtensionId);

    return await this.documentRepository.find({
      where: { visaExtensionId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<VisaExtensionDocument> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['visaExtension'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Verify user has access to the visa extension
    await this.visaExtensionService.findOne(document.visaExtensionId);

    return document;
  }

  async verify(
    id: string,
    verifyData: { isVerified: boolean; verificationNotes?: string },
    user: User,
  ): Promise<VisaExtensionDocument> {
    const document = await this.findOne(id, user);

    // Only admin and specialist can verify documents
    if (!UserUtils.hasAnyRole(user, [UserRole.ADMIN, UserRole.SPECIALIST])) {
      throw new ForbiddenException('Only admin and specialist can verify documents');
    }

    document.isVerified = verifyData.isVerified;
    if (verifyData.verificationNotes) {
      document.verificationNotes = verifyData.verificationNotes;
    }

    return await this.documentRepository.save(document);
  }

  async delete(id: string, user: User): Promise<void> {
    const document = await this.findOne(id, user);

    // Check if user can delete the document
    const visaExtension = await this.visaExtensionService.findOne(document.visaExtensionId);
    
    if (
      !user.roles.some(role => role.roleName === 'admin') &&
      visaExtension.userId !== user.id
    ) {
      throw new ForbiddenException('Cannot delete this document');
    }

    // Check if document can be deleted (only in DRAFT or ADDITIONAL_REQUIRED status)
    if (
      visaExtension.trangThai !== 'draft' &&
      visaExtension.trangThai !== 'additional_required' &&
      !user.roles.some(role => role.roleName === 'admin')
    ) {
      throw new BadRequestException('Cannot delete document in current status');
    }

    // Delete physical file
    try {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    } catch (error) {
      console.error('Failed to delete physical file:', error);
    }

    await this.documentRepository.remove(document);
  }

  async getFile(id: string, user: User): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const document = await this.findOne(id, user);

    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return {
      filePath: document.filePath,
      fileName: document.originalName,
      mimeType: document.mimeType,
    };
  }
}
