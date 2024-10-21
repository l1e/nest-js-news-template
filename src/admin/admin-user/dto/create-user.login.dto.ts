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
		default: "admin@example.com",
	})
	@IsEmail(undefined, {
		message: "Write valid email",
	})
	@IsNotEmpty()
	@Length(7, 30, { each: true, message: "Incorrect $property length" })
	readonly email: string;

	@ApiProperty({
		default: "password123",
	})
	@IsNotEmpty()
	@Length(8, 30, { each: true, message: "Incorrect $property length" })
	readonly password?: string;

	role?: string;
}
