import {Button, Form, Input, message} from "antd";
import React, {useCallback} from "react";
import api from "../../../../../api/role";
import RoleModal from "./RoleModal";

/**
 *
 * @param props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 *     refreshTableData:function, // 用于重新获取表格数据，刷新表格内容
 * }
 * @returns {JSX.Element}
 * @constructor
 */
function SelectForm(props) {
    // 使用并设置表单组件
    const [form] = Form.useForm();

    // 搜索对应的角色
    const Search = () => {
        form.validateFields().then(() => {
            props.getSearch({
                searchValue: form.getFieldValue('searchValue')
            })
        }).catch(() => {
        })
    }

    const AddRoleAndRefresh = useCallback((data) => {
        // 新增角色
        api.AddRole({
            role_name: data.role_name,
            role_describe: data.role_describe,
            permission_identifier_array: data.permission_identifier_array,
        }).then(() => {
            message.success('创建角色成功')
        }).catch(() => {
            message.error('创建角色出现错误')
        }).finally(() => {
            props.refreshTableData()
        })
    }, [props.refreshTableData])

    return (
        <>
            <Form
                layout={'inline'}
                form={form}
                initialValues={{
                    searchValue: '',
                }}
                onFinish={Search}
            >
                <Form.Item>
                    <RoleModal
                        buttonText={'创建角色'}
                        buttonType={'primary'}
                        title={'新增角色'}
                        detailData={{
                            role_name: '',
                            role_describe: '',
                            permission: [],
                            permission_identifier_array: [],
                        }}
                        callback={AddRoleAndRefresh}/>
                </Form.Item>
                <Form.Item
                    name={'searchValue'}
                    rules={[
                        {
                            max: 64,
                            message: '搜索内容请小于64个字',
                        },
                    ]}
                >
                    <Input
                        placeholder="请输入角色名称或描述"
                        size="middle"
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType={'submit'}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default React.memo(SelectForm)
