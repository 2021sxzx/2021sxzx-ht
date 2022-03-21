import api from "../api/login";
import Cookie from "./Cookie";
import {message} from "antd";

const MenuList = {
    /**
     * 获取侧边栏信息，并将信息存放到 sessionStorage 中。
     * - 优先从 sessionStorage 中获取。
     * - 如果 sessionStorage 中没有就根据用户名向服务请申请，并储存到 sessionStorage 中。
     * @param roleName{string} 角色名称。
     * 不传入或者传入空字符串 '' ，就默认从 cookie 中获取并重置 cookie 的过期时间。如果获取失败 return false。
     * 如果有传入就根据输入的 roleName 向服务器重新请求侧边栏菜单。
     *
     * @param callback{function} 用于获取 menuList 的回调函数,比如 (menuList)=>{setMenuList(menuList)}
     * @return {boolean} 是否成功获得了侧边栏菜单。
     */
    getAndStorageMenuList(callback = (menuList) => {
        /*setMenuList(menuList)*/
        return menuList
    }, roleName = '') {
        // 如果没有传入 roleName，
        if (roleName === '') {
            // // 如果 sessionStorage 中找到了 menuList 就直接返回
            // let menuListJSON = sessionStorage.getItem('menuList')
            // if (menuListJSON) {
            //     console.log('从 sessionStorage 中找到了 menuList 并调用 callback 函数')
            //     callback(JSON.parse(menuListJSON))
            //     return true
            // }

            // 否则去 cookie 中找 roleName
            roleName = Cookie.getAndResetCookie('roleName')
            // 如果没有找到 roleName，就 return false
            if (!roleName) {
                console.log("error 没有找到 roleName，请重新登录")
                // TODO（钟卓江）：测试一下
                // roleName = '全知全能的开发人员'
                message.warn('登录已过期，请重新登录')
                return false
            }
        }

        // 根据角色名称向服务器申请获取 MenuList
        api.GetMenuList({role_name: roleName}).then((response => {
            console.log('GetMenuList', response.data.data)
            const menuList = response.data.data
            // // 储存到 sessionStorage 中
            // console.log('根据角色名称向服务器申请获取 MenuList 成功', menuList)
            // sessionStorage.setItem('menuList', JSON.stringify(menuList))

            console.log('执行 callback(menuList)')
            callback(menuList)
            return true
        })).catch(error => {
            console.log("error GetMenuList", error)
            console.log('执行 callback(null)')
            callback(null)
            return false
        })
    }
}

export default MenuList