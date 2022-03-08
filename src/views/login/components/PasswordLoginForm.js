import {Button, Checkbox, Col, Form, Row, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import QuickLogin from "./QuickLogin";

/**
 * 账号密码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function PasswordLoginForm() {
    const onFinish = (values) => {
        console.log('passwordLoginForm Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('passwordLoginForm Failed:', errorInfo);
    };

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
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {/*账号/手机号码*/}
            <Form.Item
                // label="账号"
                name="userAccount"
                rules={[
                    {
                        required: true,
                        message: '请输入账号/手机号码!',
                    },
                ]}
            >
                <Input placeholder={'账号/手机号码'} prefix={<UserOutlined className="site-form-item-icon"/>}
                       allowClear={true}/>
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
                <Input.Password type={"password"} placeholder={"密码"}
                                prefix={<LockOutlined className="site-form-item-icon"/>} allowClear={true}/>
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
                        <Button type="primary" htmlType="submit" block={true}>
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