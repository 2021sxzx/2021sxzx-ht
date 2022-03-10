import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'

import './PageContainer.scss'

import Home from './Home/Home'
// import Personal from './Personal/Personal.js'
import Personal from './Personal/Personal'
import ItemManageRule from './ItemManage/ItemManageRule/ItemManageRule'
import ItemManage from './ItemManage/ItemManage'
import ItemManageGuide from './ItemManage/ItemManageGuide/ItemManageGuide'
import ItemManageProcess from './ItemManage/ItemManageProcess/ItemManageProcess'
import CommentManageList from './ComponentManageList/CommentManageList.js'
import CommentManageReport from './CommentManageReport/CommentManageReport.js'
import SystemManageJournal
  from "./SystemManage/SystemManageJournal/SystemManageJournal.js";
import SystemManageResource
  from "./SystemManage/SystemManageResource/SystemManageResource.js";

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
              <Route path="/home" component={Home} />
              <Route path="/comment-manage/list" component={CommentManageList} />
              <Route path="/comment-manage/report" component={CommentManageReport} />
              <Route path="/personal" component={Personal}/>
              <Route path="/item-manage" component={()=><ItemManage />}/>
              <Route path="/system-manage/journal" component={SystemManageJournal}/>
              <Route path="/system-manage/resource" component={SystemManageResource}/>
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
