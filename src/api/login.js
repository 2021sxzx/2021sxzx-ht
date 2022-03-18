/**
 * 登录相关 API
 */
import service from "./http";

const api = {
    // 增加角色
    // req.data = { account:string, password:string }
    Login(data) {
        return service.request({
            method: "post",
            url: "/v1/login",
            data, //data:data同名可以直接写 data
        });
    },
    // 根据角色名获取侧边栏
    GetMenuList(data){
        return service.request({
            method:"post",
            url:'/v1/sideBar',
            data:data,//{role_name}
        })
    }
}

export default api