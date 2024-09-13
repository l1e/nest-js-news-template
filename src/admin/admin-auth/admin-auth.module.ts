import { Module } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";
import { UserModule } from "../admin-user/admin-user.module";

@Module({
	imports: [UserModule],
	providers: [AdminAuthService],
	controllers: [AdminAuthController],
	exports: [AdminAuthService],
})
export class AdminAuthModule {}
