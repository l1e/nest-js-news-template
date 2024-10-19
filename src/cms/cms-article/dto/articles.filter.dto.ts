import { SortBy, SortDirection } from "./../../../utils/types/types";

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
