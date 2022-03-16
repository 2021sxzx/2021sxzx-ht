import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Dropdown, Menu, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageRegions(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    // 是否正在删除，以及删除队列
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isBatching, setIsBatching] = useState(false)
    const onSelectionChange = keys=>{
        console.log(keys)
        setIsBatching(keys.length > 0)
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
    }
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(1)

    const tableColumns = [
        {
            title: '区划编码',
            dataIndex: 'region_id',
            key: 'region_id',
            width: 120
        },
        {
            title: '规则路径',
            dataIndex: 'region_path',
            key: 'region_path',
            width: 500
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
                                modifyRegion(record.region_id)
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
                        <Menu.Item key='2'>
                            <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                deleteSingleItem(record.region_id)
                            }}>
                                删除
                            </Button>
                        </Menu.Item>
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
        // 获取规则id对应的规则路径
        let parent = props.regionNodes[id].parentId
        let currId = id
        let res = []
        while (parent !== '' && parent !== currId){
            res.push({
                nodeId: props.regionNodes[currId].region_id,
                nodeName: props.regionNodes[currId].region_name,
                isRegion: false
            })
            currId = parent
            parent = props.regionNodes[currId].parentId
        }
        res.push({
            nodeId: props.regionNodes[currId].region_id,
            nodeName: props.regionNodes[currId].region_name,
            isRegion: false
        })
        return res
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        setIsDeleting(true)
        setDeletingIds([id])
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        setIsDeleting(true)
        let temp = []
        for (let i = 0; i < selectedRowKeys.length; i++){
            temp.push(selectedRowKeys[i])
        }
        setDeletingIds(temp)
    }

    const endDeleting = ()=>{
        setIsDeleting(false)
    }

    const finishDeleting = ()=>{
        // 确定删除，调用接口
        deleteRegions()
        setIsDeleting(false)
    }

    const deleteRegions = ()=>{
        let data = {
            Regions: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRegions(data).then(response=>{ 
            // 等规则路径问题处理完后只需要刷新regionItems
            props.showSuccess()
            getRegions()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError()
            props.getRegionTree()
            getRegions()
        })
    }

    /*const getRegions = ()=>{
        api.GetRegions({}).then(response=>{
            let regions = response.data.data
            console.log(regions)
            for (let i = 0; i < regions.length; i++){
                regions[i]['region_path'] = getPathByRegionId(regions[i].region_id)
            }
            setTableData(regions)
        }).catch(error=>{

        })
    }*/
    const getRegions = (nodes)=>{
        let regions = []
        for (let key in nodes){
            let region = {
                region_id: nodes[key].region_id,
                isRegion: false,
                region_path: getPathByRegionId(nodes[key].region_id)
            }
            regions.push(region)
        }
        setTableData(regions)
    }

    const searchRegions = (data)=>{
        api.GetRegions(data).then(response=>{
            let regions = response.data.data
            for (let i = 0; i < regions.length; i++){
                regions[region_path] = getPathByRegionId(regions[region_id])
            }
            setTableData(regions)
        }).catch(error=>{

        })
    }

    const modifyRegion = (id)=>{
        let nodes = getNodesByRegionId(id)
        props.setModifyPath(nodes)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        props.setModifyPath('')
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        setCurrent(1)
        getRegions()
    }

    const changePage = (page)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page)
    }

    useEffect(function(){
        getRegions(props.regionNodes)
    }, [props.regionNodes])

    return (
        <>
            <Space direction='vertical' size={12}>
                <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                    <div>是否确定删除该{deletingIds.length}项规则？</div>
                </Modal>
                <SelectForm getSearch={searchRegions} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: 925}}>
                    <Button type='primary' onClick={handleCreate}>创建规则</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='item_region_id'
                    pagination={{onChange: changePage, current: current}}/>
            </Space>
        </>
    )
}
