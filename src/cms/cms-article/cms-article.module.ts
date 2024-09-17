import { Module } from "@nestjs/common";
import { CmsArticleService } from "./cms-article.service";
import { CmsArticleController } from "./cms-article.controller";
import { AdminArticleModule } from "./../../admin/admin-article/admin-article.module";

@Module({
	imports: [AdminArticleModule],
	providers: [CmsArticleService],
	controllers: [CmsArticleController],
})
export class CmsArticleModule {}
