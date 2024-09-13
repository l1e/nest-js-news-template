import { Module } from "@nestjs/common";
import { AdminMediaService } from "./admin-media.service";
import { AdminMediaController } from "./admin-media.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Media } from "./model/media.model";

@Module({
	imports: [SequelizeModule.forFeature([Media])],
	providers: [AdminMediaService],
	controllers: [AdminMediaController],
	exports: [AdminMediaService],
})
export class AdminMediaModule {}
