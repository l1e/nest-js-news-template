import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	ParseIntPipe,
	UseGuards,
	Delete,
	HttpStatus,
	Query,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { PublisherArticleService } from "./publisher-article.service";
import { CreateArticleDto } from "./dto/create.publisher-article.dto";
import {
	Article,
	Requestor,
	ValidationStatus,
} from "./../../admin/admin-article/model/article.model";
import { AuthPublisherGuard } from "./../../utils/auth.publisher.guard";
import { EmailToken } from "./../../utils/email.from.token.decorator";
import { UpdateArticleDto } from "./../../admin/admin-article/dto/update.article.dto";
import { Pagination, SoringArticles, SortByArticles, SortDirection } from "./../../utils/types/types";

@ApiBearerAuth()
@Controller("publisher-article")
@ApiTags("publisher-article")
export class PublisherArticleController {
	constructor(
		private readonly publisherArticleService: PublisherArticleService,
	) {}

	@Post()
	@ApiOperation({ summary: "Create an article" })
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async createArticle(
		@Body() createArticleDto: CreateArticleDto,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		createArticleDto.creatorEmail = decodedEmail;
		createArticleDto.validationStatus = ValidationStatus.APPROVED;
		return this.publisherArticleService.createArticle(createArticleDto);
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
	async getArticleById(
		@Param("id", ParseIntPipe) id: number,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		return this.publisherArticleService.getArticleById(
			id,
			Requestor.PUBLISHER,
			decodedEmail,
		);
	}

	@Put(":id")
	@ApiOperation({ summary: "Update an article" })
	async updateArticle(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateArticleDto: UpdateArticleDto,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		updateArticleDto.creatorEmail = decodedEmail;
		updateArticleDto.requestor = Requestor.PUBLISHER;
		updateArticleDto.validationStatus = ValidationStatus.APPROVED;
		return this.publisherArticleService.updateArticle(id, updateArticleDto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete an article" })
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async deleteArticle(
		@Param("id", ParseIntPipe) id: number,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<void> {
		return this.publisherArticleService.deleteArticle(
			id,
			Requestor.PUBLISHER,
			decodedEmail,
		);
	}

	@Get()
	@ApiOperation({ summary: "Get my articles" })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "User with email  not found",
	})
	@ApiResponse({
		status: 500,
		description: "Failed to fetch articles",
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
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async getAllArticles(
		@EmailToken("decodedEmail") decodedEmail: string,
		@Query("sortBy") sortBy: SortByArticles = SortByArticles.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	): Promise<{ pagination: any, articles: Article[] }> {

		let sorting: SoringArticles = {
			sortBy: sortBy,
			sortDirection: sortDirection
		}
		
		let pagination: Pagination = {
			page: Number(page),
			perPage: Number(perPage)
		}

		let publishers = this.publisherArticleService.getPublisherArticles(decodedEmail, sorting, pagination);
		return publishers;
	}

	@Put(":id/send-for-approval")
	@ApiExcludeEndpoint(true)
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async sendForApproval(
		@Param("id", ParseIntPipe) id: number,
		@EmailToken("decodedEmail") decodedEmail: string,
	): Promise<Article> {
		return this.publisherArticleService.sendForApproval(
			id,
			Requestor.PUBLISHER,
			decodedEmail,
		);
	}
}
