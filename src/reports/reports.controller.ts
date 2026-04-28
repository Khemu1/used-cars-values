import { Body, Controller, Get, HttpCode, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  createReport(@Body() newReport: CreateReportDto, @Session() session: Record<string, any>) {
    return this.reportsService.createReport(newReport, +session.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.reportsService.findAll();
  }
  @Get('my-reports')
  @UseGuards(AuthGuard)
  findUserReports(@Session() session: Record<string, any>) {
    return this.reportsService.findUserReports(+session.userId);
  }

  @Get('unapproved')
  @UseGuards(AuthGuard)
  findUnAprovedReports() {
    return this.reportsService.findUnAprovedReports();
  }

  @Patch('approve/:report_id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  approveReport(@Param('report_id') id: number) {
    return this.reportsService.approveReport(id);
  }
}
