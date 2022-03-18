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
export default function SelectForm(props) {
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
        // TODO(zzj):新增角色有bug，服务器会崩溃！！！
        // 新增角色非权限信息
        api.AddRole(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('addRoleResult=', response.data)
            message.success('新增角色成功')
        }).catch(error => {
            message.error('新增角色出现错误')
            console.log("AddRole error",error)
        })

        // 新增角色权限信息
        api.AddRolePermission(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('addRolePermissionResult=', response.data)
            message.success('新增角色权限成功')
        }).catch(error => {
            message.error('新增角色权限出现错误')
            console.log("AddRolePermission error",error)
        })

        // 刷新页面
        props.refreshTableData()
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
                                   permission: []
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