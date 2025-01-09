import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PublishStatus } from "../model/tag.model";

export class CreateTagDto {
    id?: number;
    @ApiProperty({
        example: "Technology",
        description: "The name of the tag",
    })
    @IsString()
    name: string;


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
