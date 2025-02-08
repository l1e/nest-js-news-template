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

    /**
     * Creates a new Tag in the database.
     *
     * @param createTagDto: - The data transfer object containing the necessary information to create a new Tag.
     * @returns A Promise that resolves to the newly created Tag.
     * @throws An InternalServerErrorException if an error occurs while creating the Tag.
     */
    async createTag(
        createTagDto: CreateTagDto,
    ): Promise<Tag> {
        try {
            return await this.tagModel.create(createTagDto);
        } catch (error) {
            throw new InternalServerErrorException(
                "An error occurred while creating Tag",
            );
        }
    }



 /**
  * Retrieves a single Tag from the database by its ID. For internal use only.
  *
  * @param id - The unique identifier of the Tag to retrieve.
  * @returns A Promise that resolves to the retrieved Tag.
  * @throws HttpException - If the Tag with the given ID is not found, a 404 Not Found exception is thrown.
  * @throws InternalServerErrorException - If an error occurs while retrieving the Tag, an Internal Server Error exception is thrown.
  */
 async findOne(id: number): Promise<Tag> {
     try {
         let tag = await this.tagModel.findByPk(id);

         if (!tag) {
             throw new NotFoundException(
                 `Tag with ID ${id} not found`
             );
         }
         return tag;
     } catch (error) {
        if (
            error.status === HttpStatus.NOT_FOUND
        ) {
            throw error;
        }
         throw new InternalServerErrorException(
             `An error occurred while retrieving tag. ${error}`,
         );
     }
 }

    /**
     * Retrieves a single Tag from the database by its ID, considering the requestor's role.
     *
     * @param id - The unique identifier of the Tag to retrieve.
     * @param requestor - The role of the requestor (default is PUBLISHER).
     *
     * @returns A Promise that resolves to the retrieved Tag.
     *
     * @throws HttpException - If the Tag with the given ID is not found, a 404 Not Found exception is thrown.
     * @throws HttpException - If the requestor is a PUBLISHER and the Tag's publishStatus is not PUBLISHED, a 403 Forbidden exception is thrown.
     * @throws InternalServerErrorException - If an error occurs while retrieving the Tag, an Internal Server Error exception is thrown.
     */
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
            if (!tag) {
                throw new NotFoundException(
                    `Tag with ID ${id} not found`
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
                throw error;
            }
            throw new InternalServerErrorException("Failed to fetch Tag");
        }
    }


    /**
     * Retrieves a paginated list of Tags from the database, considering the requestor's role and sorting options.
     *
     * @param requestor - The role of the requestor (default is PUBLISHER).
     * @param sorting - The sorting options, including the field to sort by and the sort direction.
     * @param pagination - The pagination options, including the number of items per page and the current page.
     *
     * @returns A Promise that resolves to an object containing the pagination information and the retrieved Tags.
     *
     * @throws InternalServerErrorException - If an error occurs while retrieving the Tags.
     */
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


    /**
     * Updates an existing Tag in the database.
     *
     * @param id - The unique identifier of the Tag to update.
     * @param updateTagDto - The data transfer object containing the updated information for the Tag.
     *
     * @returns A Promise that resolves to the updated Tag.
     *
     * @throws NotFoundException - If the Tag with the given ID is not found.
     * @throws InternalServerErrorException - If an other error occurs while updating the Tag.
     */
    async updateTag(
        id: number,
        updateTagDto: CreateTagDto,
    ): Promise<Tag> {
        try {
            const tag = await this.getTagById(id);
            if (!tag) {
                throw new NotFoundException(`Tag with ID ${id} not found.`);
            }
            return await tag.update(updateTagDto);
        } catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `An error occurred while updating Tag. ${error}`,
            );
        }
    }


    /**
     * Deletes a Tag from the database by its ID.
     *
     * @param id - The unique identifier of the Tag to delete.
     *
     * @returns A Promise that resolves to void when the Tag is successfully deleted.
     *
     * @throws NotFoundException - If the Tag with the given ID is not found.
     * @throws InternalServerErrorException - If an other error occurs while deleting the Tag.
     */
    async deleteTag(id: number): Promise<void> {
        try {
            const tag = await this.getTagById(id);
            if (!tag) {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }
            await tag.destroy();
        } catch (error) {
            if (
                error.status === HttpStatus.NOT_FOUND
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                `An error occurred while deleting Tag. ${error}`, 
            );
        }
    }

}
