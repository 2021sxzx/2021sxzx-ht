import React, {Suspense, lazy, useEffect, useRef, useState} from 'react'
import {Redirect, Route, Switch, withRouter} from 'react-router-dom'

import {Breadcrumb, Layout} from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'
import api from '../../api/login'

// 导入页面内容
// import Home from './Home/Home'
// import Personal from './Personal/Personal'
// import ItemManage from './ItemManage/ItemManage.js'
// import ItemAudit from './ItemAudit/ItemAudit.js'
// import CommentManageList from './CommentManageList/CommentManageList.js'
// import CommentManageReport from './CommentManageReport/CommentManageReport.js'
// import MetaData from './SystemManage/MetaData/MetaData.js'
// import SystemManageJournal from './SystemManage/SystemManageJournal/SystemManageJournal.js'
// import SystemManageResource from './SystemManage/SystemManageResource/SystemManageResource.js'
// import UserManageAccount from './UserManage/UserManageAccount/UserManageAccount'
// import UserManageRole from './UserManage/UserManageRole/UserManageRole'
// import SystemManageFailure from './SystemManage/SystemManageFailure/SystemManageFailure.js'
// import SystemManageBasic from './SystemManage/SystemManageBasic/SystemManageBasic.js'
// import SystemManageBackup from './SystemManage/SystemManageBackup/SystemManageBackup.js'
// import NoPermission from './NoPermission/NoPermission.js'
// import RegisterManagement from './UserManage/RegisterManagement/RegisterManagement'
import style from './PageContainer.module.scss'
import Sider from 'antd/es/layout/Sider'
import MenuList from '../../utils/MenuList'
import {Header} from 'antd/es/layout/layout'

// 懒加载
const Home = lazy(() => {
    return import('./Home/Home')
})
const Personal = lazy(() => {
    return import('./Personal/Personal')
})
const ItemManage = lazy(() => {
    return import('./ItemManage/ItemManage.js')
})
const ItemAudit = lazy(() => {
    return import('./ItemAudit/ItemAudit.js')
})
const CommentManageList = lazy(() => {
    return import('./CommentManageList/CommentManageList.js')
})
const CommentManageReport = lazy(() => {
    return import('./CommentManageReport/CommentManageReport.js')
})
const MetaData = lazy(() => {
    return import('./SystemManage/MetaData/MetaData.js')
})
const SystemManageJournal = lazy(() => {
    return import('./SystemManage/SystemManageJournal/SystemManageJournal.js')
})
const SystemManageResource = lazy(() => {
    return import('./SystemManage/SystemManageResource/SystemManageResource.js')
})
const UserManageAccount = lazy(() => {
    return import('./UserManage/UserManageAccount/UserManageAccount')
})
const UserManageRole = lazy(() => {
    return import('./UserManage/UserManageRole/UserManageRole')
})
const SystemManageFailure = lazy(() => {
    return import('./SystemManage/SystemManageFailure/SystemManageFailure.js')
})
const SystemManageBasic = lazy(() => {
    return import('./SystemManage/SystemManageBasic/SystemManageBasic.js')
})
const SystemManageBackup = lazy(() => {
    return import('./SystemManage/SystemManageBackup/SystemManageBackup.js')
})
const NoPermission = lazy(() => {
    return import('./NoPermission/NoPermission.js')
})
const RegisterManagement = lazy(() => {
    return import('./UserManage/RegisterManagement/RegisterManagement')
})


const {Content} = Layout

