import {
	Controller,
	Get,
	Query,
	InternalServerErrorException,
	NotFoundException,
	Inject,
	BadRequestException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { Cache } from "cache-manager";
import { CACHE_MANAGER} from "@nestjs/cache-manager";
import { CmsPublisherService } from "./cms-publisher.service";
import { User } from "./../../admin/admin-user/model/user.model";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { PaginationUsers, SortDirection, UsersSortBy } from "./../../utils/types/types";


@ApiTags("cms-publisher")
@Controller("cms-publisher")
export class CmsPublisherController {
	constructor(
		private readonly cmsPublisherService: CmsPublisherService,
		@Inject(CACHE_MANAGER)
        private cacheManager: Cache,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all Publishers" })
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["id", "createdAt", "publishedArticlesCount"],
		description: "Field to sort by (views or createdAt)",
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
		@Query("sortBy") sortBy: UsersSortBy = UsersSortBy.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	){

		// Validate query parameters 
		if (!["id", "createdAt", "publishedArticlesCount"].includes(sortBy)) {
			throw new BadRequestException("Invalid sortBy value");
		}
		if (!["asc", "desc"].includes(sortDirection)) {
			throw new BadRequestException("Invalid sortDirection value");
		}

		try {

			const pageNumber = Number(page);
			const perPageNumber = Number(perPage);

			let pagination: PaginationUsers = {
				sortBy: sortBy,
				sortDirection: sortDirection,
				page: pageNumber,
				perPage: perPageNumber
			}

			let hashRequest = 'sortBy='+sortBy+'&sortDirection='+sortDirection+'&page='+page+'&perPage='+perPage;
			let cachedUsers = await this.cacheManager.get(`cms_users?${hashRequest}`);

			if(cachedUsers) return cachedUsers;

			const users = await this.cmsPublisherService.findAllUsers(
				Requestor.CMS,
				pagination
			);
			if (users.publishers.length=== 0) {
				throw new NotFoundException("No users found");
			}
			this.cacheManager.set(`cms_users?${hashRequest}`, users, 100);
			return users;
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving publishers");
		}
	}
}
