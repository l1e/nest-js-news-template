import { Injectable } from "@nestjs/common";
import { AdminCategoryService } from "./../../admin/admin-category/admin-category.service";
import { Category } from "./../../admin/admin-category/model/category.model";

@Injectable()
export class CmsCategoryService {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	async getAllCategories(): Promise<Category[]> {
		return this.adminCategoryService.getAllCategories();
	}
}
