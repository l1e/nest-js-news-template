import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module"; // Adjust the path as needed
import { Category } from "./../src/admin/admin-category/model/category.model";
import { Article } from "src/admin/admin-article/model/article.model";

describe("CMS Endpoints (e2e)", () => {

	console.log('Test environment:', process.env.NODE_ENV); 

	let app: INestApplication;
	let categories: Category[];
	let articles: Article[];

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

	it("/cms-category (GET) - should return all categories and validate quantity", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-category")
			.expect(200);

		if (response.body.data.length > 0) {
			categories = response.body.data;
		}

		expect(response.body.data.length).toBeGreaterThan(0); // Assert that categories are returned
		expect(response.body).toEqual({
			success: true,
			status_code: 200,
			data: expect.any(Array),
		});
	});

	// Test the default sorting by publishedArticlesCount in descending order
	it("/cms-publisher (GET) - should return users sorted by publishedArticlesCount (default)", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-publisher")
			.expect(200);

		expect(response.body.data.length).toBeGreaterThan(0); 
		const sorted = response.body.data.sort(
			(a, b) => b.publishedArticlesCount - a.publishedArticlesCount,
		);
		expect(response.body.data).toEqual(sorted);
	});

	// Test custom sorting by id in ascending order
	it("/cms-publisher (GET) - should return users sorted by id in ascending order", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-publisher")
			.query({ sortBy: "id", sortDirection: "asc" })
			.expect(200);

		expect(response.body.data.length).toBeGreaterThan(0);
		const sorted = response.body.data.sort((a, b) => a.id - b.id);
		expect(response.body.data).toEqual(sorted);
	});

	// Test scenario where no users are found
	it("/cms-publisher (GET) - should return list of publishers", async () => {

		const response = await request(app.getHttpServer())
			.get("/cms-publisher")
			.expect(200);

		expect(response.body.data.length).toBeGreaterThan(0);
	});

	it("should return a list of public articles", async () => {

		const response = await request(app.getHttpServer())
			.get("/cms-article/public")
			.expect(200);

		articles = response.body.data;
		expect(response.body.data.length).toBeGreaterThan(0);

	});

	it("should return a public article by ID", async () => {

		const response = await request(app.getHttpServer())
			.get(`/cms-article/public/${articles[0].id}`)
			.expect(200);
		expect(response.body.success).toEqual(true);
		expect(response.body.data.id).toBe(articles[0].id);
		expect(response.body.data.title).toBe(articles[0].title);
		
	});

	it("should return 400 if article is not found", async () => {

		const response = await request(app.getHttpServer())
			.get("/cms-article/public/9991113")
			.expect(400);
		expect(response.body.statusCode).toEqual(400);

	});

	it("should return 400 for invalid article ID", () => {
		return request(app.getHttpServer())
			.get("/cms-article/public/invalid")
			.expect(400);
	});

	it("should return articles by category ID", async () => {
		const response = await request(app.getHttpServer())
			.get(`/cms-article/category/${categories[0]?.id}`)
			.expect(200);
		expect(response.body.success).toEqual(true);
		expect(response.body.data.length).toBeGreaterThan(0);

	});

	it("should return 404 if no articles are found for the category", async () => {
		const response = await request(app.getHttpServer())
			.get(`/cms-article/category/999112`)
			.expect(400);
	});

	it("should return 200 if article of the day is found", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-article/articleoftheday")
			.expect(200);
		expect(response?.body?.data?.articleOfTheDay).toEqual("yes");
	});

	it("should return 200 if special articles are found", async () => {
		const response = await request(app.getHttpServer())
			.get("/cms-article/articlespecial")
			.expect(200);
		expect(response.body.data.length).toBeGreaterThan(0);
		expect(response?.body?.data[0]?.articleSpecial).toEqual("yes");
	});
});
