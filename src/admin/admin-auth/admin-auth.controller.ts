import { Controller, Body, Post, Request } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminUserService } from "../admin-user/admin-user.service";
import { AdminAuthService } from "./admin-auth.service";
import { AdminUserLoginDTO } from "../admin-user/dto/create-user.login.dto";
import { CreateUserDto } from "../admin-user/dto/create-user.dto";
import { UserRole, UserStatus } from "../admin-user/model/user.model";

@Controller("admin-auth")
@ApiTags("admin-auth")
export class AdminAuthController {
	constructor(
		private adminAuthService: AdminAuthService,
		private adminUserService: AdminUserService,
	) {}

	@Post("register")
	@ApiOperation({ summary: "Registration to be an admin." })
	@ApiResponse({
		status: 201,
		description: "The record has been successfully created.",
	})
	@ApiResponse({ status: 400, description: "User already exists." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async register(@Body() createUserDto: CreateUserDto) {
		if (createUserDto?.role === UserRole.ADMIN) {
			createUserDto.status = UserStatus.DISABLED;
		}

		const user = await this.adminUserService.createUser(createUserDto);
		const payload = {
			email: user.email,
			role: createUserDto.role,
			provder: "email",
		};

		const token = await this.adminAuthService.signPayload(payload);

		if (user.id !== null && user.id !== undefined) {
			return `Your email account with that type ${createUserDto.role} was created. Write to an administrative about account activation.`;
		}

		return { user, token };
	}

	@Post("login")
	@ApiOperation({ summary: "Log in into admin account." })
	@ApiResponse({ status: 201, description: "Success" })
	@ApiResponse({ status: 400, description: "User does not exists" })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async login(@Body() adminUserLoginDTO: AdminUserLoginDTO, @Request() req) {
		const user = await this.adminUserService.checkLogInCredentials(
			adminUserLoginDTO,
		);
		const payload = {
			email: user.email,
			role: "admin",
			provider: "email",
		};

		const token = await this.adminAuthService.signPayload(payload);

		return { token };
	}
}
