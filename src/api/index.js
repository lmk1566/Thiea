import Env from './env';
import axios from 'axios';

axios.defaults.withCredentials = true;
// 添加一个响应拦截器
axios.interceptors.response.use(
  function(response) {
    if (response.data && response.data.errcode) {
      if (parseInt(response.data.errcode) === 40001) {
        //未登录
        this.$emit('goto', '/login');
      }
    }

    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

//基地址
let base = Env.baseURL;

//测试使用
export const ISDEV = Env.isDev;

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data);
};

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, { params: params }).then(res => res.data);
};

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data);
};

export const DELETE = (url, params) => {
  return axios
    .delete(`${base}${url}`, { params: params })
    .then(res => res.data);
};

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data);
};
