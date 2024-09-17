import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserStatus } from "../model/user.model";

export class UpdateUserDto {
	@ApiProperty({
		example: "test.admin@dev.com/test.publisher@dev.com",
		description: "The email address of the user",
		required: false, // Mark as optional
	})
	@IsEmail()
	@IsOptional() // Marking the field as optional
	email?: string;

	@ApiProperty({
		example: "mySecretMega9Password0Venus",
		description: "The password of the user",
		required: false,
		default: "default_password", // Default value for password
	})
	@IsString()
	@IsOptional()
	password?: string = "default_password"; // Default value

	@ApiProperty({
		example: "1234567890",
		description: "The phone number of the user",
		required: false,
		nullable: true,
		default: "0000000000", // Default value for phone
	})
	@IsString()
	@IsOptional()
	phone?: string = "0000000000"; // Default value

	@ApiProperty({
		example: "This is a short biography...",
		description: "The biography of the user",
		required: false,
		nullable: true,
		default: "No biography provided.", // Default value for biography
	})
	@IsString()
	@IsOptional()
	biography?: string = "No biography provided."; // Default value

	@ApiProperty({
		example: "John",
		description: "The first name of the user",
		required: false,
	})
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiProperty({
		example: "Doe",
		description: "The last name of the user",
		required: false,
	})
	@IsString()
	@IsOptional()
	lastName?: string;

	@ApiProperty({
		example: "Johnny",
		description: "The nickname of the user",
		nullable: true,
		required: false,
	})
	@IsString()
	@IsOptional()
	nickname?: string;

	@ApiProperty({
		example: UserStatus.ACTIVE,
		description: "The status of the user.",
		enum: UserStatus,
		required: false,
		default: UserStatus.DISABLED,
	})
	@IsEnum(UserStatus)
	@IsOptional()
	status?: UserStatus = UserStatus.DISABLED;

	@ApiProperty({
		example: UserRole.PUBLISHER,
		description: "User role.",
		enum: UserRole,
		required: false,
		default: UserRole.PUBLISHER,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole = UserRole.ADMIN;
}
