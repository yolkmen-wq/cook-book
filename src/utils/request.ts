import { formatToken } from "./";

// request.ts
// 定义请求配置接口
interface RequestConfig {
  url: string;
  method?:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  data?: any;
  params?: any;
  header?: { [key: string]: string };
  dataType?: string;
  responseType?: "text" | "arraybuffer";
}

// 封装请求函数
const request = <T>(config: RequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      url: import.meta.env.VITE_BASE_URL + config.url,
      header: {
        Authorization: formatToken(uni.getStorageSync("token")),
      },
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(new Error(`请求失败：${err.errMsg}`));
      },
    });
  });
};

export { request };
export default request;
