import request from "@/utils/request";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type CaptchaResult = {
  success: boolean;
  message: string;
  data: {
    b64s: string;
    id: string;
  };
};

export type TokenResult = {
  success: boolean;
  message: string;
  code: number;
  data: {
    /** `token` */
    token: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
  };
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  message: string;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return request<UserResult>({
    url: "app/login",
    data: data,
    method: "POST",
  });
};

/** 微信登录 */
export const getWxLogin = (code: string) => {
  return request<TokenResult>({
    url: `app/wx-login?code=${code}`,
    method: "POST",
  });
};

/** 获取验证码 */
export const getCaptcha = (data?: object) => {
  return request<CaptchaResult>({
    url: "app/get-captcha",
    method: "POST",
  });
};
