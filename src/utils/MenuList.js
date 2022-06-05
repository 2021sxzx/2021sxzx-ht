import api from "../api/login";
import {message} from "antd";
import UrlJump from "./UrlJump";

const MenuList = {
    /**
     * 获取侧边栏信息，并将信息存放到 sessionStorage 中。
     * - 优先从 sessionStorage 中获取。
     * - 如果 sessionStorage 中没有就根据用户名向服务请申请，并储存到 sessionStorage 中。
     * 不传入或者传入空字符串 '' ，就默认从 cookie 中获取并重置 cookie 的过期时间。如果获取失败 return false。
     * 如果有传入就根据输入的 roleName 向服务器重新请求侧边栏菜单。
     *
     * @param callback{function} 用于获取 menuList 的回调函数,比如 (menuList)=>{setMenuList(menuList)}
     * @param roleID
     * @return {boolean} 是否成功获得了侧边栏菜单。
     */
    getAndStorageMenuList(callback = (menuList) => {
        /*setMenuList(menuList)*/
        return menuList
    }, roleID  = '') {
        // 侧边栏菜单
        let menuList

        // 判断 sessionStorage 有没有侧边栏缓存
        menuList = JSON.parse(sessionStorage.getItem('menuList'))
        if(menuList && menuList instanceof Array){
            callback(menuList)
            return menuList
        }

        // 如果没有传入 roleName，
        if (roleID === '') {
            roleID = localStorage.getItem('roleID')

            // 如果没有找到 roleName，就 return false
            if (!roleID) {
                console.log("error 没有找到 roleName，请重新登录")
                // TODO（钟卓江）：测试一下
                // roleName = '全知全能的开发人员'
                message.warn('登录已过期，请重新登录')
                UrlJump.replace('#/login');
                return false
            }
        }

        // 根据角色名称向服务器申请获取 MenuList
        api.GetMenuList({role_id:roleID}).then((response => {
            menuList = response.data.data
            sessionStorage.setItem('menuList',JSON.stringify(menuList))
            callback(menuList)
            return true
        })).catch(error => {
            callback(null)
            return false
        })
    }
}

export default MenuList
