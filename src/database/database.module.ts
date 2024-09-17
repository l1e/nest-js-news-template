// src/database/database.module.ts

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Article } from "./../admin/admin-article/model/article.model";
import { Category } from "./../admin/admin-category/model/category.model";
import { Media } from "./../admin/admin-media/model/media.model";
import { User } from "./../admin/admin-user/model/user.model";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
	imports: [
		SequelizeModule.forRoot({
			dialect: "mysql",
			host: process.env.MYSQL_HOST || "127.0.0.1",
			port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
			username: process.env.MYSQL_USERNAME || "root",
			password: process.env.MYSQL_PASSWORD || "root",
			database: process.env.MYSQL_DATABASE || "nest-auth-sequlize-seeds",
			models: [Category, Article, User, Media], // Register all necessary models here
		}),
		SequelizeModule.forFeature([Category, Article, User, Media]), // For feature models
	],
	exports: [SequelizeModule], // Export SequelizeModule so it can be imported in other modules
})
export class DatabaseModule {}
