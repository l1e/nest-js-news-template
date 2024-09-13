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
} from "@nestjs/common";
import { AdminCategoryService } from "./admin-category.service";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { Category } from "./model/category.model";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthAdminhGuard } from "src/utils/auth.admin.guard";
import { AuthGuard } from "@nestjs/passport";
import { Requestor } from "../admin-article/model/article.model";

@ApiBearerAuth()
@ApiTags("categories")
@Controller("admin-category")
export class AdminCategoryController {
	constructor(private readonly adminCategoryService: AdminCategoryService) {}

	@Post()
	@ApiOperation({ summary: "Create a category" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async createCategory(
		@Body() createCategoryDto: CreateCategoryDto,
	): Promise<Category> {
		return this.adminCategoryService.createCategory(createCategoryDto);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get a category by ID" })
	@ApiResponse({
		status: 200,
		description: "Return a single category.",
	})
	@ApiResponse({
		status: 403,
		description: "Invalid credentials",
	})
	@ApiResponse({
		status: 404,
		description: "Category not found",
	})
	@ApiResponse({
		status: 500,
		description: "Failed to fetch category",
	})
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async getCategoryById(
		@Param("id", ParseIntPipe) id: number,
	): Promise<Category> {
		return this.adminCategoryService.getCategoryById(id);
	}

	@Get()
	@ApiOperation({ summary: "Get all categories" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Successfully retrieved all categories.",
	})
	@ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "An error occurred while retrieving categories.",
	})
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async getAllCategories(): Promise<Category[]> {
		return this.adminCategoryService.getAllCategories(Requestor.ADMIN);
	}

	@Put(":id")
	@ApiOperation({ summary: "Update a category" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async updateCategory(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateCategoryDto: CreateCategoryDto,
	): Promise<Category> {
		return this.adminCategoryService.updateCategory(id, updateCategoryDto);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete a category" })
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async deleteCategory(@Param("id", ParseIntPipe) id: number): Promise<void> {
		return this.adminCategoryService.deleteCategory(id);
	}
}
