import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptors';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() newReport: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.createReport(newReport, user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.reportsService.findAll();
  }
  @Get('my-reports')
  @UseGuards(AuthGuard)
  findUserReports(@CurrentUser() user: User) {
    return this.reportsService.findUserReports(user.id);
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
