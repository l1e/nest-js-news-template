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
	InternalServerErrorException,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import { CmsArticleService } from "./cms-article.service"; // Update this path to your actual service location
import {
	Article,
	Requestor,
} from "src/admin/admin-article/model/article.model";

@ApiTags("cms-article")
@Controller("cms-article")
export class CmsArticleController {
	constructor(private readonly cmsArticleService: CmsArticleService) {}

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
	): Promise<Article[]> {
		// Validate query parameters
		if (!["views", "createdAt"].includes(sortBy)) {
			throw new BadRequestException("Invalid sortBy value");
		}
		if (!["asc", "desc"].includes(sortDirection)) {
			throw new BadRequestException("Invalid sortDirection value");
		}

		try {
			const articles = await this.cmsArticleService.getPublicArticles(
				sortBy,
				sortDirection,
			);
			if (articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria",
				);
			}
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
	async getPublicArticleById(@Param("id") id: number): Promise<Article> {
		try {
			// Ensure the ID is a valid number
			if (isNaN(id) || id <= 0) {
				throw new BadRequestException("Invalid article ID");
			}

			const article = await this.cmsArticleService.getArticleById(
				id,
				Requestor.CMS,
			);

			// Check if the article exists
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
	): Promise<Article[]> {
		try {
			// Ensure categoryId is a valid number
			if (isNaN(categoryId) || categoryId <= 0) {
				throw new BadRequestException("Invalid category ID");
			}

			const articles =
				await this.cmsArticleService.getArticlesByCategoryId(
					categoryId,
					sortBy,
					sortDirection,
					Requestor.CMS,
				);

			// Check if any articles were found
			if (!articles || articles.length === 0) {
				throw new NotFoundException(
					`No articles found for category ID: ${categoryId}`,
				);
			}

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
			const article = await this.cmsArticleService.getArticleOfTheDay(
				Requestor.CMS,
			);

			// Check if the article exists
			if (!article) {
				throw new NotFoundException("No article of the day found");
			}

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
			const articles = await this.cmsArticleService.getArticleSpecial(
				Requestor.CMS,
			);

			// Check if articles exist
			if (!articles || articles.length === 0) {
				throw new NotFoundException("No special articles found");
			}

			return articles;
		} catch (error) {
			// Handle the error more specifically if needed
			throw new BadRequestException("Error during articles fetching");
		}
	}
}
