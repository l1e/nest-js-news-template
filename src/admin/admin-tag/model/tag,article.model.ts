import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Article } from "../../admin-article/model/article.model";
import { Tag } from "./tag.model";

@Table({
    indexes: [
      {
        fields: ["articleId", "tagId"], // Composite index
        unique: false, // Explicitly allow duplicates
      },
    ],
  })
  export class TagArticle extends Model<TagArticle> {
    @ForeignKey(() => Article)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    articleId: number;
  
    @ForeignKey(() => Tag)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    tagId: number;
  }