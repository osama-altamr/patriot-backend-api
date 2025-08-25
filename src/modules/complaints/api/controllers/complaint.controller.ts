import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, UseGuards, Req, Query } from "@nestjs/common";
import { ComplaintService } from "../../services/complaint.service"; // Adjust path
import { CreateComplaintDto } from "../dto/request/create-complaint.dto";
import { UpdateComplaintDto } from "../dto/request/update-complaint.dto";
import { Complaint, User } from "src/database"
import { CreateComplaintValidation } from "../validation/create-complaint.pipe";
import { UpdateComplaintValidation } from "../validation/update-complaint.pipe";
import { CurrentUser } from "@Package/api";
import { JwtAuthGuard } from "@Package/auth";
import { parseQuery } from "@Package/api/functions";
import { GetAllComplaintsDto } from "../dto/request/get-all.dto";

@Controller("complaints")
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createComplaint(
        @Body(CreateComplaintValidation
        ) complaintData: CreateComplaintDto,
    ): Promise<Complaint | Complaint[]> {
        return await this.complaintService.createComplaint(complaintData);
    }

    @Get()
    async getAll(
          @Query() query: GetAllComplaintsDto
    ) {
         const q = parseQuery(query)
        const complaints = await this.complaintService.findAll(q.myQuery, q.pagination)
        complaints.results = complaints.results.map(comp => {
            comp.userId = comp.user?.id
            comp.closedById = comp.closedBy?.id
            return comp
        })
        return complaints
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Complaint> {
        return await this.complaintService.getComplaint(idParam);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') idParam: string,
        @Body(UpdateComplaintValidation) updateData: UpdateComplaintDto,
    ): Promise<Complaint> {
        return await this.complaintService.updateComplaint(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComplaint(@Param('id') idParam: string): Promise<void> {
        await this.complaintService.deleteComplaint(idParam);
    }
}