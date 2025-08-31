import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorApplication } from './entities/visitor-application.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorApplication)
    private visitorApplicationRepository: Repository<VisitorApplication>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto, userId?: string): Promise<VisitorApplication> {
    const visitorApp = this.visitorApplicationRepository.create({
      groupName: createVisitorDto.groupName,
      organization: createVisitorDto.organization || createVisitorDto.organizationName,
      organizationCountry: createVisitorDto.organizationCountry || createVisitorDto.country,
      visitPurpose: createVisitorDto.visitPurpose,
      visitStartDate: new Date(createVisitorDto.visitStartDate || createVisitorDto.arrivalDate),
      visitEndDate: new Date(createVisitorDto.visitEndDate || createVisitorDto.departureDate),
      numberOfPeople: createVisitorDto.numberOfPeople || createVisitorDto.numberOfMembers,
      description: createVisitorDto.description,
      contactPersonName: createVisitorDto.contactPersonName || createVisitorDto.contactPerson,
      contactPersonEmail: createVisitorDto.contactPersonEmail || createVisitorDto.contactEmail,
      contactPersonPhone: createVisitorDto.contactPersonPhone || createVisitorDto.contactPhone,
      accommodation: createVisitorDto.accommodation,
      transportation: createVisitorDto.transportation,
      members: createVisitorDto.members,
      documentPaths: createVisitorDto.documentPaths || [],
      userId: userId,
    });
    
    return this.visitorApplicationRepository.save(visitorApp);
  }

  async findAll(): Promise<VisitorApplication[]> {
    return this.visitorApplicationRepository.find();
  }

  async findOne(id: string): Promise<VisitorApplication> {
    const visitor = await this.visitorApplicationRepository.findOne({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException('Visitor application not found');
    }

    return visitor;
  }

  async update(id: string, updateVisitorDto: UpdateVisitorDto): Promise<VisitorApplication> {
    const visitor = await this.findOne(id);
    Object.assign(visitor, updateVisitorDto);
    return this.visitorApplicationRepository.save(visitor);
  }

  async remove(id: string): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorApplicationRepository.remove(visitor);
  }
}
