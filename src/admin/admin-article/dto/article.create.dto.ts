import { IsEnum, IsOptional, IsString, IsDate, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
	ArticleOfTheDay,
	ArticleSpecial,
	PublishStatus,
	Requestor,
	ValidationStatus,
} from "../model/article.model";

export class CreateArticleDto {
	@ApiProperty({
		example: "An amazing article title",
		description: "The title of the article.",
	})
	@IsString()
	title: string;

	@ApiProperty({
		example: "This is the description of the article...",
		description: "The description of the article.",
	})
	@IsString()
	description: string;

	@ApiProperty({
		example: PublishStatus.DRAFT,
		description: "The publish status of the article.",
		enum: PublishStatus,
		default: PublishStatus.DRAFT,
	})
	@IsEnum(PublishStatus)
	@IsOptional()
	publishStatus?: PublishStatus = PublishStatus.DRAFT;

	@ApiProperty({
		example: ValidationStatus.PENDING,
		description: "The validation status of the article.",
		enum: ValidationStatus,
		default: ValidationStatus.PENDING,
	})
	@IsEnum(ValidationStatus)
	@IsOptional()
	validationStatus?: ValidationStatus = ValidationStatus.PENDING;

	@ApiProperty({
		example: ArticleOfTheDay.NO,
		description: "Article of the day",
		enum: ArticleOfTheDay,
		default: ArticleOfTheDay.NO,
	})
	@IsEnum(ArticleOfTheDay)
	@IsOptional()
	articleOfTheDay: ArticleOfTheDay;

	@ApiProperty({
		example: ArticleSpecial.NO,
		description: "Special article",
		enum: ArticleSpecial,
		default: ArticleSpecial.NO,
	})
	@IsEnum(ArticleSpecial)
	@IsOptional()
	articleSpecial?: ArticleSpecial;

	@IsDate()
	@IsOptional()
	approvedAt?: Date;

	@ApiProperty({
		example: 0,
		description: "The number of views the article has received.",
		default: 0,
	})
	@IsInt()
	@IsOptional()
	views?: number = 0;

	@ApiProperty({
		example: 1,
		description: "The ID of the category the article belongs to",
	})
	@IsInt()
	categoryId: number;

	@ApiProperty({
		example: [1],
		description: "The ID of the category the article belongs to",
	})
	media: number[] | null;

	creatorId: number;
	creatorEmail: string;
	requestor?: Requestor = Requestor.PUBLISHER;
}
