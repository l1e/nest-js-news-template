export interface Pagination {
	page: number,
	perPage: number
}

export enum SortDirection{
	ASC = 'asc',
	DESC = 'desc',
}

export enum SortByGeneral{
	CREATED_AT = 'createdAt',
	ID = 'id',
}

export enum SortByArticles{
	CREATED_AT = 'createdAt',
	VIEWS = 'views',
}

export enum UsersSortBy{
	ID = 'id',
	CREATED_AT = 'createdAt',
	publishedArticlesCount = 'publishedArticlesCount'
}
export interface PaginationAndSortUsers {
	sortBy: UsersSortBy,
	sortDirection: SortDirection,
	page: number,
	perPage: number
}

export interface SoringArticles{
	sortBy: SortByArticles,
	sortDirection: SortDirection
}
export interface SoringCategories{
	sortBy: SortByGeneral,
	sortDirection: SortDirection
}