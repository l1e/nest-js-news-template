import { CreateArticleDto } from "../src/admin/admin-article/dto/article.create.dto";
import { CreateCategoryDto } from "../src/admin/admin-category/dto/category.create.dto";
import { Category, PublishStatus } from "../src/admin/admin-category/model/category.model";
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
export const categoryAll: { pagination: any, categories: any } ={
	  pagination: {
		count: 2,
		total: 5,
		perPage: 2,
		currentPage: 1,
		totalPages: 3
	  },
	  categories: [
		{
		  id: 1,
		  name: "Military",
		  description: "Articles covering the latest advancements in military robotics and their use in warfare.",
		  createdAt: "2024-10-19T23:31:14.000Z",
		  updatedAt: "2024-10-19T23:31:14.000Z"
		},
		{
		  id: 2,
		  name: "AI and Robot",
		  description: "Articles focusing on artificial intelligence and robotics integration in various industries.",
		  createdAt: "2024-10-19T23:31:14.000Z",
		  updatedAt: "2024-10-19T23:31:14.000Z"
		}
	  ]
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

export const articlesAll: { pagination: any, articles: any } = {
	pagination: {
	  count: 3,
	  total: 14,
	  perPage: 3,
	  currentPage: 1,
	  totalPages: 5
	},
	articles: [
	  {
		"id": 8,
		"title": "Unmanned Ground Vehicles: The Future of Infantry Support",
		"description": "\n\t\t\t\t\tUnmanned Ground Vehicles (UGVs) are transforming the future of infantry support in military operations. These robotic systems, designed to operate on land, are equipped with a range of capabilities from carrying heavy equipment to engaging in combat. UGVs have the potential to significantly enhance the effectiveness of ground troops by taking on roles traditionally filled by human soldiers, such as reconnaissance, logistics, and fire support.\n\n\t\t\t\t\tOne of the key advantages of UGVs is their ability to operate in dangerous environments, such as minefields or areas with chemical, biological, or nuclear contamination. UGVs equipped with advanced sensors can scout ahead, detect threats, and even neutralize them without risking human lives. In combat situations, UGVs can also provide direct fire support, using mounted weapons to engage the enemy while soldiers maintain a safe distance.\n\n\t\t\t\t\tThese vehicles are also capable of carrying heavy loads, reducing the burden on soldiers during long missions. Some UGVs are designed to carry medical supplies and evacuate injured personnel, making them indispensable in providing logistical support on the battlefield. As AI and robotics technology advances, UGVs are expected to become more autonomous, capable of making decisions without human intervention, and performing complex tasks in real-time.\n\n\t\t\t\t\tHowever, the integration of UGVs into military operations presents challenges, such as ensuring that these vehicles can communicate reliably in all environments. There is also concern over the potential for these autonomous systems to malfunction in combat situations, leading to unintended consequences.\n\t\t\t\t",
		"publishStatus": "draft",
		"validationStatus": "approved",
		"requestor": "publisher",
		"articleOfTheDay": "no",
		"articleSpecial": "no",
		"views": 0,
		"categoryId": 2,
		"creatorId": 1,
		"createdAt": "2024-10-19T23:31:15.000Z",
		"updatedAt": "2024-10-19T23:31:15.000Z",
		"category": {
		  "id": 2,
		  "name": "AI and Robot",
		  "description": "Articles focusing on artificial intelligence and robotics integration in various industries.",
		  "createdAt": "2024-10-19T23:31:14.000Z",
		  "updatedAt": "2024-10-19T23:31:14.000Z"
		},
		"media": [
		  {
			"id": 8,
			"fileName": "1*ynxCgSa2MP8y5p2R3DNr6Q.png",
			"articleId": 8,
			"type": "image",
			"src": "https://miro.medium.com/v2/resize:fit:1000/1*ynxCgSa2MP8y5p2R3DNr6Q.png",
			"order": 1,
			"isPhysicallyExist": "yes",
			"publishStatus": "draft",
			"createdAt": "2024-10-19T23:31:16.000Z",
			"updatedAt": "2024-10-19T23:31:16.000Z"
		  }
		]
	  },
	  {
		"id": 7,
		"title": "Robot Medics: How Robotics is Transforming Battlefield Medicine",
		"description": "\n\t\t\t\t\tRobotics is not only being used for combat but also for saving lives on the battlefield. The development of robotic medics and automated systems is transforming how soldiers receive medical care in war zones. These robots can be deployed in high-risk environments where human medics would be endangered, providing first aid, transporting the wounded, and even performing complex surgeries remotely.\n\n\t\t\t\t\tOne significant advantage of robotic medics is their ability to assess and stabilize soldiers under fire. Equipped with advanced AI, these robots can monitor vital signs, administer basic care, and alert human doctors who can guide the robot to perform more complex medical procedures from a distance. These robots can navigate harsh terrain, identify injured soldiers, and perform triage to prioritize care based on the severity of injuries.\n\n\t\t\t\t\tThere are already prototypes of autonomous systems that can carry injured personnel out of dangerous zones, minimizing the risk to human medics. This technology is particularly valuable in scenarios where the battlefield is difficult to access due to active combat or environmental hazards like radiation or chemical weapons.\n\n\t\t\t\t\tWhile promising, the use of robotic medics also poses challenges, including the need for reliable communication networks to ensure smooth coordination between robots and human operators. Additionally, ensuring that these systems can operate independently in the event of communication failure is crucial. As the technology advances, robot medics are expected to become a vital part of future military operations.\n\t\t\t\t",
		"publishStatus": "published",
		"validationStatus": "approved",
		"requestor": "publisher",
		"articleOfTheDay": "no",
		"articleSpecial": "no",
		"views": 1,
		"categoryId": 4,
		"creatorId": 1,
		"createdAt": "2024-10-19T23:31:15.000Z",
		"updatedAt": "2024-10-19T23:36:04.000Z",
		"category": {
		  "id": 4,
		  "name": "Med and Robot",
		  "description": "Articles about the use of robots in battlefield medicine and healthcare in warzones.",
		  "createdAt": "2024-10-19T23:31:14.000Z",
		  "updatedAt": "2024-10-19T23:31:14.000Z"
		},
		"media": [
		  {
			"id": 7,
			"fileName": "rs-202131-maxresdefault.jpg?w=1581&h=1054&crop=1.jpg",
			"articleId": 7,
			"type": "image",
			"src": "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-202131-maxresdefault.jpg?w=1581&h=1054&crop=1",
			"order": 1,
			"isPhysicallyExist": "yes",
			"publishStatus": "draft",
			"createdAt": "2024-10-19T23:31:16.000Z",
			"updatedAt": "2024-10-19T23:31:16.000Z"
		  }
		]
	  },
	  {
		"id": 3,
		"title": "Autonomous Tanks: Game Changer in Ground Combat",
		"description": "\n\t\t\t\t\tThe concept of autonomous tanks has shifted from the realm of science fiction to reality, thanks to rapid advancements in robotics and AI. In many ways, these unmanned combat vehicles represent the future of ground warfare. Autonomous tanks, equipped with advanced sensors, AI algorithms, and weaponry, are capable of navigating complex environments without direct human control. This allows for safer operations in dangerous combat zones and improves the effectiveness of ground forces.\n\n\t\t\t\t\tOne of the most significant advantages of autonomous tanks is their ability to process data in real time, enabling them to make decisions such as identifying and engaging targets without waiting for human commands. This rapid decision-making process is especially critical in fast-paced combat scenarios where split-second actions can mean the difference between success and failure. These tanks can also operate in extreme conditions, such as extreme temperatures or radioactive environments, where human presence would be dangerous or impossible.\n\n\t\t\t\t\tHowever, the deployment of autonomous tanks raises important questions about control, responsibility, and ethics. How much autonomy should these machines have in making life-or-death decisions? Can they distinguish between combatants and civilians? These are pressing concerns that need to be addressed as military forces worldwide continue to develop and deploy autonomous vehicles on the battlefield.\n\t\t\t\t",
		"publishStatus": "published",
		"validationStatus": "approved",
		"requestor": "publisher",
		"articleOfTheDay": "no",
		"articleSpecial": "no",
		"views": 120,
		"categoryId": 1,
		"creatorId": 2,
		"createdAt": "2024-10-19T23:31:15.000Z",
		"updatedAt": "2024-10-19T23:31:15.000Z",
		"category": {
		  "id": 1,
		  "name": "Military",
		  "description": "Articles covering the latest advancements in military robotics and their use in warfare.",
		  "createdAt": "2024-10-19T23:31:14.000Z",
		  "updatedAt": "2024-10-19T23:31:14.000Z"
		},
		"media": [
		  {
			"id": 3,
			"fileName": "photo-1667986292516-f27450ae75a9.jpg",
			"articleId": 3,
			"type": "image",
			"src": "https://images.unsplash.com/photo-1667986292516-f27450ae75a9?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			"order": 1,
			"isPhysicallyExist": "yes",
			"publishStatus": "draft",
			"createdAt": "2024-10-19T23:31:16.000Z",
			"updatedAt": "2024-10-19T23:31:16.000Z"
		  }
		]
	  }
	]
  }

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
