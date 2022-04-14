/**
 * 用户管理/角色管理页面
 */
import React, { useEffect, useState } from 'react'

import { Space, message } from 'antd';

import api from "../../../../api/department";
import SelectForm from "./components/SelectForm";
import DepartmentTable from "./components/DepartmentTable";

export default function DepartmentManagement() {
    // 用 [] 初始化 useState，第一项（tableData）用于保存状态值（表格数据），第二项（setTableData）用于保存更新状态的函数，
    const [tableData, setTableData] = useState([])
    // 第一次渲染组件的的时候加载表格数据
    useEffect(() => {
        getDepartment()
    }, [])
    // 从服务器获取角色表格的数据，保存到 tableData 中
    const getDepartment = () => {
        api.GetDepartment().then(response => {
            console.log(' GetDepartment =', response.data.data)
            setTableData(response.data.data)
        }).catch(error => {
            console.log('GetDepartment error:', error)
        })
    }
    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchDepartment = (data) => {
        // log 搜索值
        console.log('roleSearchValue=', data)
        api.SearchDepartment(data).then(response => {
            // log 服务端返回的搜索结果
            console.log('SearchDepartment=', response.data)
            setTableData(response.data.data)
            message.success("搜索部门成功")
        }).catch(error => {
            message.error("搜索部门出现错误")
            console.log("SearchDepartment error:", error)
        })
    }

    return (
        <div>
            <Space direction="vertical" size={12} style={{width:100+'%'}}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchDepartment} refreshTableData={getDepartment} />
                {/* 部门信息的表格 */}
                <DepartmentTable tableData={tableData} refreshTableData={getDepartment} />
            </Space>
        </div>
    )
}
