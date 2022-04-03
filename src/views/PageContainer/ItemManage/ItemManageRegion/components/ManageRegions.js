import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Dropdown, Menu, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageRegions(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOringinData] = useState({})
    const [unableCreate, setUnableCreate] = useState(true)
    // 删除队列
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = keys=>{
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
        getCheckboxProps: (record)=>({
            // 不允许删除中间节点
            disabled: record._id in props.regionTree
        })
    }
    // 页数处理
    const [current, setCurrent] = useState(0)
    const [currPageSize, setCurrPageSize] = useState(10)
    const [totalSize, setTotalSize] = useState(0)

    const tableColumns = [
        {
            title: '规则编码',
            dataIndex: 'region_code',
            key: 'region_code',
            width: 120
        },
        {
            title: '规则路径',
            dataIndex: 'region_path',
            key: 'region_path'
        },
        {
            title: '业务部门',
            dataIndex: 'department',
            key: 'department',
            width: 125
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100
        },
        {
            title: '创建时间',
            key: 'create_time',
            width: 120,
            render: (text, record)=>(
                <Space size='middle'>
                    {getYMD(record.create_time)}
                </Space>
            )
        },
        {
            title: '操作',
            key: 'operation',
            width: 120,
            render: (text, record)=>(
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item key='0'>
                            <Button type='primary' onClick={function(){
                                modifyRegion(record._id)
                            }}>
                                编辑
                            </Button>
                        </Menu.Item>
                        <Menu.Item key='1'>
                            <Button type='primary' onClick={function(){
                                message.info('导出！')
                            }}>
                                导出
                            </Button>
                        </Menu.Item>
                        {
                            !(record._id in props.regionTree) &&
                            <Menu.Item key='2'>
                                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                    deleteSingleItem(record._id)
                                }}>
                                    删除
                                </Button>
                            </Menu.Item>
                        }  
                    </Menu>
                } trigger={['click']}>
                    <Button type='primary'>
                        操作
                    </Button>
                </Dropdown>
            )
        }
    ]

    const getPathByRegionId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = props.regionNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = props.regionNodes[currId].region_name + '\\' + res
            currId = parent
            parent = props.regionNodes[currId].parentId
        }
        res = props.regionNodes[currId].region_name + '\\' + res
        return res
    }

    const getNodesByRegionId = (id)=>{
        // 获取规则id对应的规则路径节点
        let parent = props.regionNodes[id].parentId
        let currId = id
        let res = []
        while (parent !== '' && parent !== currId){
            res.push({
                nodeId: props.regionNodes[currId]._id,
                nodeCode: props.regionNodes[currId].region_code,
                nodeName: props.regionNodes[currId].region_name,
                isRegion: false
            })
            currId = parent
            parent = props.regionNodes[currId].parentId
        }
        res.push({
            nodeId: props.regionNodes[currId]._id,
            nodeCode: props.regionNodes[currId].region_code,
            nodeName: props.regionNodes[currId].region_name,
            isRegion: false
        })
        return res
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        let str = '确定删除该节点吗？'
        let nodes = [id]
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                finishDeleting(nodes)
            }
        })
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let str = '确定删除该' + selectedRowKeys.length + '个节点吗？'      
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                finishDeleting(selectedRowKeys)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const finishDeleting = (id)=>{
        // 确定删除，调用接口，通过hook触发
        setDeletingIds(id)
    }

    useEffect(function(){
        // 避免初始化触发或误触发
        if (deletingIds.length === 0) return
        deleteRegions()
    }, [deletingIds])

    const deleteRegions = ()=>{
        let data = {
            regions: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRegions(data).then(response=>{ 
            props.deleteRegionSimulate(deletingIds)
            getRegions()
            props.showSuccess()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError()
            props.getRegionTree()
        })
    }

    const getRegions = ()=>{
        // 无搜索条件获取全数据
        api.GetRegions({
            page_num: 0,
            page_size: currPageSize
        }).then(response=>{
            let regions = response.data.data.data
            setTotalSize(response.data.data.total)
            let table = []
            for (let i = 0; i < regions.length; i++){
                regions[i]['region_path'] = getPathByRegionId(regions[i]._id)
                table.push(regions[i])
            }
            setTableData(table)
        }).catch(error=>{
        })
    }

    const searchRegions = (data)=>{
        // 搜索时重置table
        setOringinData(data)
        let totalData = data
        totalData['page_num'] = 0
        totalData['page_size'] = currPageSize
        api.GetRegions(totalData).then(response=>{
            let regions = response.data.data.data
            setCurrent(0)
            setTotalSize(response.data.data.total)
            let table = []
            for (let i = 0; i < regions.length; i++){
                regions[i]['region_path'] = getPathByRegionId(regions[i]._id)
                table.push(regions[i])
            }
            setTableData(table)
        }).catch(error=>{
        })
    }

    const modifyRegion = (id)=>{
        // 获取该节点的整条父子关系路径并存储，供修改界面使用
        let nodes = getNodesByRegionId(id)
        props.setUpdatePath(nodes)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        // 无路径切换切面即为创建
        props.setUpdatePath([])
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        // 回 归 本 源
        setOringinData({})
        setCurrent(0)
        getRegions()
    }

    const changePage = (page, pageSize)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        // 更新页面数据
        setCurrent(page - 1)
        setCurrPageSize(pageSize)
        // 只是换页的话还是用上一次的搜索条件进行筛查
        let totalData = originData
        totalData['page_num'] = page - 1
        totalData['page_size'] = pageSize
        api.GetRegions(totalData).then(response=>{
            let regions = response.data.data.data
            let table = []
            for (let i = 0; i < regions.length; i++){
                regions[i]['region_path'] = getPathByRegionId(regions[i]._id)
                table.push(regions[i])
            }
            setTableData(table)
        }).catch(error=>{

        })
    }

    useEffect(function(){
        // 避开初始化时执行查询
        for (let key in props.regionTree){
            getRegions()
            // regionTree初始化完毕前不能进行节点创建，否则会报错
            setUnableCreate(false)
            break
        }
    }, [props.regionTree])

    return (
        <>
            <Space direction='vertical' size={12}>
                <SelectForm getSearch={searchRegions} reset={resetSearch} setOringinData={setOringinData}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: '75%'}}>
                    <Button type='primary' onClick={handleCreate} disabled={unableCreate}>创建规则</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='_id'
                    pagination={{onChange: changePage, current: current + 1, total: totalSize}}/>
            </Space>
        </>
    )
}
