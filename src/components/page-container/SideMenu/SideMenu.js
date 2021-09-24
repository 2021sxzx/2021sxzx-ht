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
    key:'/mine',
    title:'个人中心',
    icon:<UserOutlined />
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