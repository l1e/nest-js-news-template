import { Requestor } from "./../../admin/admin-article/model/article.model";
import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Category } from "./../../admin/admin-category/model/category.model";
import { PublisherCategoryService } from "./publisher-category.service";

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
	async getAllCategories(): Promise<Category[]> {
		return this.publisherCategoryService.getAllCategories(
			Requestor.PUBLISHER,
		);
	}
}
