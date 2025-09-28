import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaApplication, VisaStatus } from '../../visa/visa/entities/visa-application.entity';
import { MOUApplication, MOUStatus } from '../../identity/user/entities/mou-application.entity';
import { VisitorApplication, VisitorStatus } from '../../identity/user/entities/visitor-application.entity';
import { TranslationRequest, TranslationStatus } from '../../identity/user/entities/translation-request.entity';
import { User } from '../../identity/user/entities/user.entity';
import {
  MOUFilterDto,
  VisitorFilterDto,
  TranslationFilterDto,
  VisaStatisticsDto,
} from './dto';

export interface DashboardStats {
  mou: {
    total: number;
    byYear: Array<{ year: string; count: number }>;
    byCountry: Array<{ country: string; count: number }>;
  };
  visa: {
    total: number;
    expiring: number;
    byCountry: Array<{ country: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
  };
  visitor: {
    total: number;
    totalVisitors: number;
    byCountry: Array<{ country: string; count: number; totalVisitors: number }>;
    byYear: Array<{ year: string; count: number; totalVisitors: number }>;
  };
  translation: {
    total: number;
    byYear: Array<{ year: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byLanguagePair: Array<{ pair: string; count: number }>;
  };
}

@Injectable()
export class ViewerService {
  constructor(
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
    @InjectRepository(MOUApplication)
    private mouRepository: Repository<MOUApplication>,
    @InjectRepository(VisitorApplication)
    private visitorRepository: Repository<VisitorApplication>,
    @InjectRepository(TranslationRequest)
    private translationRepository: Repository<TranslationRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ===================
  // DASHBOARD STATISTICS
  // ===================

  async getDashboardStats(): Promise<DashboardStats> {
    // MOU Statistics
    const mouTotal = await this.mouRepository.count({ 
      where: { status: MOUStatus.APPROVED } 
    });

    const mouByYear = await this.mouRepository
      .createQueryBuilder('mou')
      .select('EXTRACT(YEAR FROM mou.proposedStartDate) as year')
      .addSelect('COUNT(*) as count')
      .where('mou.status = :status', { status: MOUStatus.APPROVED })
      .groupBy('EXTRACT(YEAR FROM mou.proposedStartDate)')
      .orderBy('year', 'DESC')
      .getRawMany();

    const mouByCountry = await this.mouRepository
      .createQueryBuilder('mou')
      .select('mou.partnerCountry as country')
      .addSelect('COUNT(*) as count')
      .where('mou.status = :status', { status: MOUStatus.APPROVED })
      .groupBy('mou.partnerCountry')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Visa Statistics
    const visaTotal = await this.visaRepository.count({ 
      where: { status: VisaStatus.APPROVED } 
    });

    const visaExpiring = await this.visaRepository.count({
      where: { 
        status: VisaStatus.APPROVED,
        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    const visaByCountry = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.country as country')
      .addSelect('COUNT(*) as count')
      .where('visa.status = :status', { status: VisaStatus.APPROVED })
      .groupBy('visa.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const visaByType = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.visaType as type')
      .addSelect('COUNT(*) as count')
      .where('visa.status = :status', { status: VisaStatus.APPROVED })
      .groupBy('visa.visaType')
      .orderBy('count', 'DESC')
      .getRawMany();

    // Visitor Statistics
    const visitorTotal = await this.visitorRepository.count({ 
      where: { status: VisitorStatus.APPROVED } 
    });

    const totalVisitorsCount = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('SUM(visitor.groupSize)', 'total')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .getRawOne();

    const visitorByCountry = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.country as country')
      .addSelect('COUNT(*) as count')
      .addSelect('SUM(visitor.groupSize) as totalVisitors')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .groupBy('visitor.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const visitorByYear = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('EXTRACT(YEAR FROM visitor.visitStartDate) as year')
      .addSelect('COUNT(*) as count')
      .addSelect('SUM(visitor.groupSize) as totalVisitors')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .groupBy('EXTRACT(YEAR FROM visitor.visitStartDate)')
      .orderBy('year', 'DESC')
      .getRawMany();

    // Translation Statistics
    const translationTotal = await this.translationRepository.count({ 
      where: { status: TranslationStatus.COMPLETED } 
    });

    const translationByYear = await this.translationRepository
      .createQueryBuilder('trans')
      .select('EXTRACT(YEAR FROM trans.createdAt) as year')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('EXTRACT(YEAR FROM trans.createdAt)')
      .orderBy('year', 'DESC')
      .getRawMany();

    const translationByType = await this.translationRepository
      .createQueryBuilder('trans')
      .select('trans.documentType as type')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('trans.documentType')
      .orderBy('count', 'DESC')
      .getRawMany();

    const translationByLanguagePair = await this.translationRepository
      .createQueryBuilder('trans')
      .select('CONCAT(trans.sourceLanguage, \' → \', trans.targetLanguage) as pair')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('trans.sourceLanguage, trans.targetLanguage')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      mou: {
        total: mouTotal,
        byYear: mouByYear,
        byCountry: mouByCountry,
      },
      visa: {
        total: visaTotal,
        expiring: visaExpiring,
        byCountry: visaByCountry,
        byType: visaByType,
      },
      visitor: {
        total: visitorTotal,
        totalVisitors: parseInt(totalVisitorsCount?.total || '0'),
        byCountry: visitorByCountry,
        byYear: visitorByYear,
      },
      translation: {
        total: translationTotal,
        byYear: translationByYear,
        byType: translationByType,
        byLanguagePair: translationByLanguagePair,
      },
    };
  }

  // ===================
  // MOU QUERIES
  // ===================

  async getMOUs(filterDto: MOUFilterDto) {
    const query = this.mouRepository
      .createQueryBuilder('mou')
      .leftJoinAndSelect('mou.user', 'user')
      .where('mou.status = :status', { status: MOUStatus.APPROVED });

    if (filterDto.year) {
      query.andWhere('EXTRACT(YEAR FROM mou.proposedStartDate) = :year', { 
        year: filterDto.year 
      });
    }

    if (filterDto.country) {
      query.andWhere('mou.partnerCountry ILIKE :country', { 
        country: `%${filterDto.country}%` 
      });
    }

    if (filterDto.field) {
      query.andWhere('mou.collaborationType ILIKE :field', { 
        field: `%${filterDto.field}%` 
      });
    }

    if (filterDto.partnerUniversity) {
      query.andWhere('mou.partnerUniversity ILIKE :partner', { 
        partner: `%${filterDto.partnerUniversity}%` 
      });
    }

    const total = await query.getCount();
    
    const offset = (filterDto.page - 1) * filterDto.limit;
    const mous = await query
      .orderBy('mou.proposedStartDate', 'DESC')
      .skip(offset)
      .take(filterDto.limit)
      .getMany();

    return {
      data: mous,
      total,
      page: filterDto.page,
      limit: filterDto.limit,
      totalPages: Math.ceil(total / filterDto.limit),
    };
  }

  async getMOUById(id: string) {
    return await this.mouRepository.findOne({
      where: { id, status: MOUStatus.APPROVED },
      relations: ['user'],
    });
  }

  // ===================
  // VISA QUERIES
  // ===================

  async getVisaStatistics(filterDto: VisaStatisticsDto) {
    const query = this.visaRepository
      .createQueryBuilder('visa')
      .where('visa.status = :status', { status: VisaStatus.APPROVED });

    if (filterDto.year) {
      query.andWhere('EXTRACT(YEAR FROM visa.createdAt) = :year', { 
        year: filterDto.year 
      });
    }

    if (filterDto.country) {
      query.andWhere('visa.country ILIKE :country', { 
        country: `%${filterDto.country}%` 
      });
    }

    if (filterDto.visaType) {
      query.andWhere('visa.visaType ILIKE :type', { 
        type: `%${filterDto.visaType}%` 
      });
    }

    const total = await query.getCount();

    const byCountry = await query
      .select('visa.country as country')
      .addSelect('COUNT(*) as count')
      .groupBy('visa.country')
      .orderBy('count', 'DESC')
      .getRawMany();

    const byType = await query
      .select('visa.visaType as type')
      .addSelect('COUNT(*) as count')
      .groupBy('visa.visaType')
      .orderBy('count', 'DESC')
      .getRawMany();

    const byYear = await query
      .select('EXTRACT(YEAR FROM visa.createdAt) as year')
      .addSelect('COUNT(*) as count')
      .groupBy('EXTRACT(YEAR FROM visa.createdAt)')
      .orderBy('year', 'DESC')
      .getRawMany();

    return {
      total,
      byCountry,
      byType,
      byYear,
    };
  }

  async getExpiringVisas(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.visaRepository.find({
      where: { 
        status: VisaStatus.APPROVED,
      },
      relations: ['user'],
      order: { expireDate: 'ASC' }
    });
  }

  // ===================
  // VISITOR QUERIES
  // ===================

  async getVisitors(filterDto: VisitorFilterDto) {
    const query = this.visitorRepository
      .createQueryBuilder('visitor')
      .leftJoinAndSelect('visitor.user', 'user')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED });

    if (filterDto.year) {
      query.andWhere('EXTRACT(YEAR FROM visitor.visitStartDate) = :year', { 
        year: filterDto.year 
      });
    }

    if (filterDto.country) {
      query.andWhere('visitor.country ILIKE :country', { 
        country: `%${filterDto.country}%` 
      });
    }

    if (filterDto.institution) {
      query.andWhere('visitor.institution ILIKE :institution', { 
        institution: `%${filterDto.institution}%` 
      });
    }

    const total = await query.getCount();
    
    const offset = (filterDto.page - 1) * filterDto.limit;
    const visitors = await query
      .orderBy('visitor.visitStartDate', 'DESC')
      .skip(offset)
      .take(filterDto.limit)
      .getMany();

    return {
      data: visitors,
      total,
      page: filterDto.page,
      limit: filterDto.limit,
      totalPages: Math.ceil(total / filterDto.limit),
    };
  }

  async getVisitorStatistics() {
    const total = await this.visitorRepository.count({ 
      where: { status: VisitorStatus.APPROVED } 
    });

    const totalVisitors = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('SUM(visitor.groupSize)', 'total')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .getRawOne();

    const byCountry = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.country as country')
      .addSelect('COUNT(*) as groups')
      .addSelect('SUM(visitor.groupSize) as totalVisitors')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .groupBy('visitor.country')
      .orderBy('totalVisitors', 'DESC')
      .getRawMany();

    const byYear = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('EXTRACT(YEAR FROM visitor.visitStartDate) as year')
      .addSelect('COUNT(*) as groups')
      .addSelect('SUM(visitor.groupSize) as totalVisitors')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .groupBy('EXTRACT(YEAR FROM visitor.visitStartDate)')
      .orderBy('year', 'DESC')
      .getRawMany();

    const byInstitution = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select('visitor.institution as institution')
      .addSelect('COUNT(*) as groups')
      .addSelect('SUM(visitor.groupSize) as totalVisitors')
      .where('visitor.status = :status', { status: VisitorStatus.APPROVED })
      .groupBy('visitor.institution')
      .orderBy('totalVisitors', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total,
      totalVisitors: parseInt(totalVisitors?.total || '0'),
      byCountry,
      byYear,
      byInstitution,
    };
  }

  // ===================
  // TRANSLATION QUERIES
  // ===================

  async getTranslations(filterDto: TranslationFilterDto) {
    const query = this.translationRepository
      .createQueryBuilder('trans')
      .leftJoinAndSelect('trans.user', 'user')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED });

    if (filterDto.year) {
      query.andWhere('EXTRACT(YEAR FROM trans.createdAt) = :year', { 
        year: filterDto.year 
      });
    }

    if (filterDto.documentType) {
      query.andWhere('trans.documentType ILIKE :type', { 
        type: `%${filterDto.documentType}%` 
      });
    }

    if (filterDto.sourceLanguage) {
      query.andWhere('trans.sourceLanguage ILIKE :source', { 
        source: `%${filterDto.sourceLanguage}%` 
      });
    }

    if (filterDto.targetLanguage) {
      query.andWhere('trans.targetLanguage ILIKE :target', { 
        target: `%${filterDto.targetLanguage}%` 
      });
    }

    const total = await query.getCount();
    
    const offset = (filterDto.page - 1) * filterDto.limit;
    const translations = await query
      .orderBy('trans.createdAt', 'DESC')
      .skip(offset)
      .take(filterDto.limit)
      .getMany();

    return {
      data: translations,
      total,
      page: filterDto.page,
      limit: filterDto.limit,
      totalPages: Math.ceil(total / filterDto.limit),
    };
  }

  async getTranslationStatistics() {
    const total = await this.translationRepository.count({ 
      where: { status: TranslationStatus.COMPLETED } 
    });

    const byYear = await this.translationRepository
      .createQueryBuilder('trans')
      .select('EXTRACT(YEAR FROM trans.createdAt) as year')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('EXTRACT(YEAR FROM trans.createdAt)')
      .orderBy('year', 'DESC')
      .getRawMany();

    const byType = await this.translationRepository
      .createQueryBuilder('trans')
      .select('trans.documentType as type')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('trans.documentType')
      .orderBy('count', 'DESC')
      .getRawMany();

    const byLanguagePair = await this.translationRepository
      .createQueryBuilder('trans')
      .select('CONCAT(trans.sourceLanguage, \' → \', trans.targetLanguage) as pair')
      .addSelect('COUNT(*) as count')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .groupBy('trans.sourceLanguage, trans.targetLanguage')
      .orderBy('count', 'DESC')
      .getRawMany();

    const avgCompletionTime = await this.translationRepository
      .createQueryBuilder('trans')
      .select('AVG(EXTRACT(EPOCH FROM (trans.updatedAt - trans.createdAt))/86400)', 'avgDays')
      .where('trans.status = :status', { status: TranslationStatus.COMPLETED })
      .getRawOne();

    return {
      total,
      byYear,
      byType,
      byLanguagePair,
      averageCompletionDays: Math.round(parseFloat(avgCompletionTime?.avgDays || '0')),
    };
  }
}
