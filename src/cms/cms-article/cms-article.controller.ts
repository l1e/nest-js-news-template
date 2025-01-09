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
import { CmsArticleService } from "./cms-article.service";
import {
	Article,
	Requestor,
} from "./../../admin/admin-article/model/article.model";

import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { FilterArticleDto } from "./dto/articles.filter.dto";
import { Pagination, SoringArticles, SortByArticles, SortDirection } from "./../../utils/types/types";


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

	@ApiQuery({
		name: "categoryId",
		required: false,
		description: "By what categoryId you want to get articles",
	})
	@ApiQuery({
		name: "publisherId",
		required: false,
		description: "By what publisherId you want to get articles",
	})
	@ApiQuery({
		name: "textToSearch",
		required: false,
		description: "By what text you want to get articles",
	})
	@ApiQuery({
		name: "minPublishedArticles",
		required: false,
		description: "By what minPublishedArticles you want to get articles (NOT IMPLEMENTED YET)",
	})

	@ApiQuery({
		name: "minArticleVeiws",
		required: false,
		description: "By what minArticleVeiws you want to get articles",
	})
	@ApiQuery({
		name: "minArticleSizeSymbols",
		required: false,
		description: "By what minPublisherTottalVeiws you want to get articles (NOT IMPLEMENTED YET)",
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
		@Query("sortBy") sortBy: SortByArticles = SortByArticles.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("categoryId") categoryId: number,
		@Query("publisherId") publisherId: number,
		@Query("textToSearch") textToSearch: string,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
		@Query("minPublishedArticles") minPublishedArticles: number,
		@Query("minArticleVeiws") minArticleVeiws: number,
		@Query("minArticleSizeSymbols") minArticleSizeSymbols: number,
		
	){

		// Validate query parameters 
		if (!["views", "createdAt"].includes(sortBy)) {
			throw new BadRequestException("Invalid sortBy value");
		}
		if (!["asc", "desc"].includes(sortDirection)) {
			throw new BadRequestException("Invalid sortDirection value");
		}

		let sorting: SoringArticles = {
			sortBy: sortBy,
			sortDirection: sortDirection
		}
		
		let pagination: Pagination = {
			page: Number(page),
			perPage: Number(perPage)
		}


		let filterArticleDto: FilterArticleDto = {
			categoryId: categoryId,
			publisherId: publisherId,
			minPublishedArticles: minPublishedArticles,
			minArticleVeiws: minArticleVeiws,
			minArticleSizeSymbols: minArticleSizeSymbols,
			textToSearch: textToSearch,
		}

		

		try {

			let hashRequest = `public?sortBy=${sortBy}&sortDirection=${sortDirection}&page=${pagination.page}&perPage=${pagination.perPage}`;
			
			if(filterArticleDto.categoryId!==null && filterArticleDto.categoryId!==undefined && filterArticleDto.categoryId!==0){
				hashRequest +=`&categoryId=${categoryId}`
			}

			if(filterArticleDto.publisherId!==null && filterArticleDto.publisherId!==undefined && filterArticleDto.publisherId!==0){
				hashRequest +=`&publisherId=${publisherId}`
			}

			if(filterArticleDto.minPublishedArticles!==null && filterArticleDto.minPublishedArticles!==undefined && filterArticleDto.minPublishedArticles!==0){
				hashRequest +=`&minPublishedArticles=${minPublishedArticles}`
			}

			if(filterArticleDto.minArticleVeiws!==null && filterArticleDto.minArticleVeiws!==undefined && filterArticleDto.minArticleVeiws!==0){
				hashRequest +=`&minArticleVeiws=${minArticleVeiws}`
			}

			if(filterArticleDto.minArticleSizeSymbols!==null && filterArticleDto.minArticleSizeSymbols!==undefined && filterArticleDto.minArticleSizeSymbols!==0){
				hashRequest +=`&minArticleSizeSymbols=${minArticleSizeSymbols}`
			}

			if(filterArticleDto.textToSearch!==null && filterArticleDto.textToSearch!==undefined && filterArticleDto.textToSearch!==''){
				hashRequest +=`&textToSearch=${textToSearch}`
			}

			let cachedArticles = await this.cacheManager.get<{ pagination: any; articles: Article[] }>(`cms_articles/${hashRequest}`);

			if(cachedArticles) return cachedArticles;
			
			let articles = await this.cmsArticleService.findArticlesByFilterWithTheHealthCheck(filterArticleDto, sorting, pagination)
			if (articles.articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria",
				);
			}
			await this.cacheManager.set(`cms_articles/${hashRequest}`, articles, 100)
			return articles;
		} catch (error) {
			console.log('error getPublicArticles 1:',error)
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

			const article = await this.cmsArticleService.getArticleByIdByFilterWithTheHealthCheck(
				id,
				Requestor.CMS,
			);

			if (!article) {
				throw new NotFoundException(`Article with ID ${id} not found`);
			}

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
        @Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	): Promise<{ pagination: any; articles: Article[] }> {
		try {
			// Ensure categoryId is a valid number
			if (isNaN(categoryId) || categoryId <= 0) {
				throw new BadRequestException("Invalid category ID");
			}

			let hashRequest = `cms_articles_by_category/${categoryId}?sortBy=${sortBy}&${sortDirection}=sortDirection&page=${page}&perPage=${perPage}`;
			let cachedArticles = await this.cacheManager.get<{ pagination: any; articles: Article[] }>(`cms_articles_by_category/${hashRequest}`);

			if(cachedArticles) return cachedArticles;

            let pagination: Pagination = {
                page: Number(page),
                perPage: Number(perPage)
            }

			const articles =
				await this.cmsArticleService.getArticlesByCategoryId(
					categoryId,
					sortBy,
					sortDirection,
					Requestor.CMS,
                    pagination
				);

			if (!articles || articles.articles.length === 0) {
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


	@Get("tag/:tagId")
	@ApiOperation({ summary: "Get articles by tag ID" })
	@ApiParam({
		name: "tagId",
		type: "number",
		description: "Tag ID",
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
		description: "No articles found for the given tag",
	})
	@ApiResponse({ status: 400, description: "Invalid tag ID" })
	async getArticlesByTagId(
		@Param("tagId") tagId: number,
		@Query("sortBy") sortBy: "views" | "createdAt" = "createdAt",
		@Query("sortDirection") sortDirection: "asc" | "desc" = "desc",
        @Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	): Promise<{ pagination: any; articles: Article[] }>{
		try {
			// Ensure categoryId is a valid number
			if (isNaN(tagId) || tagId <= 0) {
				throw new BadRequestException("Invalid tag ID");
			}

			let hashRequest = `cms_articles_by_tag/${tagId}?sortBy=${sortBy}&${sortDirection}=sortDirection&page=${page}&perPage=${perPage}`;
			let cachedArticles = await this.cacheManager.get<{ pagination: any; articles: Article[] }>(`cms_articles_by_tag/${hashRequest}`);

			if(cachedArticles) return cachedArticles;

            let pagination: Pagination = {
                page: Number(page),
                perPage: Number(perPage)
            }

			const articles =
				await this.cmsArticleService.getArticlesByTagId(
					tagId,
					sortBy,
					sortDirection,
					Requestor.CMS,
                    pagination
				);

			if (!articles || articles.articles.length === 0) {
				throw new NotFoundException(
					`No articles found for tag ID: ${tagId}`,
				);
			}

			await this.cacheManager.set(`cms_articles_by_tag/${hashRequest}`, articles, 100)
			return articles;
		} catch (error) {
            console.error('getArticlesByTagId error:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error; // Re-throw specific exceptions
            }
            throw new InternalServerErrorException("Error fetching articles");
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
