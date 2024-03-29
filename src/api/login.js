/**
 * 登录相关 API
 */
import service from "./http";
import { message } from "antd";
import UrlJump from "../utils/UrlJump";

const api = {
    /** 
     * 登录
     * req.data = { account:string, password:string, ?state: 1 }
     * state为1时候为验证码登录
    */
    Login(data) {
        return service.request({
            method: "post",
            url: "/v1/login",
            headers: {
                "Content-Type": "application/json",
            },
            data, //data:data同名可以直接写 data
        });
    },
    // 根据角色名获取侧边栏
    GetMenuList(data) {
        return service.request({
            method: "post",
            url: "/v1/sideBar",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        });
    },
    // 前端简单判断是否成功登录
    async IsLogin() {
        const res = await service.request({
            method: "get",
            url: "/v1/isLogin",
        });
        return res.data.data ? res.data.data.isLogin : false;
    },

    /**
     * 登出 api
     * @param {Object} data = { account:string }
     * @return {Promise<AxiosResponse<any>>}
     * @constructor
     */
    Logout(data) {
        return service.request({
            method: "post",
            url: "/v1/logout",
            headers: {
                "Content-Type": "application/json",
            },
            data,
        });
    },
    /**
     * 清除缓存信息并重定向到登录页面
     */
    clearStorageAndRedirect() {
        // 清除本地保存的所有信息
        localStorage.clear();
        // 清除会话缓存
        sessionStorage.clear();
        // message.success('您已成功登出')
        UrlJump.goto("#/login");
    },
    /**
     * 登出效果的统一实现
     */
    logout() {
        api.Logout({ logoutData: { account: localStorage.getItem("account") } })
            .then(() => {
                message.success("您已登出");
            })
            .catch(() => {
                message.error("登出失败，请检查网络");
            })
            .finally(() => {
                api.clearStorageAndRedirect();
            });
    },
    /**
     * 请求后端发送验证码至手机
     * req.data = { account:string }
     */
    RequestVC(data) {
        return service.request({
            method: "post",
            url: "/v1/sendVC",
            headers: {
                "Content-Type": "application/json",
            },
            data, //data:data同名可以直接写 data
        })
    },
};

export default api;
