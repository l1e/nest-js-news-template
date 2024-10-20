export enum SortBy{
	CREATED_AT = 'createdAt',
	VIEWS = 'views',
}

export enum SortByGeneral{
	CREATED_AT = 'createdAt',
	ID = 'id',
}

export enum UsersSortBy{
	ID = 'id',
	CREATED_AT = 'createdAt',
	publishedArticlesCount = 'publishedArticlesCount'
}



export enum SortDirection{
	ASC = 'asc',
	DESC = 'desc',
}

export interface PaginationUsers {
	sortBy: UsersSortBy,
	sortDirection: SortDirection,
	page: number,
	perPage: number
}


export interface PaginationArticles {
	page: number,
	perPage: number
}

export interface SoringArticles{
	sortBy: SortBy,
	sortDirection: SortDirection
}

export interface PaginationCategories {
	page: number,
	perPage: number
}

export interface SoringCategories{
	sortBy: SortByGeneral,
	sortDirection: SortDirection
}