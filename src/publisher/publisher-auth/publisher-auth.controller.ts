import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PublisherAuthService } from "./publisher-auth.service";
import { CreateUserDto } from "./../../admin/admin-user/dto/create-user.dto";
import { UserStatus } from "./../../admin/admin-user/model/user.model";
import { PortalAuthTalantLoginStandartDTO } from "./dto/portal-auth.login.dto";

@ApiTags("publisher-auth")
@Controller("publisher-auth")
export class PublisherAuthController {
	constructor(private publisherAuthService: PublisherAuthService) {}

	@Post("register")
	@ApiOperation({ description: "Registration." })
	@ApiResponse({
		status: 201,
		description: "The record has been successfully created.",
	})
	@ApiResponse({ status: 400, description: "User already exists." })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async register(@Body() createUserDto: CreateUserDto) {
		createUserDto.status = UserStatus.ACTIVE;

		let allowedRoles = ["admin", "publisher"];
		if (!allowedRoles.includes(createUserDto.role)) {
			throw new HttpException("You use wrong role", HttpStatus.CONFLICT);
		}

		createUserDto.status = createUserDto.status
			? createUserDto.status
			: UserStatus.ACTIVE;

		const user = await this.publisherAuthService.register(createUserDto);

		const payload = {
			email: user.email,
			role: createUserDto.role,
			provder: "email",
		};

		const token = await this.publisherAuthService.signPayload(payload);
		return { token };
	}

	@Post("login")
	@ApiOperation({ description: "Log in into account." })
	@ApiResponse({ status: 201, description: "Success" })
	@ApiResponse({ status: 400, description: "User does not exists" })
	@ApiResponse({ status: 403, description: "Forbidden." })
	async login(
		@Body()
		portalAuthTalantLoginStandartDTO: PortalAuthTalantLoginStandartDTO,
	) {
		console.log(
			"portalAuthTalantLoginStandartDTO ",
			portalAuthTalantLoginStandartDTO,
		);
		// console.log('req request:::', request);

		if (
			portalAuthTalantLoginStandartDTO.role === null ||
			portalAuthTalantLoginStandartDTO.role === undefined
		) {
			throw new HttpException("Role is required.", HttpStatus.CONFLICT);
		}

		let allowedRoles = ["admin", "publisher"];
		if (!allowedRoles.includes(portalAuthTalantLoginStandartDTO.role)) {
			throw new HttpException("You use wrong role", HttpStatus.CONFLICT);
		}

		const token = await this.publisherAuthService.loginEmail(
			portalAuthTalantLoginStandartDTO,
		);

		return token;
	}
}
