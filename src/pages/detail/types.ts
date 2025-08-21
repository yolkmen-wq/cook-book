export interface ContentProps {
  title: string;
  content: string;
}
/**
 * 上传的文件状态
 * 0未上传，1上传中，2上传成功，3上传失败（网络错误），4已取消（终止，上到一半取消了）,5超过大小
 * 0 Not uploaded, 1 Uploading, 2 Upload successful, 3 Upload failed (network error), 4 Cancelled (terminated, canceled halfway), 5 Exceeds size limit,
 */
export enum TMUPLOAD_PHOTO_STATUS {
  NOT = 0,
  UPLOADING = 1,
  UPLOAD_SUCCESS = 2,
  UPLOAD_FAILED = 3,
  CANCELLED = 4,
  EXCEEDS_SIZE_LIMIT = 5,
}
/**
 * 上传的文件类型
 */
export type TMUPLOAD_PHOTO_INFO = {
  id: string;
  /** 文件大小 */
  size?: number;
  /** 文件路径 */
  path: string;
  progress: number;
  statusText: string;
  status: TMUPLOAD_PHOTO_STATUS;
  response: any;
};

export interface CommentListItem {
  id: number;
  articleId: number;
  userId: number;
  content: number;
  createdAt: string;
  updatedAt: string;
  parentCommentId: number;
  rootCommentId: number;
  needExpand?: boolean;
  isExpanded?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}
