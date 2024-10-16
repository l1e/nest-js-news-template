import { Controller, Get, HttpStatus, Inject, InternalServerErrorException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CmsCategoryService } from "./cms-category.service";
import { Category } from "./../../admin/admin-category/model/category.model";


import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@ApiTags("cms-category")
@Controller("cms-category")
export class CmsCategoryController {
	constructor(
		private readonly publisherCategoryService: CmsCategoryService,
		@Inject(CACHE_MANAGER)
        private cacheManager: Cache,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all categories" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Successfully retrieved all categories.",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "An error occurred while retrieving categories.",
	})
	async getAllCategories(): Promise<Category[]> {

		try {
			
			let hashRequest = `categories`;
			let cachedCategories = await this.cacheManager.get<Category[]>(`cms_categories/${hashRequest}`);
	
			if(cachedCategories) return cachedCategories;

			let categories = await this.publisherCategoryService.getAllCategories();
			this.cacheManager.set(`cms_categories/${hashRequest}`, categories, 100);
			return categories
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving categories");
		}


	}
}
