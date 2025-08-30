import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorGroup } from './entities/visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorGroup)
    private visitorRepository: Repository<VisitorGroup>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<VisitorGroup> {
    const visitor = this.visitorRepository.create(createVisitorDto);
    return this.visitorRepository.save(visitor);
  }

  async findAll(): Promise<VisitorGroup[]> {
    return this.visitorRepository.find();
  }

  async findOne(id: string): Promise<VisitorGroup> {
    const visitor = await this.visitorRepository.findOne({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    return visitor;
  }

  async update(id: string, updateVisitorDto: UpdateVisitorDto): Promise<VisitorGroup> {
    const visitor = await this.findOne(id);
    Object.assign(visitor, updateVisitorDto);
    return this.visitorRepository.save(visitor);
  }

  async remove(id: string): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorRepository.remove(visitor);
  }
}
