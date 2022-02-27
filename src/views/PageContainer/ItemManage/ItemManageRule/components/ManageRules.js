import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageRules(props) {
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
            title: '事项规则编码',
            dataIndex: 'item_rule_id',
            key: 'item_rule_id',
            width: 150
        },
        {
            title: '事项规则',
            dataIndex: 'rule_path',
            key: 'rule_path',
            width: 530
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
            width: 160,
            render: (text, record)=>(
                <Space size='small'>
                    <Button type='primary' onClick={function(){
                        modifyItemRule(record.item_rule_id)
                    }}>修改</Button>
                    <Button type='default' onClick={function(){
                        deleteSingleItem(record.item_rule_id)
                    }}>删除</Button>
                </Space>
            )
        }
    ]

    const getPathByRuleId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = props.ruleNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = props.ruleNodes[currId].rule_name + '\\' + res
            currId = parent
            parent = props.ruleNodes[currId].parentId
        }
        res = props.ruleNodes[currId].rule_name + '\\' + res
        return res
    }

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

    const getItemRules = ()=>{
        // 获取所有事项规则
        api.GetItemRules({}).then(response=>{
            let rules = response.data.data
            for (let i = 0; i < rules.length; i++){
                rules[i]['rule_path'] = getPathByRuleId(rules[i]['rule_id']) + getPathByRegionId(rules[i]['region_id'])
            }
            setTableData(rules)
        }).catch(error=>{
        })
    }

    const deleteSingleItem = (id)=>{
        // 删除单个事项，将事项id设为deletingIds
        setIsDeleting(true)
        setDeletingIds([{
            item_rule_id: id
        }])
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        setIsDeleting(true)
        let temp = []
        for (let i = 0; i < selectedRowKeys.length; i++){
            temp.push({
                item_rule_id: selectedRowKeys[i]
            })
        }
        setDeletingIds(temp)
    }

    const endDeleting = ()=>{
        setIsDeleting(false)
    }

    const finishDeleting = ()=>{
        // 确定删除，调用接口
        deleteRules()
        setIsDeleting(false)
    }

    const deleteRules = ()=>{
        let data = {
            itemRules: deletingIds
        }
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteItemRules(data).then(response=>{ 
            // 等规则路径问题处理完后只需要刷新ruleItems
            getItemRules()
        }).catch(error=>{
            console.log(error)
        })
    }

    const searchItemRules = (data)=>{
        api.GetItemRules(data).then(response=>{
            let rules = response.data.data
            for (let i = 0; i < rules.length; i++){
                rules[i]['rule_path'] = getPathByRuleId(rules[i]['rule_id']) + getPathByRegionId(rules[i]['region_id'])
            }
            setTableData(rules)
        }).catch(error=>{
        })
    }

    const modifyItemRule = (id)=>{
        props.setModifyId(id)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        props.setModifyId('')
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        setCurrent(1)
        getItemRules()
    }

    const changePage = (page)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page)
    }

    useEffect(()=>{
        getItemRules()
    },[props.ruleNodes, props.regionNodes])

    return (
        <>
            <Space direction='vertical' size={12}>
                <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                    <div>是否确定删除该{deletingIds.length}项规则？</div>
                </Modal>
                <SelectForm getSearch={searchItemRules} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: 925}}>
                    <Button type='primary' onClick={handleCreate}>创建事项</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='item_rule_id'
                    pagination={{onChange: changePage, current: current}}/>
            </Space>
        </>
    )
}
