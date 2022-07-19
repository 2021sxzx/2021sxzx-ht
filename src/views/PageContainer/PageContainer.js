import React, {useEffect, useState, useRef} from 'react'
import {Redirect, Switch, Route, withRouter} from 'react-router-dom'

import {Layout, Breadcrumb} from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'
import api from '../../api/login'

// 导入页面内容
import Home from './Home/Home'
import Personal from './Personal/Personal'
import ItemManage from './ItemManage/ItemManage.js'
import ItemAudit from './ItemAudit/ItemAudit.js'
import CommentManageList from './CommentManageList/CommentManageList.js'
import CommentManageReport from './CommentManageReport/CommentManageReport.js'
import MetaData from './SystemManage/MetaData/MetaData.js'
import SystemManageJournal from './SystemManage/SystemManageJournal/SystemManageJournal.js'
import SystemManageResource from './SystemManage/SystemManageResource/SystemManageResource.js'
import UserManageAccount from './UserManage/UserManageAccount/UserManageAccount'
import UserManageRole from './UserManage/UserManageRole/UserManageRole'
import SystemManageFailure from './SystemManage/SystemManageFailure/SystemManageFailure.js'
import SystemManageBasic from './SystemManage/SystemManageBasic/SystemManageBasic.js'
import SystemManageBackup from './SystemManage/SystemManageBackup/SystemManageBackup.js'
import NoPermission from './NoPermission/NoPermission.js'
import RegisterManagement from './UserManage/RegisterManagement/RegisterManagement'
import style from './PageContainer.module.scss'
import Sider from 'antd/es/layout/Sider'
import MenuList from '../../utils/MenuList'
import {Header} from 'antd/es/layout/layout'

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

  // 心跳
  // 避免多用户同时心跳，在一个合适区间内随机化心跳时间
  const [shouldHeartbeat, setHeartbeat] = useState(true)
  const heartbeatRef = useRef(shouldHeartbeat)
  const heartbeatIntervalTime = 1000 // 每 1 秒检查一次是否要心跳
  useEffect(() => {
    heartbeatRef.current = shouldHeartbeat
  })
  useEffect(() => {
    let count = 0 // 计时器
    const timeInterval = [590, 595] // 心跳时间区间
    let heartbeat = setInterval(() => {
      const threshold = 1 / (timeInterval[1] - count) // 检测阈值
      const checker = Math.random()
      if (count >= timeInterval[0] && checker < threshold) {
        count = 0
        if (heartbeatRef.current) {
          setHeartbeat(false)
          api.IsLogin().then((res) => {
            if (!res) api.logout()
          })
        } else api.logout()
      } else ++count
    }, heartbeatIntervalTime)
    return () => clearInterval(heartbeat)
  }, [])
  useEffect(() => {
    const body = document.body
    body.onmousedown = body.onkeydown = () => setHeartbeat(true)
    return () => body.onmousedown = body.onkeydown = null
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
            </div>
          </Content>
        </Layout>
      </Layout>
    </Content>
  </Layout>
})
