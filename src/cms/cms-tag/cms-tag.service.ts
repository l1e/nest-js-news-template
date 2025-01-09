import { Injectable } from '@nestjs/common';
import { Requestor } from './../../admin/admin-article/model/article.model';
import { AdminTagService } from './../../admin/admin-tag/admin-tag.service';
import { Pagination, SoringCategories } from './../../utils/types/types';

@Injectable()
export class CmsTagService {
        constructor(private readonly adminTagService: AdminTagService) {}

        async getAllTags(requestor: Requestor, sorting: SoringCategories, pagination: Pagination) {
                return this.adminTagService.getAllTags(requestor, sorting, pagination);
        }
        async getTagById(id: number, requestor: Requestor = Requestor.PUBLISHER) {
                return this.adminTagService.getTagById(id, requestor);
        }
}
