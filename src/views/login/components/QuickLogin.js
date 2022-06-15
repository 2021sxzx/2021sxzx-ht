import {Avatar, Space} from "antd";
import {QqOutlined, WechatOutlined} from "@ant-design/icons";
import React from "react";

/**
 * 第三方快捷登录的组件
 * @returns {JSX.Element}
 * @constructor
 */
export default function QuickLogin() {
    return (
        <Space size={"middle"}>
            其他登录方式：（举个例子）
            <Avatar icon={<WechatOutlined/>}/>
            <Avatar icon={<QqOutlined/>}/>
        </Space>
    )
}
