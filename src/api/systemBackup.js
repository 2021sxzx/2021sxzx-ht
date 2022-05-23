import service from "./http";

const api ={
    GetBackupCycle(data) {
        return service.request({
            method: "get",
            url: "v1/mongo-backup-cycle",
            data, //data:data同名可以直接写 data
        });
    },
    ChangeBackupCycle(data){
        // console.log("change")
        return service.request({
            method:"post",
            url:"v1/change-backup-cycle",
            data
        })
    },
    HandleBackup(data){
        return service.request({
            method:"get",
            url:"v1/handle-backup",
            data
        })
    },
    GetBackup(data){
        return service.request({
            method:"get",
            url:"v1/mongo-backup",
            data
        })
    }
}

export default api