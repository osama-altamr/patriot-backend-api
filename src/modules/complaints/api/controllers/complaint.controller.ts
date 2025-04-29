import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { ComplaintService } from "../../services/complaint.service"; // Adjust path
import { CreateComplaintDto } from "../dto/request/create-complaint.dto";
import { UpdateComplaintDto } from "../dto/request/update-complaint.dto";
import { Complaint, User } from "src/database"
import { AuthGuard } from '@nestjs/passport'
import { CreateComplaintValidation } from "../validation/create-complaint.pipe";
import { UpdateComplaintValidation } from "../validation/update-complaint.pipe";

@Controller("complaints")
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createComplaint(
        @Body(CreateComplaintValidation
        ) complaintData: CreateComplaintDto,
        @Req() req
    ): Promise<Complaint | Complaint[]> {
        const user = req.user as User
        return await this.complaintService.createComplaint(complaintData, user);
    }

    @Get()
    async getAll(): Promise<Complaint[]> {
        return await this.complaintService.getAllComplaints();
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Complaint> {
        return await this.complaintService.getComplaint(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateComplaintValidation) updateData: UpdateComplaintDto,
        @Req() req
    ): Promise<Complaint> {
        const user = req.user as User
        return await this.complaintService.updateComplaint(idParam, updateData, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComplaint(@Param('id') idParam: string): Promise<void> {
        await this.complaintService.deleteComplaint(idParam);
    }
}