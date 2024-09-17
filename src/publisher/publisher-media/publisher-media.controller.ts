import {
	Controller,
	Get,
	Post,
	Delete,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
	Param,
	Query,
	Body,
	ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiTags,
	ApiBody,
	ApiConsumes,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { CreateMediaDto } from "./../../admin/admin-media/dto/admin-media.create.dto";
import { editFileName, ImgFileFilter } from "./../../utils/file-upload.utils";
import { PublisherMediaService } from "./publisher-media.service";

@ApiBearerAuth()
@Controller("publisher-media")
@ApiTags("publisher-media")
export class PublisherMediaController {
	constructor(
		private readonly publisherMediaService: PublisherMediaService,
	) {}

	// Upload a single photo to S3
	@Post("upload/single")
	@UseGuards(AuthGuard("jwt"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: { type: "string", format: "binary" },
			},
		},
	})
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: process.env.TEMPORARY_FOLDER + "/media",
				filename: editFileName,
			}),
			fileFilter: ImgFileFilter,
			limits: { fileSize: 20200000 },
		}),
	)
	@ApiOperation({ description: "Upload media file to S3" })
	async mediaUploadToS3(
		@UploadedFile() file,
		@Body() createMediaDto: CreateMediaDto,
	) {
		const photoInfo = {
			photo_name_original: file.originalname,
			photo_name_new: file.filename,
		};

		return this.publisherMediaService.mediaUploadToS3(
			photoInfo,
			"media",
			createMediaDto,
		);
	}
}
