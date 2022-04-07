import {Button, Form, Input, message} from "antd";
import React, {useState} from "react";
import api from "../../../../../api/department";
import DepartmentModal from "./DepartmentModal";

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

    const [searchValue, setSearchValue] = useState('');

    // 保存输入框的部门名称
    const handleInputChange = (e) => {
        setSearchValue(e.target.value)
    }

    // 搜索对应的部门
    const Search = () => {
        const data = {
            searchValue: searchValue
        }
        // TODO(钟卓江）：这个 API 暂时有问题，会引起服务器崩溃，先注释掉
        // props.getSearch(data)
    }

    const AddDepartmentAndRefresh = (data) => {
        // 新增角色非权限信息
        api.AddDepartment({
            department_name: data.department_name,
            department_describe: data.department_describe,
        }).then(response => {
            console.log('AddDepartment=', response.data)
            message.success('新增部门成功')
        }).catch(error => {
            message.error('新增部门出现错误')
            console.log("AddRole error", error)
        })

        // 刷新表格数据
        setTimeout(props.refreshTableData, 1000)
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
                    <DepartmentModal buttonText={'新增部门'} buttonType={'primary'} title={'新增部门'}
                                     detailData={{
                                         department_name: '',
                                         department_describe: '',
                                     }} callback={AddDepartmentAndRefresh}/>
                </Form.Item>
                <Form.Item>
                    <Input placeholder="请输入部门名称或描述" size="middle" onChange={handleInputChange}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={Search}>搜索</Button>
                </Form.Item>
            </Form>
        </>
    )
}
