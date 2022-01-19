import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'

import './PageContainer.scss'

// 导入页面内容
import Home from './Home/Home'
import Personal from './Personal/Personal'
import ItemManageRule from './ItemManage/ItemManageRule/ItemManageRule'
import ItemManageGuide from './ItemManage/ItemManageGuide/ItemManageGuide'
import ItemManageProcess from './ItemManage/ItemManageProcess/ItemManageProcess'
import CommentManageList from './ComponentManageList/CommentManageList.js'
import CommentManageReport from './CommentManageReport/CommentManageReport.js'
import SystemManageJournal
  from "./SystemManage/SystemManageJournal/SystemManageJournal.js";
import SystemManageResource
  from "./SystemManage/SystemManageResource/SystemManageResource.js";
import UserManageAccount
  from './UserManage/UserManageAccount/UserManageAccount'
import UserManageRole from './UserManage/UserManageRole/UserManageRole'
import NoPermission from './NoPermission/NoPermission.js'

const { Content } = Layout

export default function PageContainer() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
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
              <Route path="/item-manage/process" component={ItemManageProcess} />
              {/* 事项指南管理 */}
              <Route path="/item-manage/guide" component={ItemManageGuide} />
              {/* 事项规则管理 */}
              <Route path="/item-manage/rule" component={ItemManageRule} />
              {/* 日志管理 */}
              <Route path="/system-manage/journal" component={SystemManageJournal} />
              {/* 资源管理 */}
              <Route path="/system-manage/resource" component={SystemManageResource} />
              {/* 后台账号管理 */}
              <Route path="/user-manage/account" component={UserManageAccount} />
              {/* 角色管理 */}
              <Route path="/user-manage/role" component={UserManageRole} />
              {/* 其他 */}
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
