import service from "./http";

const api ={
    GetLog(data) {
        return service.request({
            method: "get",
            url: "/v1/show/",
            data, //data:data同名可以直接写 data
        });
    },
    async getLogparams(){
        return service.get('/v1/logparam')
    },
    SearchLog(data){
        return service.request({
            method: "post",
            url: "/v1/searchLog/",
            data, //data:data同名可以直接写 data
        });
    },
    MetaDataLog(data){
        return service.request({
            method: "get",
            url: "/v1/metaDataLog/",
            data,
        });
    },
    ItemBrowseCount(data){
        return service.request({
            method: "get",
            url: "/v1/itemBrowseCount/",
            data,
        });
    }
}

export default api