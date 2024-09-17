import { Module } from "@nestjs/common";
import { CmsPublisherService } from "./cms-publisher.service";
import { CmsPublisherController } from "./cms-publisher.controller";
import { UserModule } from "./../../admin/admin-user/admin-user.module";

@Module({
	imports: [UserModule],
	providers: [CmsPublisherService],
	controllers: [CmsPublisherController],
})
export class CmsPublisherModule {}
