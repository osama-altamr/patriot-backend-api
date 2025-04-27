import { Body, Controller, Post } from "@nestjs/common";
import { ComplaintService } from "/complaints/services/complaint.service";

@Controller("complaints")
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService){}
}