import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { TranslationRequest, TranslationStatus } from '../entities/translation-request.entity';
import { CreateTranslationRequestDto } from '../dto/translation-request/create-translation-request.dto';
import { UpdateTranslationRequestDto } from '../dto/translation-request/update-translation-request.dto';
import { ReviewTranslationRequestDto } from '../dto/translation-request/review-translation-request.dto';
import { TranslationReportDto, ReportFormat } from '../dto/translation-request/translation-report.dto';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class TranslationRequestService {
  constructor(
    @InjectRepository(TranslationRequest)
    private translationRequestRepository: Repository<TranslationRequest>,
  ) {}

  async create(
    createTranslationRequestDto: CreateTranslationRequestDto,
    userId: string,
  ): Promise<TranslationRequest> {
    // Generate request code
    const requestCode = await this.generateRequestCode();

    const translationRequest = this.translationRequestRepository.create({
      ...createTranslationRequestDto,
      requestCode,
      submittedById: userId,
    });

    return await this.translationRequestRepository.save(translationRequest);
  }

  async findAll(
    userId: string,
    userUnit: string,
    userRole: string,
    query?: {
      submittingUnit?: string;
      status?: TranslationStatus;
      documentType?: string;
      languagePair?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.translationRequestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.submittedBy', 'submittedBy')
      .leftJoinAndSelect('request.reviewedBy', 'reviewedBy')
      .orderBy('request.createdAt', 'DESC');

    // Role-based filtering
    if (userRole !== 'KHCN_DN') {
      queryBuilder.where('request.submittingUnit = :userUnit', { userUnit });
    }

    // Apply filters
    if (query?.submittingUnit) {
      queryBuilder.andWhere('request.submittingUnit = :submittingUnit', {
        submittingUnit: query.submittingUnit,
      });
    }

    if (query?.status) {
      queryBuilder.andWhere('request.status = :status', {
        status: query.status,
      });
    }

    if (query?.documentType) {
      queryBuilder.andWhere('request.documentType = :documentType', {
        documentType: query.documentType,
      });
    }

    if (query?.languagePair) {
      queryBuilder.andWhere('request.languagePair = :languagePair', {
        languagePair: query.languagePair,
      });
    }

    if (query?.startDate && query?.endDate) {
      queryBuilder.andWhere('request.createdAt BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(request.originalDocumentTitle LIKE :search OR request.requestCode LIKE :search OR request.purpose LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [requests, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(
    id: string,
    userId: string,
    userUnit: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    const request = await this.translationRequestRepository.findOne({
      where: { id },
      relations: ['submittedBy', 'reviewedBy'],
    });

    if (!request) {
      throw new NotFoundException('Translation request not found');
    }

    // Check permissions
    if (userRole !== 'KHCN_DN' && request.submittingUnit !== userUnit) {
      throw new ForbiddenException('Access denied');
    }

    return request;
  }

  async update(
    id: string,
    updateTranslationRequestDto: UpdateTranslationRequestDto,
    userId: string,
    userUnit: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    const request = await this.findOne(id, userId, userUnit, userRole);

    // Only allow updates if status is PENDING or NEEDS_REVISION
    if (request.status !== TranslationStatus.PENDING && 
        request.status !== TranslationStatus.NEEDS_REVISION) {
      throw new BadRequestException('Cannot update request in current status');
    }

    // Only the submitter can update their own request (except KHCN_DN)
    if (userRole !== 'KHCN_DN' && request.submittedById !== userId) {
      throw new ForbiddenException('You can only update your own requests');
    }

    Object.assign(request, updateTranslationRequestDto);

    // If updating from NEEDS_REVISION, change status back to PENDING
    if (request.status === TranslationStatus.NEEDS_REVISION) {
      request.status = TranslationStatus.PENDING;
      request.revisionCount += 1;
    }

    return await this.translationRequestRepository.save(request);
  }

  async approve(
    id: string,
    reviewerId: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    if (userRole !== 'KHCN_DN') {
      throw new ForbiddenException('Only KHCN_DN can approve requests');
    }

    const request = await this.translationRequestRepository.findOne({
      where: { id },
      relations: ['submittedBy', 'reviewedBy'],
    });

    if (!request) {
      throw new NotFoundException('Translation request not found');
    }

    if (request.status !== TranslationStatus.UNDER_REVIEW) {
      throw new BadRequestException('Request must be under review to approve');
    }

    request.status = TranslationStatus.APPROVED;
    request.reviewedById = reviewerId;
    request.approvedAt = new Date();

    // Generate confirmation document
    await this.generateConfirmationDocument(request);

    return await this.translationRequestRepository.save(request);
  }

  async reject(
    id: string,
    reviewDto: ReviewTranslationRequestDto,
    reviewerId: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    if (userRole !== 'KHCN_DN') {
      throw new ForbiddenException('Only KHCN_DN can reject requests');
    }

    const request = await this.translationRequestRepository.findOne({
      where: { id },
      relations: ['submittedBy', 'reviewedBy'],
    });

    if (!request) {
      throw new NotFoundException('Translation request not found');
    }

    if (request.status !== TranslationStatus.UNDER_REVIEW) {
      throw new BadRequestException('Request must be under review to reject');
    }

    request.status = TranslationStatus.REJECTED;
    request.reviewedById = reviewerId;
    request.rejectedAt = new Date();
    request.reviewComments = reviewDto.reviewComments;

    return await this.translationRequestRepository.save(request);
  }

  async requestRevision(
    id: string,
    reviewDto: ReviewTranslationRequestDto,
    reviewerId: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    if (userRole !== 'KHCN_DN') {
      throw new ForbiddenException('Only KHCN_DN can request revisions');
    }

    const request = await this.translationRequestRepository.findOne({
      where: { id },
      relations: ['submittedBy', 'reviewedBy'],
    });

    if (!request) {
      throw new NotFoundException('Translation request not found');
    }

    if (request.status !== TranslationStatus.UNDER_REVIEW) {
      throw new BadRequestException('Request must be under review to request revision');
    }

    request.status = TranslationStatus.NEEDS_REVISION;
    request.reviewedById = reviewerId;
    request.reviewComments = reviewDto.reviewComments;

    return await this.translationRequestRepository.save(request);
  }

  async startReview(
    id: string,
    reviewerId: string,
    userRole: string,
  ): Promise<TranslationRequest> {
    if (userRole !== 'KHCN_DN') {
      throw new ForbiddenException('Only KHCN_DN can start review');
    }

    const request = await this.translationRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Translation request not found');
    }

    if (request.status !== TranslationStatus.PENDING) {
      throw new BadRequestException('Request must be pending to start review');
    }

    request.status = TranslationStatus.UNDER_REVIEW;
    request.reviewedById = reviewerId;

    return await this.translationRequestRepository.save(request);
  }

  async generateReport(
    reportDto: TranslationReportDto,
    userRole: string,
    userUnit: string,
    res: Response,
  ) {
    const { 
      startDate, 
      endDate, 
      submittingUnit, 
      status, 
      documentType, 
      languagePair, 
      format, 
      year 
    } = reportDto;

    let dateFilter: any = {};
    
    // Calculate date range
    if (year) {
      const currentYear = parseInt(year);
      dateFilter = {
        createdAt: Between(
          new Date(currentYear, 0, 1),
          new Date(currentYear, 11, 31, 23, 59, 59)
        ),
      };
    } else if (startDate && endDate) {
      dateFilter = {
        createdAt: Between(new Date(startDate), new Date(endDate)),
      };
    }

    const queryBuilder = this.translationRequestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.submittedBy', 'submittedBy')
      .leftJoinAndSelect('request.reviewedBy', 'reviewedBy')
      .orderBy('request.createdAt', 'ASC');

    // Role-based filtering
    if (userRole !== 'KHCN_DN') {
      queryBuilder.where('request.submittingUnit = :userUnit', { userUnit });
    }

    // Apply filters
    if (submittingUnit) {
      queryBuilder.andWhere('request.submittingUnit = :submittingUnit', { submittingUnit });
    }

    if (status) {
      queryBuilder.andWhere('request.status = :status', { status });
    }

    if (documentType) {
      queryBuilder.andWhere('request.documentType = :documentType', { documentType });
    }

    if (languagePair) {
      queryBuilder.andWhere('request.languagePair = :languagePair', { languagePair });
    }

    // Apply date filter
    if (Object.keys(dateFilter).length > 0) {
      queryBuilder.andWhere('request.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateFilter.createdAt.from,
        endDate: dateFilter.createdAt.to,
      });
    }

    const requests = await queryBuilder.getMany();

    // Generate report based on format
    switch (format) {
      case ReportFormat.EXCEL:
        return await this.generateExcelReport(requests, res);
      case ReportFormat.PDF:
        return await this.generatePDFReport(requests, res);
      default:
        return await this.generateExcelReport(requests, res);
    }
  }

  private async generateRequestCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.translationRequestRepository.count();
    return `TR${year}${String(count + 1).padStart(3, '0')}`;
  }

  private async generateConfirmationDocument(request: TranslationRequest): Promise<void> {
    // Generate Word/PDF confirmation document
    // This is a placeholder - implement actual document generation
    const filename = `confirmation-${request.requestCode}.pdf`;
    const filePath = `./uploads/confirmations/${filename}`;
    
    request.confirmationDocumentPath = filePath;
  }

  private async generateExcelReport(requests: TranslationRequest[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Translation Report');

    // Add headers
    worksheet.columns = [
      { header: 'Mã yêu cầu', key: 'requestCode', width: 15 },
      { header: 'Tên tài liệu', key: 'originalDocumentTitle', width: 40 },
      { header: 'Loại tài liệu', key: 'documentType', width: 20 },
      { header: 'Ngôn ngữ', key: 'languagePair', width: 25 },
      { header: 'Đơn vị nộp', key: 'submittingUnit', width: 25 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày nộp', key: 'createdAt', width: 20 },
      { header: 'Ngày duyệt', key: 'approvedAt', width: 20 },
    ];

    // Add data
    requests.forEach(request => {
      worksheet.addRow({
        requestCode: request.requestCode,
        originalDocumentTitle: request.originalDocumentTitle,
        documentType: request.documentType,
        languagePair: request.languagePair,
        submittingUnit: request.submittingUnit,
        status: request.status,
        createdAt: request.createdAt.toLocaleDateString('vi-VN'),
        approvedAt: request.approvedAt?.toLocaleDateString('vi-VN') || '',
      });
    });

    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="translation-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  private async generatePDFReport(requests: TranslationRequest[], res: Response) {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="translation-report-${new Date().toISOString().split('T')[0]}.pdf"`,
    );

    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('BÁO CÁO XÁC NHẬN BẢN DỊCH', { align: 'center' });
    doc.moveDown();

    // Add request data
    requests.forEach((request, index) => {
      doc.fontSize(12).text(`${index + 1}. ${request.originalDocumentTitle}`, { underline: true });
      doc.text(`Mã yêu cầu: ${request.requestCode}`);
      doc.text(`Loại tài liệu: ${request.documentType}`);
      doc.text(`Ngôn ngữ: ${request.languagePair}`);
      doc.text(`Đơn vị nộp: ${request.submittingUnit}`);
      doc.text(`Trạng thái: ${request.status}`);
      doc.text(`Ngày nộp: ${request.createdAt.toLocaleDateString('vi-VN')}`);
      if (request.approvedAt) {
        doc.text(`Ngày duyệt: ${request.approvedAt.toLocaleDateString('vi-VN')}`);
      }
      doc.moveDown();
    });

    doc.end();
  }
}
