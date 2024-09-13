import { IsEnum, IsString } from "class-validator";
import { SrcType } from "./admin-media.update.dto";
import { isExsistFormat, PublishStatus } from "../model/media.model";

export class CreateMediaDto {
	fileName: string;

	articleId?: number;

	@IsEnum(SrcType)
	type: SrcType;

	src: string;

	@IsString()
	order: number;

	@IsEnum(isExsistFormat)
	isPhysicallyExist: isExsistFormat;

	@IsEnum(PublishStatus)
	publishStatus: PublishStatus;
}
