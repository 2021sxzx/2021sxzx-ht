import {Form} from "antd";
import React from "react";

/**
 * 个人中心中展示的数据表单
 * @param props = {
 *     data:{ // 要展示的数据
 *         account: string,
 *         user_name: string,
 *         password: string,
 *         role: string,
 *         unit: string,
 *     }
 * }
 * @return {JSX.Element}
 * @constructor
 */
function PersonalDescription(props) {
    const [form] = Form.useForm()

    // 表单初始化数据
    const initialValues = {
        account: props.data.account,
        user_name: props.data.user_name,
        password: props.data.password,
        role: props.data.role_id,
        unit: props.data.unit_id,
    }

    return (
        <div>
            <Form
                form={form}
                initialValues={initialValues}
            >
                <Form.Item
                    label="账号/手机号码"
                    name="account"
                >
                    {props.data.account}
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="roleName"
                >
                    {props.data.role_name}
                </Form.Item>

                <Form.Item
                    label="机构"
                    name="unitName"
                >
                    {props.data.unit_name}
                </Form.Item>
            </Form>
        </div>
    )
}

export default PersonalDescription
