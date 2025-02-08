import { PaginationAndSortUsers } from './../../utils/types/types';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcrypt";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserRole, UserStatus } from "./model/user.model";
import { Payload } from "./../../utils/types/payload.dto";
import { AdminUserLoginDTO } from "./dto/create-user.login.dto";
import { Article, Requestor } from "../admin-article/model/article.model";


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
		requestor: Requestor,
		pagination: PaginationAndSortUsers
	) {
		console.log('findAllUsers pagination:', pagination);
		
		const { sortBy, sortDirection, page, perPage } = pagination;
	
		let paginationResult = {
			count: perPage,
			total: 0,
			perPage: perPage,
			currentPage: page,
			totalPages: 0,
		};
	
		const queryOptions: any = {
			where: {},
			attributes: {
				exclude: [],
				include: [
					[
						Sequelize.literal(
							"(SELECT COUNT(*) FROM Articles WHERE Articles.creatorId = User.id AND Articles.publishStatus = 'published')"
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
						publishStatus: "published",
					},
					required: false, // Use LEFT JOIN
				},
			],
			// Sorting
			order: [
				[
					Sequelize.literal(
						sortBy === "publishedArticlesCount"
							? "publishedArticlesCount"
							: "User.id"
					),
					sortDirection,
				],
			],
		};
	
		// Filter for CMS requestor
		if (requestor === Requestor.CMS) {
			queryOptions.where = {
				status: UserStatus.ACTIVE,
			};
			queryOptions.attributes.exclude = [
				"email",
				"password",
				"status",
				"role",
				"createdAt",
				"updatedAt",
			];
		}
	
		// First, count total number of users (without pagination)
		const totalUsers = await this.userModel.count({
			where: queryOptions.where,
			// include: queryOptions.include,
		});

		// console.log('findAllUsers totalUsers:', totalUsers)
	
		paginationResult.total = totalUsers;
		paginationResult.totalPages = Math.ceil(totalUsers / perPage);
	
		queryOptions.limit = perPage;
		queryOptions.offset = (page - 1) * perPage;
	
		let users = await this.userModel.findAll(queryOptions);
	
		return { pagination: paginationResult, users: users };
	}
	

	async findAllPublishers(
		requestor: Requestor,
		paginationUsers: PaginationAndSortUsers
	) {
		const { sortBy, sortDirection, page, perPage } = paginationUsers;
	
		// Initialize pagination result
		let paginationResult = {
			count: perPage,
			total: 0,
			perPage: perPage,
			currentPage: page,
			totalPages: 0,
		};
	
		const queryOptions: any = {
			where: {},
			attributes: {
				exclude: [],
				include: [
					[
						Sequelize.literal(
							"(SELECT COUNT(*) FROM Articles WHERE Articles.creatorId = User.id AND Articles.publishStatus = 'published')"
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
			// Sorting
			order: [
				[
					Sequelize.literal(
						sortBy === "publishedArticlesCount"
							? "publishedArticlesCount"
							: "User.id"
					),
					sortDirection,
				],
			],
		};
	
		// Filter for CMS requestor
		if (requestor === Requestor.CMS) {
			queryOptions.where = {
				status: UserStatus.ACTIVE,
			};
			queryOptions.attributes.exclude = [
				"email",
				"password",
				"status",
				"role",
				"createdAt",
				"updatedAt",
			];
		}
	

		const totalPublishers = await this.userModel.count({
			where: queryOptions.where,
			include: queryOptions.include,
			group: ["User.id"],
		});
	
		paginationResult.total = totalPublishers.length || 0;
		paginationResult.totalPages = Math.ceil(paginationResult.total / perPage);

		queryOptions.limit = perPage;
		queryOptions.offset = (page - 1) * perPage;
	
		// Fetch publishers with pagination
		let publishers = await this.userModel.findAll(queryOptions);
	
		return { pagination: paginationResult, publishers: publishers };
	}
	

	async findUserById(id: string): Promise<User> {
		try {
			const user = await this.userModel.findByPk(id);

			if (!user) {
				throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
			}

			return user;
		} catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND ||
                error.status === HttpStatus.FORBIDDEN
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to fetch user. ${error}`, 
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

	async deleteUser(id: string): Promise<number> {
        try {

            const user = await this.userModel.findByPk(id);
            if(!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return await this.userModel.destroy({ where: { id } });
        } catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND ||
                error.status === HttpStatus.FORBIDDEN
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `An error occurred while deleting user. ${error}`, 
            );
        }

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

		const passwordMatches = await bcrypt.compare(
			adminUserLoginDTO.password,
			user.password,
		);


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
