import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaApplication, VisaDocument, VisaHistory } from './entities';

@Injectable()
export class VisaService {
  constructor(
    @InjectRepository(VisaApplication)
    private readonly visaApplicationRepository: Repository<VisaApplication>,
    @InjectRepository(VisaDocument)
    private readonly visaDocumentRepository: Repository<VisaDocument>,
    @InjectRepository(VisaHistory)
    private readonly visaHistoryRepository: Repository<VisaHistory>,
  ) {}

  // Placeholder methods - implement as needed
  async findAll(): Promise<VisaApplication[]> {
    return this.visaApplicationRepository.find({
      relations: ['documents', 'history'],
    });
  }

  async findOne(id: string): Promise<VisaApplication> {
    return this.visaApplicationRepository.findOne({
      where: { id },
      relations: ['documents', 'history'],
    });
  }

  async create(visaData: Partial<VisaApplication>): Promise<VisaApplication> {
    const visa = this.visaApplicationRepository.create(visaData);
    return this.visaApplicationRepository.save(visa);
  }

  async update(id: string, updateData: Partial<VisaApplication>): Promise<VisaApplication> {
    await this.visaApplicationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.visaApplicationRepository.delete(id);
  }
}
