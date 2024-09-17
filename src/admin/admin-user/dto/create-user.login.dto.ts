import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsEmpty,
	IsNotEmpty,
	Length,
	MinLength,
} from "class-validator";

export class AdminUserLoginDTO {
	@ApiProperty({
		default: "test.admin@dev.com",
	})
	@IsEmail(undefined, {
		message: "Write valid email",
	})
	@IsNotEmpty()
	@Length(7, 30, { each: true, message: "Incorrect $property length" })
	readonly email: string;

	@ApiProperty({
		default: "mySecretMega9Password0Venus",
	})
	@IsNotEmpty()
	@Length(8, 30, { each: true, message: "Incorrect $property length" })
	readonly password?: string;

	role?: string;
}
