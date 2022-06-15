import React, { useEffect, useState } from 'react'
import {Button, Layout, Image} from 'antd'
import apiPersonal from '../../../api/personal';
import api from '../../../api/login';
import './TopHeader.scss';

const {Header} = Layout;

export default function TopHeader() {

  // 用户信息
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    apiPersonal.getTopHeaderData()
      .then(value => {
        console.log(value.data)
        setUserInfo(value.data.data)
      })
      .catch(err => {
        console.log(err)
      });
  }, []);

  return (
    <Header className='header'>

      <div className="wrapBox">

        <div className="btnContainer">
          <Button onClick={api.logout}>logout</Button>
        </div>

        <div className="imgContainer">
          <Image
            width={50}
            src={"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}
            preview={false}
          />
        </div>

        <div>
          你好: <strong>{userInfo.user_name}</strong> 你是: <strong>{userInfo.unit_name}</strong> 的: <strong>{userInfo.role_name}</strong>
        </div>
      </div>
    </Header>
  )
}
