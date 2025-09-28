import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisaExtension } from './entities/visa-extension.entity';
import { CreateVisaExtensionDto } from './dto/create-visa-extension.dto';
import { UpdateVisaExtensionDto } from './dto/update-visa-extension.dto';
import { User } from '../../identity/user/entities/user.entity';

@Injectable()
export class VisaExtensionService {
  constructor(
    @InjectRepository(VisaExtension)
    private visaExtensionRepository: Repository<VisaExtension>,
  ) {}

  async create(
    createVisaExtensionDto: CreateVisaExtensionDto,
    user: User,
  ): Promise<VisaExtension> {
    const visaExtension = this.visaExtensionRepository.create({
      ...createVisaExtensionDto,
      ngaySinh: new Date(createVisaExtensionDto.ngaySinh),
      ngayCapHoChieu: new Date(createVisaExtensionDto.ngayCapHoChieu),
      ngayHetHanHoChieu: new Date(createVisaExtensionDto.ngayHetHanHoChieu),
      ngayCapVisa: new Date(createVisaExtensionDto.ngayCapVisa),
      ngayHetHanVisa: new Date(createVisaExtensionDto.ngayHetHanVisa),
      ngayNhapCanh: new Date(createVisaExtensionDto.ngayNhapCanh),
      userId: user.id,
      user: user,
      trangThai: 'pending',
    });

    return await this.visaExtensionRepository.save(visaExtension);
  }

  async findAll(): Promise<VisaExtension[]> {
    return await this.visaExtensionRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<VisaExtension> {
    const visaExtension = await this.visaExtensionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!visaExtension) {
      throw new NotFoundException('Visa extension application not found');
    }

    return visaExtension;
  }

  async update(
    id: string,
    updateVisaExtensionDto: UpdateVisaExtensionDto,
    user: User,
  ): Promise<VisaExtension> {
    const visaExtension = await this.findOne(id);

    // Check if user can update this application
    if (visaExtension.userId !== user.id && !user.roles.some(role => role.roleName === 'admin')) {
      throw new ForbiddenException('You can only update your own applications');
    }

    // Convert date strings to Date objects if they exist
    const updateData: any = { ...updateVisaExtensionDto };
    
    if (updateData.ngaySinh) {
      updateData.ngaySinh = new Date(updateData.ngaySinh);
    }
    if (updateData.ngayCapHoChieu) {
      updateData.ngayCapHoChieu = new Date(updateData.ngayCapHoChieu);
    }
    if (updateData.ngayHetHanHoChieu) {
      updateData.ngayHetHanHoChieu = new Date(updateData.ngayHetHanHoChieu);
    }
    if (updateData.ngayCapVisa) {
      updateData.ngayCapVisa = new Date(updateData.ngayCapVisa);
    }
    if (updateData.ngayHetHanVisa) {
      updateData.ngayHetHanVisa = new Date(updateData.ngayHetHanVisa);
    }
    if (updateData.ngayNhapCanh) {
      updateData.ngayNhapCanh = new Date(updateData.ngayNhapCanh);
    }

    Object.assign(visaExtension, updateData);
    return await this.visaExtensionRepository.save(visaExtension);
  }

  async remove(id: string, user: User): Promise<void> {
    const visaExtension = await this.findOne(id);

    // Check if user can delete this application
    if (visaExtension.userId !== user.id && !user.roles.some(role => role.roleName === 'admin')) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    await this.visaExtensionRepository.remove(visaExtension);
  }

  async findByUser(userId: string): Promise<VisaExtension[]> {
    return await this.visaExtensionRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async updateStatus(id: string, status: string, user: User): Promise<VisaExtension> {
    // Only admin can update status
    if (!user.roles.some(role => role.roleName === 'admin')) {
      throw new ForbiddenException('Only admin can update application status');
    }

    const visaExtension = await this.findOne(id);
    visaExtension.trangThai = status;
    visaExtension.reviewerId = user.id;
    visaExtension.reviewer = user;

    return await this.visaExtensionRepository.save(visaExtension);
  }
}