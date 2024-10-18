import { AdminOpensearchModule } from './../admin-opensearch/admin-opensearch.module';
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminArticleService } from "./admin-article.service";
import { AdminArticleController } from "./admin-article.controller";
import { Article } from "./model/article.model";
import { AdminCategoryModule } from "../admin-category/admin-category.module";
import { UserModule } from "../admin-user/admin-user.module";
import { Media } from "../admin-media/model/media.model";
import { AdminMediaModule } from "../admin-media/admin-media.module";
import { Category } from "../admin-category/model/category.model";

@Module({
	imports: [
		AdminCategoryModule,
		AdminMediaModule,
		UserModule,
		SequelizeModule.forFeature([Article, Media, Category]),
		AdminOpensearchModule,
	],
	providers: [AdminArticleService],
	controllers: [AdminArticleController],
	exports: [AdminArticleService],
})
export class AdminArticleModule {}
