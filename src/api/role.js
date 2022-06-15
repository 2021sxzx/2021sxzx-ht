/**
 * 角色-权限数据相关的服务器 API
 */
import service from "./http";

const api = {
    // 增加角色
    AddRole(data) {
        return service.request({
            method: "post",
            url: "/v1/role/",
            data,
        });
    },

    DeleteRole(data) {
        return service.request({
            method: "delete",
            url: "/v1/role/",
            data,
        })
    },

    // 更新角色非权限相关的信息
    UpdateRole(data) {
        return service.request({
            method: "patch",
            url: "/v1/role/",
            data,
        })
    },

    // 修改用户权限(更新角色权限相关的信息)
    UpdateRolePermission(data) {
        return service.request({
            method: "patch",
            url: "/v1/aboutPermission/",
            data,
        })
    },

    // 添加用户权限(添加角色权限相关的信息)
    AddRolePermission(data) {
        return service.request({
            method: "post",
            url: "/v1/aboutPermission/",
            data,
        })
    },

    // 获取角色数据
    GetRole() {
        return service.request({
            method: "get",
            url: `/v1/role`,
        });
    },

    // 搜索角色
    SearchRole(data) {
        return service.request({
            method: "post",
            url: "/v1/searchRole",
            data,
        });
    },

    //获取权限列表
    GetPermission() {
        return service.get('/v1/permissionList')
    }
}

export default api
