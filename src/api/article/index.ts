import request from "@/utils/request";

export type Result = {
	success : boolean;
	message : string;
	data ?: any;
}

export type ArticleListResult = {
	success : boolean;
	message : string;
	data : {
		list : any[];
		currentPage : number;
		pageSize : number;
		total : number;
	};
};

export type ArticleDetailResult = {
	success : boolean;
	message : string;
	data : {
		author : string;
		content : string;
		title : string;
		createdTime : string;
	};
};

/** 获取文章 */
export const getArticles = (data ?: object) => {
	return request<ArticleListResult>({
		url: "app/article/list",
		data: data,
		method: "POST",
	});
};

/** 获取文章轮播图 */
export const getCarousels = (position: number) => {
	return request<Result>({
		url: `app/carousel/list?position=${position}`,
		method: "POST",
	});
};

/** 获取文章分类 */
export const getCategories = () => {
	return request<ArticleListResult>({
		url: "app/categories/list",
		method: "POST",
	});
};

/** 通过分类获取文章 */
export const getArticlesByCategory = (categoryID ?: number) => {
	return request<ArticleListResult>({
		url: `app/articles/category/${categoryID}`,
		method: "POST",
	});
};

/** 获取最新文章 */
export const getLatestArticles = (data ?: object) => {
	return request<ArticleListResult>({
		url: `app/article/latest/list`,
		method: "POST",
		data: data,
	});
};

/** 获取文章详情 */
export const getArticleDetail = (id : number) => {
	return request<ArticleDetailResult>({
		url: `app/article/${id}`,
		method: "GET",
	});
};