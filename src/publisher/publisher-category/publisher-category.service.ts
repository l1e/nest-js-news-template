import { Injectable } from "@nestjs/common";
import { Requestor } from "src/admin/admin-article/model/article.model";
import { AdminCategoryService } from "src/admin/admin-category/admin-category.service";

@Injectable()
export class PublisherCategoryService {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	async getAllCategories(requestor: Requestor) {
		return this.adminCategoryService.getAllCategories(requestor);
	}
}
