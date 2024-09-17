import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserStatus } from "./../admin/admin-user/model/user.model";

@Injectable()
export class AuthAdminhGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const userAuth = context.getArgs()[0].user;

		if (userAuth.status === UserStatus.ACTIVE) {
			if (userAuth.role === "admin") {
				return true;
			} else {
				return false;
			}
		}
	}
}
