import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './entities/visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
  ) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    const visitor = this.visitorRepository.create(createVisitorDto);
    return this.visitorRepository.save(visitor);
  }

  async findAll(): Promise<Visitor[]> {
    return this.visitorRepository.find();
  }

  async findOne(id: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findOne({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    return visitor;
  }

  async update(id: string, updateVisitorDto: UpdateVisitorDto): Promise<Visitor> {
    const visitor = await this.findOne(id);
    Object.assign(visitor, updateVisitorDto);
    return this.visitorRepository.save(visitor);
  }

  async remove(id: string): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorRepository.remove(visitor);
  }
}
