import React from 'react'
import { Redirect, Switch,Route } from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'

import './PageContainer.scss'

// 导入页面内容
import Home from './Home/Home'
import Personal from './Personal/Personal'
import ItemManage from './ItemManage/ItemManage'
import CommentManageList from './ComponentManageList/CommentManageList.js'
import CommentManageReport from './CommentManageReport/CommentManageReport.js'
import SystemManageBasic from './SystemManage/SystemManageBasic/SystemManageBasic.js'
import SystemManageJournal
  from "./SystemManage/SystemManageJournal/SystemManageJournal.js";
import SystemManageResource
  from "./SystemManage/SystemManageResource/SystemManageResource.js";
import UserManageAccount
  from './UserManage/UserManageAccount/UserManageAccount'
import UserManageRole from './UserManage/UserManageRole/UserManageRole'
import SystemManageFailure from './SystemManage/SystemManageFailure/SystemManageFailure.js';
import MetaData from './SystemManage/MetaData/MetaData.js'
import SystemManageBackup from './SystemManage/SystemManageBackup/SystemManageBackup.js'
import NoPermission from './NoPermission/NoPermission.js'

const { Content } = Layout

export default function PageContainer() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu/>
      <Layout className="site-layout">
        <TopHeader/>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
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
              {/* 日志管理 */}
              <Route path="/system-manage/journal" component={SystemManageJournal} />
              {/* 资源管理 */}
              <Route path="/system-manage/resource" component={SystemManageResource} />
              {/* 后台账号管理 */}
              <Route path="/user-manage/account" component={UserManageAccount} />
              {/* 角色管理 */}
              <Route path="/user-manage/role" component={UserManageRole} />
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
}
