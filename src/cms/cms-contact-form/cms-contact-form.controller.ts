import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CmsContactFormService } from './cms-contact-form.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateContactFormDto } from 'src/admin/admin-contact-form/dto/contact-form.create.dto';

@ApiTags("cms-contact-form")
@Controller('cms-contact-form')
export class CmsContactFormController {

    constructor(private readonly cmsContactFormService: CmsContactFormService) {
    }

    @Post()
    @ApiOperation({ summary: "Create a Contact Form" })
    async createContactForm(
        @Body() createContactFormDto: CreateContactFormDto,
    ): Promise<string> {
        return this.cmsContactFormService.createContactFormDto(createContactFormDto);
    }
}
