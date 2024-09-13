import {
	Controller,
	Get,
	Query,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { CmsPublisherService } from "./cms-publisher.service";
import { User } from "src/admin/admin-user/model/user.model";
import { Requestor } from "src/admin/admin-article/model/article.model";

@ApiTags("cms-publisher")
@Controller("cms-publisher")
export class CmsPublisherController {
	constructor(private readonly cmsPublisherService: CmsPublisherService) {}

	@Get()
	@ApiOperation({ summary: "Get all users" })
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["publishedArticlesCount", "id"],
		description: "Field to sort by (publishedArticlesCount or id)",
	})
	@ApiQuery({
		name: "sortDirection",
		required: false,
		enum: ["asc", "desc"],
		description: "Sort direction (ascending or descending)",
	})
	@ApiResponse({
		status: 200,
		description: "Successfully returned all users.",
		type: [User],
	})
	@ApiResponse({
		status: 400,
		description: "Invalid request parameters or filtering criteria",
	})
	@ApiResponse({ status: 404, description: "No users found" })
	@ApiResponse({
		status: 500,
		description: "Internal server error. An unexpected error occurred.",
	})
	async findUsers(
		@Query("sortBy")
		sortBy: "publishedArticlesCount" | "id" = "publishedArticlesCount",
		@Query("sortDirection") sortDirection: "asc" | "desc" = "desc",
	): Promise<User[]> {
		try {
			const users = await this.cmsPublisherService.findAllUsers(
				Requestor.CMS,
				sortDirection,
				sortBy,
			);
			if (users.length === 0) {
				throw new NotFoundException("No users found");
			}
			return users;
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving users");
		}
	}
}
