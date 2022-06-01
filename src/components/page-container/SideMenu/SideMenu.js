import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom';
import {Layout, Menu,} from 'antd'
import {Scrollbars} from 'react-custom-scrollbars'
import style from './SideMenu.module.css'
import {
    DesktopOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import MenuList from "../../../utils/MenuList";

const {Sider} = Layout;
const {SubMenu} = Menu;
const lastMenu='/user-manage/metaData'
let menuTitleIcon = new Map([
    ['首页', <DesktopOutlined/>],
    ['个人中心', <UserOutlined/>],
    ['事项审核', <UserOutlined/>],
    ['事项管理', <FileOutlined/>],
    ['系统管理', <SettingOutlined/>],
    ['用户评价管理', <FileOutlined/>],
    ['用户管理', <FileOutlined/>]
])

let menuTitle=new Map([])

function SideMenu(props) {
    // 获取侧边栏菜单
    const [menuList,setMenuList] = useState([])
    const getPathName=(path)=>{
        let mid=path.split('/')
        for (let i=0;i<mid.length;i++){
            if (i<mid.length-1) mid[i+1]=mid[i]+'/'+mid[i+1]
            if (i>0) mid[i]=menuTitle.get(mid[i])
        }
        mid.splice(0,1)
        console.log(mid)
        return mid

    }
    // 只在第一次渲染的时候加载
    useEffect(()=>{

        // 获取侧边栏信息
        MenuList.getAndStorageMenuList((menuList)=>{
            setMenuList(menuList)

            // console.log('获得了 menuList', menuList)
        })
    },[])

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            menuTitle.set(item.key,item.title)
            if (item.children?.length > 0) {
                return <SubMenu key={item.key} icon={menuTitleIcon.get(item.title)} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return <Menu.Item key={item.key} icon={menuTitleIcon.get(item.title)} onClick={() => {
                props.history.push(item.key)
                props.setCurRoute(getPathName(item.key))
            }}>{item.title}</Menu.Item>
        })

    }

    const selectedKeys = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]

    return (
        <Sider theme="light">
            <div style={{display: 'flex', height: "100%", "flexDirection": "column"}}>
                <div className={style.logo}>广州人社</div>
                <Scrollbars>
                    <div style={{flex: 1, "overflow": "auto"}}>
                        <Menu theme="light" selectedKeys={selectedKeys} mode="inline" defaultOpenKeys={openKeys}>
                            {renderMenu(menuList ? menuList : [])}
                        </Menu>
                    </div>
                </Scrollbars>
            </div>
        </Sider>
    )
}

export default withRouter(SideMenu)
