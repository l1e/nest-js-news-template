import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ContactForm } from './model/contact-form.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateContactFormDto } from './dto/contact-form.create.dto';
import { Requestor } from '../admin-article/model/article.model';

@Injectable()
export class AdminContactFormService {

    constructor(
        @InjectModel(ContactForm)
        private readonly contactFormModel: typeof ContactForm,
    ) {}

    
    async getContactFormById(
        id: number,
        requestor: Requestor = Requestor.PUBLISHER,
    ): Promise<ContactForm> {
        try {
            const contactForm = await this.contactFormModel.findByPk(id);
            if (!contactForm) {
                throw new HttpException(
                    `Conctact form with ID ${id} not found`,
                    HttpStatus.NOT_FOUND,
                );
            }
            if (
                requestor !== Requestor.ADMIN 
            ) {
                throw new HttpException(
                    "Invalid credentials",
                    HttpStatus.FORBIDDEN,
                );
            }
            return contactForm;
        } catch (error) {
            if (
                error.status === HttpStatus.FORBIDDEN ||
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }

            throw new InternalServerErrorException("Failed to fetch contact form");
        }
    }

    async getContactForms() {
        try {
            const contactForms = await this.contactFormModel.findAll();
            return contactForms;
        } catch (error) {
            throw new InternalServerErrorException(
                "An error occurred while retrieving contact form",
            );
        }
    }

    async createContactForm(
        createContactFormDto: CreateContactFormDto,
    ): Promise<string> {
        try {
            let contactForm = await this.contactFormModel.create(createContactFormDto);
            console.log('createContactForm contactForm:',contactForm)
            if (contactForm){
                return 'ok';
            }

        } catch (error) {
            throw new InternalServerErrorException(
                "An error occurred while creating contact form.",
            );
        }

    }
    async updateContactForm(
        id: number,
        updateContactFormDto: CreateContactFormDto,
    ): Promise<ContactForm> {

        try {

            const contactForm = await this.getContactFormById(id);
            if (!contactForm) {
                throw new NotFoundException(`Conctact form with ID ${id} not found`);
            }
            return contactForm.update(updateContactFormDto);

        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while updating contact form. ${error}`,
            );
        }


    }

    async deleteContactForm(id: number): Promise<void> {
        try {

            const contactForm = await this.getContactFormById(id);
            if (!contactForm) {
                throw new NotFoundException(`Conctact form with ID ${id} not found`);
            }
            await contactForm.destroy();

        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while deleting conctact form. ${error}`, 
            );
        }
    }
}
