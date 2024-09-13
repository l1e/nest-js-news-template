import { AdminArticleService } from "./../../admin/admin-article/admin-article.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
	ArticleStatus,
	CreateArticleDto,
} from "./dto/create.publisher-article.dto";
import {
	Article,
	Requestor,
} from "src/admin/admin-article/model/article.model";
import { UpdateArticleDto } from "src/admin/admin-article/dto/update.article.dto";

@Injectable()
export class PublisherArticleService {
	constructor(
		@InjectModel(Article)
		private readonly articleModel: typeof Article,
		private adminArticleService: AdminArticleService,
	) {}

	async createArticle(createArticleDto: CreateArticleDto): Promise<Article> {
		return this.adminArticleService.createArticle(createArticleDto);
	}

	async getArticleById(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	): Promise<Article> {
		return this.adminArticleService.getArticleById(
			id,
			requestor,
			creatorEmail,
		);
	}

	async updateArticle(
		id: number,
		updateArticleDto: UpdateArticleDto,
	): Promise<Article> {
		console.log("updateArticle updateArticleDto:", updateArticleDto);
		return this.adminArticleService.updateArticle(id, updateArticleDto);
	}
	async deleteArticle(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	) {
		return this.adminArticleService.deleteArticle(
			id,
			requestor,
			creatorEmail,
		);
	}

	async getPublisherArticles(publisherEmail: string) {
		return this.adminArticleService.getPublisherArticles(publisherEmail);
	}

	async sendForApproval(
		id: number,
		requestor: Requestor,
		creatorEmail: string,
	): Promise<Article> {
		const article = await this.getArticleById(id, requestor, creatorEmail);
		// article.status = ArticleStatus.PENDING;
		return article.save();
	}
}
