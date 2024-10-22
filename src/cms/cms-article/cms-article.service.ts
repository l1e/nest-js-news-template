import { Inject, Injectable } from "@nestjs/common";
import { AdminArticleService } from "./../../admin/admin-article/admin-article.service";
import {
	Article,
	Requestor,
} from "./../../admin/admin-article/model/article.model";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { FilterArticleDto } from "./dto/articles.filter.dto";
import { AdminOpensearchService } from "./../../admin/admin-opensearch/admin-opensearch.service";
import { Pagination, SoringArticles, SortByArticles, SortDirection } from "./../../utils/types/types";


@Injectable()
export class CmsArticleService {
	constructor(
		private readonly adminArticleService: AdminArticleService,
		private adminOpenSearchService: AdminOpensearchService,
		@Inject(CACHE_MANAGER)
        private cacheManager: Cache,
	) {}

	// Method to get articles for the public.
	async getPublicArticles(
		sorting: SoringArticles,
		categoryId: number,
		publisherId: number,
		textToSearch: string,
		minArticleVeiws: number,
		pagination:Pagination,
	): Promise<{ pagination: any; articles: Article[] }> {

		// console.log('getPublicArticles {sortBy, sortDirection, categoryId, publisherId, textToSearch}:' ,{sortBy, sortDirection, categoryId, publisherId, textToSearch})
		

		// let hashRequest = 'sortBy='+sortBy+'&sortDirection='+sortDirection;
		// let cachedArticles:Article[] = await this.cacheManager.get(`cms_articles?${hashRequest}`);

		// if(cachedArticles) return cachedArticles;


		let articles = await this.adminArticleService.getAllArticles(
			Requestor.CMS,
			sorting,
			categoryId,
			publisherId,
			textToSearch,
			minArticleVeiws,
			pagination
		);

		// this.cacheManager.set(`cms_articles?${hashRequest}`, articles, 100);

		return articles;
	}

	async findArticlesByFilterWithTheHealthCheck(
		filterArticleDto : FilterArticleDto,
		sorting: SoringArticles,
		pagination:Pagination,
	): Promise<{ pagination: any; articles: Article[] }> {

		let openSearcHealthCheck = await this.adminOpenSearchService.checkOpenSearchClusterHealth(process.env.OPENSEARCH_ARTICLE_INDEX_NAME);

		let articles: { pagination: any; articles: Article[] }
 
		if(openSearcHealthCheck.opensearch === true) {
			articles = await this.adminOpenSearchService.findArticlesByFilter(filterArticleDto, sorting, pagination)
		}else if(openSearcHealthCheck.opensearch === false){
			articles =  await this.getPublicArticles(
				sorting,
				filterArticleDto.categoryId,
				filterArticleDto.publisherId,
				filterArticleDto.textToSearch,
				filterArticleDto.minArticleVeiws,
				pagination,
			);
		}else{
			articles =  await this.getPublicArticles(
				sorting, 
				filterArticleDto.categoryId,
				filterArticleDto.publisherId,
				filterArticleDto.textToSearch,
				filterArticleDto.minArticleVeiws,
				pagination,
			);
		}

		return {articles:(await articles).articles, pagination: (await articles).pagination};
	}

	async getArticleById(id: number, requestor: Requestor):Promise<Article> {

		let hashRequest = `${id}`;
		let cachedArticle: Article = await this.cacheManager.get(`cms_article/${hashRequest}`);

		if(cachedArticle) return cachedArticle;

		let article = await this.adminArticleService.getArticleById(id, requestor);
		this.cacheManager.set(`cms_article/${hashRequest}`, article, 100);
		return article
	}

	async getArticleByIdByFilterWithTheHealthCheck(id: number, requestor: Requestor):Promise<Article>{

		let openSearcHealthCheck = await this.adminOpenSearchService.checkOpenSearchClusterHealth(process.env.OPENSEARCH_ARTICLE_INDEX_NAME);
		let article: Article;
		if(openSearcHealthCheck.opensearch === true) {
			article = (await this.adminOpenSearchService.findOneArticle(id)).body._source;
		}else{

			article = await this.getArticleById(
				id,
				Requestor.CMS,
			);
		}
		return article
	}

	async getArticlesByCategoryId(
		categoryId: number,
		sortBy: "views" | "createdAt" = "createdAt",
		sortDirection: "asc" | "desc" = "desc",
		requestor: Requestor,
	): Promise<Article[]> {
		return this.adminArticleService.getArticlesByCategoryId(
			categoryId,
			sortBy,
			sortDirection,
			requestor,
		);
	}

	async getArticleOfTheDay(requestor: Requestor): Promise<Article> {
		return this.adminArticleService.getArticleOfTheDay(requestor);
	}

	async getArticleSpecial(requestor: Requestor): Promise<Article[]> {
		return this.adminArticleService.getArticleSpecial(requestor);
	}
}
