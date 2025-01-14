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
    UnauthorizedException,
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

import { AdminArticleService } from "./admin-article.service";
import { CreateArticleDto } from "./dto/article.create.dto";
import { Article, Requestor } from "./model/article.model";
import { AuthAdminhGuard } from "./../../utils/auth.admin.guard";
import { EmailToken } from "./../../utils/email.from.token.decorator";
import { UpdateArticleDto } from "./dto/update.article.dto";
import { Pagination, SoringArticles, SortByArticles, SortDirection } from "./../../utils/types/types";
import { ConfigService } from "@nestjs/config";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("admin-article")
export class AdminArticleController {
	constructor(
        private readonly adminArticleService: AdminArticleService,
        private readonly configService: ConfigService
    ) {}

	@Get("push-to-opensearch")
    @ApiOperation({ summary: "Push articles to the OpenSearch" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async pushArticlesToOpenSearch() {
        return await this.adminArticleService.pushArticleToOpenSearch();
    }

    @Get("automatic-push-with-secret-key")
    @ApiOperation({ summary: "Automatic push with a secret key" })
    @ApiExcludeEndpoint()
    async pushArticlesAutomaticlyToOpenSearch(@Query("secretKey") secretKey: string) {

        if (secretKey !== this.configService.get<string>('OPEN_SEARCH_SECRET_KEY_TO_PUSH_ARTICLES')) {
            throw new UnauthorizedException("Invalid secret key");
        }

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
		@Query("sortBy") sortBy: SortByArticles = SortByArticles.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("categoryId") categoryId: number,
		@Query("publisherId") publisherId: number,
		@Query("textToSearch") textToSearch: string,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
		@Query("minPublishedArticles") minPublishedArticles: number,
		@Query("minArticleVeiws") minArticleVeiws: number,
		@Query("minSizeSymbols") minSizeSymbols: number,
	): Promise<{ pagination: any; articles: Article[] }>  {
		console.log('getAllArticles {sortBy, sortDirection, categoryId, publisherId, textToSearch, minPublishedArticles, minArticleVeiws, minSizeSymbols}:', {sortBy, sortDirection, categoryId, publisherId, textToSearch, minPublishedArticles, minArticleVeiws, minSizeSymbols})
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

		try {
			const articles = await this.adminArticleService.getAllArticles(
				Requestor.ADMIN,
				sorting,
				categoryId,
				publisherId,
				textToSearch,
				minArticleVeiws,
				pagination,
			);

			if (articles && articles.articles && Object.keys(articles.articles).length === 0) {
				throw new NotFoundException(
					"No articles found matching the given criteria",
				);
			}
			return articles;
		} catch (error) {
			// console.log('error getPublicArticles:',error)
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
