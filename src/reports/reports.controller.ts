import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { Role } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptors';
import { ReportDto } from './dtos/report.dto';
import { WithRoles } from '../decorators/with-roles.decorator';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @HttpCode(201)
  @WithRoles(Role.User)
  @Serialize(ReportDto)
  createReport(@Body() newReport: CreateReportDto, @Session() session: Record<string, any>) {
    console.log('session', session);
    return this.reportsService.createReport(newReport, session.userId as number);
  }

  @Get()
  @WithRoles(Role.Admin)
  findAll() {
    return this.reportsService.findAll();
  }
  @Get('my-reports')
  @WithRoles(Role.User)
  findUserReports(@Session() session: Record<string, any>) {
    return this.reportsService.findUserReports(session.userId as number);
  }

  @Get('unapproved')
  @WithRoles(Role.Admin)
  @Serialize(ReportDto)
  findUnAprovedReports() {
    return this.reportsService.findUnAprovedReports();
  }

  @Patch('approve/:report_id')
  @HttpCode(204)
  @WithRoles(Role.Admin)
  approveReport(@Param('report_id') id: number) {
    return this.reportsService.approveReport(id);
  }

  @Get('estimate')
  @WithRoles(Role.User)
  @Serialize(ReportDto)
  getEstimate(@Query() data: GetEstimateDto) {
    return this.reportsService.getEstimate(data);
  }
}
