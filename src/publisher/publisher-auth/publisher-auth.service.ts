import { Injectable } from "@nestjs/common";
import { AdminAuthService } from "./../../admin/admin-auth/admin-auth.service";
import { AdminUserService } from "./../../admin/admin-user/admin-user.service";
import { CreateUserDto } from "./../../admin/admin-user/dto/create-user.dto";
import { Payload } from "./../../utils/types/payload.dto";
import { PortalAuthLoginStandartDTO } from "./dto/portal-auth.login.dto";

@Injectable()
export class PublisherAuthService {
	constructor(
		private adminUserService: AdminUserService,
		private adminAuthService: AdminAuthService,
	) {}

	async signPayload(payload: Payload) {
		return await this.adminAuthService.signPayload(payload);
	}

	async validateUser(payload: Payload) {
		let user = await this.adminUserService.findByPayload(payload);

		if (user !== null) {
		}

		return user;
	}

	async register(createUserDto: CreateUserDto) {
		let register = await this.adminUserService.createUser(createUserDto);

		return register;
	}

	async loginEmail(
		portalAuthLoginStandartDTO: PortalAuthLoginStandartDTO,
	) {
		const user = await this.adminUserService.findByEmailAndRole(
			portalAuthLoginStandartDTO,
		);

		const payload = {
			email: user.email,
			role: portalAuthLoginStandartDTO.role,
			provider: "email",
		};

		const token = await this.signPayload(payload);

		return { token };
	}
}
