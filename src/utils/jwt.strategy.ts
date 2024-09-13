import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, VerifiedCallback } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { AdminAuthService } from "src/admin/admin-auth/admin-auth.service";
import { UserStatus } from "src/admin/admin-user/model/user.model";
import { PublisherAuthService } from "src/publisher/publisher-auth/publisher-auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private adminAuthService: AdminAuthService,
		private publisherAuthService: PublisherAuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET_KEY,
		});
	}

	async validate(payload: any, done: VerifiedCallback) {
		let user: any;
		if (payload.role === "admin" || payload.role === "publisher") {
			user = await this.adminAuthService.validateUser(payload);
		} else {
			user = await this.publisherAuthService.validateUser(payload);
		}

		if (!user) {
			return done(
				new HttpException("Unauthorized access", HttpStatus.CONFLICT),
				false,
			);
		}

		if (user.active === UserStatus.DISABLED) {
			return done(
				new HttpException(
					"User was deactivated status*",
					HttpStatus.CONFLICT,
				),
				false,
			);
		}

		return done(null, user, payload.iat);
	}
}
