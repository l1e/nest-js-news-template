import { Module } from '@nestjs/common';
import { CmsContactFormService } from './cms-contact-form.service';
import { CmsContactFormController } from './cms-contact-form.controller';
import { AdminContactFormModule } from 'src/admin/admin-contact-form/admin-contact-form.module';

@Module({
    imports: [AdminContactFormModule],
    providers: [CmsContactFormService],
    controllers: [CmsContactFormController],
    exports: [CmsContactFormService]
})
export class CmsContactFormModule {}
