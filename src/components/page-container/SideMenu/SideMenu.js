import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom';
import { Menu,} from 'antd'
import {Scrollbars} from 'react-custom-scrollbars'
import {
    DesktopOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import MenuList from "../../../utils/MenuList";

const {SubMenu} = Menu;

let menuTitleIcon = new Map([
    ['首页', <DesktopOutlined/>],
    ['个人中心', <UserOutlined/>],
    ['事项审核', <UserOutlined/>],
    ['事项管理', <FileOutlined/>],
    ['系统管理', <SettingOutlined/>],
    ['用户评价管理', <FileOutlined/>],
    ['用户管理', <FileOutlined/>]
])

function SideMenu(props) {
    // 获取侧边栏菜单
    const [menuList, setMenuList] = useState([])

    // 只在第一次渲染的时候加载
    useEffect(() => {
        // 获取侧边栏信息
        MenuList.getAndStorageMenuList((menuList) => {
            setMenuList(menuList)
            console.log('获得了 menuList', menuList)
        })
    }, [])

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0) {
                return <SubMenu key={item.key} icon={menuTitleIcon.get(item.title)} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return <Menu.Item key={item.key} icon={menuTitleIcon.get(item.title)} onClick={() => {
                props.history.push(item.key)
            }}>{item.title}</Menu.Item>
        })
    }

    const selectedKeys = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]


    console.log('渲染 menuList', props)

    return (
        <Scrollbars>
            <div style={{flex: 1, "overflow": "auto"}}>
                <Menu theme="light" selectedKeys={selectedKeys} mode="inline" defaultOpenKeys={openKeys}>
                    {renderMenu(menuList ? menuList : [])}
                </Menu>
            </div>
        </Scrollbars>
    )
}

export default withRouter(React.memo(SideMenu))
