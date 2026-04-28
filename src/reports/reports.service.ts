import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async createReport(data: CreateReportDto, userId: number) {
    const report = this.repo.create({
      ...data,
      approved: false,
      user: { id: userId },
    });
    return await this.repo.save(report);
  }

  async findUserReports(userId: number) {
    const reports = await this.repo.find({
      where: { user: { id: userId } },
    });
    return reports;
  }

  async findUnAprovedReports() {
    const reports = await this.repo.find({
      where: { approved: false },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
    console.log('reports', reports);
    return reports;
  }

  async approveReport(id: number) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = true;
    await this.repo.save(report);
  }

  async findAll() {
    const reports = await this.repo.find();
    return reports;
  }

  getEstimate(data: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: data.make })
      .andWhere('model = :model', { model: data.model })
      .andWhere('year - :year BETWEEN -5 AND 5', { year: data.year })
      .andWhere('longitude - :lng BETWEEN -5 AND 5', { lng: data.lng })
      .andWhere('latitude - :lat BETWEEN -5 AND 5', { lat: data.lat })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: data.mileage })
      .limit(3)
      .getRawOne();
  }
}
