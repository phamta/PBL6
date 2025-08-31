import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mou, MouStatus } from '../mou/entities/mou.entity';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Mou)
    private mouRepository: Repository<Mou>,
  ) {}

  async generateExcelReport(filters?: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('MOU Report');

    // Headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tiêu đề', key: 'title', width: 30 },
      { header: 'Đối tác', key: 'partnerOrganization', width: 25 },
      { header: 'Quốc gia', key: 'partnerCountry', width: 15 },
      { header: 'Loại', key: 'type', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 15 },
      { header: 'Ngày ký', key: 'signedDate', width: 15 },
      { header: 'Ngày hết hạn', key: 'expiryDate', width: 15 },
      { header: 'Khoa/Phòng', key: 'department', width: 20 },
    ];

    // Apply filters and get data
    const query = this.mouRepository.createQueryBuilder('mou');
    
    if (filters?.status) {
      query.andWhere('mou.status = :status', { status: filters.status });
    }
    if (filters?.year) {
      const year = parseInt(filters.year);
      query.andWhere('EXTRACT(YEAR FROM mou.createdAt) = :year', { year });
    }
    if (filters?.partnerCountry) {
      query.andWhere('mou.partnerCountry ILIKE :country', { 
        country: `%${filters.partnerCountry}%` 
      });
    }

    const mous = await query.orderBy('mou.createdAt', 'DESC').getMany();

    // Add data rows
    mous.forEach((mou, index) => {
      worksheet.addRow({
        id: index + 1,
        title: mou.title,
        partnerOrganization: mou.partnerOrganization,
        partnerCountry: mou.partnerCountry,
        type: mou.type,
        status: mou.status,
        createdAt: mou.createdAt?.toLocaleDateString('vi-VN'),
        signedDate: mou.signedDate?.toLocaleDateString('vi-VN') || '',
        expiryDate: mou.endDate?.toLocaleDateString('vi-VN') || '',
        department: mou.department || '',
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generatePDFReport(filters?: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Title
        doc.fontSize(18).font('Helvetica-Bold').text('BÁO CÁO THỐNG KÊ MOU', { align: 'center' });
        doc.moveDown(2);

        // Apply filters and get data
        const query = this.mouRepository.createQueryBuilder('mou');
        
        if (filters?.status) {
          query.andWhere('mou.status = :status', { status: filters.status });
        }
        if (filters?.year) {
          const year = parseInt(filters.year);
          query.andWhere('EXTRACT(YEAR FROM mou.createdAt) = :year', { year });
        }

        const mous = await query.orderBy('mou.createdAt', 'DESC').getMany();

        // Summary statistics
        const totalMous = mous.length;
        const signedMous = mous.filter(m => m.status === MouStatus.SIGNED).length;
        const approvedMous = mous.filter(m => m.status === MouStatus.APPROVED).length;

        doc.fontSize(12).font('Helvetica-Bold').text('THỐNG KÊ TỔNG QUAN:');
        doc.fontSize(10).font('Helvetica')
          .text(`- Tổng số MOU: ${totalMous}`)
          .text(`- MOU đã ký: ${signedMous}`)
          .text(`- MOU đã duyệt: ${approvedMous}`)
          .moveDown();

        // Country statistics
        const countryStats = mous.reduce((acc, mou) => {
          acc[mou.partnerCountry] = (acc[mou.partnerCountry] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        doc.fontSize(12).font('Helvetica-Bold').text('THỐNG KÊ THEO QUỐC GIA:');
        Object.entries(countryStats).forEach(([country, count]) => {
          doc.fontSize(10).font('Helvetica').text(`- ${country}: ${count} MOU`);
        });

        doc.moveDown();

        // MOU list
        doc.fontSize(12).font('Helvetica-Bold').text('DANH SÁCH MOU:');
        doc.moveDown();

        mous.forEach((mou, index) => {
          if (doc.y > 700) {
            doc.addPage();
          }

          doc.fontSize(10).font('Helvetica-Bold')
            .text(`${index + 1}. ${mou.title}`, { continued: false });
          
          doc.fontSize(9).font('Helvetica')
            .text(`   Đối tác: ${mou.partnerOrganization}`)
            .text(`   Quốc gia: ${mou.partnerCountry}`)
            .text(`   Trạng thái: ${mou.status}`)
            .text(`   Ngày tạo: ${mou.createdAt?.toLocaleDateString('vi-VN')}`)
            .moveDown(0.5);
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getDashboardStats(): Promise<any> {
    const totalMous = await this.mouRepository.count();
    
    const statusStats = await this.mouRepository
      .createQueryBuilder('mou')
      .select('mou.status, COUNT(*) as count')
      .groupBy('mou.status')
      .getRawMany();

    const recentMous = await this.mouRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['creator'],
    });

    const expiringMous = await this.mouRepository
      .createQueryBuilder('mou')
      .where('mou.expiryDate BETWEEN :now AND :sixMonths', {
        now: new Date(),
        sixMonths: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
      })
      .andWhere('mou.status = :status', { status: MouStatus.SIGNED })
      .getMany();

    return {
      totalMous,
      statusStats,
      recentMous,
      expiringMous,
    };
  }
}
