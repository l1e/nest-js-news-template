import { Injectable } from "@nestjs/common";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { AdminCategoryService } from "./../../admin/admin-category/admin-category.service";

@Injectable()
export class PublisherCategoryService {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	async getAllCategories(requestor: Requestor) {
		return this.adminCategoryService.getAllCategories(requestor);
	}
}
