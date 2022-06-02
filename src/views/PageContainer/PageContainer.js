import React, {useEffect, useState} from 'react'
import {Redirect, Switch, Route, withRouter} from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'

import './PageContainer.scss'

// 导入页面内容
import Home from './Home/Home'
import Personal from './Personal/Personal'
import ItemManage from './ItemManage/ItemManage.js'
import ItemAudit from './ItemAudit/ItemAudit.js'
import CommentManageList from './CommentManageList/CommentManageList.js'
import CommentManageReport from './CommentManageReport/CommentManageReport.js'
import MetaData from './SystemManage/MetaData/MetaData.js'
import SystemManageJournal
  from "./SystemManage/SystemManageJournal/SystemManageJournal.js";
import SystemManageResource
  from "./SystemManage/SystemManageResource/SystemManageResource.js";
import UserManageAccount
  from './UserManage/UserManageAccount/UserManageAccount'
import UserManageRole from './UserManage/UserManageRole/UserManageRole'
import SystemManageFailure from './SystemManage/SystemManageFailure/SystemManageFailure.js';
import SystemManageBasic from './SystemManage/SystemManageBasic/SystemManageBasic.js'
import SystemManageBackup from './SystemManage/SystemManageBackup/SystemManageBackup.js'
import NoPermission from './NoPermission/NoPermission.js'
import DepartmentManagement from "./UserManage/departmentManagement/DepartmentManagement";
import MenuList from "../../utils/MenuList";

const { Content } = Layout

export default withRouter(function PageContainer(props) {
  const [curRoute,setCurRoute]=useState([])
  const menuTitle=new Map([])
  function getMenuTitle(menu){
      if (!menu) return
      menu.map(item=>{
        menuTitle.set(item.key,item.title)
        if (item.children?.length > 0) {
            getMenuTitle(item.children)
        }
      })
  }

  const getPathName=(path,menuTitle)=>{
      let mid=path.split('/')
      for (let i=0;i<mid.length;i++){
        if (i<mid.length-1) mid[i+1]=mid[i]+'/'+mid[i+1]
        if (i>0) mid[i]=menuTitle.get(mid[i])
      }
      mid.splice(0,1)
      return mid

  }

  useEffect(()=>{
    MenuList.getAndStorageMenuList((menuList)=>{
        if (!menuList) return
        getMenuTitle(menuList)
        setCurRoute(getPathName(props.location.pathname,menuTitle))
      // console.log('获得了 menuList', menuList)
    })
  },[])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu setCurRoute={setCurRoute} getPathName={getPathName}/>
      <Layout className="site-layout">
        <TopHeader/>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {
              curRoute.map(item=>{
                return(
                    <Breadcrumb.Item>{item}</Breadcrumb.Item>
                )
              })
            }
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, }}>
            <Switch>
              {/* 首页 */}
              <Route path="/home" component={Home} />
              {/* 用户评价 */}
              <Route path="/comment-manage/list" component={CommentManageList} />
              {/* 评价报告 */}
              <Route path="/comment-manage/report" component={CommentManageReport} />
              {/* 个人中心 */}
              <Route path="/personal" component={Personal} />
              {/* 事项过程管理 */}
              <Route path="/item-manage" component={ItemManage} />
              <Route path="/item-audit" component={ItemAudit} />
              {/* 日志管理 */}
              <Route path="/system-manage/journal" component={SystemManageJournal} />
              {/* 资源管理 */}
              <Route path="/system-manage/resource" component={SystemManageResource} />
              {/* 后台账号管理 */}
              <Route path="/user-manage/account" component={UserManageAccount} />
              {/* 角色管理 */}
              <Route path="/user-manage/role" component={UserManageRole} />
              {/* 部门管理 */}
              <Route path="/user-manage/department" component={DepartmentManagement} />
              <Route path="/system-manage/failure" component={SystemManageFailure}/>
              <Route path="/system-manage/meta-data" component={MetaData}/>
              <Route path="/system-manage/backup" component={SystemManageBackup}/>
              <Route path="/system-manage/basic" component={SystemManageBasic}/>
              <Redirect from="/" to="/home" exact />
              <Route path="*" component={NoPermission} />
            </Switch>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
})
