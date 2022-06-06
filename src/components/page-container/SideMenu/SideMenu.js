import React from 'react'
import {withRouter} from 'react-router-dom';
import {Menu,} from 'antd'
import {Scrollbars} from 'react-custom-scrollbars'
import {
    DesktopOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
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

const menuList = [
    {
        "key": "/home",
        "title": "首页",
        "id": 1
    },
    {
        "key": "/personal",
        "title": "个人中心",
        "id": 2
    },
    {
        "key": "/system-manage",
        "title": "系统管理",
        "id": 8,
        "children": [
            {
                "key": "/system-manage/journal",

                "title": "系统日志管理",

                "id": 9

            },
            {
                "key": "/system-manage/resource",

                "title": "系统资源管理",

                "id": 10

            },
            {
                "key": "/system-manage/basic",

                "title": "系统基础管理",

                "id": 22

            },
            {
                "key": "/system-manage/backup",

                "title": "系统数据备份管理",

                "id": 23

            },
            {
                "key": "/system-manage/meta-data",

                "title": "系统元数据管理",

                "id": 24

            },
            {
                "key": "/system-manage/failure",

                "title": "系统故障管理",

                "id": 25

            }
        ]

    },
    {
        "key": "/comment-manage",
        "title": "用户评价管理",
        "id": 11,
        "children": [
            {
                "key": "/comment-manage/list",

                "title": "用户评价",

                "id": 12

            },
            {
                "key": "/comment-manage/report",

                "title": "评价报告",

                "id": 13

            }
        ]

    },
    {
        "key": "/user-manage",
        "title": "用户管理",
        "id": 14,
        "children": [
            {
                "key": "/user-manage/account",
                "title": "账号管理",
                "id":19,
                "children": [
                    {
                        "key": "/user-manage/account/user",

                        "title": "后台账号管理",

                        "id": 15

                    },
                    {
                        "key": "/user-manage/account/role",

                        "title": "角色管理",

                        "id": 16

                    },
                    // {
                    //     "key": "/user-manage/department",
                    //
                    //     "title": "部门管理",
                    //
                    //     "id": 17
                    //
                    // },
                ]
            },
            {
                "key": "/user-manage/register",
                "title": "注册管理",
                "id": 18
            }
        ]

    }
]

function SideMenu(props) {
    // 获取侧边栏菜单
    // const [menuList, setMenuList] = useState([])
    const menuTitle = new Map([])
    // // 只在第一次渲染的时候加载
    // useEffect(() => {
    //     // 获取侧边栏信息
    //     MenuList.getAndStorageMenuList((menuList) => {
    //         setMenuList(menuList)
    //
    //     })
    // }, [])

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
