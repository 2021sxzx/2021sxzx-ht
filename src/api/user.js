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
            data, //data:data同名可以直接写 data
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
            data, //data:data同名可以直接写 data
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
            data, //data:data同名可以直接写 data
        })
    },

    /**
     * 获取用户信息
     * @param data = {}
     * @returns {Promise<AxiosResponse<any>>}
     * response.data = {
     *     idc:{   //证件号码
     *     type: String,
     *     required:true
     *   },
     *   profile_picture:{   // 头像
     *     type: String,
     *     default: ''
     *   },
     *   user_name:{  // 用户名
     *     type: String,
     *     required:true
     *   },
     *   role_name:{  // 角色名称
     *     type: String,
     *     required:true
     *   },
     *   account:{   // 账号信息
     *     type: String,
     *     required:true
     *   },
     *   password: {
     *     type: String,
     *     required:true
     *   },
     *   activation_status:{   //激活状态
     *     type: Number,
     *     default:0
     *   }
     * }
     * @constructor
     */
    GetUser(data) {
        return service.request({
            method: "get",
            url: "/v1/user",

            data, //data:data同名可以直接写 data
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
            data, //data:data同名可以直接写 data
        });
    },

    /**
     * 更新账号状态
     * @param data
     * @returns {Promise<AxiosResponse<any>>}
     * @constructor
     */
    SetActivation(data){
        return service.request({
            method: "post",
            url: "v1/setActivation",
            headers: {
                'Content-Type': 'application/json'
            },
            data, //data:data同名可以直接写 data
        });
    }
}

export default api

