import service from "./http";
/**
 * 获取验证码
 */

const api ={
    GetComment(data) {
        return service.request({
            method: "get",
            url: "/allcomment/",
            data, //data:data同名可以直接写 data
        });
    },
    async getCommentparams(){
        return service.get('/commentparam')
    }
}

export default api