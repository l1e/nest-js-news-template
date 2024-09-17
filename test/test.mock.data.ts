import { CreateArticleDto } from "../src/admin/admin-article/dto/article.create.dto";
import { CreateCategoryDto } from "../src/admin/admin-category/dto/category.create.dto";
import { PublishStatus } from "../src/admin/admin-category/model/category.model";
import {
	ArticleOfTheDay,
	ArticleSpecial,
	Requestor,
	ValidationStatus,
} from "../src/admin/admin-article/model/article.model";
import { UpdateArticleDto } from "../src/admin/admin-article/dto/update.article.dto";

export const categoryMockDataNew: CreateCategoryDto = {
	name: "Test Category",
	description: "test",
	publishStatus: PublishStatus.PUBLISHED,
};

export const categoryMockDataCreated: CreateCategoryDto = {
	id: 1,
	name: "Test Category",
	description: "test",
	publishStatus: PublishStatus.PUBLISHED,
};

export const mockCreateArticleDtoNew: CreateArticleDto = {
	title: "Test Article",
	description: "This is a test description",
	publishStatus: PublishStatus.DRAFT,
	validationStatus: ValidationStatus.PENDING,
	articleOfTheDay: ArticleOfTheDay.NO,
	articleSpecial: ArticleSpecial.NO,
	views: 0,
	categoryId: 1,
	media: [1, 2],
	creatorId: 1,
	creatorEmail: "test.creator@dev.com",
	requestor: Requestor.ADMIN,
};

export const mockCreateArticleDtoCreated: CreateArticleDto = {
	id: 1,
	title: "Test Article",
	description: "This is a test description",
	publishStatus: PublishStatus.DRAFT,
	validationStatus: ValidationStatus.PENDING,
	articleOfTheDay: ArticleOfTheDay.NO,
	articleSpecial: ArticleSpecial.NO,
	views: 0,
	categoryId: 1,
	media: [1, 2],
	creatorId: 1,
	creatorEmail: "test.creator@dev.com",
	requestor: Requestor.ADMIN,
};

export const mockUser = {
	id: 1,
	email: "test.creator@dev.com",
};

export const mockUpdateArticleDto: UpdateArticleDto = {
	title: "Updated Title",
	description: "Updated description",
	publishStatus: PublishStatus.PUBLISHED,
	validationStatus: ValidationStatus.APPROVED,
	articleOfTheDay: ArticleOfTheDay.YES,
	articleSpecial: ArticleSpecial.YES,
	views: 10,
	categoryId: 2,
	media: [1, 2],
	requestor: Requestor.ADMIN,
	creatorEmail: "test.creator@dev.com",
};

export const updatedArticle = {
	id: 1,
	title: "Updated Title",
	description: "Updated description",
	publishStatus: PublishStatus.PUBLISHED,
	validationStatus: ValidationStatus.APPROVED,
	articleOfTheDay: ArticleOfTheDay.YES,
	articleSpecial: ArticleSpecial.YES,
	views: 10,
	categoryId: 2,
	creatorId: 1,
	requestor: Requestor.ADMIN,
	media: [],
	$set: jest.fn(),
	update: jest.fn(),
	reload: jest.fn(),
};

export const mockMediaItems = [{ id: 1 }, { id: 2 }];
