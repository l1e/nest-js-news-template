import { Module } from "@nestjs/common";
import { PublisherMediaController } from "./publisher-media.controller";
import { PublisherMediaService } from "./publisher-media.service";
import { AdminMediaModule } from "src/admin/admin-media/admin-media.module";

@Module({
	imports: [AdminMediaModule],
	controllers: [PublisherMediaController],
	providers: [PublisherMediaService],
})
export class PublisherMediaModule {}
