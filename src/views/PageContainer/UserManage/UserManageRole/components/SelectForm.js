import {Button, Form, Input, message} from "antd";
import React, {useState} from "react";
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
    console.log('SelectForm')
    // 使用并设置表单组件
    const [form] = Form.useForm();
    const formLayout = 'inline';

    // roleName 为状态值，setRoleName 为更新 roleName 的方法
    const [searchValue, setSearchValue] = useState('');

    // 保存输入框的角色名称
    const handleInputChange = (e) => {
        setSearchValue(e.target.value)
    }

    // 搜索对应的角色
    const Search = () => {
        const data = {
            searchValue: searchValue
        }

        props.getSearch(data)
    }

    const AddRoleAndRefresh = (data) => {
        // // 用于判断所有信息是否都完成更新
        // let canRefresh = false

        // // 自动决定是否刷新表格
        // const autoRefresh = () => {
        //     if (canRefresh) {
        //         message.success('新增角色成功')
        //         // 刷新表格
        //         props.refreshTableData()
        //     } else {
        //         canRefresh = true
        //     }
        // }

        // 新增角色
        api.AddRole({
            role_name: data.role_name,
            role_describe: data.role_describe,
            permission_identifier_array: data.permission_identifier_array,
        }).then(() => {
            message.success('添加角色成功')
        }).catch(() => {
            message.error('添加角色出现错误')
        }).finally(()=>{
            props.refreshTableData()
        })

        // // 新增角色权限信息
        // api.AddRolePermission({
        //     role_name: data.role_name,
        //     permission_identifier_array: data.permission_identifier_array
        // }).then(response => {
        //     // log 服务端返回的搜索结果
        //     console.log('addRolePermissionResult=', response.data)
        //     autoRefresh()
        // }).catch(error => {
        //     message.error('新增角色权限出现错误')
        //     console.log("AddRolePermission error", error)
        // })
    }

    return (
        <>
            <Form
                layout={formLayout}
                form={form}
                initialValues={{
                    layout: formLayout,
                }}
            >
                <Form.Item>
                    <RoleModal buttonText={'新增角色'} buttonType={'primary'} title={'新增角色'}
                               detailData={{
                                   role_name: '',
                                   role_describe: '',
                                   permission: [],
                                   permission_identifier_array: [],
                               }} callback={AddRoleAndRefresh}/>
                </Form.Item>
                <Form.Item>
                    <Input placeholder="请输入角色名称或描述" size="middle" onChange={handleInputChange}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={Search}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default React.memo(SelectForm)
