import React, { useEffect } from 'react'
import {Button, Layout, Image} from 'antd'
import api from '../../../api/login';
import './TopHeader.scss';

const {Header} = Layout;

export default function TopHeader() {

  useEffect(() => {
    console.log(document.cookie);
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
          你好，你是{"{}"}
        </div>
      </div>
    </Header>
  )
}
