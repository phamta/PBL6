import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Mou, MouStatus } from './entities/mou.entity';
import { User } from '../user/entities/user.entity';
import { CreateMouDto } from './dto/create-mou.dto';
import { UpdateMouDto } from './dto/update-mou.dto';
import { ReviewMouDto, ApproveMouDto, SignMouDto, FilterMouDto } from './dto/workflow-mou.dto';

@Injectable()
export class MouService {
  constructor(
    @InjectRepository(Mou)
    private mouRepository: Repository<Mou>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMouDto: CreateMouDto, userId: string): Promise<Mou> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const mou = this.mouRepository.create({
      ...createMouDto,
      createdBy: userId,
      status: MouStatus.PROPOSING,
    });

    return this.mouRepository.save(mou);
  }

  async findAll(filterDto?: FilterMouDto): Promise<{ data: Mou[]; total: number }> {
    const query = this.mouRepository.createQueryBuilder('mou')
      .leftJoinAndSelect('mou.creator', 'creator')
      .leftJoinAndSelect('mou.assignee', 'assignee');

    if (filterDto?.status) {
      query.andWhere('mou.status = :status', { status: filterDto.status });
    }

    if (filterDto?.partnerCountry) {
      query.andWhere('mou.partnerCountry ILIKE :country', { 
        country: `%${filterDto.partnerCountry}%` 
      });
    }

    if (filterDto?.department) {
      query.andWhere('mou.department ILIKE :department', { 
        department: `%${filterDto.department}%` 
      });
    }

    if (filterDto?.type) {
      query.andWhere('mou.type = :type', { type: filterDto.type });
    }

    if (filterDto?.year) {
      const year = parseInt(filterDto.year);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.andWhere('mou.createdAt BETWEEN :startDate AND :endDate', { 
        startDate, 
        endDate 
      });
    }

    if (filterDto?.search) {
      query.andWhere(
        '(mou.title ILIKE :search OR mou.partnerOrganization ILIKE :search OR mou.description ILIKE :search)',
        { search: `%${filterDto.search}%` }
      );
    }

    // Sorting
    const sortBy = filterDto?.sortBy || 'createdAt';
    const sortOrder = filterDto?.sortOrder || 'DESC';
    query.orderBy(`mou.${sortBy}`, sortOrder);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Mou> {
    const mou = await this.mouRepository.findOne({
      where: { id },
      relations: ['creator', 'assignee'],
    });

    if (!mou) {
      throw new NotFoundException('MOU not found');
    }

    return mou;
  }

  async update(id: string, updateMouDto: UpdateMouDto, userId: string): Promise<Mou> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check permissions
    if (mou.createdBy !== userId && user.role !== 'admin') {
      throw new ForbiddenException('You can only edit your own MOUs');
    }

    Object.assign(mou, updateMouDto);
    return this.mouRepository.save(mou);
  }

  async review(id: string, reviewDto: ReviewMouDto, userId: string): Promise<Mou> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check if user has permission to review
    if (!['admin', 'khoa', 'phong'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to review MOUs');
    }

    // Check workflow status
    if (mou.status !== MouStatus.PROPOSING && mou.status !== MouStatus.PENDING_SUPPLEMENT) {
      throw new BadRequestException('MOU is not in a reviewable state');
    }

    mou.status = reviewDto.status;
    mou.reviewComments = reviewDto.reviewComments;
    mou.reviewedBy = user.fullName;
    mou.reviewedAt = new Date();
    mou.assignedTo = userId;

    return this.mouRepository.save(mou);
  }

  async approve(id: string, approveDto: ApproveMouDto, userId: string): Promise<Mou> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check if user has permission to approve (leadership roles)
    if (!['admin', 'khoa'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to approve MOUs');
    }

    // Check workflow status
    if (mou.status !== MouStatus.REVIEWING) {
      throw new BadRequestException('MOU must be in reviewing state to approve/reject');
    }

    mou.status = approveDto.status;
    
    if (approveDto.status === MouStatus.APPROVED) {
      mou.approvedBy = user.fullName;
      mou.approvedAt = new Date();
    } else if (approveDto.status === MouStatus.REJECTED) {
      mou.rejectedBy = user.fullName;
      mou.rejectedAt = new Date();
      mou.rejectionReason = approveDto.rejectionReason;
    }

    return this.mouRepository.save(mou);
  }

  async sign(id: string, signDto: SignMouDto, userId: string): Promise<Mou> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check if user has permission to sign (admin or leadership)
    if (!['admin', 'khoa'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to sign MOUs');
    }

    // Check workflow status
    if (mou.status !== MouStatus.APPROVED) {
      throw new BadRequestException('MOU must be approved before signing');
    }

    mou.status = MouStatus.SIGNED;
    mou.signedDate = new Date(signDto.signedDate);
    if (signDto.notes) {
      mou.notes = signDto.notes;
    }

    return this.mouRepository.save(mou);
  }

  async assignToUser(id: string, assigneeId: string, userId: string): Promise<Mou> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const assignee = await this.userRepository.findOne({ where: { id: assigneeId } });

    if (!assignee) {
      throw new NotFoundException('Assignee not found');
    }

    // Check permission
    if (!['admin', 'khoa', 'phong'].includes(user.role)) {
      throw new ForbiddenException('You do not have permission to assign MOUs');
    }

    mou.assignedTo = assigneeId;
    return this.mouRepository.save(mou);
  }

  async getStatistics(): Promise<any> {
    const stats = await this.mouRepository
      .createQueryBuilder('mou')
      .select('mou.status, COUNT(*) as count')
      .groupBy('mou.status')
      .getRawMany();

    const byCountry = await this.mouRepository
      .createQueryBuilder('mou')
      .select('mou.partnerCountry, COUNT(*) as count')
      .groupBy('mou.partnerCountry')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const byType = await this.mouRepository
      .createQueryBuilder('mou')
      .select('mou.type, COUNT(*) as count')
      .groupBy('mou.type')
      .getRawMany();

    return {
      statusStats: stats,
      countryStats: byCountry,
      typeStats: byType,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check permissions
    if (mou.createdBy !== userId && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own MOUs');
    }

    // Only allow deletion of draft or rejected MOUs
    if (!['proposing', 'rejected'].includes(mou.status)) {
      throw new BadRequestException('Cannot delete MOU in current status');
    }

    await this.mouRepository.remove(mou);
  }
}
