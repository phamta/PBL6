import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslationCertificate } from '../../common/entities/translation-certificate.entity';
import { CreateTranslationCertificateDto } from './dto/create-translation-certificate.dto';
import { UpdateTranslationCertificateDto } from './dto/update-translation-certificate.dto';

@Injectable()
export class TranslationCertificateService {
  constructor(
    @InjectRepository(TranslationCertificate)
    private readonly translationCertificateRepository: Repository<TranslationCertificate>,
  ) {}

  async create(createDto: CreateTranslationCertificateDto, userId: number): Promise<TranslationCertificate> {
    const certificate = this.translationCertificateRepository.create({
      ...createDto,
      createdBy: userId,
    });

    return await this.translationCertificateRepository.save(certificate);
  }

  async findAll(page = 1, limit = 20): Promise<{ data: TranslationCertificate[]; total: number }> {
    const [data, total] = await this.translationCertificateRepository.findAndCount({
      relations: ['creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<TranslationCertificate> {
    const certificate = await this.translationCertificateRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!certificate) {
      throw new NotFoundException(`Translation certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async update(id: number, updateDto: UpdateTranslationCertificateDto): Promise<TranslationCertificate> {
    await this.findOne(id);
    await this.translationCertificateRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const certificate = await this.findOne(id);
    await this.translationCertificateRepository.remove(certificate);
  }

  async updateStatus(id: number, trangThai: string): Promise<TranslationCertificate> {
    await this.translationCertificateRepository.update(id, { trangThai });
    return this.findOne(id);
  }
}