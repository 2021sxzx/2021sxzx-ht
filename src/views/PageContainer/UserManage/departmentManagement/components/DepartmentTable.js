import {message, Table} from "antd";
import React from "react";
import api from "../../../../../api/department";
import DepartmentModal from "./DepartmentModal";

/**
 * 角色管理的表格
 * @param props = {
 *     tableData:[],// 表格内的数据
 *     refreshTableData:function,// 用于刷新表格数据
 *     loading:boolean, // 是否处于加载中状态
 * }
 * @returns {JSX.Element}
 * @constructor
 */
export default function DepartmentTable(props) {
    const UpdateDepartmentAndRefresh = (data) => {
        // 更新非权限相关的信息
        api.UpdateDepartment(data).then(response => {
            console.log('UpdateDepartment = ', response.data)
            message.success('修改部门信息成功')
            // 刷新表格内容
            props.refreshTableData()
        }).catch(error => {
            message.error('修改部门信息发生错误').then()
            console.log("UpdateDepartment error",error)
        })
    }

    // 表格的属性/列名
    const tableColumns = [
        {
            title: '部门名称',
            dataIndex: 'department_name',
            key: 'department_name',
        },
        {
            title: '部门描述',
            dataIndex: 'department_describe',
            key: 'department_describe',
            render:()=>(
                <>这是部门描述</>
            )
        },
        {
            title: '修改部门信息',
            key: 'detail',
            render: (text, record) => (//查看详情按钮和详情弹窗
                <DepartmentModal buttonText={'修改部门信息'}
                                 buttonType={''}
                                 title={'修改部门信息'}
                                 detailData={record}
                                 callback={UpdateDepartmentAndRefresh}
                />
            ),
        },
    ]

    return (
        <Table columns={tableColumns}
               dataSource={props.tableData !== {} ? props.tableData : {}}
               rowKey={record=>record.role_name}
               loading={props.loading}
        />
    )
}
