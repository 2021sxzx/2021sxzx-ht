import React from 'react'
import { Route, Switch } from 'react-router'
import { Redirect } from 'react-router-dom'

import { Layout, Breadcrumb } from 'antd'
import SideMenu from '../../components/page-container/SideMenu/SideMenu.js'
import TopHeader from '../../components/page-container/TopHeader/TopHeader.js'

import './PageContainer.css'

import Home from './home/Home'
import UserList from './user-manage/UserList.js'
import RoleList from './right-manage/RoleList.js'
import RightList from './right-manage/RightList.js'
import Nopermission from './nopermission/Nopermission.js'

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
              <Route path="/user-manage/list" component={UserList} />
              <Route path="/right-manage/role/list" component={RoleList} />
              <Route path="/right-manage/right/list" component={RightList} />

              <Redirect from="/" to="/home" exact />
              <Route path="*" component={Nopermission} />
            </Switch>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
}
