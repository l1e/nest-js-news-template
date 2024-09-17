import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Put,
	Delete,
	UseGuards,
	Query,
} from "@nestjs/common";

import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiQuery,
	ApiBody,
} from "@nestjs/swagger";
import { User, UserRole, UserStatus } from "./model/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { AdminUserService } from "./admin-user.service";
import { AuthAdminhGuard } from "./../../utils/auth.admin.guard";
import { AuthGuard } from "@nestjs/passport";
import { Requestor } from "../admin-article/model/article.model";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiBearerAuth()
@ApiTags("users")
@Controller("admin-users")
export class AdminUserController {
	constructor(private readonly adminUserService: AdminUserService) {}

	@ApiOperation({ summary: "Create a new user" })
	@ApiResponse({
		status: 201,
		description: "The user has been successfully created.",
		type: User,
	})
	@Post()
	@ApiQuery({
		name: "role",
		enum: UserRole,
		required: false,
		description: "User role",
	})
	@ApiQuery({
		name: "status",
		enum: UserStatus,
		required: false,
		description: "User status",
	})
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	async create(
		@Query("role") role: UserRole,
		@Query("status") status: UserStatus,
		@Body() createUserDto: CreateUserDto,
	): Promise<User> {
		createUserDto.role = role || createUserDto.role;
		createUserDto.status = status || createUserDto.status;
		return this.adminUserService.createUser(createUserDto);
	}

	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({
		status: 200,
		description: "Return all users.",
		type: [User],
	})
	@Get()
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	findAll(): Promise<User[]> {
		return this.adminUserService.findAllUsers(Requestor.ADMIN);
	}

	@ApiOperation({ summary: "Get a user by ID" })
	@ApiResponse({
		status: 200,
		description: "Return a single user.",
		type: User,
	})
	@ApiResponse({
		status: 404,
		description: "User not found  ",
	})
	@ApiResponse({
		status: 500,
		description: "Failed to fetch user",
	})
	@Get(":id")
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	findOne(@Param("id") id: string): Promise<User> {
		return this.adminUserService.findUserById(id);
	}

	@Put(":id")
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	@ApiOperation({ summary: "Update an existing user" })
	@ApiResponse({
		status: 200,
		description: "The user has been successfully updated.",
		type: User,
	})
	@ApiBody({ type: UpdateUserDto }) // This is crucial to tell Swagger the body type
	async update(
		@Param("id") id: string,
		@Body() updateData: UpdateUserDto,
	): Promise<User> {
		return this.adminUserService.updateUser(id, updateData);
	}

	@ApiOperation({ summary: "Delete a user" })
	@ApiResponse({
		status: 200,
		description: "The user has been successfully deleted.",
	})
	@Delete(":id")
	@UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
	remove(@Param("id") id: string): Promise<number> {
		return this.adminUserService.deleteUser(id);
	}
}
