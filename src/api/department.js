/**
 * 部门管理相关的服务器 API
 */

import service from "./http";

const api = {
    /**
     * 添加处室
     * @param data = { department_name:string }
     */
    AddDepartment(data) {
        return service.request({
            method: "post",
            url: "/v1/Department/",
            data, //data:data同名可以直接写 data
        });
    },

    /**
     * 删除处室
     * @param data = { department_name:string }
     */
    DeleteDepartment(data) {
        return service.request({
            method: "delete",
            url: "/v1/Department/",
            data, //data:data同名可以直接写 data
        })
    },

    /**
     * 修改处室
     * @param data = {
     *  department_name:string,
     *  new_department_name:string,
     * }
     */
    UpdateDepartment(data) {
        return service.request({
            method: "patch",
            url: "/v1/Department/",
            data, //data:data同名可以直接写 data
        })
    },

    /**
     * 获取处室列表
     * @param data = {role_name:string}
     */
    GetDepartment(data) {
        return service.request({
            method: "get",
            url: "/v1/Department",
            data, //data:data同名可以直接写 data
        });
    },
    async getDepartment() {
        return service.get('/v1/Department')
    },

    /**
     * 搜索处室
     * @param data = { searchValue:string }
     */
    SearchDepartment(data) {
        return service.request({
            method: "get",
            url: "/v1/searchDepartment",
            data, //data:data同名可以直接写 data
        });
    },

    /**
     * 修改某个人的处室
     * TODO（钟卓江）：这部分接口文档还没完善
     * @param data
     */
    SetDepartment(data){
        return service.request({
            method: "post",
            url: "v1/setActivation",
            data, //data:data同名可以直接写 data
        });
    }
}

export default api
