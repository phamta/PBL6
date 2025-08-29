import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Visitor } from '../entities/visitor.entity';
import { CreateVisitorDto } from '../dto/visitor/create-visitor.dto';
import { UpdateVisitorDto } from '../dto/visitor/update-visitor.dto';
import { VisitorReportDto, ReportPeriod } from '../dto/visitor/visitor-report.dto';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
  ) {}

  async create(
    createVisitorDto: CreateVisitorDto,
    userId: string,
    userUnit: string,
  ): Promise<Visitor> {
    // Check if passport number already exists
    const existingVisitor = await this.visitorRepository.findOne({
      where: { passportNumber: createVisitorDto.passportNumber },
    });

    if (existingVisitor) {
      throw new BadRequestException('Passport number already exists');
    }

    // Generate visitor code
    const visitorCode = await this.generateVisitorCode();

    const visitor = this.visitorRepository.create({
      ...createVisitorDto,
      visitorCode,
      createdById: userId,
      arrivalDateTime: new Date(createVisitorDto.arrivalDateTime),
      departureDateTime: new Date(createVisitorDto.departureDateTime),
    });

    return await this.visitorRepository.save(visitor);
  }

  async findAll(
    userId: string,
    userUnit: string,
    userRole: string,
    query?: {
      invitingUnit?: string;
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

    const queryBuilder = this.visitorRepository.createQueryBuilder('visitor')
      .leftJoinAndSelect('visitor.createdBy', 'createdBy')
      .orderBy('visitor.createdAt', 'DESC');

    // Role-based filtering
    if (userRole !== 'KHCN_DN') {
      queryBuilder.where('visitor.invitingUnit = :userUnit', { userUnit });
    }

    // Apply filters
    if (query?.invitingUnit) {
      queryBuilder.andWhere('visitor.invitingUnit = :invitingUnit', {
        invitingUnit: query.invitingUnit,
      });
    }

    if (query?.startDate && query?.endDate) {
      queryBuilder.andWhere('visitor.arrivalDateTime BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(visitor.fullName LIKE :search OR visitor.passportNumber LIKE :search OR visitor.organization LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [visitors, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: visitors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string, userUnit: string, userRole: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    // Check permissions
    if (userRole !== 'KHCN_DN' && visitor.invitingUnit !== userUnit) {
      throw new ForbiddenException('Access denied');
    }

    return visitor;
  }

  async update(
    id: string,
    updateVisitorDto: UpdateVisitorDto,
    userId: string,
    userUnit: string,
    userRole: string,
  ): Promise<Visitor> {
    const visitor = await this.findOne(id, userId, userUnit, userRole);

    // Check if passport number already exists (excluding current visitor)
    if (updateVisitorDto.passportNumber) {
      const existingVisitor = await this.visitorRepository.findOne({
        where: { passportNumber: updateVisitorDto.passportNumber },
      });

      if (existingVisitor && existingVisitor.id !== id) {
        throw new BadRequestException('Passport number already exists');
      }
    }

    Object.assign(visitor, updateVisitorDto);

    if (updateVisitorDto.arrivalDateTime) {
      visitor.arrivalDateTime = new Date(updateVisitorDto.arrivalDateTime);
    }

    if (updateVisitorDto.departureDateTime) {
      visitor.departureDateTime = new Date(updateVisitorDto.departureDateTime);
    }

    return await this.visitorRepository.save(visitor);
  }

  async remove(
    id: string,
    userId: string,
    userUnit: string,
    userRole: string,
  ): Promise<void> {
    const visitor = await this.findOne(id, userId, userUnit, userRole);
    await this.visitorRepository.remove(visitor);
  }

  async generateReport(
    reportDto: VisitorReportDto,
    userId: string,
    userUnit: string,
    userRole: string,
    res: Response,
  ) {
    const { startDate, endDate, invitingUnit, format, period, year, month, quarter } = reportDto;

    let dateFilter: any = {};
    
    // Calculate date range based on period
    if (period && period !== ReportPeriod.CUSTOM) {
      const currentYear = year ? parseInt(year) : new Date().getFullYear();
      
      switch (period) {
        case ReportPeriod.MONTHLY:
          const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
          dateFilter = {
            arrivalDateTime: Between(
              new Date(currentYear, currentMonth - 1, 1),
              new Date(currentYear, currentMonth, 0, 23, 59, 59)
            ),
          };
          break;
          
        case ReportPeriod.QUARTERLY:
          const currentQuarter = quarter ? parseInt(quarter) : Math.ceil((new Date().getMonth() + 1) / 3);
          const startMonth = (currentQuarter - 1) * 3;
          dateFilter = {
            arrivalDateTime: Between(
              new Date(currentYear, startMonth, 1),
              new Date(currentYear, startMonth + 3, 0, 23, 59, 59)
            ),
          };
          break;
          
        case ReportPeriod.YEARLY:
          dateFilter = {
            arrivalDateTime: Between(
              new Date(currentYear, 0, 1),
              new Date(currentYear, 11, 31, 23, 59, 59)
            ),
          };
          break;
      }
    } else if (startDate && endDate) {
      dateFilter = {
        arrivalDateTime: Between(new Date(startDate), new Date(endDate)),
      };
    }

    const queryBuilder = this.visitorRepository.createQueryBuilder('visitor')
      .leftJoinAndSelect('visitor.createdBy', 'createdBy')
      .orderBy('visitor.arrivalDateTime', 'ASC');

    // Role-based filtering
    if (userRole !== 'KHCN_DN') {
      queryBuilder.where('visitor.invitingUnit = :userUnit', { userUnit });
    }

    // Apply unit filter
    if (invitingUnit) {
      queryBuilder.andWhere('visitor.invitingUnit = :invitingUnit', { invitingUnit });
    }

    // Apply date filter
    if (Object.keys(dateFilter).length > 0) {
      queryBuilder.andWhere('visitor.arrivalDateTime BETWEEN :startDate AND :endDate', {
        startDate: dateFilter.arrivalDateTime.from,
        endDate: dateFilter.arrivalDateTime.to,
      });
    }

    const visitors = await queryBuilder.getMany();

    // Generate report based on format
    switch (format) {
      case 'excel':
        return await this.generateExcelReport(visitors, res);
      case 'pdf':
        return await this.generatePDFReport(visitors, res);
      case 'word':
        return await this.generateWordReport(visitors, res);
      default:
        return await this.generateExcelReport(visitors, res);
    }
  }

  private async generateVisitorCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.visitorRepository.count();
    return `VIS${year}${String(count + 1).padStart(4, '0')}`;
  }

  private async generateExcelReport(visitors: Visitor[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Visitor Report');

    // Add headers
    worksheet.columns = [
      { header: 'Mã khách', key: 'visitorCode', width: 15 },
      { header: 'Họ và tên', key: 'fullName', width: 25 },
      { header: 'Quốc tịch', key: 'nationality', width: 15 },
      { header: 'Số hộ chiếu', key: 'passportNumber', width: 15 },
      { header: 'Giới tính', key: 'gender', width: 10 },
      { header: 'Ngày sinh', key: 'dateOfBirth', width: 15 },
      { header: 'Chức danh', key: 'position', width: 20 },
      { header: 'Cơ quan', key: 'organization', width: 30 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Điện thoại', key: 'phoneNumber', width: 15 },
      { header: 'Thời gian đến', key: 'arrivalDateTime', width: 20 },
      { header: 'Thời gian rời', key: 'departureDateTime', width: 20 },
      { header: 'Mục đích', key: 'purpose', width: 20 },
      { header: 'Đơn vị mời', key: 'invitingUnit', width: 25 },
    ];

    // Add data
    visitors.forEach(visitor => {
      worksheet.addRow({
        visitorCode: visitor.visitorCode,
        fullName: visitor.fullName,
        nationality: visitor.nationality,
        passportNumber: visitor.passportNumber,
        gender: visitor.gender,
        dateOfBirth: visitor.dateOfBirth,
        position: visitor.position,
        organization: visitor.organization,
        email: visitor.email,
        phoneNumber: visitor.phoneNumber,
        arrivalDateTime: visitor.arrivalDateTime.toLocaleDateString('vi-VN'),
        departureDateTime: visitor.departureDateTime.toLocaleDateString('vi-VN'),
        purpose: visitor.purpose,
        invitingUnit: visitor.invitingUnit,
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
      `attachment; filename="visitor-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  private async generatePDFReport(visitors: Visitor[], res: Response) {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="visitor-report-${new Date().toISOString().split('T')[0]}.pdf"`,
    );

    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('BÁO CÁO KHÁCH QUỐC TẾ', { align: 'center' });
    doc.moveDown();

    // Add visitor data
    visitors.forEach((visitor, index) => {
      doc.fontSize(12).text(`${index + 1}. ${visitor.fullName}`, { underline: true });
      doc.text(`Quốc tịch: ${visitor.nationality}`);
      doc.text(`Số hộ chiếu: ${visitor.passportNumber}`);
      doc.text(`Cơ quan: ${visitor.organization}`);
      doc.text(`Đơn vị mời: ${visitor.invitingUnit}`);
      doc.text(`Thời gian: ${visitor.arrivalDateTime.toLocaleDateString('vi-VN')} - ${visitor.departureDateTime.toLocaleDateString('vi-VN')}`);
      doc.moveDown();
    });

    doc.end();
  }

  private async generateWordReport(visitors: Visitor[], res: Response) {
    // For simplicity, we'll generate a basic text document
    // In a real application, you might want to use a library like docx
    let content = 'BÁO CÁO KHÁCH QUỐC TẾ\n\n';
    
    visitors.forEach((visitor, index) => {
      content += `${index + 1}. ${visitor.fullName}\n`;
      content += `Quốc tịch: ${visitor.nationality}\n`;
      content += `Số hộ chiếu: ${visitor.passportNumber}\n`;
      content += `Cơ quan: ${visitor.organization}\n`;
      content += `Đơn vị mời: ${visitor.invitingUnit}\n`;
      content += `Thời gian: ${visitor.arrivalDateTime.toLocaleDateString('vi-VN')} - ${visitor.departureDateTime.toLocaleDateString('vi-VN')}\n\n`;
    });

    res.setHeader('Content-Type', 'application/msword');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="visitor-report-${new Date().toISOString().split('T')[0]}.doc"`,
    );

    res.send(content);
  }
}
