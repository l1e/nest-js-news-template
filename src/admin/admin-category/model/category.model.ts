import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import { Article } from "src/admin/admin-article/model/article.model";

export enum PublishStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	UNPUBLISHED = "unpublished",
}

@Table
export class Category extends Model<Category> {
	@Column({
		type: DataType.STRING(191),
		allowNull: false,
		// unique: true,
	})
	name: string;

	@Column({
		type: DataType.STRING(191),
		allowNull: true,
	})
	description: string;

	@Column({
		type: DataType.ENUM(...Object.values(PublishStatus)),
		allowNull: false,
		defaultValue: PublishStatus.DRAFT,
	})
	publishStatus: PublishStatus;

	@HasMany(() => Article)
	articles: Article[];
}
