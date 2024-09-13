import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Article } from "src/admin/admin-article/model/article.model";
import { AdminCategoryController } from "src/admin/admin-category/admin-category.controller";
import { AdminCategoryService } from "src/admin/admin-category/admin-category.service";
import { Category } from "src/admin/admin-category/model/category.model";

@Module({
	imports: [SequelizeModule.forFeature([Category, Article])], // Include Category and Article models
	providers: [AdminCategoryService],
	controllers: [AdminCategoryController],
	exports: [AdminCategoryService],
})
export class AdminCategoryModule {}
