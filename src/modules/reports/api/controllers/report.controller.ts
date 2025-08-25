import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Report } from "src/database";
import { CreateReportlDto } from "../dto/request/create-report.dto";
import { ReportService } from "/reports/services/report.service";
import { CreateReportValidation } from "../validation/create-report.pipe";
import { GetAllReportsDto } from "../dto/request/get-all.dto";
import { GetAllReportsValidation } from "../validation/get-all.pipe";
import { Query } from "@nestjs/common";
import { parseQuery } from "@Package/api/functions";

@Controller("reports")
export class ReportController {
    constructor(private readonly reportService: ReportService) { }
    @Post()

    async create(
        @Body(CreateReportValidation) data: CreateReportlDto
    ) {
        Logger.debug({ data })
        return await this.reportService.create(data as any)
    }
    @Get()
    async getAll(@Query(GetAllReportsValidation) query: GetAllReportsDto) {
        const { pagination, myQuery } = parseQuery(query)
        const data = await this.reportService.getAllReports(myQuery, pagination);
        return {
            results: data,
            total: data.length
        }
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Report> {
        return await this.reportService.getReport(idParam);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteReport(@Param('id') idParam: string): Promise<void> {
        await this.reportService.deleteReport(idParam);
    }
}