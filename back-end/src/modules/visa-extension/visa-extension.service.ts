import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { VisaExtension, VisaExtensionStatus } from './entities/visa-extension.entity';
import { VisaExtensionHistory } from './entities/visa-extension-history.entity';
import { VisaExtensionDocument } from './entities/visa-extension-document.entity';
import { CreateVisaExtensionDto } from './dto/create-visa-extension.dto';
import { UpdateVisaExtensionDto } from './dto/update-visa-extension.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { VisaExtensionFilterDto } from './dto/visa-extension-filter.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../common/enums/user.enum';
import { UserUtils } from '../../common/utils/user.utils';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class VisaExtensionService {
  constructor(
    @InjectRepository(VisaExtension)
    private visaExtensionRepository: Repository<VisaExtension>,
    @InjectRepository(VisaExtensionHistory)
    private historyRepository: Repository<VisaExtensionHistory>,
    @InjectRepository(VisaExtensionDocument)
    private documentRepository: Repository<VisaExtensionDocument>,
    private emailService: EmailService,
    private notificationService: NotificationService,
  ) {}

  async create(
    createVisaExtensionDto: CreateVisaExtensionDto,
    applicant: User,
  ): Promise<VisaExtension> {
    // Generate unique application number
    const applicationNumber = await this.generateApplicationNumber();

    const visaExtension = this.visaExtensionRepository.create({
      ...createVisaExtensionDto,
      applicationNumber,
      applicant,
      applicantId: applicant.id,
      passportIssueDate: new Date(createVisaExtensionDto.passportIssueDate),
      passportExpiryDate: new Date(createVisaExtensionDto.passportExpiryDate),
      dateOfBirth: new Date(createVisaExtensionDto.dateOfBirth),
      visaIssueDate: new Date(createVisaExtensionDto.visaIssueDate),
      visaExpiryDate: new Date(createVisaExtensionDto.visaExpiryDate),
      expectedGraduationDate: createVisaExtensionDto.expectedGraduationDate
        ? new Date(createVisaExtensionDto.expectedGraduationDate)
        : undefined,
    });

    const savedExtension = await this.visaExtensionRepository.save(visaExtension);

    // Create initial history entry
    await this.createHistoryEntry(
      savedExtension.id,
      VisaExtensionStatus.DRAFT,
      VisaExtensionStatus.DRAFT,
      'Application created',
      applicant.id,
    );

    return savedExtension;
  }

  async findAll(
    filterDto: VisaExtensionFilterDto,
    user: User,
  ): Promise<{ data: VisaExtension[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      visaType,
      nationality,
      submissionDateFrom,
      submissionDateTo,
      expiryDateFrom,
      expiryDateTo,
      applicantId,
      reviewerId,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const queryBuilder = this.visaExtensionRepository
      .createQueryBuilder('visa_extension')
      .leftJoinAndSelect('visa_extension.applicant', 'applicant')
      .leftJoinAndSelect('visa_extension.reviewer', 'reviewer')
      .leftJoinAndSelect('visa_extension.documents', 'documents');

    // Role-based filtering
    if (UserUtils.hasAnyRole(user, [UserRole.USER, UserRole.MANAGER])) {
      queryBuilder.where('visa_extension.applicantId = :userId', { userId: user.id });
    }

    // Search filter
    if (search) {
      queryBuilder.andWhere(
        '(visa_extension.fullName ILIKE :search OR visa_extension.passportNumber ILIKE :search OR visa_extension.applicationNumber ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('visa_extension.status = :status', { status });
    }

    // Visa type filter
    if (visaType) {
      queryBuilder.andWhere('visa_extension.visaType = :visaType', { visaType });
    }

    // Nationality filter
    if (nationality) {
      queryBuilder.andWhere('visa_extension.nationality = :nationality', { nationality });
    }

    // Submission date range
    if (submissionDateFrom && submissionDateTo) {
      queryBuilder.andWhere(
        'visa_extension.submissionDate BETWEEN :submissionDateFrom AND :submissionDateTo',
        {
          submissionDateFrom: new Date(submissionDateFrom),
          submissionDateTo: new Date(submissionDateTo),
        },
      );
    }

    // Expiry date range
    if (expiryDateFrom && expiryDateTo) {
      queryBuilder.andWhere(
        'visa_extension.visaExpiryDate BETWEEN :expiryDateFrom AND :expiryDateTo',
        {
          expiryDateFrom: new Date(expiryDateFrom),
          expiryDateTo: new Date(expiryDateTo),
        },
      );
    }

    // Applicant filter (for admin/specialist use)
    if (applicantId && (UserUtils.hasAnyRole(user, [UserRole.ADMIN, UserRole.SPECIALIST]))) {
      queryBuilder.andWhere('visa_extension.applicantId = :applicantId', { applicantId });
    }

    // Reviewer filter
    if (reviewerId && (UserUtils.hasAnyRole(user, [UserRole.ADMIN, UserRole.SPECIALIST]))) {
      queryBuilder.andWhere('visa_extension.reviewerId = :reviewerId', { reviewerId });
    }

    // Sorting
    queryBuilder.orderBy(`visa_extension.${sortBy}`, sortOrder);

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    queryBuilder.skip(offset).take(limitNum);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  async findOne(id: string, user: User): Promise<VisaExtension> {
    const visaExtension = await this.visaExtensionRepository.findOne({
      where: { id },
      relations: ['applicant', 'reviewer', 'documents', 'history', 'history.changedBy'],
    });

    if (!visaExtension) {
      throw new NotFoundException('Visa extension application not found');
    }

    // Check permission
    if (
      !UserUtils.hasRole(user, UserRole.ADMIN) &&
      !UserUtils.hasRole(user, UserRole.SPECIALIST) &&
      visaExtension.applicantId !== user.id
    ) {
      throw new ForbiddenException('Access denied');
    }

    return visaExtension;
  }

  async update(
    id: string,
    updateVisaExtensionDto: UpdateVisaExtensionDto,
    user: User,
  ): Promise<VisaExtension> {
    const visaExtension = await this.findOne(id, user);

    // Only allow updates if status is DRAFT or ADDITIONAL_REQUIRED (for applicant)
    // Or if user is admin/specialist
    if (
      !UserUtils.hasRole(user, UserRole.ADMIN) &&
      !UserUtils.hasRole(user, UserRole.SPECIALIST) &&
      visaExtension.status !== VisaExtensionStatus.DRAFT &&
      visaExtension.status !== VisaExtensionStatus.ADDITIONAL_REQUIRED
    ) {
      throw new BadRequestException('Cannot update application in current status');
    }

    const updateData = { ...updateVisaExtensionDto };

    // Convert date strings to Date objects
    if (updateData.passportIssueDate) {
      updateData.passportIssueDate = new Date(updateData.passportIssueDate) as any;
    }
    if (updateData.passportExpiryDate) {
      updateData.passportExpiryDate = new Date(updateData.passportExpiryDate) as any;
    }
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth) as any;
    }
    if (updateData.visaIssueDate) {
      updateData.visaIssueDate = new Date(updateData.visaIssueDate) as any;
    }
    if (updateData.visaExpiryDate) {
      updateData.visaExpiryDate = new Date(updateData.visaExpiryDate) as any;
    }
    if (updateData.expectedGraduationDate) {
      updateData.expectedGraduationDate = new Date(updateData.expectedGraduationDate) as any;
    }
    if (updateData.newVisaExpiryDate) {
      updateData.newVisaExpiryDate = new Date(updateData.newVisaExpiryDate) as any;
    }

    Object.assign(visaExtension, updateData);

    return await this.visaExtensionRepository.save(visaExtension);
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangeStatusDto,
    user: User,
  ): Promise<VisaExtension> {
    const visaExtension = await this.findOne(id, user);

    // Check permissions for status changes
    if (!UserUtils.hasRole(user, UserRole.ADMIN) && !UserUtils.hasRole(user, UserRole.SPECIALIST)) {
      throw new ForbiddenException('Only admin and specialist can change status');
    }

    const oldStatus = visaExtension.status;
    const newStatus = changeStatusDto.status;

    // Validate status transition
    if (!this.isValidStatusTransition(oldStatus, newStatus)) {
      throw new BadRequestException(`Invalid status transition from ${oldStatus} to ${newStatus}`);
    }

    // Update status and related fields
    visaExtension.status = newStatus;
    visaExtension.reviewerId = user.id;
    visaExtension.reviewer = user;

    if (newStatus === VisaExtensionStatus.SUBMITTED) {
      visaExtension.submissionDate = new Date();
    } else if (newStatus === VisaExtensionStatus.UNDER_REVIEW) {
      visaExtension.reviewDate = new Date();
    } else if (newStatus === VisaExtensionStatus.APPROVED || newStatus === VisaExtensionStatus.EXTENDED) {
      visaExtension.approvalDate = new Date();
      if (changeStatusDto.officialDocumentNumber) {
        visaExtension.officialDocumentNumber = changeStatusDto.officialDocumentNumber;
      }
      if (changeStatusDto.newVisaExpiryDate) {
        visaExtension.newVisaExpiryDate = new Date(changeStatusDto.newVisaExpiryDate);
      }
    }

    if (changeStatusDto.rejectionReason) {
      visaExtension.rejectionReason = changeStatusDto.rejectionReason;
    }

    if (changeStatusDto.additionalRequirements) {
      visaExtension.additionalRequirements = changeStatusDto.additionalRequirements;
    }

    const savedExtension = await this.visaExtensionRepository.save(visaExtension);

    // Create history entry
    await this.createHistoryEntry(
      id,
      oldStatus,
      newStatus,
      changeStatusDto.comment,
      user.id,
      changeStatusDto.reason,
    );

    // Send notifications
    await this.sendStatusChangeNotification(savedExtension, oldStatus, newStatus);

    return savedExtension;
  }

  async submit(id: string, user: User): Promise<VisaExtension> {
    const visaExtension = await this.findOne(id, user);

    if (visaExtension.status !== VisaExtensionStatus.DRAFT) {
      throw new BadRequestException('Can only submit applications in DRAFT status');
    }

    // Check if required documents are uploaded
    const requiredDocuments = await this.documentRepository.find({
      where: { visaExtensionId: id, isRequired: true },
    });

    if (requiredDocuments.length === 0) {
      throw new BadRequestException('Required documents must be uploaded before submission');
    }

    return await this.changeStatus(
      id,
      { status: VisaExtensionStatus.SUBMITTED, comment: 'Application submitted' },
      user,
    );
  }

  async getExpiringSoon(days: number = 30): Promise<VisaExtension[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return await this.visaExtensionRepository.find({
      where: {
        visaExpiryDate: Between(new Date(), cutoffDate),
        status: In([
          VisaExtensionStatus.DRAFT,
          VisaExtensionStatus.SUBMITTED,
          VisaExtensionStatus.UNDER_REVIEW,
          VisaExtensionStatus.PENDING,
        ]),
      },
      relations: ['applicant'],
    });
  }

  async getStatistics(user: User): Promise<any> {
    if (!UserUtils.hasRole(user, UserRole.ADMIN) && !UserUtils.hasRole(user, UserRole.SPECIALIST)) {
      throw new ForbiddenException('Access denied');
    }

    const queryBuilder = this.visaExtensionRepository.createQueryBuilder('visa_extension');

    // Total applications
    const total = await queryBuilder.getCount();

    // Status distribution
    const statusStats = await queryBuilder
      .select('visa_extension.status as status, COUNT(*) as count')
      .groupBy('visa_extension.status')
      .getRawMany();

    // Visa type distribution
    const visaTypeStats = await queryBuilder
      .select('visa_extension.visaType as visaType, COUNT(*) as count')
      .groupBy('visa_extension.visaType')
      .getRawMany();

    // Nationality distribution
    const nationalityStats = await queryBuilder
      .select('visa_extension.nationality as nationality, COUNT(*) as count')
      .groupBy('visa_extension.nationality')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Applications by month (last 12 months)
    const monthlyStats = await queryBuilder
      .select([
        "TO_CHAR(visa_extension.submissionDate, 'YYYY-MM') as month",
        'COUNT(*) as count',
      ])
      .where('visa_extension.submissionDate >= :date', {
        date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      })
      .groupBy("TO_CHAR(visa_extension.submissionDate, 'YYYY-MM')")
      .orderBy('month', 'DESC')
      .getRawMany();

    // Expiring soon
    const expiringSoon = await this.getExpiringSoon(30);

    return {
      total,
      statusStats,
      visaTypeStats,
      nationalityStats,
      monthlyStats,
      expiringSoon: expiringSoon.length,
    };
  }

  async remove(id: string, user: User): Promise<void> {
    const visaExtension = await this.findOne(id, user);

    // Only allow deletion if status is DRAFT and user is the applicant or admin
    if (
      visaExtension.status !== VisaExtensionStatus.DRAFT ||
      (!UserUtils.hasRole(user, UserRole.ADMIN) && visaExtension.applicantId !== user.id)
    ) {
      throw new BadRequestException('Cannot delete application in current status');
    }

    await this.visaExtensionRepository.remove(visaExtension);
  }

  private async generateApplicationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const lastApplication = await this.visaExtensionRepository
      .createQueryBuilder('visa_extension')
      .where('visa_extension.applicationNumber LIKE :pattern', {
        pattern: `VE${year}${month}%`,
      })
      .orderBy('visa_extension.applicationNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastApplication) {
      const lastSequence = parseInt(lastApplication.applicationNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `VE${year}${month}${String(sequence).padStart(4, '0')}`;
  }

  private async createHistoryEntry(
    visaExtensionId: string,
    fromStatus: VisaExtensionStatus,
    toStatus: VisaExtensionStatus,
    comment: string,
    changedById: string,
    reason?: string,
  ): Promise<void> {
    const history = this.historyRepository.create({
      visaExtensionId,
      fromStatus,
      toStatus,
      comment,
      reason,
      changedById,
    });

    await this.historyRepository.save(history);
  }

  private isValidStatusTransition(from: VisaExtensionStatus, to: VisaExtensionStatus): boolean {
    const validTransitions: Record<VisaExtensionStatus, VisaExtensionStatus[]> = {
      [VisaExtensionStatus.DRAFT]: [VisaExtensionStatus.SUBMITTED],
      [VisaExtensionStatus.SUBMITTED]: [
        VisaExtensionStatus.UNDER_REVIEW,
        VisaExtensionStatus.ADDITIONAL_REQUIRED,
        VisaExtensionStatus.REJECTED,
      ],
      [VisaExtensionStatus.UNDER_REVIEW]: [
        VisaExtensionStatus.PENDING,
        VisaExtensionStatus.ADDITIONAL_REQUIRED,
        VisaExtensionStatus.APPROVED,
        VisaExtensionStatus.REJECTED,
      ],
      [VisaExtensionStatus.ADDITIONAL_REQUIRED]: [VisaExtensionStatus.SUBMITTED],
      [VisaExtensionStatus.PENDING]: [
        VisaExtensionStatus.APPROVED,
        VisaExtensionStatus.REJECTED,
        VisaExtensionStatus.EXTENDED,
      ],
      [VisaExtensionStatus.APPROVED]: [VisaExtensionStatus.EXTENDED],
      [VisaExtensionStatus.REJECTED]: [],
      [VisaExtensionStatus.EXTENDED]: [],
    };

    return validTransitions[from]?.includes(to) || false;
  }

  private async sendStatusChangeNotification(
    visaExtension: VisaExtension,
    oldStatus: VisaExtensionStatus,
    newStatus: VisaExtensionStatus,
  ): Promise<void> {
    const applicant = visaExtension.applicant;
    
    // Send email notification
    const subject = `Visa Extension Application Status Update - ${visaExtension.applicationNumber}`;
    const message = `Dear ${applicant.fullName},\n\nYour visa extension application status has been updated from "${oldStatus}" to "${newStatus}".\n\nApplication Number: ${visaExtension.applicationNumber}\n\nPlease check your dashboard for more details.`;

    try {
      await this.emailService.sendStatusUpdate(applicant.email, subject, message);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }

    // Send in-app notification
    try {
      await this.notificationService.create({
        userId: applicant.id,
        title: 'Visa Extension Status Update',
        message: `Your application ${visaExtension.applicationNumber} status changed to ${newStatus}`,
        type: 'visa_extension_status',
        relatedId: visaExtension.id,
      });
    } catch (error) {
      console.error('Failed to send in-app notification:', error);
    }
  }
}
