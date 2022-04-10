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
            url:"v1/basic",
            data
        })
    }

}

export default api