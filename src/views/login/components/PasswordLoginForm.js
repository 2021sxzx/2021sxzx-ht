import {Button, Checkbox, Col, Form, Row, Input, message} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import QuickLogin from "./QuickLogin";
import api from "../../../api/login";
import Cookie from "../../../utils/Cookie";
import UrlJump from "../../../utils/UrlJump";
import MenuList from "../../../utils/MenuList";

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    const [account, setAccount] = useState('')
    const [password, setPassword] = useState('')

    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }

    const handleInputChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = () => {
        api.Login({
            account: account,
            password: password
        }).then(async response => {
            console.log('login response', response.data)
            // 存 token
            Cookie.setCookie('loginToken', response.data.data.jwt.token)
            // 存角色
            Cookie.setCookie('roleName', response.data.data.role_name)
            // 获取并保存侧边栏
            MenuList.getAndStorageMenuList(response.data.data.role_name)

            // TODO(钟卓江): 使用异步的方式等待 getAndStorageMenuList 完成后展现登录成功操作提示并跳转到首页
            setTimeout(()=>{
                message.success('登录成功')
                UrlJump.goto('#/home')
            },300)



        }).catch(error => {
            console.log('error:login', error)
            message.error('登录失败，请尝试重新登录')
        })
    }


    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                offset: 8,
                span: 8,
            }}
            initialValues={{
                remember: true,
            }}
            autoComplete="off"
        >
            {/*账号/手机号码*/}
            <Form.Item
                // label="账号"
                name="account"
                rules={[
                    {
                        required: true,
                        message: '请输入账号/手机号码!',
                    },
                ]}
            >
                <Input placeholder={'账号/手机号码'} prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true} onChange={handleInputChangeAccount}/>
            </Form.Item>
            {/*密码*/}
            <Form.Item
                // label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input.Password type={"password"}
                                placeholder={"密码"}
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                allowClear={true}
                                onChange={handleInputChangePassword}/>
            </Form.Item>
            {/*是否记住登录状态 & 忘记密码 */}
            <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                    offset: 8,
                    span: 8,
                }}
            >
                <Row>
                    <Col span={8}>
                        <Checkbox>自动登录</Checkbox>
                    </Col>
                    <Col span={3} offset={13}>
                        <a className="login-form-forgot" href="">
                            忘记密码
                        </a>
                    </Col>
                </Row>
            </Form.Item>
            {/*登录按钮*/}
            <Form.Item>
                <Row type="flex" justify="center" align="middle">
                    <Col span={24}>
                        <Button type="primary" htmlType="submit" block={true} onClick={login}>
                            登录
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item>
                {/*第三方快捷登录*/}
                <QuickLogin/>
            </Form.Item>
        </Form>
    )
}