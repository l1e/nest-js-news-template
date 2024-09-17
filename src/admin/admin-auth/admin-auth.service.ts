import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";

import { AdminUserService } from "../admin-user/admin-user.service";
import { Payload } from "./../../utils/types/payload.dto";

@Injectable()
export class AdminAuthService {
	constructor(private adminUserService: AdminUserService) {}

	async signPayload(payload: Payload) {
		return sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
	}

	async validateUser(payload: Payload) {
		return await this.adminUserService.findByPayload(payload);
	}
}
