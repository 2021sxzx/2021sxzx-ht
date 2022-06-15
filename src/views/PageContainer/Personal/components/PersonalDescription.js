import {Form} from "antd";
import React from "react";


function PersonalDescription(props) {
    const [form] = Form.useForm()

    // 表单初始化数据
    const initialValues = {
        // account: props.detailData.account,
        // user_name: props.detailData.user_name,
        // password: props.detailData.password,
        // role: props.detailData.role_id,
        // unit: props.detailData.unit_id,
        account: 'account',
        userName: 'user_name',
        password: 'password',
        roleName: 'role_name',
        unitName: 'unit_name',
    }

    return (
        <div>
            {/*<Divider />*/}
            <Form
                form={form}
                // name="basic"
                // labelCol={{
                //     span: 8,
                // }}
                // wrapperCol={{
                //     span: 16,
                // }}
                initialValues={initialValues}
                // autoComplete="off"
            >
                <Form.Item
                    label="账号/手机号码"
                    name="account"
                >
                    {/*<div>{form.getFieldValue('account')}</div>*/}
                    18128706873
                </Form.Item>

                {/*<Form.Item*/}
                {/*    label="用户名"*/}
                {/*    name="userName"*/}
                {/*>*/}
                {/*    <div>{form.getFieldValue('userName')}</div>*/}
                {/*</Form.Item>*/}

                <Form.Item
                    label="用户密码"
                    name="password"
                >
                    {/*<div>{form.getFieldValue('password')}</div>*/}
                    11aaAA@@
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="roleName"
                >
                    {/*<div>{form.getFieldValue('roleName')}</div>*/}
                    业务员
                </Form.Item>

                <Form.Item
                    label="机构"
                    name="unitName"
                >
                    {/*<div>{form.getFieldValue('unitName')}</div>*/}
                    办公室
                </Form.Item>
            </Form>
        </div>
    )
}

export default PersonalDescription
