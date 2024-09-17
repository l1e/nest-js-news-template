import { Injectable } from "@nestjs/common";
import { AdminMediaService } from "./../../admin/admin-media/admin-media.service";
import { CreateMediaDto } from "./../../admin/admin-media/dto/admin-media.create.dto";

@Injectable()
export class PublisherMediaService {
	constructor(private readonly adminMediaService: AdminMediaService) {}
	async mediaUploadToS3(
		data,
		folder: string,
		createMediaDto: CreateMediaDto,
	) {
		let media = await this.adminMediaService.mediaUploadToS3(
			data,
			folder,
			createMediaDto,
		);
		return media;
	}
}
