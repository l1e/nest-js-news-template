import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserRole, UserStatus } from "./model/user.model";
import { Payload } from "./../../utils/types/payload.dto";
import { Op } from "sequelize";
import { AdminUserLoginDTO } from "./dto/create-user.login.dto";
import { Article, Requestor } from "../admin-article/model/article.model";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class AdminUserService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {}

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		let exsistingUser = await this.findByEmail(createUserDto, false);

		if (exsistingUser) {
			throw new HttpException(
				"You already use that email.",
				HttpStatus.NOT_FOUND,
			);
		}
		let usedNikcname = await this.userModel.findOne({
			where: {
				nickname: createUserDto.nickname
			}
		})

		if (usedNikcname) {
			throw new HttpException(
				"You already use that nickname.",
				HttpStatus.NOT_FOUND,
			);
		}

		const validRoles = ['admin', 'publisher'];
		if (!validRoles.includes(createUserDto.role)) {
			throw new HttpException('Invalid role provided.', HttpStatus.BAD_REQUEST);
		}

		let user

		try {
			user = await this.userModel.create({
				...createUserDto,
			});
		} catch (error) {
			console.error('Sequelize validation error:', error);
			throw new HttpException(
			  "Validation error: " + error.parent.sqlMessage,
			  HttpStatus.BAD_REQUEST,
			);
		}

		const userSanitized = await this.userModel.findByPk(user.id, {
			attributes: { exclude: ["password"] },
		});

		return userSanitized;
	}

	async findAllUsers(
		requestor?: Requestor,
		sortDirection: "asc" | "desc" = "desc",
		sortBy: "publishedArticlesCount" | "id" = "publishedArticlesCount",
	): Promise<User[]> {
		const queryOptions: any = {
			where: {},
			attributes: {
				exclude: [],
				include: [
					[
						Sequelize.literal(
							"(SELECT COUNT(*) FROM Articles WHERE Articles.creatorId = User.id AND Articles.publishStatus = 'published')",
						),
						"publishedArticlesCount",
					],
				],
			},
			include: [
				{
					model: Article,
					as: "articles",
					attributes: [],
					where: {
						publishStatus: "published", // Only count published articles
					},
					required: false, // Use LEFT JOIN
				},
			],
			group: ["User.id"],
			having: Sequelize.literal("publishedArticlesCount > 0"),
			order: [
				[
					Sequelize.literal(
						sortBy === "publishedArticlesCount"
							? "publishedArticlesCount"
							: "User.id",
					),
					sortDirection,
				],
			],
		};

		if (requestor === Requestor.CMS) {
			queryOptions.where = {
				status: UserStatus.ACTIVE,
			};
			queryOptions.attributes.exclude = [
				// 'firstName',
				// 'lastName',
				"email",
				"password",
				"status",
				"role",
				"createdAt",
				"updatedAt",
			];
		}

		return this.userModel.findAll(queryOptions);
	}

	async findUserById(id: string): Promise<User> {
		try {
			const user = await this.userModel.findByPk(id);

			if (!user) {
				throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
			}

			return user;
		} catch (error) {
			throw new HttpException(
				`Failed to fetch user`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateUser(id: string, updateData: Partial<User>): Promise<User> {
		const [affectedCount] = await this.userModel.update(updateData, {
			where: { id },
		});

		if (affectedCount === 0) {
			throw new Error("User not found or no changes made");
		}

		const updatedUser = await this.userModel.findByPk(id, {
			attributes: { exclude: ["password"] },
		});
		if (!updatedUser) {
			throw new Error("User not found");
		}

		return updatedUser;
	}

	deleteUser(id: string): Promise<number> {
		return this.userModel.destroy({ where: { id } });
	}

	async findByPayload(payload: Payload): Promise<User | null> {
		const { email } = payload;

		return await this.userModel.findOne({ where: { email } });
	}

	async checkLogInCredentials(
		adminUserLoginDTO: AdminUserLoginDTO,
	): Promise<User | Partial<User>> {
		const user = await this.findByEmail(adminUserLoginDTO);

		if (!user) {
			throw new HttpException(
				"Invalid credentials",
				HttpStatus.BAD_REQUEST,
			);
		}

		const hashedInputPassword = bcrypt.hashSync(
			adminUserLoginDTO.password,
			10,
		);

		const passwordMatches = await bcrypt.compare(
			adminUserLoginDTO.password,
			user.password,
		);

		console.log("Password Matches:", passwordMatches);

		if (!passwordMatches) {
			throw new HttpException(
				"Invalid credentials",
				HttpStatus.BAD_REQUEST,
			);
		}

		return this.sanitizeUser(user);
	}

	async findByEmail(
		adminUserLoginDTO: AdminUserLoginDTO,
		error_throw: boolean = true,
	): Promise<User> {
		const { email } = adminUserLoginDTO;

		const user = await this.userModel.findOne({
			where: {
				email,
				role: {
					[Op.or]: [UserRole.ADMIN, UserRole.PUBLISHER],
				},
			},
		});

		if (!user && error_throw) {
			throw new HttpException(
				"The user was not found with that email.",
				HttpStatus.NOT_FOUND,
			);
		}

		if (user?.status !== UserStatus.ACTIVE && error_throw) {
			throw new HttpException(
				"User was deactivated",
				HttpStatus.BAD_REQUEST,
			);
		}

		return user?.get();
	}

	sanitizeUser(user: User): User | Partial<User> {
		const sanitizedUser = JSON.parse(JSON.stringify(user));
		delete sanitizedUser.password;
		return sanitizedUser;
	}

	async findByEmailAndRole(adminUserLoginDTO: AdminUserLoginDTO) {
		const { email, password, role } = adminUserLoginDTO;

		const user = await this.userModel.findOne({
			where: {
				email: email,
				role: role,
			},
		});

		if (!user) {
			throw new HttpException(
				"User was not found by that email",
				HttpStatus.NOT_FOUND,
			);
		}

		if (user.status !== "active") {
			throw new HttpException(
				"User was deactivated",
				HttpStatus.BAD_REQUEST,
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new HttpException(
				"Invalid credentials",
				HttpStatus.BAD_REQUEST,
			);
		}

		return this.sanitizeUser(user);
	}
}
