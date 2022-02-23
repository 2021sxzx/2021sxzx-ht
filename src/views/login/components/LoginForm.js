import HeaderLoginForm from "./HeaderLoginForm";
import {Tabs} from "antd";
import PasswordLoginForm from "./PasswordLoginForm";
import MobileLoginForm from "./MobileLoginForm";
import React from "react";

const {TabPane} = Tabs


export default function LoginForm() {
    return (
        <div>
            <HeaderLoginForm/>
            <Tabs defaultActiveKey="2" centered>
                <TabPane tab="账号密码登录" key="1">
                    <PasswordLoginForm/>
                </TabPane>
                <TabPane tab="手机快捷登录" key="2">
                    <MobileLoginForm/>
                </TabPane>
            </Tabs>
        </div>
    )
}