// src/database/database.module.ts

import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import * as dotenv from "dotenv";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Article } from "./../admin/admin-article/model/article.model";
import { Category } from "./../admin/admin-category/model/category.model";
import { Media } from "./../admin/admin-media/model/media.model";
import { User } from "./../admin/admin-user/model/user.model";


dotenv.config();

console.log(
	{'database.module.ts':'database.module.ts',
	'process.env.MYSQL_HOST':process.env.MYSQL_HOST,
	'process.env.MYSQL_PORT':process.env.MYSQL_PORT,
	'process.env.MYSQL_USERNAME':process.env.MYSQL_USERNAME,
	'process.env.MYSQL_PASSWORD': process.env.MYSQL_PASSWORD,
	'process.env.MYSQL_DATABASE': process.env.MYSQL_DATABASE
})

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
			  dialect: "mysql",
			  host: configService.get<string>('MYSQL_HOST', '127.0.0.1'),
			  port: configService.get<number>('MYSQL_PORT', 3306),
			  username: configService.get<string>('MYSQL_USERNAME', 'root'),
			  password: configService.get<string>('MYSQL_PASSWORD', 'root'),
			  database: configService.get<string>('MYSQL_DATABASE', 'nest-auth-sequlize-seeds'),
			  models: [Category, Article, User, Media],
			}),
		  }),
		SequelizeModule.forFeature([Category, Article, User, Media]), 
	],
	exports: [SequelizeModule],
})
export class DatabaseModule {}
