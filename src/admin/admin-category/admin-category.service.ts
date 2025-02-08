import { Requestor } from "./../admin-article/model/article.model";
import {
    ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Article } from "./../admin-article/model/article.model";
import { Category, PublishStatus } from "./model/category.model";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { Pagination, SoringCategories } from "./../../utils/types/types";

@Injectable()
export class AdminCategoryService {
	constructor(
		@InjectModel(Category)
		private readonly categoryModel: typeof Category,
	) {}

	async createCategory(
		createCategoryDto: CreateCategoryDto,
	): Promise<Category> {
		try {
			return await this.categoryModel.create(createCategoryDto);
		} catch (error) {
			throw new InternalServerErrorException(
				"An error occurred while creating category",
			);
		}

	}

	async getCategoryById(
		id: number,
		requestor: Requestor = Requestor.PUBLISHER,
        articleAdd: boolean = true
	): Promise<Category> {
		try {
			const category = await this.categoryModel.findByPk(id, 
                articleAdd ?{
				include: [Article],
                } : {}
            
            );
			// console.log("getCategoryById category:", category);
			if (!category) {
				throw new NotFoundException(
					`Category with ID ${id} not found`
				);
			}
			if (
				requestor === Requestor.PUBLISHER &&
				category.publishStatus !== PublishStatus.PUBLISHED
			) {
                
				throw new ForbiddenException(
					"Invalid credentials"
				);
			}
			return category;
		} catch (error) {
			if (
				error.status === HttpStatus.FORBIDDEN ||
				error.status === HttpStatus.NOT_FOUND
			) {
				throw error;
			}

			throw new InternalServerErrorException("Failed to fetch category");
		}
	}

	async getAllCategories(
		requestor: Requestor = Requestor.PUBLISHER,
		sorting: SoringCategories, 
		pagination: Pagination
	): Promise<{ pagination: any, categories: Category[] }> {
		try {
			const attributes =
				requestor === Requestor.ADMIN
					? undefined
					: { exclude: ["publishStatus"] };
	
			const whereClause =
				requestor === Requestor.PUBLISHER
					? { publishStatus: PublishStatus.PUBLISHED }
					: {};
	
			const totalCategories = await this.categoryModel.count({
				where: whereClause,
			});
	
			const categories = await this.categoryModel.findAll({
				attributes,
				where: whereClause,
				order: [[sorting.sortBy, sorting.sortDirection.toUpperCase()]], 
				limit: pagination.perPage, 
				offset: (pagination.page - 1) * pagination.perPage, 
			});
	
			const paginationResult = {
				count: categories.length, 
				total: totalCategories, 
				perPage: pagination.perPage, 
				currentPage: pagination.page, 
				totalPages: Math.ceil(totalCategories / pagination.perPage), 
			};
	
			return {
				pagination: paginationResult, 
				categories,
			};

		} catch (error) {
			throw new InternalServerErrorException(
				"An error occurred while retrieving categories",
			);
		}
	}

	async updateCategory(
		id: number,
		updateCategoryDto: CreateCategoryDto,
	): Promise<Category> {

		try {

			const category = await this.getCategoryById(id);
			if (!category) {
				throw new NotFoundException(`Category with ID ${id} not found`);
			}
			return category.update(updateCategoryDto);

		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }

			throw new InternalServerErrorException(
				`An error occurred while updating category. ${error}`,
			);
		}


	}

	async deleteCategory(id: number): Promise<void> {
		try {

			const category = await this.getCategoryById(id);
			if (!category) {
				throw new NotFoundException(`Category with ID ${id} not found`);
			}
			await category.destroy();

		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }
			throw new InternalServerErrorException(
				`An error occurred while deleting category. ${error}`, 
			);
		}
	}
}
