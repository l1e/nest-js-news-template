import { BadRequestException, Controller, Get, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination, SoringCategories, SortByGeneral, SortDirection } from './../../utils/types/types';
import { PublisherTagService } from './publisher-tag.service';
import { Tag } from './../../admin/admin-tag/model/tag.model';
import { Requestor } from './../../admin/admin-article/model/article.model';

@ApiBearerAuth()
@ApiTags("publisher-tag")
@Controller('publisher-tag')
export class PublisherTagController {
    constructor(private readonly publisherTagService: PublisherTagService) {

    }

    @Get(":id")
    @ApiOperation({ summary: "Get a Tag by ID" })
    @ApiResponse({
        status: 200,
        description: "Return a single Tag.",
    })
    @ApiResponse({
        status: 403,
        description: "Invalid credentials",
    })
    @ApiResponse({
        status: 404,
        description: "Tag not found",
    })
    @ApiResponse({
        status: 500,
        description: "Failed to fetch Tag",
    })
    async getTagById(
        @Param("id", ParseIntPipe) id: number,
    ): Promise<Tag> {
        return this.publisherTagService.getTagById(id);
    }

    @Get()
    @ApiOperation({ summary: "Get all tags" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Successfully retrieved all tags.",
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: "An error occurred while retrieving tags.",
    })
    @ApiQuery({
        name: "sortBy",
        required: false,
        enum: ["id", "createdAt"],
        description: "Field to sort by (views or createdAt)",
    })
    @ApiQuery({
        name: "sortDirection",
        required: false,
        enum: ["asc", "desc"],
        description: "Sort direction (ascending or descending)",
    })
    async getAllTags(
        @Query("sortBy") sortBy: SortByGeneral = SortByGeneral.CREATED_AT,
        @Query("sortDirection") sortDirection: SortDirection = SortDirection.ASC,
        @Query("page") page: number = 1,
        @Query("perPage") perPage: number = 2,
    ): Promise<{ pagination: any, tags: Tag[] }>  {

        try {

            // Validate query parameters 
            if (!["id", "createdAt"].includes(sortBy)) {
                throw new BadRequestException("Invalid sortBy value");
            }
            if (!["asc", "desc"].includes(sortDirection)) {
                throw new BadRequestException("Invalid sortDirection value");
            }

            let sorting: SoringCategories = {
                sortBy: sortBy,
                sortDirection: sortDirection
            }
            
            let pagination: Pagination = {
                page: Number(page),
                perPage: Number(perPage)
            }

            return this.publisherTagService.getAllTags(Requestor.ADMIN, sorting, pagination);
            
        } catch (error) {
            throw new InternalServerErrorException("Error retrieving categories");
        }

    }
}
