import {Button, Form, Input} from "antd";
import React, {useState} from "react";

/**
 * 筛选搜索表单
 * @returns props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 * }
 * @constructor
 */
export default function SearchForm(props){
    const [form] = Form.useForm();
    const formLayout = 'inline';

    const [userName, setUserName] = useState('');
    const [account, setAccount] = useState('');
    const [roleName, setRoleName] = useState('');
    const [department, setDepartment] = useState('');

    // 保存搜索输入框的搜索关键字
    const handleInputChangeUserName = (e) => {
        setUserName(e.target.value)
    }
    const handleInputChangeAccount = (e) => {
        setAccount(e.target.value)
    }
    const handleInputChangeRoleName = (e) => {
        setRoleName(e.target.value)
    }
    const handleInputChangeDepartment = (e) => {
        setDepartment(e.target.value)
    }

    // 搜索对应的角色
    // TODO(zzj)：目前搜索的 API 还不支持用户名之外的查询
    const searchUser = () => {
        const data = {
            searchValue: userName
            // user_name:userName,
            // account:account,
            // role_name:roleName,
            // department:department
        }
        props.getSearch(data)
    }

    return(
        <Form
            layout={formLayout}
            form={form}
            initialValues={{
                layout: formLayout,
            }}
        >
            <Form.Item label={"用户姓名"}>
                <Input placeholder="根据用户姓名搜索" size="middle" onChange={handleInputChangeUserName}/>
            </Form.Item>
            <Form.Item label={"用户账号"}>
                <Input placeholder="根据用户账号搜索" size="middle" onChange={handleInputChangeAccount}/>
            </Form.Item>
            <Form.Item label={"角色"}>
                {/*TODO（钟卓江）：需要换成下拉列表的多选框吗？*/}
                <Input placeholder="根据角色搜索" size="middle" onChange={handleInputChangeRoleName}/>
            </Form.Item>
            <Form.Item label={"部门"}>
                <Input placeholder="根据部门搜索" size="middle" onChange={handleInputChangeDepartment}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={searchUser}>搜索</Button>
            </Form.Item>
        </Form>
    )
}