import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export type isExsistFormat = 0 | 1 | 2;

export enum SrcType {
	IMAGE = "image",
	VIDEO = "video",
}

export class AdminMediaUpdateDTO {
	@ApiProperty({
		default: 1,
		description: "id",
	})
	id?: number;

	@ApiProperty({
		default: 1,
		description: "file Name",
	})
	fileName?: string;

	@ApiPropertyOptional({
		type: "enum",
		enum: ["image", "video"],
	})
	type?: SrcType;

	@ApiProperty({
		default: "media/upload/_Samira.jpg",
	})
	src?: string;

	@ApiProperty({
		default: 1,
	})
	order?: number;

	@ApiProperty({
		default: 1,
		description: "id",
	})
	articleId?: number;

	@ApiPropertyOptional({
		default: 1,
		type: "enum",
		enum: [0, 1, 2],
	})
	is_physically_exist?: isExsistFormat | any;

	createdAt?: string;
	updatedAt?: string;
}
