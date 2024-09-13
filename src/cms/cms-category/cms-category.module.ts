import { Module } from "@nestjs/common";
import { CmsCategoryService } from "./cms-category.service";
import { CmsCategoryController } from "./cms-category.controller";
import { AdminCategoryModule } from "src/admin/admin-category/admin-category.module";

@Module({
	imports: [AdminCategoryModule],
	providers: [CmsCategoryService],
	controllers: [CmsCategoryController],
})
export class CmsCategoryModule {}
