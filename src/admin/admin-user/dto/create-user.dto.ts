import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserStatus } from "../model/user.model";

export class CreateUserDto {
	@ApiProperty({
		example: "test.admin@dev.com/test.publisher@dev.com",
		description: "The email address of the user",
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "mySecretMega9Password0Venus",
		description: "The password of the user",
		default: "default_password", // Default value for password
	})
	@IsString()
	@IsOptional()
	password: string = "default_password"; // Default value

	@ApiProperty({
		example: "1234567890",
		description: "The phone number of the user",
		nullable: true,
		default: "0000000000", // Default value for phone
	})
	@IsString()
	@IsOptional()
	phone?: string = "0000000000"; // Default value

	@ApiProperty({
		example: "This is a short biography...",
		description: "The biography of the user",
		nullable: true,
		default: "No biography provided.", // Default value for biography
	})
	@IsString()
	@IsOptional()
	biography?: string = "No biography provided."; // Default value

	@ApiProperty({
		example: "John",
		description: "The first name of the user",
	})
	@IsString()
	firstName: string;

	@ApiProperty({
		example: "Doe",
		description: "The last name of the user",
	})
	@IsString()
	lastName: string;

	@ApiProperty({
		example: "Johnny",
		description: "The nickname of the user",
		nullable: true,
	})
	@IsString()
	@IsOptional()
	nickname?: string;

	@ApiProperty({
		example: UserStatus.ACTIVE,
		description: "The publish status of the article.",
		enum: UserStatus,
		default: UserStatus.DISABLED,
	})
	@IsEnum(UserStatus)
	@IsOptional()
	status?: UserStatus = UserStatus.DISABLED;

	@ApiProperty({
		example: UserRole.PUBLISHER,
		description: "User role.",
		enum: UserRole,
		default: UserRole.PUBLISHER,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole = UserRole.ADMIN;
}
