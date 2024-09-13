import { UseFilters } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsEmpty,
	IsNotEmpty,
	Length,
	MaxLength,
	MinLength,
} from "class-validator";

export class PortalAuthTalantLoginStandartDTO {
	@ApiProperty({
		default: "test.publisher@dev.com",
	})
	@IsEmail(undefined, {
		message: "Write valid email",
	})
	@IsNotEmpty()
	@MinLength(7, {
		message:
			"Your $property is too short. It should be at least 8 characters.",
	})
	@MaxLength(50, {
		message:
			"Your $property is too long. It should not be more than 50 characters.",
	})
	readonly email: string;

	@ApiProperty({
		default: "mySecretMega9Password0Venus",
	})
	@IsNotEmpty()
	@MinLength(8, {
		message:
			"Your $property is too short. It should be at least 8 characters.",
	})
	@MaxLength(50, {
		message:
			"Your $property is too long. It should not be more than 50 characters.",
	})
	readonly password?: string;

	@ApiProperty({
		default: "publisher",
	})
	// type?: string;
	role?: string;

	date_last_visit?: Date;
}
