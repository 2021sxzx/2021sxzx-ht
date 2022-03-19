import api from "../api/login";
import Cookie from "./Cookie";

const MenuList = {
    /**
     * 获取侧边栏信息，并将信息存放到 sessionStorage 中。
     * 优先从 sessionStorage 中获取。
     * 如果 sessionStorage 中没有就根据用户名向服务请申请，并储存到 sessionStorage 中。
     * @param roleName{string} 角色名称，不输入就默认从 cookie 中获取并重置 cookie 的过期时间
     * @return {object} 侧边栏数组。没找到返回 null。
     */
    getAndStorageMenuList(roleName = '') {
        let menuListJSON = sessionStorage.getItem('menuList')
        // 如果 sessionStorage 中找到了就直接返回
        if (menuListJSON) {
            console.log('menuList1',menuListJSON)
            return JSON.parse(menuListJSON)
        }

        // 如果没有获得 roleName，去获得 roleName
        if (roleName === '') {
            roleName = Cookie.getAndResetCookie('roleName')
            // 如果没有找到 roleName
            if(!roleName){
                console.log("error getAndStorageMenuList")
                // TODO（钟卓江）：测试一下
                roleName = '全知全能的开发人员'
            }
        }



        // 根据角色名称向服务器申请获取 MenuList
        api.GetMenuList({role_name: roleName}).then((response => {
            console.log('GetMenuList', response.data.data)
            let menuList = response.data.data
            // 储存到 sessionStorage 中
            console.log('menuList2',menuList)
            sessionStorage.setItem('menuList', JSON.stringify(menuList))
            return menuList
        })).catch(error => {
            console.log("error GetMenuList", error)
            return null
        })
    }
}

export default MenuList