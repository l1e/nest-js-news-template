import { Module } from '@nestjs/common';
import { AdminContactFormService } from './admin-contact-form.service';
import { AdminContactFormController } from './admin-contact-form.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactForm } from './model/contact-form.model';

@Module({
    imports: [SequelizeModule.forFeature([ContactForm])],
    providers: [AdminContactFormService],
    controllers: [AdminContactFormController],
    exports: [AdminContactFormService]
})
export class AdminContactFormModule {}
