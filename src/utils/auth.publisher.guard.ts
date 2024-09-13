import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserStatus } from "src/admin/admin-user/model/user.model";

@Injectable()
export class AuthPublisherGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const userAuth = context.getArgs()[0].user?.dataValues;

		if (userAuth.status === UserStatus.ACTIVE) {
			if (userAuth.role === "admin" || userAuth.role === "publisher") {
				return true;
			} else {
				return false;
			}
		}
	}
}
