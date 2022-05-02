/**
 * 用户管理/角色管理页面
 */
import React, {useEffect, useState} from 'react'

import {Space, message} from 'antd';

import api from "../../../../api/department";
import SelectForm from "./components/SelectForm";
import DepartmentTable from "./components/DepartmentTable";

export default function DepartmentManagement() {
    const [tableData, setTableData] = useState([])
    const [loading,setLoading] = useState(true)
    // 第一次渲染组件的的时候加载表格数据
    useEffect(() => {
        getDepartment()
    }, [])

    // 从服务器获取角色表格的数据，保存到 tableData 中
    const getDepartment = () => {
        setLoading(true)
        api.GetDepartment().then(response => {
            setLoading(false)
            setTableData(response.data.data)
        }).catch(error => {
            console.log('GetDepartment error:', error)
        })
    }

    // 从服务器中获取搜索结果，保存到 tableData 中
    const getSearchDepartment = (data) => {
        setLoading(true)
        api.SearchDepartment(data).then(response => {
            setLoading(false)
            setTableData(response.data.data)
            message.success("搜索部门成功")
        }).catch(error => {
            message.error("搜索部门出现错误")
            console.log("SearchDepartment error:", error)
        })
    }

    return (
        <div>
            <Space direction="vertical" size={12} style={{width: 100 + '%'}}>
                {/* 搜索 */}
                <SelectForm getSearch={getSearchDepartment} refreshTableData={getDepartment}/>
                {/* 部门信息的表格 */}
                <DepartmentTable tableData={tableData} refreshTableData={getDepartment} loading={loading}/>
            </Space>
        </div>
    )
}
