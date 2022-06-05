import { Form,  message} from "antd";
import React, {useState} from "react";
import api from "../../../../../../api/department";
import UnitModal from "./UnitModal";

/**
 *
 * @param props = {
 *     getSearch:function, // 点击搜索按钮会触发的回调函数
 *     refreshTableData:function, // 用于重新获取表格数据，刷新表格内容
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function UnitSelectForm(props) {
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
        props.getSearch(data)
    }

    const AddDepartmentAndRefresh = (data) => {
        // 新增角色非权限信息
        api.AddDepartment({
            department_name: data.department_name,
            department_describe: data.department_describe,
        }).then(response => {
            console.log('AddDepartment=', response.data)
            message.success('新增部门成功')
            // 刷新表格内容
            props.refreshTableData()
        }).catch(error => {
            message.error('新增部门出现错误')
            console.log("AddRole error", error)
        })
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
                    <UnitModal buttonText={'新增机构'} buttonType={'primary'} title={'新增机构'}
                               detailData={{
                                         department_name: '',
                                         department_describe: '',
                                     }} callback={AddDepartmentAndRefresh}/>
                </Form.Item>
            </Form>
        </>
    )
}
