import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectS3, S3 } from "nestjs-s3";
import { InjectModel } from "@nestjs/sequelize";
import * as path from "path";
import * as fs from "fs";
import { Media } from "./model/media.model";
import { AdminMediaDeleteFileDTO } from "./dto/admin-media.delete.dto";
import { Requestor } from "../admin-article/model/article.model";
import { CreateMediaDto } from "./dto/admin-media.create.dto";

require("dotenv").config();

@Injectable()
export class AdminMediaService {
	constructor(
		@InjectS3() private readonly s3: S3,
		@InjectModel(Media)
		private readonly mediaModel: typeof Media,
	) {}

	// Upload Media to S3
	async mediaUploadToS3(
		data,
		folder: string,
		createMediaDto: CreateMediaDto,
	) {
		const image = data;
		if (typeof image !== "object") {
			throw new HttpException(
				"You should provide an image in the right format",
				HttpStatus.BAD_REQUEST,
			);
		}

		const rootFolder = folder;
		const userFolder = `${rootFolder}/upload/`;
		const newPath = `${userFolder}${image.photo_name_new}`;

		const filePath = path.resolve(
			__dirname,
			"../../../../temporary/",
			folder,
			image.photo_name_new,
		);
		const blob = await fs.readFileSync(filePath);

		const uploadedImage = await this.s3.putObject({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: newPath,
			Body: blob,
			ACL: "public-read",
		});

		if (uploadedImage["$metadata"].httpStatusCode === 200) {
			let mediaRequest = {
				...createMediaDto,
				articleId: null,
				order: Number(createMediaDto.order),
				src: newPath,
				fileName: image.photo_name_original,
			};

			let mediaInDb = await this.mediaModel.create(mediaRequest);
			return mediaInDb;
		} else {
			throw new HttpException(
				"Error while uploading image to S3",
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	// Fetch all media files from db
	async getAll(requestor: Requestor) {
		let excludeFields =
			requestor === Requestor.ADMIN ? undefined : ["isPhysicallyExist"];
		let medias: Media[] = await this.mediaModel.findAll({
			attributes: { exclude: excludeFields },
		});

		return medias;
	}

	// Find media by ID
	async findOne(id: number) {
		try {

			let media = await this.mediaModel.findByPk(id);

			if(!media){
				throw new HttpException(
					`Media with ID ${id} not found`,
					HttpStatus.NOT_FOUND,
				);
			}
			return media
		} catch (error) {
			throw new InternalServerErrorException(
				`An error occurred while retrieving media. ${error}`,
			);
		}

	}

	async getMediaById(id: number, requestor: Requestor) {
		try {
			let excludeFields =
			requestor === Requestor.ADMIN ? undefined : ["isPhysicallyExist"];

			let media = await this.mediaModel.findByPk(id, {
				attributes: { exclude: excludeFields },
			});

			if(!media){
				throw new HttpException(
					`Media with ID ${id} not found`,
					HttpStatus.NOT_FOUND,
				);
			}

			return media;
		} catch (error) {
			throw new InternalServerErrorException(
				`An error occurred while retrieving media. ${error}`,
			);
		}


	}

	// Update media details
	async update(mediaUpdateDto) {
		const oldMedia = await this.findOne(mediaUpdateDto.id);
		if (!oldMedia) {
			throw new HttpException("Media not found", HttpStatus.NOT_FOUND);
		}

		Object.assign(oldMedia, mediaUpdateDto);
		oldMedia.updatedAt = new Date();
		return oldMedia.save();
	}

	// Delete media from S3
	async delete(mediaId: number) {
		let media: Media = await this.mediaModel.findByPk(mediaId);
		if (media === null) {
			throw new HttpException(
				`Media with ID ${mediaId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}

		let deleteFromS3 = await this.deleteFromS3({ name: media.fileName });

		return deleteFromS3;
	}
	async deleteFromS3(mediaDeleteDto: AdminMediaDeleteFileDTO) {
		try {
			await this.s3.headObject({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: mediaDeleteDto.name,
			});

			await this.s3.deleteObject({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: mediaDeleteDto.name,
			});

			return {
				status: true,
				message: `File ${mediaDeleteDto.name} deleted successfully`,
			};
		} catch (error) {
			if (error.name === "NotFound") {
				return {
					status: false,
					message: `File ${mediaDeleteDto.name} already removed.`,
				};
			}
			throw new HttpException(
				"Error deleting file",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async validateMissingImages(medias) {
		for (const media of medias) {
			const checkImgUrl = `${process.env.AWS_S3_BUCKET_URL}/${media.src}`;
			const imageExists = await this.imageExists(checkImgUrl);
			await this.update({
				id: media.id,
				isPhysicallyExist: imageExists ? "1" : "0",
			});
		}
	}

	async imageExists(url: string): Promise<boolean> {
		try {
			const res = await fetch(url, { method: "HEAD" });
			return res.ok;
		} catch {
			return false;
		}
	}

	// Get unchecked images
	async getUncheckedImages(quantity: number) {
		return this.mediaModel.findAll({
			where: { type: ["portfolio", "polaroid"], isPhysicallyExist: "2" },
			limit: quantity,
			order: [["id", "ASC"]],
		});
	}
	async updateMedia(
		mediaId: number,
		updateData: Partial<Media>,
	): Promise<Media> {
		await this.mediaModel.update(updateData, {
			where: { id: mediaId },
		});

		const updatedMedia = await this.mediaModel.findByPk(mediaId);
		if (!updatedMedia) {
			throw new NotFoundException(`Media with ID ${mediaId} not found`);
		}
		return updatedMedia;
	}
}
