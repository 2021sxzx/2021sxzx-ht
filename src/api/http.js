import axios from "axios";
import api from "./login";
import {message, notification} from "antd"
let BASEURL
if (process.env.NODE_ENV === "development") {
    BASEURL = '/api'
} else if (process.env.NODE_ENV === "test") {
    BASEURL = 'http://8.134.73.52:80/api'
    // BASEURL = 'http://127.0.0.1:5001/api'
} else if (process.env.NODE_ENV === "production") {
    BASEURL = 'http://8.134.73.52:80/api'
}
//对axios请求进行二次封装，timeout是没执行成功就执行错误消息
const instance = axios.create({
    baseURL: BASEURL,
    timeout: 100000,
    withCredentials: true
});
// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        let headers = config.headers
        //localStorage进行身份验证
        headers.userId = localStorage.getItem('_id') ? localStorage.getItem('_id') : ''
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
        console.log('响应拦截器',response);
        //如果用户状态突然被管理员切换至未激活
        // if(response.data.loginstate == "loginout")
        // {
        //     api.clearStorageAndRedirect()
        //     notification.error({
        //         maxCount:1,
        //         duration:0,
        //         message:"账号未激活请联系管理员"
        //     })
        // }
        // 对响应数据做点什么
        return response
    },
    function (error) {
        // console.log("MISTAKE")
        if(error.response.status==401)
            {
                api.clearStorageAndRedirect()
                notification.error({
                key :"errorkey",
                maxCount:1,
                duration:0,
                message:"账号未激活请联系管理员"
            })
            }
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;

