import { IsEnum, IsOptional, IsString, IsDate, IsInt } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	PublishStatus,
	ValidationStatus,
	Requestor,
	ArticleOfTheDay,
	ArticleSpecial,
} from "../model/article.model";

export class UpdateArticleDto {
	@ApiProperty({
		example: "An updated article title",
		description: "The title of the article.",
		required: false,
	})
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({
		example: "This is the updated description of the article",
		description: "The description of the article.",
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		example: PublishStatus.PUBLISHED,
		description: "The publish status of the article.",
		enum: PublishStatus,
		required: false,
	})
	@IsEnum(PublishStatus)
	@IsOptional()
	publishStatus?: PublishStatus;

	//   @ApiProperty({
	//     example: ValidationStatus.APPROVED,
	//     description: 'The validation status of the article.',
	//     enum: ValidationStatus,
	//     required: false,
	//   })
	@IsEnum(ValidationStatus)
	@IsOptional()
	validationStatus?: ValidationStatus;

	@ApiProperty({
		example: ArticleOfTheDay.NO,
		description: "The validation status of the article.",
		enum: ArticleOfTheDay,
		default: ArticleOfTheDay.NO,
	})
	@IsEnum(ArticleOfTheDay)
	@IsOptional()
	articleOfTheDay?: ArticleOfTheDay;

	@ApiProperty({
		example: ArticleSpecial.NO,
		description: "Special article",
		enum: ArticleSpecial,
		default: ArticleSpecial.NO,
	})
	@IsEnum(ArticleSpecial)
	@IsOptional()
	articleSpecial?: ArticleSpecial;

	//   @ApiProperty({
	//     example: '2024-09-01T12:34:56Z',
	//     description: 'The date when the article was approved.',
	//     nullable: true,
	//     required: false,
	//   })
	@IsDate()
	@IsOptional()
	approvedAt?: Date;

	//   @ApiProperty({
	//     example: 10,
	//     description: 'The number of views the article has received.',
	//     required: false,
	//   })
	@IsInt()
	@IsOptional()
	views?: number;

	@ApiProperty({
		example: 1,
		description: "The ID of the category the article belongs to.",
		required: false,
	})
	@IsInt()
	@IsOptional()
	categoryId?: number;

	@ApiPropertyOptional({
		example: [1],
		description: "The ID of the category the article belongs to",
	})
	@IsOptional()
	// @IsInt()
	media?: number[] | null;


	@ApiPropertyOptional({
		example: [1],
		description: "The ID of the category the article belongs to",
	})
	@IsOptional()
	// @IsInt()
	tags?: number[] | null;

	//   @ApiProperty({
	//     example: 1,
	//     description: 'The ID of the user the article belongs to.',
	//     required: false,
	//   })
	//   @IsInt()
	@IsOptional()
	creatorId?: number;

	//   @ApiProperty({
	//     example: 'test.creator@dev.com',
	//     description: 'The email of the creator.',
	//     required: false,
	//   })
	@IsString()
	@IsOptional()
	creatorEmail?: string;

	//   @ApiProperty({
	//     example: Requestor.ADMIN,
	//     description: 'Who is requesting the update.',
	//     enum: Requestor,
	//     required: false,
	//   })
	@IsEnum(Requestor)
	@IsOptional()
	requestor?: Requestor;
}
