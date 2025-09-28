import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VisaApplication, VisaStatus } from '../visa/entities/visa-application.entity';
import { VisaHistory } from '../visa/entities/visa-history.entity';
import { UpdateVisaStatusDto, CreateNA5DocumentDto } from './dto/visa-update.dto';
import { MOUStatus, UpdateMOUStatusDto, AddMOUCommentDto } from './dto/mou-update.dto';
import { VisitorStatus, UpdateVisitorStatusDto } from './dto/visitor-update.dto';
import { TranslationStatus, UpdateTranslationStatusDto, AddTranslationCommentDto } from './dto/translation-update.dto';
import { User } from '../user/entities/user.entity';

export interface SpecialistStats {
  visa: {
    total: number;
    pending: number;
    specialistReview: number;
    pendingManager: number;
    approved: number;
    rejected: number;
  };
  mou: {
    total: number;
    inProgress: number;
    pendingManager: number;
    approved: number;
  };
  visitor: {
    total: number;
    inProgress: number;
    pendingManager: number;
    approved: number;
  };
  translation: {
    total: number;
    inProgress: number;
    pendingManager: number;
    approved: number;
  };
}

@Injectable()
export class SpecialistService {
  constructor(
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
    @InjectRepository(VisaHistory)
    private visaHistoryRepository: Repository<VisaHistory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ===================
  // VISA MANAGEMENT
  // ===================
  
  async getVisaApplications(staffId: string) {
    // For now, get all visa applications since there's no assignedStaff field
    // TODO: Add assignedStaff relation to VisaApplication entity
    return await this.visaRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getVisaApplication(id: string, staffId: string) {
    const visa = await this.visaRepository.findOne({
      where: { id },
      relations: ['user', 'history', 'documents']
    });

    if (!visa) {
      throw new NotFoundException('Visa application not found');
    }

    return visa;
  }

  async updateVisaStatus(id: string, staffId: string, updateDto: UpdateVisaStatusDto) {
    const visa = await this.getVisaApplication(id, staffId);
    
    // Validate status transition
    if (!this.isValidVisaStatusTransition(visa.status, updateDto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    visa.status = updateDto.status;
    visa.updatedAt = new Date();

    // Create history record
    const history = new VisaHistory();
    history.visaApplication = visa;
    history.status = updateDto.status;
    history.notes = updateDto.note || '';
    history.updatedBy = staffId; // Store user ID as string
    history.updatedAt = new Date();

    await this.visaHistoryRepository.save(history);
    return await this.visaRepository.save(visa);
  }

  async createNA5Document(visaId: string, staffId: string, createDto: CreateNA5DocumentDto) {
    const visa = await this.getVisaApplication(visaId, staffId);
    
    if (visa.status !== VisaStatus.APPROVED) {
      throw new BadRequestException('Visa must be approved to create NA5/NA6 document');
    }

    // Here you would implement actual document generation
    // For now, we'll just create a history record
    const history = new VisaHistory();
    history.visaApplication = visa;
    history.status = visa.status;
    history.notes = `Created ${createDto.documentType} document. ${createDto.additionalNotes || ''}`;
    history.updatedBy = staffId; // Store user ID as string
    history.updatedAt = new Date();

    await this.visaHistoryRepository.save(history);

    return {
      message: `${createDto.documentType} document created successfully`,
      documentType: createDto.documentType,
      visaId: visaId
    };
  }

  // ===================
  // MOU MANAGEMENT (Placeholder entities)
  // ===================
  
  async getMOUs(staffId: string) {
    // TODO: Replace with actual MOU entity when available
    return [];
  }

  async updateMOUStatus(id: string, staffId: string, updateDto: UpdateMOUStatusDto) {
    // TODO: Implement when MOU entity is available
    return { message: 'MOU status updated', id, status: updateDto.status };
  }

  async addMOUComment(id: string, staffId: string, commentDto: AddMOUCommentDto) {
    // TODO: Implement when MOU entity is available
    return { message: 'Comment added to MOU', id, comment: commentDto.comment };
  }

  // ===================
  // VISITOR MANAGEMENT (Placeholder entities)
  // ===================
  
  async getVisitors(staffId: string) {
    // TODO: Replace with actual Visitor entity when available
    return [];
  }

  async getVisitor(id: string, staffId: string) {
    // TODO: Implement when Visitor entity is available
    return { id, message: 'Visitor details placeholder' };
  }

  async updateVisitorStatus(id: string, staffId: string, updateDto: UpdateVisitorStatusDto) {
    // TODO: Implement when Visitor entity is available
    return { message: 'Visitor status updated', id, status: updateDto.status };
  }

  // ===================
  // TRANSLATION MANAGEMENT (Placeholder entities)
  // ===================
  
  async getTranslations(staffId: string) {
    // TODO: Replace with actual Translation entity when available
    return [];
  }

  async updateTranslationStatus(id: string, staffId: string, updateDto: UpdateTranslationStatusDto) {
    // TODO: Implement when Translation entity is available
    return { message: 'Translation status updated', id, status: updateDto.status };
  }

  async addTranslationComment(id: string, staffId: string, commentDto: AddTranslationCommentDto) {
    // TODO: Implement when Translation entity is available
    return { message: 'Comment added to translation', id, comment: commentDto.comment };
  }

  // ===================
  // REPORTS & STATISTICS
  // ===================
  
  async getSpecialistReports(specialistId: string): Promise<SpecialistStats> {
    // Visa statistics - using actual VisaStatus values
    const totalVisa = await this.visaRepository.count();

    const visaPending = await this.visaRepository.count({
      where: { status: VisaStatus.PENDING }
    });

    const visaSpecialistReview = await this.visaRepository.count({
      where: { status: VisaStatus.SPECIALIST_REVIEW }
    });

    const visaPendingLeader = await this.visaRepository.count({
      where: { status: VisaStatus.PENDING_MANAGER_APPROVAL }
    });

    const visaApproved = await this.visaRepository.count({
      where: { status: VisaStatus.APPROVED }
    });

    const visaRejected = await this.visaRepository.count({
      where: { status: VisaStatus.REJECTED }
    });

    return {
      visa: {
        total: totalVisa,
        pending: visaPending,
        specialistReview: visaSpecialistReview,
        pendingManager: visaPendingLeader,
        approved: visaApproved,
        rejected: visaRejected
      },
      mou: {
        total: 0, // TODO: Implement when MOU entity available
        inProgress: 0,
        pendingManager: 0,
        approved: 0
      },
      visitor: {
        total: 0, // TODO: Implement when Visitor entity available
        inProgress: 0,
        pendingManager: 0,
        approved: 0
      },
      translation: {
        total: 0, // TODO: Implement when Translation entity available
        inProgress: 0,
        pendingManager: 0,
        approved: 0
      }
    };
  }

  // ===================
  // UTILITY METHODS
  // ===================
  
  private isValidVisaStatusTransition(currentStatus: VisaStatus, newStatus: VisaStatus): boolean {
    const validTransitions = {
      [VisaStatus.PENDING]: [VisaStatus.SPECIALIST_REVIEW],
      [VisaStatus.SPECIALIST_REVIEW]: [
        VisaStatus.PENDING_MANAGER_APPROVAL,
        VisaStatus.REJECTED,
        VisaStatus.PROCESSING
      ],
      [VisaStatus.PROCESSING]: [
        VisaStatus.SPECIALIST_REVIEW,
        VisaStatus.PENDING_MANAGER_APPROVAL
      ],
      [VisaStatus.PENDING_MANAGER_APPROVAL]: [
        VisaStatus.APPROVED,
        VisaStatus.REJECTED,
        VisaStatus.SPECIALIST_REVIEW
      ],
      [VisaStatus.APPROVED]: [],
      [VisaStatus.REJECTED]: [VisaStatus.SPECIALIST_REVIEW]
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