export default withRouter(function PageContainer(props) {
    const [curRoute, setCurRoute] = useState([])
    const menuTitle = new Map([])
    // 根据浏览器宽度动态确定侧边栏菜单是否默认展开
    const [siderCollapsed, setSiderCollapsed] = useState(document.body.clientWidth <= 800)

    function getMenuTitle(menu) {
        if (!menu) return
        menu.map(item => {
            menuTitle.set(item.key, item.title)
            if (item.children?.length > 0) getMenuTitle(item.children)
        })
    }

    const getPathName = (path, menuTitle) => {
        let mid = path.split('/')
        for (let i = 0; i < mid.length; i++) {
            if (i < mid.length - 1) mid[i + 1] = `${mid[i]}/${mid[i + 1]}`
            if (i > 0) mid[i] = menuTitle.get(mid[i])
        }
        mid.splice(0, 1)
        return mid
    }

    // 心跳（定时自动登出）
    // 避免多用户同时心跳，在一个合适区间内随机化心跳时间
    // 一旦进入心跳时间区间，每秒均有概率进行判断
    // 若已经可以进行心跳，则执行一次心跳
    // 否则待到超过服务器时间后，直接执行登出
    let shouldHeartbeat = true
    const heartbeatIntervalTime = 1000 // 每 1 秒检查一次是否要心跳
    const checkTime = 600 // 服务器验证时间
    let start = new Date()
    const timeInterval = [checkTime - 60, checkTime - 5] // 心跳时间区间
    useEffect(() => {
        const heartbeat = setInterval(() => {
            const count = (new Date() - start).valueOf() / 1000
            const threshold = 1 / (timeInterval[1] - count) // 检测阈值
            const checker = Math.random()
            if (count >= timeInterval[1] || count >= timeInterval[0] && checker < threshold) {
                if (shouldHeartbeat) {
                    start = new Date()
                    shouldHeartbeat = false
                    api.IsLogin().then(res => {
                        if (!res) api.logout()
                    })
                } else if (count >= checkTime) api.logout()
            }
        }, heartbeatIntervalTime)
        const body = document.body
        body.onmousemove = body.onmousewheel = body.onmousedown = body.onkeydown = () => shouldHeartbeat = true
        return () => {
            clearInterval(heartbeat)
            body.onmousemove = body.onmousewheel = body.onmousedown = body.onkeydown = null
        }
    }, [])
    // end 心跳

    useEffect(() => {
        MenuList.getAndStorageMenuList(menuList => {
            if (!menuList) return
            getMenuTitle(menuList)
            setCurRoute(getPathName(props.location.pathname, menuTitle))
        })
    }, [])

    return <Layout className={style.siteLayout}>
        {/*<Layout>*/}
        <div className={style.headerContainer}>
            <Header className={style.header}>
                <TopHeader/>
            </Header>
        </div>
        <Content className={style.siteContainer}>
            <Layout className={style.leftRightLayout}>
                <Sider
                    className={style.sideMenuContainer}
                    theme="light" // 样式主题
                    // collapsible={true} // 是否可收起
                    collapsedWidth={50}
                    collapsed={siderCollapsed}
                >
                    <SideMenu
                        setCurRoute={setCurRoute}
                        getPathName={getPathName}
                        siderCollapsed={siderCollapsed}
                        setSiderCollapsed={setSiderCollapsed}
                    />
                </Sider>
                <Layout className={style.rightSideLayout}>
                    <Content
                        className={style.mainContentContainer}
                        // style={{ margin: '0 10px' }}
                    >
                        <Breadcrumb className={style.breadcrumb}>
                            {curRoute.map(item => <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>)}
                        </Breadcrumb>
                        <div className={style.mainContent}>
                            <Suspense fallback={<div>loading</div>}>
                                <Switch>
                                    {/* 首页 */}
                                    <Route path="/home" component={Home}/>
                                    {/* 用户评价 */}
                                    <Route path="/comment-manage/list" component={CommentManageList}/>
                                    {/* 评价报告 */}
                                    <Route path="/comment-manage/report" component={CommentManageReport}/>
                                    {/* 个人中心 */}
                                    <Route path="/personal" component={Personal}/>
                                    {/* 事项过程管理 */}
                                    <Route path="/item-manage" component={ItemManage}/>
                                    <Route path="/item-audit" component={ItemAudit}/>
                                    {/* 日志管理 */}
                                    <Route path="/system-manage/journal" component={SystemManageJournal}/>
                                    {/* 资源管理 */}
                                    <Route path="/system-manage/resource" component={SystemManageResource}/>
                                    {/* 后台账号管理 */}
                                    <Route path="/user-manage/account/user" component={UserManageAccount}/>
                                    {/* 角色管理 */}
                                    <Route path="/user-manage/account/role" component={UserManageRole}/>
                                    {/* 单位管理 */}
                                    <Route path="/user-manage/register" component={RegisterManagement}/>
                                    {/*/!* 部门管理 *!/*/}
                                    {/*<Route path="/user-manage/department" component={DepartmentManagement} />*/}
                                    <Route path="/system-manage/failure" component={SystemManageFailure}/>
                                    <Route path="/system-manage/meta-data" component={MetaData}/>
                                    <Route path="/system-manage/backup" component={SystemManageBackup}/>
                                    <Route path="/system-manage/basic" component={SystemManageBasic}/>
                                    <Redirect from="/" to="/home" exact/>
                                    <Route path="*" component={NoPermission}/>
                                </Switch>
                            </Suspense>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Content>
    </Layout>
})
