import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';

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
    const reports = await this.repo.findBy({
      approved: false,
    });
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
}
