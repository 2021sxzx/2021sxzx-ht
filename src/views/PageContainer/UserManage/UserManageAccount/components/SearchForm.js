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

    const [searchValue, setSearchValue] = useState('');

    // 保存搜索输入框的搜索关键字
    const handleInputChangeSearchValue = (e) => {
        setSearchValue(e.target.value)
    }

    // 搜索对应的角色
    const searchUser = () => {
        const data = {
            searchValue: searchValue
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
            <Form.Item label={"综合搜索"}>
                <Input placeholder="综合搜索"
                       size="middle"
                       onChange={handleInputChangeSearchValue}
                       type={"search"}
                       maxLength={50}
                       allowClear={true}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={searchUser}>搜索</Button>
            </Form.Item>
        </Form>
    )
}
