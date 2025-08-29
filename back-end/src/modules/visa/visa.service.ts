import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaApplication } from './entities/visa-application.entity';
import { CreateVisaApplicationDto } from './dto/create-visa-application.dto';
import { UpdateVisaApplicationDto } from './dto/update-visa-application.dto';

@Injectable()
export class VisaService {
  constructor(
    @InjectRepository(VisaApplication)
    private visaRepository: Repository<VisaApplication>,
  ) {}

  async create(createVisaApplicationDto: CreateVisaApplicationDto, userId: string): Promise<VisaApplication> {
    const visaApplication = this.visaRepository.create({
      ...createVisaApplicationDto,
      userId,
    });

    return this.visaRepository.save(visaApplication);
  }

  async findAll(): Promise<VisaApplication[]> {
    return this.visaRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<VisaApplication> {
    const visaApplication = await this.visaRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!visaApplication) {
      throw new NotFoundException('Visa application not found');
    }

    return visaApplication;
  }

  async findByUser(userId: string): Promise<VisaApplication[]> {
    return this.visaRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(id: string, updateVisaApplicationDto: UpdateVisaApplicationDto): Promise<VisaApplication> {
    const visaApplication = await this.findOne(id);
    Object.assign(visaApplication, updateVisaApplicationDto);
    return this.visaRepository.save(visaApplication);
  }

  async remove(id: string): Promise<void> {
    const visaApplication = await this.findOne(id);
    await this.visaRepository.remove(visaApplication);
  }
}
