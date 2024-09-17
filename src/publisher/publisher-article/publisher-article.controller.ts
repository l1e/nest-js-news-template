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
} from "@nestjs/common";
import { PublisherArticleService } from "./publisher-article.service";
import { CreateArticleDto } from "./dto/create.publisher-article.dto";
import {
	Article,
	Requestor,
	ValidationStatus,
} from "./../../admin/admin-article/model/article.model";
import {
	ApiBearerAuth,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AuthPublisherGuard } from "./../../utils/auth.publisher.guard";
import { EmailToken } from "./../../utils/email.from.token.decorator";
import { UserRole } from "./../../admin/admin-user/model/user.model";
import { UpdateArticleDto } from "./../../admin/admin-article/dto/update.article.dto";

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
		console.log("createArticle decodedEmail:", decodedEmail);
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
	@UseGuards(AuthGuard("jwt"), AuthPublisherGuard)
	async getAllArticles(@EmailToken("decodedEmail") decodedEmail: string) {
		return this.publisherArticleService.getPublisherArticles(decodedEmail);
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
