/**
 * 用户管理/后台账号管理页面
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import './UserManageAccount.scss'
import { message, Space} from 'antd';

import api from "../../../../api/user";
import UserTableFunctionalZone from "./components/UserTableFunctionalZone";
import UserTable from "./components/UserTable";
import SideDrawer from "./components/UnitManagement/SideDrawer";
// import UnitSelectForm from "./components/UnitManagement/UnitSelectForm";
import UnitList from "./components/UnitManagement/UnitList";
// import {hidden} from "caniuse-lite/data/features";


//  修改页面 UI 样式
export default function UserManageAccount() {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)
    // const [unitIDSelected,setUnitIDSelected] = useState(null)
    const unitIDRef = useRef(null)

    // 从服务器获取所有用户的数据，保存到 tableData 中
    const getUser = useCallback(() => {
        setLoading(true)

        api.GetUser().then(response => {
            setTableData(response.data.data)
        }).catch(error => {
            console.log("error = ", error)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    // 更新选中的 unit_id，useCallback 用于减少组件 UnitList 的渲染
    const selectUnitID = useCallback((unitID) => {
        // setUnitIDSelected(unitID)
        // unitIDSelected = unitID
        unitIDRef.current = unitID
        // console.log('selectUnit',unitIDSelected,unitID)
        // console.log('unitIDRef',unitIDRef)
        getUserByID()
    }, [])

    // 从服务器获取用户表格的数据，保存到 tableData 中
    const getUserByID = useCallback(() => {
        setLoading(true)
        console.log('getUserByID',unitIDRef.current)
        if(unitIDRef.current) {
            api.GetUserByID({
                // unit_id: unitIDSelected
                unit_id: unitIDRef.current
            }).then(response => {
                setTableData(response.data.data)
            }).catch(error => {
                console.log("error = ", error)
            }).finally(() => {
                setLoading(false)
            })
        }else{
            api.GetUser().then(response => {
                setTableData(response.data.data)
            }).catch(error => {
                console.log("error = ", error)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [])

    // 从服务器中获取搜索结果，保存到 tableData 中
    // useCallback 用于减少 UserTableFunctionalZone 组件的渲染
    const getSearchUser = useCallback((data) => {
        setLoading(true)

        api.SearchUser(data).then(response => {
            setTableData(response.data.data)
            message.success('搜索用户信息成功')
        }).catch(error => {
            console.log("error = ", error)
            message.error('搜索用户信息发生错误')
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    // 获取所有评论表格的数据，仅在第一次渲染时执行。
    useEffect(() => {
        getUser()
        // getUserByID()
    }, [])

    // 用于减少 SideDrawer 组件的渲染
    const SideDrawerProps = useMemo(() => {
        return {
            buttonTitle: '机构列表',
            title: '机构列表',
            visible: true,
            getContainer: false,
            style: {
                position: 'static',
                height: '100%',
            },
            drawerContainerOpenStyle: {
                height: '100%',
            },
            extra: (
                <div>
                    {/*<UnitSelectForm />*/}
                </div>
            )
        }
    }, [])

    const unitListComponent = useRef(<UnitList selectUnitID={selectUnitID}/>)

    return (
        <div className={'user-manage-container'}>
            <div className="drawer-container">
                <SideDrawer
                    {...SideDrawerProps}
                >
                    {unitListComponent.current}
                </SideDrawer>
            </div>
            <div className='user-account-container'>
                <Space direction="vertical" size={12} style={{width: '100%'}}>
                    {/* 功能区 */}
                    <UserTableFunctionalZone getSearch={getSearchUser}/>
                    {/* 用户评价的表格 */}
                    <UserTable tableData={tableData} refreshTableData={getUserByID} loading={loading}/>
                </Space>
            </div>
        </div>
    )
}
