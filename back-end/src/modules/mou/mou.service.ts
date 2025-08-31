import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { MouApplication, MouStatus as AppMouStatus } from './entities/mou-application.entity';
import { User } from '../user/entities/user.entity';
import { UserUtils } from '../../common/utils/user.utils';
import { UserRole } from '../../common/enums/user.enum';
import { CreateMouDto } from './dto/create-mou.dto';
import { UpdateMouDto } from './dto/update-mou.dto';
import { ReviewMouDto, ApproveMouDto, SignMouDto, FilterMouDto } from './dto/workflow-mou.dto';

@Injectable()
export class MouService {
  constructor(
    @InjectRepository(MouApplication)
    private mouApplicationRepository: Repository<MouApplication>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMouDto: CreateMouDto, userId: string): Promise<MouApplication> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const mouApp = this.mouApplicationRepository.create({
      title: createMouDto.title,
      partnerOrganization: createMouDto.partnerOrganization,
      partnerCountry: createMouDto.partnerCountry,
      mouType: createMouDto.mouType,
      description: createMouDto.description,
      proposedStartDate: new Date(createMouDto.proposedStartDate),
      proposedEndDate: createMouDto.proposedEndDate ? new Date(createMouDto.proposedEndDate) : null,
      expectedOutcomes: createMouDto.expectedOutcomes,
      contactPersonName: createMouDto.contactPersonName,
      contactPersonEmail: createMouDto.contactPersonEmail,
      documentPaths: createMouDto.documentPaths || [],
      userId: userId,
      status: AppMouStatus.DRAFT,
    });

    return this.mouApplicationRepository.save(mouApp);
  }

  async findAll(filterDto?: FilterMouDto): Promise<{ data: MouApplication[]; total: number }> {
    const query = this.mouApplicationRepository.createQueryBuilder('mou')
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

  async findOne(id: string): Promise<MouApplication> {
    const mou = await this.mouApplicationRepository.findOne({
      where: { id },
      relations: ['creator', 'assignee'],
    });

    if (!mou) {
      throw new NotFoundException('MOU application not found');
    }

    return mou;
  }

  async update(id: string, updateMouDto: UpdateMouDto, userId: string): Promise<MouApplication> {
    const mou = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Check permissions
    if (mou.userId !== userId && !UserUtils.hasRole(user, UserRole.ADMIN)) {
      throw new ForbiddenException('You can only edit your own MOUs');
    }

    Object.assign(mou, updateMouDto);
    return this.mouApplicationRepository.save(mou);
  }

  async getStatistics(): Promise<any> {
    const stats = await this.mouApplicationRepository
      .createQueryBuilder('mou')
      .select('mou.status, COUNT(*) as count')
      .groupBy('mou.status')
      .getRawMany();

    const byCountry = await this.mouApplicationRepository
      .createQueryBuilder('mou')
      .select('mou.partnerCountry, COUNT(*) as count')
      .groupBy('mou.partnerCountry')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const byType = await this.mouApplicationRepository
      .createQueryBuilder('mou')
      .select('mou.mouType, COUNT(*) as count')
      .groupBy('mou.mouType')
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
    if (mou.userId !== userId && !UserUtils.hasRole(user, UserRole.ADMIN)) {
      throw new ForbiddenException('You can only delete your own MOUs');
    }

    // Only allow deletion of draft or rejected MOUs
    if (![AppMouStatus.DRAFT, AppMouStatus.REJECTED].includes(mou.status)) {
      throw new BadRequestException('Cannot delete MOU in current status');
    }

    await this.mouApplicationRepository.remove(mou);
  }
}
