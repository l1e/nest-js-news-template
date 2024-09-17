import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PublishStatus } from "./../model/category.model";

export class CreateCategoryDto {
	id?: number;
	@ApiProperty({
		example: "Technology",
		description: "The name of the category",
	})
	@IsString()
	name: string;

	@ApiProperty({
		example: "Articles related to technology",
		description: "The description of the category",
	})
	@IsString()
	description?: string;

	@ApiProperty({
		example: PublishStatus.DRAFT,
		description: "The publish status of the article.",
		enum: PublishStatus,
		default: PublishStatus.DRAFT,
	})
	@IsEnum(PublishStatus)
	@IsOptional()
	publishStatus?: PublishStatus = PublishStatus.DRAFT;
}
