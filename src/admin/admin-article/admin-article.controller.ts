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

@ApiBearerAuth()
@ApiTags("articles")
@Controller("admin-article")
export class AdminArticleController {
	constructor(private readonly adminArticleService: AdminArticleService) {}

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
		@Query("sortBy") sortBy: "views" | "createdAt" = "createdAt",
		@Query("sortDirection") sortDirection: "asc" | "desc" = "desc",
	): Promise<Article[]> {
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
