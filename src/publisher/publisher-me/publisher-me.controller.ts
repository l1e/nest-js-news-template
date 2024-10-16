import { Controller, Get, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { PublisherMeService } from "./publisher-me.service";
import { AuthPublisherGuard } from "./../../utils/auth.publisher.guard";
import { EmailToken } from "./../../utils/email.from.token.decorator";
import { User } from "./../../admin/admin-user/model/user.model";

@ApiBearerAuth()
@Controller("publisher-me")
@ApiTags("publisher-me")
export class PublisherMeController {
	constructor(private readonly publisherMeService: PublisherMeService) {}

	@Get("me")
	@ApiOperation({
		summary: "Get information about the currently authenticated publisher",
	})
	@ApiResponse({
		status: 200,
		description: "Successfully retrieved publisher information.",
		type: User,
	})
	@ApiResponse({
		status: 404,
		description: "Publisher information not found.",
	})
	@ApiResponse({
		status: 500,
		description: "An error occurred while retrieving user information",
	})
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async getMyInfo(
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<User> {
		return await this.publisherMeService.getMyInformation(decodedEmail);
	}
}
