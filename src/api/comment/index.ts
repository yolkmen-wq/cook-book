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
    url: "http://127.0.0.1:7575/app/comment/list",
    data: data,
    method: "POST",
  });
};

/** 创建评论 */
export const createComment = (data?: object) => {
  return request<Result>({
    url: "http://127.0.0.1:7575/app/comment/create",
    data: data,
    method: "POST",
  });
};
