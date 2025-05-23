import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { ComplaintService } from "../../services/complaint.service"; // Adjust path
import { CreateComplaintDto } from "../dto/request/create-complaint.dto";
import { UpdateComplaintDto } from "../dto/request/update-complaint.dto";
import { Complaint, User } from "src/database"
import { AuthGuard } from '@nestjs/passport'
import { CreateComplaintValidation } from "../validation/create-complaint.pipe";
import { UpdateComplaintValidation } from "../validation/update-complaint.pipe";
import { CurrentUser } from "@Package/api";
import { JwtAuthGuard } from "@Package/auth";

@Controller("complaints")
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async createComplaint(
        @Body(CreateComplaintValidation
        ) complaintData: CreateComplaintDto,
        @CurrentUser() user: User
    ): Promise<Complaint | Complaint[]> {
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
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') idParam: string,
        @Body(UpdateComplaintValidation) updateData: UpdateComplaintDto,
        @CurrentUser() user: User
    ): Promise<Complaint> {
        return await this.complaintService.updateComplaint(idParam, updateData, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComplaint(@Param('id') idParam: string): Promise<void> {
        await this.complaintService.deleteComplaint(idParam);
    }
}