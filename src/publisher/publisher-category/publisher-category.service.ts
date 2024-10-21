import { Injectable } from "@nestjs/common";
import { Requestor } from "./../../admin/admin-article/model/article.model";
import { AdminCategoryService } from "./../../admin/admin-category/admin-category.service";
import { Pagination, SoringCategories } from "./../../utils/types/types";

@Injectable()
export class PublisherCategoryService {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	async getAllCategories(requestor: Requestor, sorting:SoringCategories, pagination:Pagination) {
		return this.adminCategoryService.getAllCategories(requestor, sorting, pagination);
	}
}
