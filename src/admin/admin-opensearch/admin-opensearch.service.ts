import { FilterArticleDto } from './../../cms/cms-article/dto/articles.filter.dto';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Client } from '@opensearch-project/opensearch';
import { Article } from '../admin-article/model/article.model';
import { from } from 'rxjs';

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
	async findArticlesByFilter(filterArticleDto: FilterArticleDto) {
		// console.log('findArticlesByFilter openSearch filterArticleDto:', filterArticleDto);
	
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
			// Send the search request to OpenSearch
			let articles = await this.client.search({
				index: process.env.OPENSEARCH_ARTICLE_INDEX_NAME,
				body: {
					from: 0, // Pagination
					size: 10, // Limit number of results
					query: query,
					// sort: filterArticleDto.sortDirection || [{ createdAt: 'desc' }] // Sorting
				}
			});
	
			// Log the full response to inspect its structure
			// console.log('OpenSearch full response:', articles);

	
			// Make sure to access the correct part of the response
			if (articles && articles.body && articles.body.hits) {
				// console.log('findArticlesByFilter articles:', articles.body.hits.hits);
				return this.formatArticlesByFilter(articles.body.hits.hits); // Return the relevant article hits
			} else {
				console.error('Unexpected response structure:', articles);
				return [];
			}
		} catch (error) {
			console.error('Error while fetching articles:', error);
			return [];
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
