import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private translationRepository: Repository<Translation>,
  ) {}

  async create(createTranslationDto: CreateTranslationDto): Promise<Translation> {
    const translation = this.translationRepository.create(createTranslationDto);
    return this.translationRepository.save(translation);
  }

  async findAll(): Promise<Translation[]> {
    return this.translationRepository.find();
  }

  async findOne(id: string): Promise<Translation> {
    const translation = await this.translationRepository.findOne({
      where: { id },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async update(id: string, updateTranslationDto: UpdateTranslationDto): Promise<Translation> {
    const translation = await this.findOne(id);
    Object.assign(translation, updateTranslationDto);
    return this.translationRepository.save(translation);
  }

  async remove(id: string): Promise<void> {
    const translation = await this.findOne(id);
    await this.translationRepository.remove(translation);
  }
}
