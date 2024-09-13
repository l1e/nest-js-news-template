import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminArticleService } from "./admin-article.service";
import { AdminArticleController } from "./admin-article.controller";
import { Article } from "./model/article.model";
import { AdminCategoryModule } from "../admin-category/admin-category.module";
import { UserModule } from "../admin-user/admin-user.module";
import { Media } from "../admin-media/model/media.model";
import { AdminMediaModule } from "../admin-media/admin-media.module";

@Module({
	imports: [
		AdminCategoryModule,
		AdminMediaModule,
		UserModule,
		SequelizeModule.forFeature([Article, Media]),
	],
	providers: [AdminArticleService],
	controllers: [AdminArticleController],
	exports: [AdminArticleService],
})
export class AdminArticleModule {}
