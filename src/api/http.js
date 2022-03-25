import axios from "axios";
let BASEURL
if(process.env.NODE_ENV==="development"){
    BASEURL='/api'
}
else if(process.env.NODE_ENV==="test"){
    BASEURL='http://8.134.73.52:80/api'
    // BASEURL = 'http://127.0.0.1:5001/api'
}
else if(process.env.NODE_ENV==="production"){
    BASEURL='http://8.134.73.52:80/api'
}
const instance = axios.create({
    baseURL: BASEURL,
    timeout: 100000,
});
// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        console.log('请求拦截器',config);
        return config;
    },
    function (error) {

        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;

