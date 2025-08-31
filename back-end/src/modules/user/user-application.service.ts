import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaApplication, VisaStatus } from '../visa/entities/visa-application.entity';
import { VisaHistory } from '../visa/entities/visa-history.entity';
import { MOUApplication, MOUStatus } from './entities/mou-application.entity';
import { VisitorApplication, VisitorStatus } from './entities/visitor-application.entity';
import { TranslationRequest, TranslationStatus } from './entities/translation-request.entity';
import { User } from './entities/user.entity';
import {
  CreateVisaApplicationDto,
  UpdateVisaApplicationDto,
  CreateMOUDto,
  UpdateMOUDto,
  CreateVisitorGroupDto,
  UpdateVisitorGroupDto,
  CreateTranslationRequestDto,
  UpdateTranslationRequestDto,
} from './dto';

export interface UserStats {
  visa: {
    total: number;
    pending: number;
    processing: number;
    approved: number;
    rejected: number;
  };
  mou: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  visitor: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  translation: {
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
}

@Injectable()
export class UserApplicationService {
  constructor(
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
    @InjectRepository(VisaHistory)
    private visaHistoryRepository: Repository<VisaHistory>,
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
  // VISA MANAGEMENT (For Students)
  // ===================

  async createVisaApplication(userId: string, createDto: CreateVisaApplicationDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const visaApplication = new VisaApplication();
    visaApplication.userId = userId;
    visaApplication.passportNo = createDto.passportNo;
    visaApplication.visaType = createDto.visaType;
    visaApplication.country = createDto.country;
    visaApplication.expireDate = new Date(createDto.expireDate);
    visaApplication.status = VisaStatus.PENDING;

    const savedVisa = await this.visaRepository.save(visaApplication);

    // Create initial history record
    const history = new VisaHistory();
    history.visaApplication = savedVisa;
    history.status = VisaStatus.PENDING;
    history.notes = 'Hồ sơ được tạo bởi sinh viên';
    history.updatedBy = userId;
    history.updatedAt = new Date();

    await this.visaHistoryRepository.save(history);

    return savedVisa;
  }

  async getUserVisaApplications(userId: string) {
    return await this.visaRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserVisaApplication(id: string, userId: string) {
    const visa = await this.visaRepository.findOne({
      where: { id, userId },
      relations: ['user', 'history', 'documents']
    });

    if (!visa) {
      throw new NotFoundException('Visa application not found or access denied');
    }

    return visa;
  }

  async updateVisaApplication(id: string, userId: string, updateDto: UpdateVisaApplicationDto) {
    const visa = await this.getUserVisaApplication(id, userId);
    
    // Only allow updates if status is PENDING or PROCESSING (needs additional info)
    if (![VisaStatus.PENDING, VisaStatus.PROCESSING].includes(visa.status)) {
      throw new BadRequestException('Cannot update visa application in current status');
    }

    Object.assign(visa, updateDto);
    visa.updatedAt = new Date();

    // Create history record
    const history = new VisaHistory();
    history.visaApplication = visa;
    history.status = visa.status;
    history.notes = 'Hồ sơ được cập nhật bởi sinh viên';
    history.updatedBy = userId;
    history.updatedAt = new Date();

    await this.visaHistoryRepository.save(history);
    return await this.visaRepository.save(visa);
  }

  // ===================
  // MOU MANAGEMENT (For Staff/Faculty)
  // ===================

  async createMOU(userId: string, createDto: CreateMOUDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const mou = new MOUApplication();
    mou.userId = userId;
    Object.assign(mou, createDto);
    mou.proposedStartDate = new Date(createDto.proposedStartDate);
    if (createDto.proposedEndDate) {
      mou.proposedEndDate = new Date(createDto.proposedEndDate);
    }
    mou.status = MOUStatus.DRAFT;

    return await this.mouRepository.save(mou);
  }

  async getUserMOUs(userId: string) {
    return await this.mouRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserMOU(id: string, userId: string) {
    const mou = await this.mouRepository.findOne({
      where: { id, userId },
      relations: ['user']
    });

    if (!mou) {
      throw new NotFoundException('MOU application not found or access denied');
    }

    return mou;
  }

  async updateMOU(id: string, userId: string, updateDto: UpdateMOUDto) {
    const mou = await this.getUserMOU(id, userId);
    
    // Only allow updates if status is DRAFT or SUBMITTED
    if (![MOUStatus.DRAFT, MOUStatus.SUBMITTED].includes(mou.status)) {
      throw new BadRequestException('Cannot update MOU in current status');
    }

    Object.assign(mou, updateDto);
    if (updateDto.proposedStartDate) {
      mou.proposedStartDate = new Date(updateDto.proposedStartDate);
    }
    if (updateDto.proposedEndDate) {
      mou.proposedEndDate = new Date(updateDto.proposedEndDate);
    }
    mou.updatedAt = new Date();

    return await this.mouRepository.save(mou);
  }

  async submitMOU(id: string, userId: string) {
    const mou = await this.getUserMOU(id, userId);
    
    if (mou.status !== MOUStatus.DRAFT) {
      throw new BadRequestException('Only draft MOUs can be submitted');
    }

    mou.status = MOUStatus.SUBMITTED;
    mou.updatedAt = new Date();

    return await this.mouRepository.save(mou);
  }

  // ===================
  // VISITOR MANAGEMENT (For Staff/Faculty)
  // ===================

  async createVisitorGroup(userId: string, createDto: CreateVisitorGroupDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const visitor = new VisitorApplication();
    visitor.userId = userId;
    Object.assign(visitor, createDto);
    visitor.visitStartDate = new Date(createDto.visitStartDate);
    visitor.visitEndDate = new Date(createDto.visitEndDate);
    visitor.status = VisitorStatus.DRAFT;

    return await this.visitorRepository.save(visitor);
  }

  async getUserVisitorGroups(userId: string) {
    return await this.visitorRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserVisitorGroup(id: string, userId: string) {
    const visitor = await this.visitorRepository.findOne({
      where: { id, userId },
      relations: ['user']
    });

    if (!visitor) {
      throw new NotFoundException('Visitor group not found or access denied');
    }

    return visitor;
  }

  async updateVisitorGroup(id: string, userId: string, updateDto: UpdateVisitorGroupDto) {
    const visitor = await this.getUserVisitorGroup(id, userId);
    
    // Only allow updates if status is DRAFT or SUBMITTED
    if (![VisitorStatus.DRAFT, VisitorStatus.SUBMITTED].includes(visitor.status)) {
      throw new BadRequestException('Cannot update visitor group in current status');
    }

    Object.assign(visitor, updateDto);
    if (updateDto.visitStartDate) {
      visitor.visitStartDate = new Date(updateDto.visitStartDate);
    }
    if (updateDto.visitEndDate) {
      visitor.visitEndDate = new Date(updateDto.visitEndDate);
    }
    visitor.updatedAt = new Date();

    return await this.visitorRepository.save(visitor);
  }

  async submitVisitorGroup(id: string, userId: string) {
    const visitor = await this.getUserVisitorGroup(id, userId);
    
    if (visitor.status !== VisitorStatus.DRAFT) {
      throw new BadRequestException('Only draft visitor groups can be submitted');
    }

    visitor.status = VisitorStatus.SUBMITTED;
    visitor.updatedAt = new Date();

    return await this.visitorRepository.save(visitor);
  }

  // ===================
  // TRANSLATION MANAGEMENT (For Staff/Faculty)
  // ===================

  async createTranslationRequest(userId: string, createDto: CreateTranslationRequestDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const translation = new TranslationRequest();
    translation.userId = userId;
    Object.assign(translation, createDto);
    translation.deadline = new Date(createDto.deadline);
    translation.status = TranslationStatus.DRAFT;

    return await this.translationRepository.save(translation);
  }

  async getUserTranslationRequests(userId: string) {
    return await this.translationRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserTranslationRequest(id: string, userId: string) {
    const translation = await this.translationRepository.findOne({
      where: { id, userId },
      relations: ['user']
    });

    if (!translation) {
      throw new NotFoundException('Translation request not found or access denied');
    }

    return translation;
  }

  async updateTranslationRequest(id: string, userId: string, updateDto: UpdateTranslationRequestDto) {
    const translation = await this.getUserTranslationRequest(id, userId);
    
    // Only allow updates if status is DRAFT or SUBMITTED
    if (![TranslationStatus.DRAFT, TranslationStatus.SUBMITTED].includes(translation.status)) {
      throw new BadRequestException('Cannot update translation request in current status');
    }

    Object.assign(translation, updateDto);
    if (updateDto.deadline) {
      translation.deadline = new Date(updateDto.deadline);
    }
    translation.updatedAt = new Date();

    return await this.translationRepository.save(translation);
  }

  async submitTranslationRequest(id: string, userId: string) {
    const translation = await this.getUserTranslationRequest(id, userId);
    
    if (translation.status !== TranslationStatus.DRAFT) {
      throw new BadRequestException('Only draft translation requests can be submitted');
    }

    translation.status = TranslationStatus.SUBMITTED;
    translation.updatedAt = new Date();

    return await this.translationRepository.save(translation);
  }

  // ===================
  // REPORTS & STATISTICS
  // ===================

  async getUserStats(userId: string): Promise<UserStats> {
    // Visa statistics
    const totalVisa = await this.visaRepository.count({ where: { userId } });
    const visaPending = await this.visaRepository.count({ 
      where: { userId, status: VisaStatus.PENDING } 
    });
    const visaProcessing = await this.visaRepository.count({ 
      where: { userId, status: VisaStatus.PROCESSING } 
    });
    const visaApproved = await this.visaRepository.count({ 
      where: { userId, status: VisaStatus.APPROVED } 
    });
    const visaRejected = await this.visaRepository.count({ 
      where: { userId, status: VisaStatus.REJECTED } 
    });

    // MOU statistics
    const totalMOU = await this.mouRepository.count({ where: { userId } });
    const mouDraft = await this.mouRepository.count({ 
      where: { userId, status: MOUStatus.DRAFT } 
    });
    const mouSubmitted = await this.mouRepository.count({ 
      where: { userId, status: MOUStatus.SUBMITTED } 
    });
    const mouApproved = await this.mouRepository.count({ 
      where: { userId, status: MOUStatus.APPROVED } 
    });
    const mouRejected = await this.mouRepository.count({ 
      where: { userId, status: MOUStatus.REJECTED } 
    });

    // Visitor statistics
    const totalVisitor = await this.visitorRepository.count({ where: { userId } });
    const visitorDraft = await this.visitorRepository.count({ 
      where: { userId, status: VisitorStatus.DRAFT } 
    });
    const visitorSubmitted = await this.visitorRepository.count({ 
      where: { userId, status: VisitorStatus.SUBMITTED } 
    });
    const visitorApproved = await this.visitorRepository.count({ 
      where: { userId, status: VisitorStatus.APPROVED } 
    });
    const visitorRejected = await this.visitorRepository.count({ 
      where: { userId, status: VisitorStatus.REJECTED } 
    });

    // Translation statistics
    const totalTranslation = await this.translationRepository.count({ where: { userId } });
    const translationDraft = await this.translationRepository.count({ 
      where: { userId, status: TranslationStatus.DRAFT } 
    });
    const translationSubmitted = await this.translationRepository.count({ 
      where: { userId, status: TranslationStatus.SUBMITTED } 
    });
    const translationApproved = await this.translationRepository.count({ 
      where: { userId, status: TranslationStatus.APPROVED } 
    });
    const translationRejected = await this.translationRepository.count({ 
      where: { userId, status: TranslationStatus.REJECTED } 
    });

    return {
      visa: {
        total: totalVisa,
        pending: visaPending,
        processing: visaProcessing,
        approved: visaApproved,
        rejected: visaRejected
      },
      mou: {
        total: totalMOU,
        draft: mouDraft,
        submitted: mouSubmitted,
        approved: mouApproved,
        rejected: mouRejected
      },
      visitor: {
        total: totalVisitor,
        draft: visitorDraft,
        submitted: visitorSubmitted,
        approved: visitorApproved,
        rejected: visitorRejected
      },
      translation: {
        total: totalTranslation,
        draft: translationDraft,
        submitted: translationSubmitted,
        approved: translationApproved,
        rejected: translationRejected
      }
    };
  }

  // ===================
  // UTILITY METHODS
  // ===================

  async getUpcomingVisaExpirations(userId: string, days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.visaRepository.find({
      where: { 
        userId,
        status: VisaStatus.APPROVED
      },
      order: { expireDate: 'ASC' }
    });
  }
}
