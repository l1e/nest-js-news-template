import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AdminArticleService } from "./../../admin/admin-article/admin-article.service";
import {
	Article,
	Requestor,
} from "./../../admin/admin-article/model/article.model";
import { Category } from "./../../admin/admin-category/model/category.model";

@Injectable()
export class CmsArticleService {
	constructor(private readonly adminArticleService: AdminArticleService) {}

	// Method to get articles for the public.
	async getPublicArticles(
		sortBy: "views" | "createdAt" = "createdAt", // Default to createdAt
		sortDirection: "asc" | "desc" = "desc", // Default to descending order
	): Promise<Article[]> {
		return this.adminArticleService.getAllArticles(
			Requestor.CMS,
			sortBy,
			sortDirection,
		);
	}

	async getArticleById(id: number, requestor: Requestor) {
		return this.adminArticleService.getArticleById(id, requestor);
	}

	async getArticlesByCategoryId(
		categoryId: number,
		sortBy: "views" | "createdAt" = "createdAt",
		sortDirection: "asc" | "desc" = "desc",
		requestor: Requestor,
	): Promise<Article[]> {
		return this.adminArticleService.getArticlesByCategoryId(
			categoryId,
			sortBy,
			sortDirection,
			requestor,
		);
	}

	async getArticleOfTheDay(requestor: Requestor): Promise<Article> {
		return this.adminArticleService.getArticleOfTheDay(requestor);
	}

	async getArticleSpecial(requestor: Requestor): Promise<Article[]> {
		return this.adminArticleService.getArticleSpecial(requestor);
	}
}
