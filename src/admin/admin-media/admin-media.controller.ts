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
import {
	ApiBearerAuth,
	ApiOperation,
	ApiTags,
	ApiBody,
	ApiConsumes,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { diskStorage } from "multer";
import { FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";

import { AdminMediaService } from "./admin-media.service";
import { editFileName, ImgFileFilter } from "../../utils/file-upload.utils";
import { Requestor } from "../admin-article/model/article.model";
import { CreateMediaDto } from "./dto/admin-media.create.dto";
import { Media } from "./model/media.model";

@ApiBearerAuth()
@Controller("admin-media")
@ApiTags("admin-media")
export class AdminMediaController {
	constructor(private readonly adminMediaService: AdminMediaService) {}

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

		return this.adminMediaService.mediaUploadToS3(
			photoInfo,
			"media",
			createMediaDto,
		);
	}

	// Upload multiple files to S3
	// @Post("upload/bulk")
	// @UseGuards(AuthGuard("jwt"))
	// @ApiConsumes("multipart/form-data")
	// @UseInterceptors(
	// 	AnyFilesInterceptor({
	// 		storage: diskStorage({
	// 			destination: process.env.TEMPORARY_FOLDER + "/media",
	// 			filename: editFileName,
	// 		}),
	// 		fileFilter: ImgFileFilter,
	// 		limits: { fileSize: 5020000 },
	// 	}),
	// )
	// @ApiOperation({ description: "Bulk upload photos to S3" })
	// async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>,
	// @Body() createMediaDto: CreateMediaDto[]) {
	// 	const result = [];
	// 	for (const file of files) {
	// 		const photoInfo = {
	// 			photo_name_original: file.originalname,
	// 			photo_name_new: file.filename,
	// 		};
	// 		const photo = await this.adminMediaService.mediaUploadToS3(
	// 			photoInfo,
	// 			"media",
	// 		);
	// 		result.push(photo);
	// 	}
	// 	return result;
	// }

	// Get all media
	@Get()
	@UseGuards(AuthGuard("jwt"))
	@ApiOperation({ description: "Retrieve all media" })
	async getAllMedia() {
		return this.adminMediaService.getAll(Requestor.ADMIN);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get a media by ID" })
	@UseGuards(AuthGuard("jwt"))
	async getMediaById(@Param("id", ParseIntPipe) id: number): Promise<Media> {
		return await this.adminMediaService.getMediaById(id, Requestor.ADMIN);
	}

	// Delete media by id
	@Delete(":id")
	@UseGuards(AuthGuard("jwt"))
	@ApiOperation({ description: "Delete a media file by name" })
	async deleteMedia(@Param("id") id: number) {
		return await this.adminMediaService.delete(id);
	}
}
