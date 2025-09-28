import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { VisaApplication, VisaStatus } from '../visa/entities/visa-application.entity';
import { VisaHistory } from '../visa/entities/visa-history.entity';
import { ManagerInstruction, InstructionStatus } from './entities/manager-instruction.entity';
import { 
  ApproveVisaDto, 
  ApproveMouDto, 
  ApproveVisitorDto, 
  ApproveTranslationDto,
  RejectRequestDto, 
  SendInstructionDto 
} from './dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
    @InjectRepository(VisaHistory)
    private visaHistoryRepository: Repository<VisaHistory>,
    @InjectRepository(ManagerInstruction)
    private instructionRepository: Repository<ManagerInstruction>,
  ) {}

  // =============== QUẢN LÝ VISA ===============
  
  async getVisaApplicationsForReview(page: number = 1, limit: number = 10) {
    // Chỉ lấy những hồ sơ đã qua xử lý chuyên viên
    const [visas, total] = await this.visaRepository.findAndCount({
      where: { status: VisaStatus.PENDING_MANAGER_APPROVAL },
      relations: ['user', 'documents', 'history'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      visas,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getVisaDetails(visaId: string) {
    const visa = await this.visaRepository.findOne({
      where: { id: visaId },
      relations: ['user', 'documents', 'history', 'history.updatedBy', 'reminders'],
    });

    if (!visa) {
      throw new NotFoundException('Không tìm thấy hồ sơ visa');
    }

    return visa;
  }

  async approveVisa(visaId: string, approveDto: ApproveVisaDto, managerId: string) {
    const visa = await this.getVisaDetails(visaId);
    
    if (visa.status !== VisaStatus.PENDING_MANAGER_APPROVAL) {
      throw new BadRequestException('Hồ sơ không ở trạng thái chờ duyệt quản lý');
    }

    // Cập nhật trạng thái visa
    await this.visaRepository.update(visaId, {
      status: VisaStatus.APPROVED,
    });

    // Tạo lịch sử duyệt
    const history = this.visaHistoryRepository.create({
      visaId,
      status: VisaStatus.APPROVED,
      updatedBy: managerId,
      notes: approveDto.notes || 'Quản lý phê duyệt hồ sơ',
    });
    await this.visaHistoryRepository.save(history);

    return this.getVisaDetails(visaId);
  }

  async rejectVisa(visaId: string, rejectDto: RejectRequestDto, managerId: string) {
    const visa = await this.getVisaDetails(visaId);
    
    if (visa.status !== VisaStatus.PENDING_MANAGER_APPROVAL) {
      throw new BadRequestException('Hồ sơ không ở trạng thái chờ duyệt quản lý');
    }

    // Cập nhật trạng thái visa
    await this.visaRepository.update(visaId, {
      status: VisaStatus.REJECTED,
    });

    // Tạo lịch sử từ chối
    const history = this.visaHistoryRepository.create({
      visaId,
      status: VisaStatus.REJECTED,
      updatedBy: managerId,
      notes: `Quản lý từ chối: ${rejectDto.reason}. ${rejectDto.notes || ''}`,
    });
    await this.visaHistoryRepository.save(history);

    return this.getVisaDetails(visaId);
  }

  async getExpiringVisas(days: number = 30) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    return this.visaRepository.find({
      where: {
        status: VisaStatus.APPROVED,
        expireDate: LessThan(expirationDate),
      },
      relations: ['user'],
      order: { expireDate: 'ASC' },
    });
  }

  async getVisaStatistics() {
    const [total, pending, approved, rejected, processing] = await Promise.all([
      this.visaRepository.count(),
      this.visaRepository.count({ where: { status: VisaStatus.PENDING_MANAGER_APPROVAL } }),
      this.visaRepository.count({ where: { status: VisaStatus.APPROVED } }),
      this.visaRepository.count({ where: { status: VisaStatus.REJECTED } }),
      this.visaRepository.count({ where: { status: In([VisaStatus.PENDING, VisaStatus.SPECIALIST_REVIEW]) } }),
    ]);

    // Thống kê theo quốc gia
    const byCountry = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.country', 'country')
      .addSelect('COUNT(visa.id)', 'count')
      .groupBy('visa.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Thống kê theo loại visa
    const byType = await this.visaRepository
      .createQueryBuilder('visa')
      .select('visa.visaType', 'type')
      .addSelect('COUNT(visa.id)', 'count')
      .groupBy('visa.visaType')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      overview: { total, pending, approved, rejected, processing },
      byCountry,
      byType,
    };
  }

  // =============== QUẢN LÝ MOU ===============
  // TODO: Implement MOU management methods
  
  async getMouApplicationsForReview(page: number = 1, limit: number = 10) {
    // Placeholder - sẽ implement khi có MOU entity
    return {
      mous: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }

  // =============== QUẢN LÝ VISITOR GROUP ===============
  // TODO: Implement Visitor Group management methods
  
  async getVisitorGroupsForReview(page: number = 1, limit: number = 10) {
    // Placeholder - sẽ implement khi có VisitorGroup entity
    return {
      visitors: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }

  // =============== QUẢN LÝ TRANSLATION ===============
  // TODO: Implement Translation management methods
  
  async getTranslationRequestsForReview(page: number = 1, limit: number = 10) {
    // Placeholder - sẽ implement khi có TranslationRequest entity
    return {
      translations: [],
      total: 0,
      page,
      totalPages: 0,
    };
  }

  // =============== DASHBOARD & REPORTS ===============
  
  async getDashboardStats() {
    const [visaStats] = await Promise.all([
      this.getVisaStatistics(),
      // TODO: Add MOU, Visitor, Translation stats when entities are ready
    ]);

    return {
      visa: visaStats,
      mou: { overview: { total: 0, pending: 0, approved: 0, rejected: 0 } },
      visitor: { overview: { total: 0, pending: 0, approved: 0, rejected: 0 } },
      translation: { overview: { total: 0, pending: 0, approved: 0, rejected: 0 } },
    };
  }

  // =============== CHỈ ĐẠO & THÔNG BÁO ===============
  
  async sendInstruction(instructionDto: SendInstructionDto, senderId: string) {
    const instructions = instructionDto.recipientIds.map(recipientId => 
      this.instructionRepository.create({
        senderId,
        recipientId,
        title: instructionDto.title,
        content: instructionDto.content,
        type: instructionDto.type,
        relatedEntityId: instructionDto.relatedEntityId,
        relatedEntityType: instructionDto.relatedEntityType,
        status: InstructionStatus.SENT,
      })
    );

    return this.instructionRepository.save(instructions);
  }

  async getInstructionHistory(page: number = 1, limit: number = 20) {
    const [instructions, total] = await this.instructionRepository.findAndCount({
      relations: ['sender', 'recipient'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      instructions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSpecialists() {
    // Lấy danh sách chuyên viên để gửi chỉ đạo
    return this.userRepository.find({
      where: {
        // TODO: Filter by specialist role when role system is ready
      },
      select: ['id', 'username', 'fullName', 'email'],
    });
  }
}
