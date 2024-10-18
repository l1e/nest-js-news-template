export enum SortBy{
	CREATED_AT = 'created_at',
	VIEWS = 'views',
}

export enum SortDirection{
	ASC = 'asc',
	DESC = 'desc',
}


export class FilterArticleDto {

	sortBy: SortBy;

	sortDirection: SortDirection
	
	publisherId: number

	categoryId: number

	minArticleVeiws: number

	textToSearch: string


	// will be added later 
	minArticleSizeSymbols: number

	minPublishedArticles: number

}
