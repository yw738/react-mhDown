import { get, post } from "./http";

export const searchApi = (data) => get(`/api/pingccApi/search`,data);
export const listApi = (data) => get(`/api/pingccApi/list?cartoonId=${data}`);
export const detailApi = (data) =>
  get(`/api/pingccApi/detail?chapterId=${data}`);
export const downLoadAWorlApi = (data) => get(`/api/downLoadAWorl`, data);
export const downLoadAllApi = (data) => post(`/api/downLoadAll`, data);
