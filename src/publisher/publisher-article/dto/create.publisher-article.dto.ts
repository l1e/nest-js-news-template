import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsInt } from "class-validator";
import {
	ArticleOfTheDay,
	Requestor,
	ValidationStatus,
} from "./../../../admin/admin-article/model/article.model";

export enum ArticleStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	UNPUBLISHED = "unpublished",
	PENDING = "pending", // Waiting for admin approval
	APPROVED = "approved",
	REJECTED = "rejected",
}

export class CreateArticleDto {
	@ApiProperty({
		example: "Article Title",
		description: "The title of the article",
	})
	@IsString()
	title: string;

	@ApiProperty({
		example: "This is a description of the article...",
		description: "The description of the article",
	})
	@IsString()
	description: string;

	@ApiProperty({
		example: "draft",
		description: "The status of the article",
	})
	@IsEnum(ArticleStatus)
	@IsOptional()
	status?: ArticleStatus = ArticleStatus.DRAFT; // Default is draft

	@ApiProperty({
		example: 1,
		description: "The ID of the category the article belongs to",
	})
	@IsInt()
	categoryId: number;

	// @ApiPropertyOptional({
	// 	example: 1,
	// 	description: "The ID of the category the article belongs to",
	// })
	// @IsInt()
	// @IsOptional()
	media: number[] | null;

    tags: number[] | null;

	// @ApiProperty({
	//   example: 1,
	//   description: 'The ID of the category the article belongs to',
	// })
	// @IsInt()
	creatorId: number;

	// @IsString()
	creatorEmail: string;

	// @ApiProperty({
	//   example: Requestor.PUBLISHER,
	//   description: 'Who is requestor of changes.',
	//   enum: Requestor,
	//   default: Requestor.PUBLISHER,
	// })
	requestor?: Requestor = Requestor.PUBLISHER;

	articleOfTheDay: ArticleOfTheDay = ArticleOfTheDay.NO;

	validationStatus?: ValidationStatus = ValidationStatus.PENDING;
}
