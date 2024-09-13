import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AdminCategoryModule } from "./admin/admin-category/admin-category.module";
import { CmsCategoryModule } from "./cms/cms-category/cms-category.module";
import { PublisherArticleService } from "./publisher/publisher-article/publisher-article.service";
import { PublisherArticleModule } from "./publisher/publisher-article/publisher-article.module";
import { AdminArticleModule } from "./admin/admin-article/admin-article.module";
import { CmsArticleModule } from "./cms/cms-article/cms-article.module";
import { Article } from "./admin/admin-article/model/article.model";
import { UserModule } from "./admin/admin-user/admin-user.module";
import { User } from "./admin/admin-user/model/user.model";
import { Category } from "./admin/admin-category/model/category.model";
import { PublisherCategoryModule } from "./publisher/publisher-category/publisher-category.module";
import { TransformInterceptor } from "./utils/transform.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CmsPublisherModule } from "./cms/cms-publisher/cms-publisher.module";
import { AdminAuthModule } from "./admin/admin-auth/admin-auth.module";
import { PublisherAuthModule } from "./publisher/publisher-auth/publisher-auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./utils/jwt.strategy";
import { PublisherMeModule } from "./publisher/publisher-me/publisher-me.module";
import { AdminMediaModule } from "./admin/admin-media/admin-media.module";
import { Media } from "./admin/admin-media/model/media.model";
import { S3Module } from "nestjs-s3";
import { PublisherMediaModule } from "./publisher/publisher-media/publisher-media.module";

@Module({
	imports: [
		UserModule,
		SequelizeModule.forRoot({
			dialect: "mysql",
			host: "127.0.0.1",
			port: 3306,
			username: "root",
			password: "root",
			database: "nest-auth-sequlize",
			models: [User, Article, Category, Media],
			autoLoadModels: true,
			synchronize: true,
			sync: { alter: true },
		}),
		S3Module.forRoot({
			config: {
				credentials: {
					accessKeyId: process.env.AWS_S3_ACCESS_KEY,
					secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
				},
				endpoint: process.env.AWS_S3_ENDPOINT,
				forcePathStyle: true,
				region: process.env.AWS_S3_REGION,
			},
		}),
		ConfigModule.forRoot(),
		SequelizeModule.forFeature([User, Article, Category, Media]),
		AdminCategoryModule,
		CmsCategoryModule,
		PublisherArticleModule,
		AdminArticleModule,
		CmsArticleModule,
		PublisherCategoryModule,
		CmsPublisherModule,
		AdminAuthModule,
		PublisherAuthModule,
		PublisherMeModule,
		AdminMediaModule,
		PublisherMediaModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		JwtStrategy,
	],
})
export class AppModule {}
