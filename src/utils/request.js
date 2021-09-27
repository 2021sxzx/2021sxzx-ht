import axios from "axios";

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api";
const service = axios.create({
    baseURL: BASEURL,
    timeout: 100000,

});
// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        console.log(config);
        return config;
    },
    function (error) {

        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default service;

