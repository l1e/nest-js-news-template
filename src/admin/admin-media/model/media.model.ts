import {
	Table,
	Column,
	Model,
	ForeignKey,
	DataType,
	BelongsTo,
	Default,
	AllowNull,
} from "sequelize-typescript";
import { Article } from "src/admin/admin-article/model/article.model";

export enum SrcType {
	IMAGE = "image",
	VIDEO = "video",
}

export enum isExsistFormat {
	YES = "yes",
	NO = "no",
}

export enum PublishStatus {
	PUBLISHED = "published",
	UNPUBLISHED = "unpublished",
	DRAFT = "draft",
}

@Table({
	// tableName: "talent_mediaa",
	// timestamps: true, // Enables createdAt and updatedAt automatically
	// underscored: true, // For snake_case column naming convention
})
export class Media extends Model<Media> {
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	fileName: string;

	@ForeignKey(() => Article)
	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	articleId: number;

	@BelongsTo(() => Article)
	article: Article;

	@Column({
		type: DataType.ENUM(...Object.values(SrcType)),
		defaultValue: SrcType.IMAGE,
		allowNull: false,
	})
	type: SrcType;

	@AllowNull(false)
	@Column({
		type: DataType.STRING,
	})
	src: string;

	@AllowNull(false)
	@Column({
		type: DataType.INTEGER,
	})
	order: number;

	// @Default(2)
	@Column({
		type: DataType.ENUM(...Object.values(isExsistFormat)),
		allowNull: false,
		defaultValue: isExsistFormat.YES,
	})
	isPhysicallyExist: isExsistFormat;

	@Column({
		type: DataType.ENUM(...Object.values(PublishStatus)),
		allowNull: false,
		defaultValue: PublishStatus.DRAFT,
	})
	publishStatus: PublishStatus;
}
