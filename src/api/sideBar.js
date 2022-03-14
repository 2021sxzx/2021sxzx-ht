/**
 * 获取侧边栏相关的服务器 API
 */
import service from "./http";
import api from "./role";

export default api ={
    // 根据角色名获取侧边栏
    GetSideBar(data){
        return service.request({
            method:"post",
            url:'/v1/sideBar',
            data:data,//{role_name}
        })
    }
}