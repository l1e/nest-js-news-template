import { BadRequestException, Controller, Get, HttpStatus, Inject, InternalServerErrorException, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CmsCategoryService } from "./cms-category.service";
import { Category } from "./../../admin/admin-category/model/category.model";


import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Pagination, SoringCategories, SortByGeneral, SortDirection } from "./../../utils/types/types";
import { Requestor } from "./../../admin/admin-article/model/article.model";

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
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["id", "createdAt"],
		description: "Field to sort by (id or createdAt)",
	})
	@ApiQuery({
		name: "sortDirection",
		required: false,
		enum: ["asc", "desc"],
		description: "Sort direction (ascending or descending)",
	})
	async getAllCategories(
		@Query("sortBy") sortBy: SortByGeneral = SortByGeneral.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	): Promise<{ pagination: any, categories: Category[] }>{

		try {

			// Validate query parameters 
			if (!["id", "createdAt"].includes(sortBy)) {
				throw new BadRequestException("Invalid sortBy value");
			}
			if (!["asc", "desc"].includes(sortDirection)) {
				throw new BadRequestException("Invalid sortDirection value");
			}

			let sorting: SoringCategories = {
				sortBy: sortBy,
				sortDirection: sortDirection
			}
			
			let pagination: Pagination = {
				page: Number(page),
				perPage: Number(perPage)
			}
			
			let hashRequest = `?sortBy=${sorting.sortBy}&sortDirection=${sorting.sortDirection}&page=${pagination.page}&perPage=${pagination.perPage}`;
			let cachedCategories = await this.cacheManager.get<{ pagination: any, categories: Category[] }>(`cms_categories/${hashRequest}`);
	
			if(cachedCategories) return cachedCategories;

			let categories = await this.publisherCategoryService.getAllCategories(Requestor.CMS, sorting, pagination);
			this.cacheManager.set(`cms_categories${hashRequest}`, categories, 100);
			return categories
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving categories");
		}

	}
}
