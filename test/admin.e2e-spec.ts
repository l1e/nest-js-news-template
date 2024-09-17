import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { sign } from "jsonwebtoken";
import { AppModule } from "../src/app.module";
import { Category } from "./../src/admin/admin-category/model/category.model";
import { Article } from "./../src/admin/admin-article/model/article.model";
import {
	adminLogIn,
	adminRegister,
	createCategoryAsAdminDto,
	mockCreateArticleAsAdmin,
	updateCategoryAsAdminDto,
	userRegister,
} from "./test.mock.e2e.data";
import { CreateCategoryDto } from "./../src/admin/admin-category/dto/category.create.dto";
import { CreateArticleDto } from "src/admin/admin-article/dto/article.create.dto";
import { UpdateArticleDto } from "src/admin/admin-article/dto/update.article.dto";

describe("Admin (e2e)", () => {
	let app: INestApplication;
	let categories: Category[];
	let categoryCreated: Category;
	let categoryUpdated: Category;
	let articles: Article[];
	let adminToken: string;

	let publishedArticle: Article;
	let publishedArticleUpdated: Article;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect({ success: true, status_code: 200, data: "Hello World!" });
	});
	describe("/admin-auth ", () => {
		it("Should return token that we get from authentication.", async () => {
			// Create a valid JWT token for the test

			const response = await request(app.getHttpServer())
				.post("/admin-auth/login")
				.send(adminLogIn)
				// .set("Authorization", `Bearer ${token}`)
				.expect(HttpStatus.CREATED)
				.expect((response: request.Response) => {
					adminToken = response.body.data.token;
				});

			// console.log(
			// 	"Should return toket that we get from authentication. :",
			// 	response,
			// );

			expect(response.body.status_code).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data.token).toBeDefined();
		});

		it("Should return registration message.", async () => {
			const response = await request(app.getHttpServer())
				.post("/admin-auth/register")
				.send(adminRegister)
				// .set("Authorization", `Bearer ${token}`)
				.expect(HttpStatus.CREATED);
			// .expect((response: request.Response) => {
			// 	// adminToken = response.body.data.token;
			// });

			// console.log(
			// 	"Should return toket that we get from response.body:",
			// 	response.body,
			// );

			expect(response.body.status_code).toEqual(201);
			expect(response.body.success).toEqual(true);
			expect(response.body.data).toEqual(
				"Your email account with that type admin was created. Write to an administrative about account activation.",
			);
		});
	});
	describe("/admin-category (GET,PUT,POST,DELETE)", () => {
		// console.log("my token START:");
		// console.log("my token adminToken:", adminToken);
		// console.log("my token END:");

		it("/admin-category (GET) - should return all categories and validate quantity", async () => {
			// console.log("Admin Token: ", adminToken);
			const response = await request(app.getHttpServer())
				.get("/admin-category")
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(200);

			// console.log(
			// 	"/admin-category (GET) - should return all categories and validate quantity response.body.data:",
			// 	response.body.data,
			// );
			// console.log(
			// 	"/admin-category (GET) - should return all categories and validate quantity response.body.data ${adminToken }: ",
			// 	adminToken,
			// );
			expect(response.body.data.length).toBeGreaterThan(0);
			categories = response.body.data;
			expect(response.body).toEqual({
				success: true,
				status_code: 200,
				data: expect.any(Array), // Ensure data is an array
			});
		});

		it("/admin-category (POST) - should create a category", async () => {
			const createCategoryDto: CreateCategoryDto =
				createCategoryAsAdminDto;

			const response = await request(app.getHttpServer())
				.post("/admin-category")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(createCategoryDto)
				.expect(HttpStatus.CREATED)
				.expect((response: request.Response) => {
					categoryCreated = response.body.data;
				});

			// console.log(
			// 	"/admin-category (POST) - should create a category response.body.data:",
			// 	response.body.data,
			// );
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.name).toEqual(createCategoryDto.name);
		});

		it("/admin-category/:id (GET) - should get a created category by ID", async () => {
			// Now, retrieve the category by its ID
			const response = await request(app.getHttpServer())
				.get(`/admin-category/${categoryCreated.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);

			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.name).toEqual(
				createCategoryAsAdminDto.name,
			);
		});

		it("/admin-category (PUT) - should update a category", async () => {
			const updateCategoryDto: CreateCategoryDto =
				updateCategoryAsAdminDto;

			const response = await request(app.getHttpServer())
				.put(`/admin-category/${categoryCreated.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send(updateCategoryDto)
				.expect(HttpStatus.OK)
				.expect((response: request.Response) => {
					categoryUpdated = response.body.data;
				});

			// console.log(
			// 	"/admin-category (PUT) - should update a category:",
			// 	response.body.data,
			// );
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.name).toEqual(updateCategoryDto.name);
			expect(response.body.data.description).toEqual(
				updateCategoryDto.description,
			);
		});

		it("/admin-category/:id (DELETE) - should delete a category", async () => {
			// Now, delete the category
			const response = await request(app.getHttpServer())
				.delete(`/admin-category/${categoryCreated.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);
			// console.log("should delete a category response:", response);
		});

		it("/admin-category/:id (GET) - category does not exsist", async () => {
			const response = await request(app.getHttpServer())
				.get(`/admin-category/${categoryCreated.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.NOT_FOUND);
			// console.log("should category does not exsist response:", response);
		});
	});

	describe("/admin-article (GET,PUT,POST,DELETE)", () => {
		it("/admin-article (GET) - should get all articles of the website", async () => {
			const response = await request(app.getHttpServer())
				.get("/admin-article?sortBy=createdAt&sortDirection=desc")
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);

			expect(response.body.data.length).toBeGreaterThan(0);
			expect(response.body.status_code).toEqual(200);
			expect(response.body.success).toEqual(true);

			const firstArticle = response.body.data[0];

			// console.log("response.body.data firstArticle:", firstArticle);
			// console.log(
			// 	"response.body.data publishedArticle:",
			// 	publishedArticle,
			// );

			expect(firstArticle).toHaveProperty("id");
			expect(firstArticle).toHaveProperty("title");
			expect(firstArticle).toHaveProperty("description");

			// expect(firstArticle.id).toEqual(publishedArticle.id);
			// expect(firstArticle.title).toEqual(publishedArticleUpdated.title);
			// expect(firstArticle.description).toEqual(
			// 	publishedArticleUpdated.description,
			// );
		});
		it("/admin-article (POST) - should create a new article", async () => {
			const createArticleDto: CreateArticleDto = {
				...mockCreateArticleAsAdmin,
				categoryId: categories[0].id,
			};

			// console.log(
			// 	"admin-article (POST) createArticleDto:",
			// 	createArticleDto,
			// );
			// console.log("admin-article (POST) adminToken:", adminToken);
			const response = await request(app.getHttpServer())
				.post("/admin-article")
				.set("Authorization", `Bearer ${adminToken}`)
				.send(createArticleDto)
				.expect(HttpStatus.CREATED);

			publishedArticle = response.body.data; // Store the article ID for further tests
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.title).toEqual(createArticleDto.title);
			// console.log("Created Article ID:", publishedArticle.id);
			// console.log("Created Article categories:", categories);
		});

		it("/admin-article/:id (GET) - should get an article by ID", async () => {
			const response = await request(app.getHttpServer())
				.get(`/admin-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);

			// console.log(
			// 	"should get an article by ID response.body:",
			// 	response.body,
			// );
			expect(response.body.data.id).toEqual(publishedArticle.id);
			expect(response.body.data.title).toBeDefined();
			expect(response.body).toEqual({
				data: expect.objectContaining({
					id: publishedArticle.id,
					title: publishedArticle.title,
					description: publishedArticle.description,
				}),
				status_code: 200,
				success: true,
			});
		});

		it("/admin-article/:id (PUT) - should update an article", async () => {
			const updateArticleDto: UpdateArticleDto = {
				title: "Updated Magic Article Title",
				description: "Updated Magic content of the article",
				// Add other necessary fields
			};

			const response = await request(app.getHttpServer())
				.put(`/admin-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send(updateArticleDto)
				.expect(HttpStatus.OK);

			publishedArticleUpdated = response.body.data;
			expect(response.body.data.id).toEqual(publishedArticle.id);
			expect(response.body.data.title).toEqual(updateArticleDto.title);
			expect(response.body.data.description).toEqual(
				updateArticleDto.description,
			);
		});

		it("/admin-article (GET) - should get all articles of the publisher", async () => {
			const response = await request(app.getHttpServer())
				.get("/admin-article")
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);

			expect(response.body.data.length).toBeGreaterThan(0);
			expect(response.body.status_code).toEqual(200);
			expect(response.body.success).toEqual(true);

			const firstArticle = response.body.data[0];

			// console.log("response.body.data firstArticle:", firstArticle);
			// console.log(
			// 	"response.body.data publishedArticle:",
			// 	publishedArticle,
			// );

			expect(firstArticle).toHaveProperty("id");
			expect(firstArticle).toHaveProperty("title");
			expect(firstArticle).toHaveProperty("description");

			expect(firstArticle.id).toEqual(publishedArticle.id);
			expect(firstArticle.title).toEqual(publishedArticleUpdated.title);
			expect(firstArticle.description).toEqual(
				publishedArticleUpdated.description,
			);
		});

		it("/admin-article/:id (DELETE) - should delete an article", async () => {
			const response = await request(app.getHttpServer())
				.delete(`/admin-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(HttpStatus.OK);

			// console.log(
			// 	"should delete an article response.body:",
			// 	response.body,
			// );
			expect(response.body.status_code).toEqual(200);
			expect(response.body.success).toEqual(true);
		});
	});
});
