/**
 * 用户-角色数据相关的服务器 API
 */

import service from "./http";

const api = {
    /**
     * 增加用户
     * @param data = {
     *     user_name: string,
     *     account: string,
     *     password: string,
     *     role_name: string
     *   }
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    AddUser(data) {
        return service.request({
            method: "post",
            url: "/v1/user/",
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        });
    },

    /**
     * 删除用户
     * @param data = { account:string }
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    DeleteUser(data) {
        return service.request({
            method: "delete",
            url: "/v1/user/",
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        })
    },

    /**
     * 更新用户信息
     * @param data = {
     *  user_name:string,
     *  password:string,
     *  role_name:string,
     *  account:string,
     * }
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    UpdateUser(data) {
        return service.request({
            method: "patch",
            url: "/v1/user/",
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        })
    },

    /**
     * 获取用户信息
     * @returns {Promise<AxiosResponse<any>>}
     */
    GetUser() {
        return service.request({
            method: "get",
            url: "/v1/user",
        });
    },
    async getUser() {
        return service.get('/v1/user')
    },
    /**
     * 查询用户信息
     * @param data = { searchValue:string }
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    SearchUser(data) {
        return service.request({
            method: "post",
            url: "/v1/searchUser",
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        });
    },

    /**
     * 更新账号状态
     * @param data
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    SetActivation(data) {
        return service.request({
            method: "post",
            url: "v1/setActivation",
            headers: {
                'Content-Type': 'application/json'
            },
            data,
        });
    },
    /**
     * 根据 unit_id 来获取用户
     * @param data
     * @return {Promise<AxiosResponse<any>>}
     * @constructor
     */
    GetUserByID(data) {
        return service.post(
            '/v1/getUserById',
            {unit_id: data.unit_id},
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        )
    },

    DownloadTemplate() {
        window.open('/xlsx/template.xlsx');
    },

    BatchImportUser(data) {
        return service.post(
            '/v1/batchImportUser',
            {
                imported_array: data,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            },
        )
    }
}

export default api;
