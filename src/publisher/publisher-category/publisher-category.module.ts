import { Module } from "@nestjs/common";
import { PublisherCategoryService } from "./publisher-category.service";
import { AdminCategoryModule } from "./../../admin/admin-category/admin-category.module";
import { PublisherCategoryController } from "./publisher-category.controller";

@Module({
	imports: [AdminCategoryModule],
	providers: [PublisherCategoryService],
	controllers: [PublisherCategoryController],
})
export class PublisherCategoryModule {}
