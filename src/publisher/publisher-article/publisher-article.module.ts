import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PublisherArticleService } from "./publisher-article.service";
import { PublisherArticleController } from "./publisher-article.controller";
import { AdminArticleModule } from "./../../admin/admin-article/admin-article.module";
import { Article } from "./../../admin/admin-article/model/article.model";

@Module({
	imports: [AdminArticleModule, SequelizeModule.forFeature([Article])],
	providers: [PublisherArticleService],
	controllers: [PublisherArticleController],
})
export class PublisherArticleModule {}
