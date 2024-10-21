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

import { AdminCategoryService } from "./admin-category.service";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { Category } from "./model/category.model";
import { AuthAdminhGuard } from "./../../utils/auth.admin.guard";
import { Requestor } from "../admin-article/model/article.model";
import { Pagination, SoringCategories, SortByGeneral, SortDirection } from "./../../utils/types/types";

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
	@ApiQuery({
		name: "sortBy",
		required: false,
		enum: ["id", "createdAt"],
		description: "Field to sort by (views or createdAt)",
	})
	@ApiQuery({
		name: "sortDirection",
		required: false,
		enum: ["asc", "desc"],
		description: "Sort direction (ascending or descending)",
	})
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async getAllCategories(
		@Query("sortBy") sortBy: SortByGeneral = SortByGeneral.CREATED_AT,
		@Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
		@Query("page") page: number = 1,
		@Query("perPage") perPage: number = 2,
	): Promise<{ pagination: any, categories: Category[] }>  {

		try {

			// Validate query parameters 
			if (!["id", "createdAt"].includes(sortBy)) {
				throw new BadRequestException("Invalid sortBy value");
			}
			if (!["asc", "desc"].includes(sortDirection)) {
				throw new BadRequestException("Invalid sortDirection value");
			}

			let sorting: SoringCategories = {
				sortBy: sortBy,
				sortDirection: sortDirection
			}
			
			let pagination: Pagination = {
				page: Number(page),
				perPage: Number(perPage)
			}

			return this.adminCategoryService.getAllCategories(Requestor.ADMIN, sorting, pagination);
			
		} catch (error) {
			throw new InternalServerErrorException("Error retrieving categories");
		}

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
