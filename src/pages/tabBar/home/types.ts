interface ArticleListItem {
  id: number;
  categoryID: number;
  title: string;
  content: string; // 富文本 HTML 内容
  coverImage: string; // 封面图 URL
  author: string;
  status: number; // 状态（可根据实际业务改用 0 | 1 | 2 等字面量类型）
  viewsCount: number; // 浏览计数
  createdTime: string; // ISO 8601 格式时间
  updatedTime: string; // 特殊默认值 "0001-01-01T00:00:00Z" 表示未更新
}

interface BannerListItem {
  image: string;
  bannerId: number;
  keyWord: string | number;
}

interface CategoryListItem {
  articleNum: number;
  id: number;
  parentID: number;
  categoryName: string;
  categoryDesc: string;
  categoryPic: string;
  categorySort: number;
  showCategory: number;
  createdTime: string; // ISO 8601 格式时间字符串
  updatedTime: string; // ISO 8601 格式时间字符串
}

export type { ArticleListItem, BannerListItem, CategoryListItem };
