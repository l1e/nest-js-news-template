import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model/user.model";

import { AdminUserService } from "./admin-user.service";
import { AdminUserController } from "./admin-user.controller";
import { Article } from "../../admin/admin-article/model/article.model";


@Module({
	imports: [SequelizeModule.forFeature([User, Article])],
	providers: [AdminUserService],
	controllers: [AdminUserController],
	exports: [AdminUserService],
})
export class UserModule {}
