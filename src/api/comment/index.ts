import request from "@/utils/request";

export type Result = {
  success: boolean;
  message: string;
  data?: any;
};

export type CommentListResult = {
  success: boolean;
  message: string;
  data: {
    list: any[];
    currentPage: number;
    pageSize: number;
    total: number;
  };
};

/** 获取评论 */
export const getComments = (data?: object) => {
  return request<CommentListResult>({
    url: "app/comment/list",
    data: data,
    method: "POST",
  });
};

/** 创建评论 */
export const createComment = (data?: object) => {
  return request<Result>({
    url: "app/comment/create",
    data: data,
    method: "POST",
  });
};

/** 点赞 */
export const likeComment = (id: number | string) => {
  return request<Result>({
    url: `app/comment/like/${id}`,
    method: "POST",
  });
};

/** 取消点赞 */
export const unlikeComment = (id: number | string) => {
  return request<Result>({
    url: `app/comment/unlike/${id}`,
    method: "POST",
  });
};
