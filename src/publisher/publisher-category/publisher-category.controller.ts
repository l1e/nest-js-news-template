import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PublisherCategoryService } from "./publisher-category.service";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { Category } from "./../../admin/admin-category/model/category.model";

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
