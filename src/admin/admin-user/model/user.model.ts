import { DataTypes } from "sequelize";
import {
	BeforeSave,
	Column,
	Model,
	Table,
	HasMany,
} from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import { Article } from "src/admin/admin-article/model/article.model";

export enum UserRole {
	ADMIN = "admin",
	PUBLISHER = "publisher",
}

export enum UserStatus {
	ACTIVE = "active",
	DISABLED = "disabled",
}

@Table
export class User extends Model<User> {
	@Column({
		type: DataTypes.STRING(191),
		allowNull: false,
		// unique: true,
	})
	email: string;

	@Column({
		type: DataTypes.STRING,
		allowNull: false,
	})
	password: string;

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: "0000000000", // Default value for phone
	})
	phone: string;

	@Column({
		type: DataTypes.TEXT,
		allowNull: true,
		defaultValue: "No biography provided.", // Default value for biography
	})
	biography: string;

	@Column({
		type: DataTypes.STRING,
		allowNull: false,
	})
	firstName: string;

	@Column({
		type: DataTypes.STRING,
		allowNull: false,
	})
	lastName: string;

	@Column({
		type: DataTypes.STRING,
		allowNull: true,
	})
	nickname: string;

	@Column({
		type: DataTypes.ENUM(...Object.values(UserRole)),
		allowNull: false,
		defaultValue: UserRole.PUBLISHER, // Default role
	})
	role: UserRole;

	@Column({
		type: DataTypes.ENUM(...Object.values(UserStatus)),
		allowNull: false,
		defaultValue: UserStatus.ACTIVE, // Default status
	})
	status: UserStatus;

	@HasMany(() => Article, "creatorId")
	articles: Article[];

	@BeforeSave
	static async hashPassword(user: User) {
		if (user.changed("password")) {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			user.password = hashedPassword;
		}
	}
}
