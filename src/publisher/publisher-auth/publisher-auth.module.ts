import { Module } from "@nestjs/common";
import { PublisherAuthService } from "./publisher-auth.service";
import { PublisherAuthController } from "./publisher-auth.controller";
import { AdminAuthModule } from "src/admin/admin-auth/admin-auth.module";
import { UserModule } from "src/admin/admin-user/admin-user.module";

@Module({
	imports: [UserModule, AdminAuthModule],
	providers: [PublisherAuthService],
	controllers: [PublisherAuthController],
	exports: [PublisherAuthService],
})
export class PublisherAuthModule {}
