import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateContactFormDto {
    id?: number;
    @ApiProperty({
        example: "Petro",
        description: "The name of the sender",
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        example: "Andoidov",
        description: "The last name of the sender",
    })
    @IsString()
    lastName?: string;

    @ApiProperty({
        example: "example@gmail.com",
        description: "The email of the sender",
    })
    @IsString()
    email?: string;

    @ApiProperty({
        example: "Help from you.",
        description: "The subject of the message",
    })
    @IsString()
    subject?: string;

    @ApiProperty({
        example: "I want your help with my project.",
        description: "The message of the sender",
    })
    @IsString()
    message?: string;

}
