import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemActivityLog } from '../../common/entities/system-activity-log.entity';

@Injectable()
export class SystemActivityLogService {
  constructor(
    @InjectRepository(SystemActivityLog)
    private readonly systemActivityLogRepository: Repository<SystemActivityLog>,
  ) {}

  async create(data: {
    tenDoiTac: string;
    quocGia: string;
    email: string;
    soDienThoai: string;
    tinhTrang: string;
    ngayXuLy: Date;
    userId: number;
    ghiChu?: string;
  }): Promise<SystemActivityLog> {
    const log = this.systemActivityLogRepository.create(data);
    return await this.systemActivityLogRepository.save(log);
  }

  async findAll(page = 1, limit = 20): Promise<{ data: SystemActivityLog[]; total: number }> {
    const [data, total] = await this.systemActivityLogRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findByUser(userId: number, page = 1, limit = 20): Promise<{ data: SystemActivityLog[]; total: number }> {
    const [data, total] = await this.systemActivityLogRepository.findAndCount({
      where: { userId },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async logUserActivity(
    userId: number,
    tenDoiTac: string,
    quocGia: string,
    email: string,
    soDienThoai: string,
    tinhTrang: string,
    ghiChu?: string,
  ): Promise<SystemActivityLog> {
    return this.create({
      tenDoiTac,
      quocGia,
      email,
      soDienThoai,
      tinhTrang,
      ngayXuLy: new Date(),
      userId,
      ghiChu,
    });
  }
}