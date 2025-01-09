import { Module } from '@nestjs/common';
import { AdminTagService } from './admin-tag.service';
import { AdminTagController } from './admin-tag.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';
import { Article } from '../admin-article/model/article.model';
import { TagArticle } from './model/tag,article.model';

@Module({
  imports: [SequelizeModule.forFeature([Tag, Article, TagArticle])], 
  providers: [AdminTagService],
  controllers: [AdminTagController],
  exports: [AdminTagService],
})
export class AdminTagModule {}
