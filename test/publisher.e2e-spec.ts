import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import * as request from "supertest";
import { AppModule } from "../src/app.module"; // Adjust the path as needed
import { Category } from "./../src/admin/admin-category/model/category.model";
import {
	Article,
	Requestor,
} from "./../src/admin/admin-article/model/article.model";
import {
	UserRole,
	UserStatus,
} from "./../src/admin/admin-user/model/user.model";
import { CreateUserDto } from "./../src/admin/admin-user/dto/create-user.dto";
import {
	mockCreateArticleAsPublisher,
	userLogIn,
	userRegister,
} from "./test.mock.e2e.data";
import { CreateArticleDto } from "./../src/publisher/publisher-article/dto/create.publisher-article.dto";
import { title } from "node:process";
import { UpdateArticleDto } from "./../src/admin/admin-article/dto/update.article.dto";

describe("Publisher Endpoints (e2e)", () => {
	let app: INestApplication;
	let categories: Category[];
	let articles: Article[];
	let publisherToken: string;
	let publishedArticle: Article;
	let publishedArticleUpdated: Article;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect({ success: true, status_code: 200, data: "Hello World!" });
	});

	it("/cms-category (GET) - should return all categories and validate quantity", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-category")
			.expect(200);

		expect(response.body.data.categories.length).toBeGreaterThan(0);
		categories = response.body.data.categories;
		expect(response.body).toEqual({
			success: true,
			status_code: 200,
			data: expect.any(Object),
		});
	});

	it("should register a new user and return a JWT token", async () => {
		const createUserDto: CreateUserDto = userRegister;

		const response = await request(app.getHttpServer())
			.post("/publisher-auth/register")
			.send(createUserDto)
			.expect(HttpStatus.CREATED)
			.expect((response: request.Response) => {
				publisherToken = response.body.data.token;
			});

		expect(response.body.status_code).toEqual(201);
		expect(response.body.success).toEqual(true);
		expect(response.body.data.token).toBeDefined();
	});

	it("should return the authenticated publisher's information with usage off the new register data", async () => {

		// Create a valid JWT token for the test
		const token = sign(
			{ email: userRegister.email },
			process.env.SECRET_KEY,
			{ expiresIn: "7d" },
		);

		const response = await request(app.getHttpServer())
			.get("/publisher-me/me")
			.set("Authorization", `Bearer ${token}`)
			.expect(HttpStatus.OK);

		expect(response.body).toEqual({
			data: expect.objectContaining({
				email: userRegister.email,
				firstName: userRegister.firstName,
				lastName: userRegister.lastName,
			}),
			status_code: 200,
			success: true,
		});
	});

	describe("/publisher-me/me (GET)", () => {

		it("should return the authenticated publisher's information", async () => {
			const response = await request(app.getHttpServer())
				.get("/publisher-me/me")
				.set("Authorization", `Bearer ${publisherToken}`)
				.expect(HttpStatus.OK);
			expect(response.body).toEqual({
				data: expect.objectContaining({
					email: userRegister.email,
					firstName: userRegister.firstName,
					lastName: userRegister.lastName,
				}),
				status_code: 200,
				success: true,
			});

		});

		it("should return 401 Unauthorized if no token is provided", () => {

			return request(app.getHttpServer())
				.get("/publisher-me/me")
				.expect(HttpStatus.UNAUTHORIZED);

		});

		it("should return 404 if publisher information is not found", async () => {
			const token = sign(
				{ email: "nonexistent@example.com" },
				process.env.SECRET_KEY,
				{ expiresIn: "7d" },
			);

			const response = await request(app.getHttpServer())
				.get("/publisher-me/me")
				.set("Authorization", `Bearer ${token}`)
				.expect(HttpStatus.CONFLICT);

		});
	});
	describe("/publisher-article/ (GET,PUT,POST,DELETE)", () => {
		it("/publisher-article (POST) - should create a new article", async () => {
			const createArticleDto: CreateArticleDto = {
				...mockCreateArticleAsPublisher,
				categoryId: categories[0].id,
			};

			const response = await request(app.getHttpServer())
				.post("/publisher-article")
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(createArticleDto)
				.expect(HttpStatus.CREATED);

			publishedArticle = response.body.data; // Store the article ID for further tests
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.title).toEqual(createArticleDto.title);

		});

		it("/publisher-article/:id (GET) - should get an article by ID", async () => {

			const response = await request(app.getHttpServer())
				.get(`/publisher-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.expect(HttpStatus.OK);

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
		it("/publisher-article/:id (PUT) - should update an article", async () => {

			const updateArticleDto: UpdateArticleDto = {
				title: "Updated Article Title",
				description: "Updated content of the article",
				// Add other necessary fields
			};

			const response = await request(app.getHttpServer())
				.put(`/publisher-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.send(updateArticleDto)
				.expect(HttpStatus.OK);

			publishedArticleUpdated = response.body.data;
			expect(response.body.data.id).toEqual(publishedArticle.id);
			expect(response.body.data.title).toEqual(updateArticleDto.title);
			expect(response.body.data.description).toEqual(
				updateArticleDto.description,
			);

		});
		it("/publisher-article (GET) - should get all articles of the publisher", async () => {

			const response = await request(app.getHttpServer())
				.get("/publisher-article")
				.set("Authorization", `Bearer ${publisherToken}`)
				.expect(HttpStatus.OK);

			expect(response.body.data.articles.length).toBeGreaterThan(0);
			expect(response.body.status_code).toEqual(200);
			expect(response.body.success).toEqual(true);

			const firstArticle = response.body.data.articles[0];
			expect(firstArticle).toHaveProperty("id");
			expect(firstArticle).toHaveProperty("title");
			expect(firstArticle).toHaveProperty("description");

			expect(firstArticle.id).toEqual(publishedArticle.id);
			expect(firstArticle.title).toEqual(publishedArticleUpdated.title);
			expect(firstArticle.description).toEqual(
				publishedArticleUpdated.description,
			);

		});
		it("/publisher-article/:id (DELETE) - should delete an article", async () => {
			const response = await request(app.getHttpServer())
				.delete(`/publisher-article/${publishedArticle.id}`)
				.set("Authorization", `Bearer ${publisherToken}`)
				.expect(HttpStatus.OK);

			expect(response.body.status_code).toEqual(200);
			expect(response.body.success).toEqual(true);
		});
	});
});
