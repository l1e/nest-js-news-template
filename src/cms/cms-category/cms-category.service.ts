import { Injectable } from "@nestjs/common";
import { AdminCategoryService } from "./../../admin/admin-category/admin-category.service";
import { Category } from "./../../admin/admin-category/model/category.model";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { Pagination, SoringCategories } from "./../../utils/types/types";

@Injectable()
export class CmsCategoryService {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	async getAllCategories(requestor: Requestor, sorting:SoringCategories, pagination:Pagination): Promise<{ pagination: any, categories: Category[] }> {
		return this.adminCategoryService.getAllCategories(requestor, sorting, pagination);
	}
}
