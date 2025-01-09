import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Delete,
	ParseIntPipe,
	UseGuards,
	HttpStatus,
	Query,
	BadRequestException,
	InternalServerErrorException,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AdminTagService } from './admin-tag.service';

import { AuthAdminhGuard } from "./../../utils/auth.admin.guard";
import { CreateTagDto } from "./dto/tag.create.dto";
import { Tag } from "./model/tag.model";
import { Pagination, SoringCategories, SortByGeneral, SortDirection } from "./../../utils/types/types";
import { Requestor } from "../admin-article/model/article.model";

@ApiBearerAuth()
@ApiTags("tag")
@Controller('admin-tag')
export class AdminTagController {
        constructor(private readonly adminTagService: AdminTagService) {}

    @Post()
    @ApiOperation({ summary: "Create a tag" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async createTag(
        @Body() createTagDto: CreateTagDto,
    ): Promise<Tag> {
        return this.adminTagService.createTag(createTagDto);
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
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async getTagById(
        @Param("id", ParseIntPipe) id: number,
    ): Promise<Tag> {
        return this.adminTagService.getTagById(id);
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
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
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

            return this.adminTagService.getAllTags(Requestor.ADMIN, sorting, pagination);
            
        } catch (error) {
            throw new InternalServerErrorException("Error retrieving tags");
        }

    }

    @Put(":id")
    @ApiOperation({ summary: "Update a Tag" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async updateTag(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateTagDto: CreateTagDto,
    ): Promise<Tag> {
        return this.adminTagService.updateTag(id, updateTagDto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a Tag" })
    @UseGuards(AuthGuard("jwt"), AuthAdminhGuard)
    async deleteTag(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.adminTagService.deleteTag(id);
    }
}
