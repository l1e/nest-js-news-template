import {
	BelongsTo,
	BelongsToMany,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import { Category } from "./../../admin-category/model/category.model";
import { Media } from "./../../admin-media/model/media.model";
import { User } from "./../../admin-user/model/user.model";
import { Tag } from "./../../admin-tag/model/tag.model";
import { TagArticle } from "../../admin-tag/model/tag,article.model";

export enum PublishStatus {
	PUBLISHED = "published",
	UNPUBLISHED = "unpublished",
	DRAFT = "draft",
}

export enum ValidationStatus {
	APPROVED = "approved",
	REJECTED = "rejected",
	PENDING = "pending",
}

export enum Requestor {
	ADMIN = "admin",
	PUBLISHER = "publisher",
	CMS = "cms",
}

export enum ArticleOfTheDay {
	YES = "yes",
	NO = "no",
}

export enum ArticleSpecial {
	YES = "yes",
	NO = "no",
}

@Table
export class Article extends Model<Article> {
	@Column({
		type: DataType.STRING(191),
		allowNull: false,
	})
	title: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	description: string;

	@Column({
		type: DataType.ENUM(...Object.values(PublishStatus)),
		allowNull: false,
		defaultValue: PublishStatus.DRAFT,
	})
	publishStatus: PublishStatus;

	@Column({
		type: DataType.ENUM(...Object.values(ValidationStatus)),
		allowNull: false,
		defaultValue: ValidationStatus.PENDING,
	})
	validationStatus: ValidationStatus;

	@Column({
		type: DataType.ENUM(...Object.values(Requestor)),
		allowNull: false,
		defaultValue: Requestor.PUBLISHER,
	})
	requestor: Requestor;

	@Column({
		type: DataType.ENUM(...Object.values(ArticleOfTheDay)),
		allowNull: false,
		defaultValue: ArticleOfTheDay.NO,
	})
	articleOfTheDay: ArticleOfTheDay;

	@Column({
		type: DataType.ENUM(...Object.values(ArticleSpecial)),
		allowNull: false,
		defaultValue: ArticleSpecial.NO,
	})
	articleSpecial: ArticleSpecial;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 0,
	})
	views: number;

	@ForeignKey(() => Category)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	categoryId: number;

	@BelongsTo(() => Category)
	category: Category;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	creatorId: number;

	@BelongsTo(() => User, "creatorId")
	creator: User;

	@HasMany(() => Media)
	media: Media[];


	@BelongsToMany(() => Tag, () => TagArticle)
	tags: Tag[];
}
