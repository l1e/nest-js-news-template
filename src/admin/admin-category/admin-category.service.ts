import { Requestor } from "./../admin-article/model/article.model";
import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Article } from "../admin-article/model/article.model";
import { Category, PublishStatus } from "./model/category.model";
import { CreateCategoryDto } from "./dto/category.create.dto";

@Injectable()
export class AdminCategoryService {
	constructor(
		@InjectModel(Category)
		private readonly categoryModel: typeof Category,
	) {}

	async createCategory(
		createCategoryDto: CreateCategoryDto,
	): Promise<Category> {
		return this.categoryModel.create(createCategoryDto);
	}

	async getCategoryById(
		id: number,
		requestor: Requestor = Requestor.PUBLISHER,
	): Promise<Category> {
		try {
			const category = await this.categoryModel.findByPk(id, {
				include: [Article],
			});
			if (!category) {
				throw new HttpException(
					`Category with ID ${id} not found`,
					HttpStatus.NOT_FOUND,
				);
			}
			if (
				requestor === Requestor.PUBLISHER &&
				category.publishStatus !== PublishStatus.PUBLISHED
			) {
				throw new HttpException(
					"Invalid credentials",
					HttpStatus.FORBIDDEN,
				);
			}
			return category;
		} catch (error) {
			throw new InternalServerErrorException("Failed to fetch category");
		}
	}

	async getAllCategories(
		requestor: Requestor = Requestor.PUBLISHER,
	): Promise<Category[]> {
		try {
			const attributes =
				requestor === Requestor.ADMIN
					? undefined
					: { exclude: ["publishStatus"] };

			const whereClause =
				requestor === Requestor.PUBLISHER
					? { publishStatus: PublishStatus.PUBLISHED }
					: {};

			return await this.categoryModel.findAll({
				attributes,
				where: whereClause,
			});
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
		const category = await this.getCategoryById(id);
		return category.update(updateCategoryDto);
	}

	async deleteCategory(id: number): Promise<void> {
		const category = await this.getCategoryById(id);
		await category.destroy();
	}
}
