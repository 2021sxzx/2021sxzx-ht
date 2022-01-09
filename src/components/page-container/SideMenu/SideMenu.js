import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router';
import axios from 'axios';
import { Layout, Menu, } from 'antd'
import  {Scrollbars} from 'react-custom-scrollbars'
import style from './SideMenu.module.css'
import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const menuList = [
  {
    key:'/home',
    title:'首页',
    icon:<DesktopOutlined />
  },
  {
    key:'/personal',
    title:'个人中心',
    icon:<UserOutlined />
  },
  {
    key:'/ItemAudit',
    title:'事项审核',
    icon:<UserOutlined />
  },
  {
    key:'/item-manage',
    title:'事项管理',
    icon:<FileOutlined />,
    children:[
      {
        key:'/item-manage/process',
        title:'事项过程管理',
      },
      {
        key:'/item-manage/guide',
        title:'事项指南管理',
      },
      {
        key:'/item-manage/rule',
        title:'事项规则管理',
      },
    ]
  },
  {
    key:'/comment-manage',
    title:'用户评价管理',
    icon:<FileOutlined />,
    children:[
      {
        key:'/comment-manage/list',
        title:'用户评价'
      },
      {
        key:'/comment-manage/report',
        title:'评价报告'
      }
    ]
  },
  {
    key:'/user-manage',
    title:'用户管理',
    icon:<FileOutlined />,
    children:[
      {
        key:'/user-manage/account',
        title:'后台账号管理'
      },
      {
        key:'/comment-manage/role',
        title:'角色管理'
      },
      {
        key:'/comment-manage/department',
        title:'部门管理'
      },
      {
        key:'/comment-manage/metaData',
        title:'用户资料元数据管理'
      },
      
    ]
  },
]


function SideMenu(props) {

  const [menu, setMenu] = useState(menuList)

  useEffect(()=>{
    //后期要改成根据后台返回数据渲染左侧菜单
    // axios.get('http://localhost:5000/rights?_embed=children').then(res=>{
    //   setMenu(res.data)
  },[])

  const renderMenu = (menuList)=>{
    return menuList.map(item=>{
      if(item.children?.length>0){
        return <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return <Menu.Item key={item.key} icon={item.icon} onClick={()=>{
          props.history.push(item.key)
        }}>{item.title}</Menu.Item>
    })
  }

  const selectedKeys = [props.location.pathname]
  const openKeys = ['/'+props.location.pathname.split('/')[1]]

  return (
      <Sider theme="light">
        <div style={{display:'flex',height:"100%", "flexDirection":"column"}}>
          <div className={style.logo}>广州人社</div>
          <Scrollbars>
            <div style={{flex:1,"overflow":"auto"}}>
              <Menu theme="light" selectedKeys={selectedKeys} mode="inline" defaultOpenKeys={openKeys}>
                {renderMenu(menu)}
              </Menu>
            </div>
          </Scrollbars>
        </div>
      </Sider>
  )
}

export default withRouter(SideMenu)