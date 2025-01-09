import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PublishStatus, Tag } from './model/tag.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTagDto } from './dto/tag.create.dto';
import { Article, Requestor } from '../admin-article/model/article.model';
import { Pagination, SoringCategories } from "./../../utils/types/types";

@Injectable()
export class AdminTagService {
    constructor(
        @InjectModel(Tag)
        private readonly tagModel: typeof Tag,
    ) {}

    async createTag(
        createTagDto: CreateTagDto,
    ): Promise<Tag> {
        try {
            return this.tagModel.create(createTagDto);
        } catch (error) {
            throw new InternalServerErrorException(
                "An error occurred while creating Tag",
            );
        }

    }


	async findOne(id: number) {
		try {

			let tag = await this.tagModel.findByPk(id);

			if(!tag){
				throw new HttpException(
					`Tag with ID ${id} not found`,
					HttpStatus.NOT_FOUND,
				);
			}
			return tag
		} catch (error) {
            console.log('findOne error:',error)
			throw new InternalServerErrorException(
				`An error occurred while retrieving tag. ${error}`,
			);
		}

	}

    async getTagById(
        id: number,
        requestor: Requestor = Requestor.PUBLISHER,
    ): Promise<Tag> {
        try {
            const tag = await this.tagModel.findByPk(id, {
                include: [                
                    // {
                    //     model: Article,
                    //     as: 'articles', 
                    //     required: false,
                    // }
                ],
            });
            console.log("getTagById Tag:", tag);
            if (!tag) {
                throw new HttpException(
                    `Tag with ID ${id} not found`,
                    HttpStatus.NOT_FOUND,
                );
            }
            if (
                requestor === Requestor.PUBLISHER &&
                tag.publishStatus !== PublishStatus.PUBLISHED
            ) {
                throw new HttpException(
                    "Invalid credentials",
                    HttpStatus.FORBIDDEN,
                );
            }
            return tag;
        } catch (error) {
            if (
                error.status === HttpStatus.FORBIDDEN ||
                error.status === HttpStatus.NOT_FOUND
            ) {
                // Rethrowing known exceptions to preserve their messages
                throw error;
            }
            throw new InternalServerErrorException("Failed to fetch Tag");
        }
    }

    async getAllTags(
        requestor: Requestor = Requestor.PUBLISHER,
        sorting: SoringCategories, 
        pagination: Pagination
    ): Promise<{ pagination: any, tags: Tag[] }> {
        try {
            const attributes =
                requestor === Requestor.ADMIN
                    ? undefined
                    : { exclude: ["publishStatus"] };
    
            const whereClause =
                requestor === Requestor.PUBLISHER
                    ? { publishStatus: PublishStatus.PUBLISHED }
                    : {};
    
            const totalCategories = await this.tagModel.count({
                where: whereClause,
            });
    
            const tags = await this.tagModel.findAll({
                attributes,
                where: whereClause,
                order: [[sorting.sortBy, sorting.sortDirection.toUpperCase()]], 
                limit: pagination.perPage, 
                offset: (pagination.page - 1) * pagination.perPage, 
            });
    
            const paginationResult = {
                count: tags.length, 
                total: totalCategories, 
                perPage: pagination.perPage, 
                currentPage: pagination.page, 
                totalPages: Math.ceil(totalCategories / pagination.perPage), 
            };
    
            return {
                pagination: paginationResult, 
                tags,
            };

        } catch (error) {
            throw new InternalServerErrorException(
                "An error occurred while retrieving categories",
            );
        }
    }

    async updateTag(
        id: number,
        updateTagDto: CreateTagDto,
    ): Promise<Tag> {

        try {

            const Tag = await this.getTagById(id);
            if (!Tag) {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }
            return Tag.update(updateTagDto);

        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while updating Tag. ${error}`,
            );
        }


    }

    async deleteTag(id: number): Promise<void> {
        try {

            const Tag = await this.getTagById(id);
            if (!Tag) {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }
            await Tag.destroy();

        } catch (error) {
            throw new InternalServerErrorException(
                `An error occurred while deleting Tag. ${error}`, 
            );
        }
    }
}
