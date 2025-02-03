import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AdminContactFormService } from './admin-contact-form.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthAdminhGuard } from 'src/utils/auth.admin.guard';
import { ContactForm } from './model/contact-form.model';
import { CreateContactFormDto } from './dto/contact-form.create.dto';

@ApiBearerAuth()
@ApiTags("admin-contact-form")
@Controller('admin-contact-form')
export class AdminContactFormController {
    constructor(private readonly adminContactFormService: AdminContactFormService) {
    }

    @Post()
    @ApiOperation({ summary: "Create a Contact Form" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async createContactForm(
        @Body() createContactFormDto: CreateContactFormDto,
    ): Promise<string> {
        return this.adminContactFormService.createContactForm(createContactFormDto);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a contact form by ID" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async getContactFormById(
        @Param("id", ParseIntPipe) id: number,
    ): Promise<ContactForm> {
        return this.adminContactFormService.getContactFormById(id);
    }

    @Get()
    @ApiOperation({ summary: "Get all contact form" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async getAllContactForms() {

        try {
            return this.adminContactFormService.getContactForms();
        } catch (error) {
            throw new InternalServerErrorException("Error retrieving tags");
        }

    }


    @Put(":id")
    @ApiOperation({ summary: "Update a contact form" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async updateContactForm(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateContactFormDto: CreateContactFormDto,
    ): Promise<ContactForm> {
        return this.adminContactFormService.updateContactForm(id, updateContactFormDto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a contact form" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async deleteContactForm(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.adminContactFormService.deleteContactForm(id);
    }


}

