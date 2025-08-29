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
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../common/enums/user.enum';
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
    await this.visaExtensionService.findOne(createDocumentDto.visaExtensionId, user);

    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  async findByVisaExtension(visaExtensionId: string, user: User): Promise<VisaExtensionDocument[]> {
    // Verify user has access to the visa extension
    await this.visaExtensionService.findOne(visaExtensionId, user);

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
    await this.visaExtensionService.findOne(document.visaExtensionId, user);

    return document;
  }

  async verify(
    id: string,
    verifyData: { isVerified: boolean; verificationNotes?: string },
    user: User,
  ): Promise<VisaExtensionDocument> {
    const document = await this.findOne(id, user);

    // Only admin and phong can verify documents
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.PHONG) {
      throw new ForbiddenException('Only admin and phong can verify documents');
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
    const visaExtension = await this.visaExtensionService.findOne(document.visaExtensionId, user);
    
    if (
      user.role !== UserRole.ADMIN &&
      visaExtension.applicantId !== user.id
    ) {
      throw new ForbiddenException('Cannot delete this document');
    }

    // Check if document can be deleted (only in DRAFT or ADDITIONAL_REQUIRED status)
    if (
      visaExtension.status !== 'draft' &&
      visaExtension.status !== 'additional_required' &&
      user.role !== UserRole.ADMIN
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
