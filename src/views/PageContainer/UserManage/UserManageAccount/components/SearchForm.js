import {Button, Form, Input} from "antd";
import React, {useState} from "react";

/**
 * 筛选搜索表单
 * @returns props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 * }
 * @constructor
 */
export default function SearchForm(props) {
    const [form] = Form.useForm();

    // 搜索对应的角色
    function searchUser() {
        props.getSearch({
            searchValue: form.getFieldValue('searchValue')
        })
    }

    return (
        <Form
            layout={'inline'}
            form={form}
            initialValues={{
                searchValue: '',
            }}
            onFinish={searchUser}
            autoComplete="off"
        >
            <Form.Item
                label={"综合搜索"}
                name={'searchValue'}
                rules={[
                    {
                        max: 64,
                        message: '搜索内容请小于64个字'
                    }
                ]}
            >
                <Input placeholder="综合搜索"
                       size="middle"
                       type={"search"}
                       allowClear={true}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType={'submit'}
                >搜索</Button>
            </Form.Item>
        </Form>
    )
}
