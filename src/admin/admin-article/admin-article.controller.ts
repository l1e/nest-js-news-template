import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Delete,
	ParseIntPipe,
	UseGuards,
	HttpStatus,
	Query,
	BadRequestException,
	NotFoundException,
	InternalServerErrorException,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { AdminArticleService } from "./admin-article.service";
import { CreateArticleDto } from "./dto/article.create.dto";
import { Article, Requestor } from "./model/article.model";
import { AuthAdminhGuard } from "./../../utils/auth.admin.guard";
import { EmailToken } from "./../../utils/email.from.token.decorator";
import { UpdateArticleDto } from "./dto/update.article.dto";
import { SortBy, SortDirection } from "./../../utils/types/types";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("admin-article")
export class AdminArticleController {
	constructor(private readonly adminArticleService: AdminArticleService) {}

	@Get("push-to-opensearch")
    @ApiOperation({ summary: "Push blogs to opensearch" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async pushModelsToOpenSearch() {
        return await this.adminArticleService.pushArticleToOpenSearch();
    }

	@Post()
	@ApiOperation({ summary: "Create an article" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async createArticle(
		@Body() createArticleDto: CreateArticleDto,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		console.log("createArticle decodedEmail:", decodedEmail);
		createArticleDto.creatorEmail = decodedEmail;
		return this.adminArticleService.createArticle(createArticleDto);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get an article by ID" })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Article not found",
	})
	@ApiResponse({
		status: 500,
		description: "Error fetching article",
	})
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async getArticleById(
		@Param("id", ParseIntPipe) id: number,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		return this.adminArticleService.getArticleById(
			id,
			Requestor.ADMIN,
			decodedEmail,
		);
	}

	@Get()
	@ApiOperation({ summary: "Get All articles" })
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
		description: "By what minPublishedArticles you want to get articles",
	})

	@ApiQuery({
		name: "minArticleVeiws",
		required: false,
		description: "By what minArticleVeiws you want to get articles",
	})
	@ApiQuery({
		name: "minSizeSymbols",
		required: false,
		description: "By what minSizeSymbols you want to get articles",
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
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async getAllArticles(
		@Query("sortBy") sortBy: SortBy = SortBy.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("categoryId") categoryId: number,
		@Query("publisherId") publisherId: number,
		@Query("textToSearch") textToSearch: string,
		@Query("minPublishedArticles") minPublishedArticles: number,
		@Query("minArticleVeiws") minArticleVeiws: number,
		@Query("minSizeSymbols") minSizeSymbols: number,
	): Promise<Article[]> {
		console.log('getAllArticles {sortBy, sortDirection, categoryId, publisherId, textToSearch, minPublishedArticles, minArticleVeiws, minSizeSymbols}:', {sortBy, sortDirection, categoryId, publisherId, textToSearch, minPublishedArticles, minArticleVeiws, minSizeSymbols})
		if (!["views", "createdAt"].includes(sortBy)) {
			throw new BadRequestException("Invalid sortBy value");
		}
		if (!["asc", "desc"].includes(sortDirection)) {
			throw new BadRequestException("Invalid sortDirection value");
		}

		try {
			const articles = await this.adminArticleService.getAllArticles(
				Requestor.ADMIN,
				sortBy,
				sortDirection,
				categoryId,
				publisherId,
				textToSearch,
				minArticleVeiws
			);
			if (articles.length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria",
				);
			}
			return articles;
		} catch (error) {
			throw new InternalServerErrorException(
				"Error fetching public articles",
			);
		}
	}

	@Put(":id")
	@ApiOperation({ summary: "Update an article" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async updateArticle(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateArticleDto: UpdateArticleDto,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		updateArticleDto.creatorEmail = decodedEmail;
		return this.adminArticleService.updateArticle(id, updateArticleDto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete an article" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async deleteArticle(
		@Param("id", ParseIntPipe) id: number,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<void> {
		return this.adminArticleService.deleteArticle(
			id,
			Requestor.ADMIN,
			decodedEmail,
		);
	}
}
