/**
 * 登录相关 API
 */
import service from "./http";
import {message} from "antd";
import UrlJump from "../utils/UrlJump";

const api = {
    // 登录
    // req.data = { account:string, password:string }
    Login(data) {
        return service.request({
            method: "post",
            url: "/v1/login",
            data, //data:data同名可以直接写 data
        });
    },
    // 根据角色名获取侧边栏
    GetMenuList(data) {
        return service.request({
            method: "post",
            url: '/v1/sideBar',
            data: data,//{role_name}
        })
    },
    // 判断是否成功登录
    IsLogin(data) {
        // TODO(zzj):等后端API完善
        return !!localStorage.getItem('_id')
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
            data,
        });
    },
    /**
     * 登出效果的统一实现
     */
    logout(){
        // TODO test
        // 清除 token
        localStorage.removeItem('loginToken')
        // 清除角色
        localStorage.removeItem('roleName')
        message.success('您已成功登出')
        UrlJump.goto('#/login')
        //TODO(zzj):等一个后端实现
        api.Logout({account: localStorage.getItem('account')}).then(() => {
                // // 清除 token
                // localStorage.removeItem('loginToken')
                // // 清除角色
                // localStorage.removeItem('roleName')
                // message.success('您已成功登出')
                // UrlJump.goto('#/login')
            }
        ).catch(() => {
            // message.error('登出失败，请检查网络')
        })
    }
}

export default api
