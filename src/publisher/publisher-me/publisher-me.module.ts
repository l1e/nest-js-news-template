import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/admin/admin-user/model/user.model";
import { PublisherMeService } from "./publisher-me.service";
import { PublisherMeController } from "./publisher-me.controller";

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [PublisherMeService],
	controllers: [PublisherMeController],
	exports: [PublisherMeService],
})
export class PublisherMeModule {}
