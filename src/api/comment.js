import service from "./http";
/**
 * 获取验证码
 */

const api ={
    GetComment(data) {
        return service.request({
            method: "get",
            url: "/v1/comment/",
            data, //data:data同名可以直接写 data
        });
    },
    async getCommentparams(){
        return service.get('/v1/commentparam')
    },
    SearchComment(data){
        return service.request({
            method: "post",
            url: "/v1/searchComment/",
            data, //data:data同名可以直接写 data
        });
    }
}

export default api