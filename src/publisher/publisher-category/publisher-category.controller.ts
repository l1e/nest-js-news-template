import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PublisherCategoryService } from "./publisher-category.service";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { Category } from "./../../admin/admin-category/model/category.model";
import { PaginationCategories, SoringCategories, SortByGeneral, SortDirection } from "./../../utils/types/types";

@ApiTags("publisher-category")
@Controller("publisher-category")
export class PublisherCategoryController {
	constructor(
		private readonly publisherCategoryService: PublisherCategoryService,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all categories" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Successfully retrieved all categories.",
		type: [Category],
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "An error occurred while retrieving categories.",
	})
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["id", "createdAt"],
		description: "Field to sort by (views or createdAt)",
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
	): Promise<{ pagination: any, categories: Category[] }> {

		let sorting: SoringCategories = {
			sortBy: sortBy,
			sortDirection: sortDirection
		}
		
		let pagination: PaginationCategories = {
			page: Number(page),
			perPage: Number(perPage)
		}

		let categories = await this.publisherCategoryService.getAllCategories(
			Requestor.PUBLISHER, sorting, pagination
		);
		return categories;
	}
}
