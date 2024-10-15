import {
	Controller,
	Get,
	Query,
	InternalServerErrorException,
	NotFoundException,
	Inject,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { CmsPublisherService } from "./cms-publisher.service";
import { User } from "./../../admin/admin-user/model/user.model";
import { Requestor } from "./../../admin/admin-article/model/article.model";

import { RedisClientType } from 'redis';

import { Cache } from "cache-manager";
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";
@ApiTags("cms-publisher")
@Controller("cms-publisher")
export class CmsPublisherController {
	constructor(
		private readonly cmsPublisherService: CmsPublisherService,
		@Inject(CACHE_MANAGER)
        private cacheManager: Cache,
	) {}

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

			let hashRequest = 'sortBy='+sortBy+'&sortDirection='+sortDirection;
			let cachedUsers = await this.cacheManager.get<User[]>(`cms_users?${hashRequest}`);

			if(cachedUsers) return cachedUsers;

			const users = await this.cmsPublisherService.findAllUsers(
				Requestor.CMS,
				sortDirection,
				sortBy,
			);
			if (users.length === 0) {
				throw new NotFoundException("No users found");
			}
			this.cacheManager.set(`cms_users?${hashRequest}`, users, 100);
			return users;
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving publishers");
		}
	}
}
