import { Controller, Get, HttpStatus } from "@nestjs/common";
import { CmsCategoryService } from "./cms-category.service";
import { Category } from "src/admin/admin-category/model/category.model";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("cms-category")
@Controller("cms-category")
export class CmsCategoryController {
	constructor(
		private readonly publisherCategoryService: CmsCategoryService,
	) {}

	@Get()
	@ApiOperation({ summary: "Get all categories" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Successfully retrieved all categories.",
		// type: [Category], // This specifies that an array of Category objects will be returned
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "An error occurred while retrieving categories.",
	})
	async getAllCategories(): Promise<Category[]> {
		return this.publisherCategoryService.getAllCategories();
	}
}
