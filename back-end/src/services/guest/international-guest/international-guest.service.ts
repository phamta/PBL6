import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternationalGuest } from '../../common/entities/international-guest.entity';
import { CreateInternationalGuestDto } from './dto/create-international-guest.dto';
import { UpdateInternationalGuestDto } from './dto/update-international-guest.dto';

@Injectable()
export class InternationalGuestService {
  constructor(
    @InjectRepository(InternationalGuest)
    private readonly internationalGuestRepository: Repository<InternationalGuest>,
  ) {}

  async create(createDto: CreateInternationalGuestDto, userId: number): Promise<InternationalGuest> {
    const guest = this.internationalGuestRepository.create({
      ...createDto,
      dateOfBirth: new Date(createDto.dateOfBirth),
      thoiGianDen: new Date(createDto.thoiGianDen),
      thoiGianVe: new Date(createDto.thoiGianVe),
      createdBy: userId,
    });

    return await this.internationalGuestRepository.save(guest);
  }

  async findAll(page = 1, limit = 20): Promise<{ data: InternationalGuest[]; total: number }> {
    const [data, total] = await this.internationalGuestRepository.findAndCount({
      relations: ['creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<InternationalGuest> {
    const guest = await this.internationalGuestRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!guest) {
      throw new NotFoundException(`International guest with ID ${id} not found`);
    }

    return guest;
  }

  async update(id: number, updateDto: UpdateInternationalGuestDto): Promise<InternationalGuest> {
    const guest = await this.findOne(id);
    
    const updateData: any = { ...updateDto };
    if (updateDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    }
    if (updateDto.thoiGianDen) {
      updateData.thoiGianDen = new Date(updateDto.thoiGianDen);
    }
    if (updateDto.thoiGianVe) {
      updateData.thoiGianVe = new Date(updateDto.thoiGianVe);
    }

    await this.internationalGuestRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const guest = await this.findOne(id);
    await this.internationalGuestRepository.remove(guest);
  }

  async updateStatus(id: number, trangThai: string): Promise<InternationalGuest> {
    await this.internationalGuestRepository.update(id, { trangThai });
    return this.findOne(id);
  }
}