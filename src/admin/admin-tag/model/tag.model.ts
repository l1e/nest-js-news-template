import {
	BelongsToMany,
	Column,
	DataType,
	Model,
	Table,
} from "sequelize-typescript";
import { Article } from "./../../admin-article/model/article.model";
import { TagArticle } from "./tag,article.model";

export enum PublishStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	UNPUBLISHED = "unpublished",
}

@Table
export class Tag extends Model<Tag> {
	@Column({
		type: DataType.STRING(191),
		allowNull: false,
	})
	name: string;

	@BelongsToMany(() => Tag, () => TagArticle)
	tags: Tag[];

	@Column({
		type: DataType.ENUM(...Object.values(PublishStatus)),
		allowNull: false,
		defaultValue: PublishStatus.DRAFT,
	})
	publishStatus: PublishStatus;
}
