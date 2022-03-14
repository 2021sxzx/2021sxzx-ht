import {Button, Col, Form, Input, Row} from "antd";
import {MobileOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import QuickLogin from "./QuickLogin";
import CountDownButton from "./CountDownButton";

/**
 * 手机验证码登录
 * @returns {JSX.Element}
 * @constructor
 */
export default function MobileLoginForm() {
    const onFinish = (values) => {
        console.log('MobileLoginForm Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('MobileLoginForm Failed:', errorInfo);
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
            {/*手机号码*/}
            <Form.Item
                // label="手机号码"
                name="phoneNumber"
                rules={[
                    {
                        required: true,
                        message: '请输入手机号码!',
                    },
                ]}
            >
                <Input placeholder={'手机号码'} prefix={<UserOutlined className="site-form-item-icon"/>} allowClear={true}/>
            </Form.Item>
            {/*验证码*/}
            <Form.Item
                // label="验证码"
                name="verificationCode"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码!',
                    },
                ]}
            >
                <Row>
                    <Col span={16}>
                        <Input placeholder={"验证码"}
                               prefix={<MobileOutlined/>} allowClear={true}/>
                    </Col>
                    <Col span={7} offset={1}>
                        <CountDownButton />
                    </Col>
                </Row>
            </Form.Item>

            {/*登录按钮*/
            }
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