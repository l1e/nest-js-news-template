import { FilterArticleDto } from './../../cms/cms-article/dto/articles.filter.dto';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Client } from '@opensearch-project/opensearch';
import { Article } from '../admin-article/model/article.model';
import { from } from 'rxjs';
import { Pagination, SoringArticles } from 'src/utils/types/types';

@Injectable()
export class AdminOpensearchService {
	private readonly client: Client;
	constructor() {
        // Initialize the OpenSearch client with the node URL, authentication, and SSL settings
        this.client = new Client({
            node: process.env.OPENSERACH_NODE,
            auth: {
                username: process.env.OPENSEARCH_INITIAL_ADMIN_USERNAME,
                password: process.env.OPENSEARCH_INITIAL_ADMIN_PASSWORD,
            },
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    async checkOpenSearchClusterHealth(searchIndex: string) {
        let clusterHealthResponse;
		let indexExists;

        try {
            clusterHealthResponse = await this.client.cluster.health({});
			indexExists = await this.client.indices.exists({ index: searchIndex });

			// console.log('checkOpenSearchClusterHealth indexExists:', indexExists)
			// console.log('checkOpenSearchClusterHealth clusterHealthResponse:', clusterHealthResponse)

			if(clusterHealthResponse.body.status==="green" && indexExists.statusCode ===200){
				return { opensearch: true };
			}else{
				return { opensearch: false };
			}

        } catch (error) {
            // console.log("no healthy claster");
        }

        // console.log("Get Cluster Health", clusterHealthResponse);

        return { opensearch: false };
    }


	async createArticle(article: Article) {
        try {
            await this.client.index({
                index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
                body: article,
                id: String(article.id),
            });

            // console.log("createArticle article.id:", article.id);
        } catch (e) {
            // console.log("createArticle create e:", e);
            // console.log("createArticle article :", article);

            // Throw an HttpException if there's an error during indexing
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    async updateArticle(article: Article) {
        try {
            let article_to_update = await this.client.index({
                index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
                body: article,
                id: String(article.id),
            });
            return article_to_update;
        } catch (e) {
            // Throw an HttpException if there's an error during updating
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

	async removeArticle(id: number) {
        try {
            await this.client.delete({
                index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
                id: String(id),
            });
            return `Article with id ${id} was removed.`;
        } catch (e) {
            // Throw an HttpException if there's an error during deletion
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

	async findOneArticle(id: number) {
        if (!id) {
            // Throw an HttpException if the ID is not provided
            throw new HttpException("id does not exsist", HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await this.client.get({
                index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
                id: String(id),
            });
			// console.log('findOneArticle response:', response)
            return response; // Return the document source data
        } catch (error) {
            // console.log("create error:", error);
            if (error.statusCode === 404) {
                // If the document is not found, return null
                return null;
            }
            // Rethrow other errors
            throw error;
        }
    }
	async findArticlesByFilter(
		filterArticleDto: FilterArticleDto,
		sorting: SoringArticles,
		pagination: Pagination,
	): Promise<{ pagination: any; articles: Article[] }> {
		// console.log('findArticlesByFilter openSearch filterArticleDto:', filterArticleDto);
		
		// Calculate pagination values
		const from = (pagination.page - 1) * pagination.perPage;
		const size = pagination.perPage;
		
		// Build the query based on filterArticleDto
		const query = {
			bool: {
				must: [
					...(filterArticleDto.textToSearch !== undefined
						? [
							  {
								  bool: {
									  should: [
										  {
											  multi_match: {
												  query: filterArticleDto.textToSearch,
												  fields: ["title", "description"],
											  },
										  },
									  ],
									  minimum_should_match: 1,
								  },
							  },
						  ]
						: []),
					{
						match: {
							publishStatus: "published",
						},
					},
					...(filterArticleDto.categoryId !== null && filterArticleDto.categoryId !== undefined
						? [
							  {
								  match: { "categoryId": filterArticleDto.categoryId },
							  },
						  ]
						: []),
					...(filterArticleDto.publisherId !== null && filterArticleDto.publisherId !== undefined
						? [
							  {
								  match: { "creatorId": filterArticleDto.publisherId },
							  },
						  ]
						: []),
					...(filterArticleDto.minArticleVeiws !== null && filterArticleDto.minArticleVeiws !== undefined
						? [
							{
								range: { 
									views: { gte: filterArticleDto.minArticleVeiws } 
								}, // Use range for minimum views filter
							},
						]
						: []),
				],
			},
		};
	
		// console.log('findArticlesByFilter query:', query);
	
		try {

			let articles = await this.client.search({
				index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
				body: {
					from: from, // Pagination: starting point
					size: size, // Pagination: number of results per page
					query: query,
					sort: [{ [sorting.sortBy]: { order: sorting.sortDirection.toLowerCase() } }] // Sorting
				}
			});
	

	
			
			if (articles && articles.body && articles.body.hits) {
				
				
				const totalHits = articles.body.hits.total.value;
				const totalPages = Math.ceil(totalHits / pagination.perPage);
	
				const paginationResult = {
					total: totalHits,
					perPage: pagination.perPage,
					currentPage: pagination.page,
					totalPages: totalPages,
				};
	
				// console.log('findArticlesByFilter articles:', articles.body.hits.hits);
				return { 
					pagination: paginationResult, // Include pagination info
					articles: await this.formatArticlesByFilter(articles.body.hits.hits) // Return the relevant article hits
				};
			} else {
				// console.error('Unexpected response structure:', articles);
				return { pagination: {}, articles: [] };
			}
		} catch (error) {
			// console.error('Error while fetching articles:', error);
			return { pagination: {}, articles: [] };
		}
	}
	
	

	async formatArticlesByFilter(articles){
		let articlesResult = [];
		// console.log('formatArticlesByFilter articles:', articles)
		for (let i = 0; i < articles.length; i++) {
			const article = articles[i]._source;
			articlesResult.push(article);
		}
		return articlesResult;

	}
}
