import { Injectable } from "@nestjs/common";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { AdminUserService } from "./../../admin/admin-user/admin-user.service";

@Injectable()
export class CmsPublisherService {
	constructor(private readonly adminUserService: AdminUserService) {}
	async findAllUsers(
		requestor?: Requestor,
		sortDirection: "asc" | "desc" = "desc", // Default sort direction
		sortBy: "publishedArticlesCount" | "id" = "publishedArticlesCount",
	) {
		return this.adminUserService.findAllUsers(
			requestor,
			sortDirection,
			sortBy,
		);
	}
}
