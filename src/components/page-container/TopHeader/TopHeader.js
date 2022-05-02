import React from 'react'
import {Button, Layout, message} from 'antd'
import UrlJump from "../../../utils/UrlJump";
import api from '../../../api/login'

const {Header} = Layout;

export default function TopHeader() {
    return (
        <Header style={{background: '#fff', padding: 0}}>
            <div style={{position: "absolute", right: 0, margin: "auto 30px"}}>
                <Button onClick={api.logout}>logout</Button>
            </div>
        </Header>
    )
}
