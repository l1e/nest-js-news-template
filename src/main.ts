import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./utils/http-exception.filter";
import { AdminArticleModule } from "./admin/admin-article/admin-article.module";
import { AdminCategoryModule } from "./admin/admin-category/admin-category.module";
import { UserModule } from "./admin/admin-user/admin-user.module";
import { PublisherArticleModule } from "./publisher/publisher-article/publisher-article.module";
import { CmsArticleModule } from "./cms/cms-article/cms-article.module";
import { PublisherCategoryModule } from "./publisher/publisher-category/publisher-category.module";
import { CmsPublisherModule } from "./cms/cms-publisher/cms-publisher.module";
import { CmsCategoryModule } from "./cms/cms-category/cms-category.module";
import { AdminAuthModule } from "./admin/admin-auth/admin-auth.module";
import { PublisherAuthModule } from "./publisher/publisher-auth/publisher-auth.module";
import { PublisherMeModule } from "./publisher/publisher-me/publisher-me.module";
import { AdminMediaModule } from "./admin/admin-media/admin-media.module";
import { PublisherMediaModule } from "./publisher/publisher-media/publisher-media.module";

async function bootstrap() {
	const PORT = process.env.NEST_APP_PORT || 3006;
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: "http://localhost:3000",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	});

	// Admin API Swagger Setup
	const adminConfig = new DocumentBuilder()
		.setTitle("Admin API")
		.setDescription("Admin Section API Documentation")
		.setVersion("1.0")
		.addBearerAuth()
		// .addTag('Admin panel')
		.build();

	const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
		include: [
			AdminArticleModule,
			AdminCategoryModule,
			UserModule,
			AdminAuthModule,
			AdminMediaModule,
		],
	});
	SwaggerModule.setup("api/admin", app, adminDocument);

	// Publisher API Swagger Setup
	const publisherConfig = new DocumentBuilder()
		.setTitle("Publisher API")
		.setDescription("Publisher Section API Documentation")
		.setVersion("1.0")
		.addBearerAuth()
		// .addTag('publisher')
		.build();
	const publisherDocument = SwaggerModule.createDocument(
		app,
		publisherConfig,
		{
			include: [
				PublisherArticleModule,
				PublisherCategoryModule,
				PublisherAuthModule,
				PublisherMeModule,
				PublisherMediaModule,
			],
		},
	);
	SwaggerModule.setup("api/publisher", app, publisherDocument);

	// CMS API Swagger Setup
	const cmsConfig = new DocumentBuilder()
		.setTitle("CMS API")
		.setDescription("CMS Section API Documentation")
		.setVersion("1.0")
		.build();
	const cmsDocument = SwaggerModule.createDocument(app, cmsConfig, {
		include: [CmsArticleModule, CmsPublisherModule, CmsCategoryModule],
	});
	SwaggerModule.setup("api/cms", app, cmsDocument);

	//fields validation
	app.useGlobalPipes(new ValidationPipe());

	//work with exeptions
	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(PORT);
}
bootstrap();
