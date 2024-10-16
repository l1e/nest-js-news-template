import {
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import {
	BadRequestException,
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import { CmsArticleService } from "./cms-article.service"; // Update this path to your actual service location
import {
	Article,
	Requestor,
} from "./../../admin/admin-article/model/article.model";
import { RedisClientType } from 'redis';

import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";


@ApiTags("cms-article")
@Controller("cms-article")
export class CmsArticleController {
	constructor(
		private readonly cmsArticleService: CmsArticleService,
		@Inject(CACHE_MANAGER)
        private cacheManager: Cache,

	) {}

	@Get("public")
	@ApiOperation({ summary: "Get all public articles with sorting" })
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["views", "createdAt"],
		description: "Field to sort by (views or createdAt)",
	})
	@ApiQuery({
		name: "sortDirection",
		required: false,
		enum: ["asc", "desc"],
		description: "Sort direction (ascending or descending)",
	})
	@ApiResponse({
		status: 200,
		description: "Successfully fetched public articles",
		// type: [Article],
	})
	@ApiResponse({
		status: 400,
		description:
			"Invalid query parameters. Ensure 'sortBy' is 'views' or 'createdAt' and 'sortDirection' is 'asc' or 'desc'.",
	})
	@ApiResponse({
		status: 404,
		description: "No articles found matching the given criteria",
	})
	@ApiResponse({
		status: 500,
		description:
			"Internal server error. An unexpected error occurred while fetching the articles.",
	})
	async getPublicArticles(
		@Query("sortBy") sortBy: "views" | "createdAt" = "createdAt",
		@Query("sortDirection") sortDirection: "asc" | "desc" = "desc",
	){
		console.log('getPublicArticles sortBy :',sortBy)
		console.log('getPublicArticles sortDirection :',sortDirection)

		// Validate query parameters 
		if (!["views", "createdAt"].includes(sortBy)) {
			throw new BadRequestException("Invalid sortBy value");
		}
		if (!["asc", "desc"].includes(sortDirection)) {
			throw new BadRequestException("Invalid sortDirection value");
		}

		try {
			
			let hashRequest = 'sortBy='+sortBy+'&sortDirection='+sortDirection;
			let cachedArticles = await this.cacheManager.get(`cms_articles?${hashRequest}`);

			if(cachedArticles) return cachedArticles;

			const articles = await this.cmsArticleService.getPublicArticles(
				sortBy,
				sortDirection,
			);
			if (articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria",
				);
			}

			this.cacheManager.set(`cms_articles?${hashRequest}`, articles, 100);
			return articles;
		} catch (error) {
			// Log the error or handle it as needed
			throw new InternalServerErrorException(
				"Error fetching public articles",
			);
		}
	}

	@Get("public/:id")
	@ApiOperation({ summary: "Get a public article by ID" })
	@ApiParam({ name: "id", type: "number", description: "Article ID" })
	@ApiResponse({
		status: 200,
		description: "Successfully fetched the article",
	})
	@ApiResponse({ status: 404, description: "Article not found" })
	@ApiResponse({ status: 400, description: "Invalid article ID" })
	async getPublicArticleById(@Param("id") id: number) {
		try {
			// Ensure the ID is a valid number
			if (isNaN(id) || id <= 0) {
				throw new BadRequestException("Invalid article ID");
			}

			let hashRequest = `${id}`;
			let cachedArticle = await this.cacheManager.get(`cms_article/${hashRequest}`);

			if(cachedArticle) return cachedArticle;

			const article = await this.cmsArticleService.getArticleById(
				id,
				Requestor.CMS,
			);

			if (!article) {
				throw new NotFoundException(`Article with ID ${id} not found`);
			}

			this.cacheManager.set(`cms_article/${hashRequest}`, article, 100);
			return article;
		} catch (error) {
			throw new BadRequestException("Error fetching the article");
		}
	}

	@Get("category/:categoryId")
	@ApiOperation({ summary: "Get articles by category ID" })
	@ApiParam({
		name: "categoryId",
		type: "number",
		description: "Category ID",
	})
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["views", "createdAt"],
		description: "Field to sort by (views or createdAt)",
	})
	@ApiQuery({
		name: "sortDirection",
		required: false,
		enum: ["asc", "desc"],
		description: "Sort direction (ascending or descending)",
	})
	@ApiResponse({ status: 200, description: "Successfully fetched articles" })
	@ApiResponse({
		status: 404,
		description: "No articles found for the given category",
	})
	@ApiResponse({ status: 400, description: "Invalid category ID" })
	async getArticlesByCategoryId(
		@Param("categoryId") categoryId: number,
		@Query("sortBy") sortBy: "views" | "createdAt" = "createdAt",
		@Query("sortDirection") sortDirection: "asc" | "desc" = "desc",
	): Promise<Article[]> {
		try {
			// Ensure categoryId is a valid number
			if (isNaN(categoryId) || categoryId <= 0) {
				throw new BadRequestException("Invalid category ID");
			}

			let hashRequest = `cms_articles_by_category/${categoryId}?sortBy=${sortBy}&${sortDirection}=sortDirection`;
			let cachedArticles = await this.cacheManager.get<Article[]>(`cms_category/${hashRequest}`);

			if(cachedArticles) return cachedArticles;

			const articles =
				await this.cmsArticleService.getArticlesByCategoryId(
					categoryId,
					sortBy,
					sortDirection,
					Requestor.CMS,
				);

			if (!articles || articles.length === 0) {
				throw new NotFoundException(
					`No articles found for category ID: ${categoryId}`,
				);
			}

			await this.cacheManager.set(`cms_articles_by_category/${hashRequest}`, articles, 100)
			return articles;
		} catch (error) {
			throw new BadRequestException("Error fetching articles");
		}
	}

	@Get("/articleoftheday")
	@ApiOperation({ summary: "Get Article of the Day" })
	@ApiResponse({
		status: 200,
		description: "Successfully fetched the article of the day",
	})
	@ApiResponse({ status: 404, description: "No article of the day found" })
	async getArticleOfTheDay(): Promise<Article> {
		try {

			let hashRequest = `articleoftheday`;
			let cachedArticle = await this.cacheManager.get<Article>(`cms_articleoftheday/${hashRequest}`);

			if(cachedArticle) return cachedArticle;

			const article = await this.cmsArticleService.getArticleOfTheDay(
				Requestor.CMS,
			);
			if (!article) {
				throw new NotFoundException("No article of the day found");
			}
			await this.cacheManager.set(`cms_articleoftheday/${hashRequest}`, article, 100)
			return article;
		} catch (error) {
			throw new BadRequestException("Error during article fetching");
		}
	}

	@Get("/articlespecial")
	@ApiOperation({ summary: "Get special articles" })
	@ApiResponse({
		status: 200,
		description: "Successfully fetched special articles",
	})
	@ApiResponse({ status: 404, description: "No special articles found" })
	async getArticleSpecial(): Promise<Article[]> {
		try {
			
			let hashRequest = `articlespecial`;
			let cachedArticle = await this.cacheManager.get<Article[]>(`cms_articlespecial/${hashRequest}`);

			if(cachedArticle) return cachedArticle;

			const articles = await this.cmsArticleService.getArticleSpecial(
				Requestor.CMS,
			);

			if (!articles || articles.length === 0) {
				throw new NotFoundException("No special articles found");
			}
			await this.cacheManager.set(`cms_articlespecial/${hashRequest}`, articles, 100)
			return articles;
		} catch (error) {
			// Handle the error more specifically if needed
			throw new BadRequestException("Error during articles fetching");
		}
	}
}
