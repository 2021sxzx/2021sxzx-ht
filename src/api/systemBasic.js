import service from "./http";

const api ={
    UploadPicture(data) {//可能不需要这个
        return service.request({
            method: "post",
            url: "v1/picture-upload",
            data, //data:data同名可以直接写 data
        });
    },
    SiteSettings(data){
        return service.request({
            method:"get",
            url:"v1/site-settings",
            data
        })
    },
    ChangeSiteSettings(data){
        // console.log("change")
        return service.request({
            method:"post",
            url:"v1/site-settings",
            data
        })
    },
    CoreSettings(data){
        return service.request({
            method:"get",
            url: "v1/core-settings",
            data
        })
    },
    ChangeCoreSettings(data){
        return service.request({
            method:"post",
            url: "v1/core-settings",
            data
        })
    },
    GetNetworkStatus(data) {
        return service.request({
            method: "get",
            url: "v1/interface/NetworkStatus",
            data
        });
    },
    SetInterfaceUrl(data){
        return service.request({
            method: "patch",
            url: "v1/interface",
            data
        });
    },
    GetInterfaceUrl(data){
        return service.request({
            method: "get",
            url: "v1/interface",
            data
        });
    }
}

export default api
