import service from "./http";

const api = {
    GetUnit(){
        return service.request({
            method:"get",
            url:'/v1/unit',
        })
    },
    AddUnit(data){
        return service.request({
            method:'post',
            url:'/v1/unit',
            data
        })
    },
    UpdateUnit(data){
        return service.request({
            method:'patch',
            url:'/v1/unit',
            data
        })
    },
    DeletUnit(data){
        return service.request({
            method:'delete',
            url:'/v1/unit',
            data
        })
    }
}

export default api
