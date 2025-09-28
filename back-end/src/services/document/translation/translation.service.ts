import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslationRequestNew } from './entities/translation-application.entity';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(TranslationRequestNew)
    private translationRepository: Repository<TranslationRequestNew>,
  ) {}

  async create(createTranslationDto: CreateTranslationDto): Promise<TranslationRequestNew> {
    const translation = this.translationRepository.create(createTranslationDto);
    return this.translationRepository.save(translation);
  }

  async findAll(): Promise<TranslationRequestNew[]> {
    return this.translationRepository.find();
  }

  async findOne(id: string): Promise<TranslationRequestNew> {
    const translation = await this.translationRepository.findOne({
      where: { id },
    });

    if (!translation) {
      throw new NotFoundException('Translation request not found');
    }

    return translation;
  }

  async update(id: string, updateTranslationDto: UpdateTranslationDto): Promise<TranslationRequestNew> {
    const translation = await this.findOne(id);
    Object.assign(translation, updateTranslationDto);
    return this.translationRepository.save(translation);
  }

  async remove(id: string): Promise<void> {
    const translation = await this.findOne(id);
    await this.translationRepository.remove(translation);
  }
}
