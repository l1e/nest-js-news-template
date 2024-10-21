// import { SortByArticles, SortDirection } from "./../../../utils/types/types";

export class FilterArticleDto {

	// sortBy: SortByArticles;

	// sortDirection: SortDirection
	
	publisherId: number

	categoryId: number

	minArticleVeiws: number

	textToSearch: string

	// page: number
	
	// perPage: number

	// will be added later 
	minArticleSizeSymbols: number

	minPublishedArticles: number

}
