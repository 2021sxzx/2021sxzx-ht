/**
 * 获取角色数据的API
 */
import service from "./http";

// TODO(zzj): 所有接口都待完善

const api = {
    // 增加角色
    AddRole(data){
        return 
    },

    // TODO(zzj): 可能还需要删除角色的 API

    // 更新角色信息
    updateRole(data){
        return 
    },

    // 获取角色数据
    GetRole(data) {
        return service.request({
            method: "get",
            url: "/v1/role/",
            data, //data:data同名可以直接写 data
        });
    },

    // 下面这个函数不知道要用来干什么
    // async getCommentparams(){
    //     return service.get('/v1/commentparam')
    // },

    // 搜索角色
    SearchRole(data) {
        return service.request({
            method: "post",
            url: "/v1/searchRole/",
            data, //data:data同名可以直接写 data
        });
    }
}

export default api