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
import { Tag } from '../admin-tag/model/tag.model';
import { TagArticle } from '../admin-tag/model/tag,article.model';
import { AdminTagModule } from '../admin-tag/admin-tag.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		AdminCategoryModule,
		AdminMediaModule,
        AdminTagModule,
		UserModule,
		SequelizeModule.forFeature([Article, Media, Category, Tag, TagArticle]),
		AdminOpensearchModule,
        ConfigModule.forRoot()
	],
	providers: [AdminArticleService],
	controllers: [AdminArticleController],
	exports: [AdminArticleService],
})
export class AdminArticleModule {}
