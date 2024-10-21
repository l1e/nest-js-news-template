import { Injectable } from "@nestjs/common";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { AdminUserService } from "./../../admin/admin-user/admin-user.service";
import { PaginationAndSortUsers } from "./../../utils/types/types";

@Injectable()
export class CmsPublisherService {
	constructor(private readonly adminUserService: AdminUserService) {}
	async findAllUsers(
		requestor: Requestor,
		paginationUsers: PaginationAndSortUsers
	) {
		return this.adminUserService.findAllPublishers(
			requestor,
			paginationUsers
		);
	}
}
