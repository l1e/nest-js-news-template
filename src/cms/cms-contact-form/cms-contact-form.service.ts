import { Injectable } from '@nestjs/common';
import { AdminContactFormService } from 'src/admin/admin-contact-form/admin-contact-form.service';
import { CreateContactFormDto } from 'src/admin/admin-contact-form/dto/contact-form.create.dto';

@Injectable()
export class CmsContactFormService {
    constructor(private readonly adminContactFormService: AdminContactFormService) {
    }
    async createContactFormDto(createContactFormDto: CreateContactFormDto){
        return await this.adminContactFormService.createContactForm(createContactFormDto)
    }
}


