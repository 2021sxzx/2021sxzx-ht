import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom';
import {Button, Menu, Tooltip} from 'antd'
import style from './SideMenu.module.scss'
import {
    DesktopOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
} from '@ant-design/icons';
import MenuList from "../../../utils/MenuList";

const {SubMenu} = Menu;

const menuTitleIcon = new Map([
    ['首页', <DesktopOutlined/>],
    ['个人中心', <UserOutlined/>],
    ['事项审核', <UserOutlined/>],
    ['事项管理', <FileOutlined/>],
    ['系统管理', <SettingOutlined/>],
    ['用户评价管理', <FileOutlined/>],
    ['用户管理', <FileOutlined/>]
])

/**
 *
 * @param props={
 *     siderCollapsed:boolean, // 菜单展开状态
 *     setSiderCollapsed: function(boolean), // 设置菜单是否展开
 *     getPathName:function, // 根据 key 和 title 获取 url
 *     setCurRoute, // 更新当前的 url，用于面包屑展示
 * }
 * @return {JSX.Element}
 * @constructor
 */
function SideMenu(props) {
    // 获取侧边栏菜单
    const [menuList, setMenuList] = useState([])
    const menuTitle = new Map([])
    // 只在第一次渲染的时候加载
    useEffect(() => {
        // 获取侧边栏信息
        MenuList.getAndStorageMenuList((menuList) => {
            setMenuList(menuList)
        })
    }, [])

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            menuTitle.set(item.key, item.title)
            if (item.children?.length > 0) {
                return <SubMenu key={item.key} icon={menuTitleIcon.get(item.title)} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return <Menu.Item
                key={item.key}
                icon={menuTitleIcon.get(item.title)}
                onClick={() => {
                    props.history.push(item.key)
                    props.setCurRoute(props.getPathName(item.key, menuTitle))
                }}
            >{item.title}</Menu.Item>
        })
    }

    const selectedKeys = [props.location.pathname]
    const openKeys = ['/' + props.location.pathname.split('/')[1]]

    const foldingSideMenu = () => {
        props.setSiderCollapsed(!props.siderCollapsed)
    }

    return (
        <div className={style.sideMenuContainer}>
            <Tooltip
                title={props.siderCollapsed ? '展开菜单' : '折叠菜单'}
                placement={'right'}
                mouseEnterDelay={0.3}
            >
                <Button
                    icon={props.siderCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    // type={'text'}
                    onClick={foldingSideMenu}
                    style={{
                        width: '100%',
                    }}

                >
                    {/*{props.siderCollapsed ? '' : '折叠菜单'}*/}
                </Button>
            </Tooltip>

            <Menu
                theme="light"
                selectedKeys={selectedKeys}
                mode="inline"
                defaultOpenKeys={openKeys}
            >
                {renderMenu(menuList ? menuList : [])}
            </Menu>
        </div>
    )
}

export default withRouter(React.memo(SideMenu))
