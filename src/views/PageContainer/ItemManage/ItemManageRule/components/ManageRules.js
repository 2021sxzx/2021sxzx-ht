import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Dropdown, Menu, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
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
            title: '规则编码',
            dataIndex: 'rule_id',
            key: 'rule_id',
            width: 120
        },
        {
            title: '规则路径',
            dataIndex: 'rule_path',
            key: 'rule_path',
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
                                modifyRule(record.rule_id)
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
                                deleteSingleItem(record.rule_id)
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

    const getNodesByRuleId = (id)=>{
        // 获取规则id对应的规则路径节点
        let parent = props.ruleNodes[id].parentId
        let currId = id
        let res = []
        while (parent !== '' && parent !== currId){
            res.push({
                nodeId: props.ruleNodes[currId].rule_id,
                nodeName: props.ruleNodes[currId].rule_name,
                isRegion: false
            })
            currId = parent
            parent = props.ruleNodes[currId].parentId
        }
        res.push({
            nodeId: props.ruleNodes[currId].rule_id,
            nodeName: props.ruleNodes[currId].rule_name,
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
        deleteRules()
        setIsDeleting(false)
    }

    const deleteRules = ()=>{
        let data = {
            rules: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRules(data).then(response=>{ 
            // 等规则路径问题处理完后只需要刷新ruleItems
            props.showSuccess()
            getRules()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError()
            props.getruleTree()
            getRules()
        })
    }

    const getRules = (nodes)=>{
        let rules = []
        console.log(nodes)
        console.log(props.ruleTree)
        for (let key in nodes){
            if (nodes[key].rule_id in props.ruleTree){
                continue
            }
            let rule = {
                rule_id: nodes[key].rule_id,
                isRegion: false,
                rule_path: getPathByRuleId(nodes[key].rule_id)
            }
            rules.push(rule)
        }
        setTableData(rules)
    }

    const searchRules = (data)=>{
        api.GetRules(data).then(response=>{
            let rules = response.data.data
            for (let i = 0; i < rules.length; i++){
                rules[rule_path] = getPathByRuleId(rules[rule_id])
            }
            setTableData(rules)
        }).catch(error=>{

        })
    }

    const modifyRule = (id)=>{
        let nodes = getNodesByRuleId(id)
        props.setModifyPath(nodes)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        props.setModifyPath('')
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        setCurrent(1)
        getRules()
    }

    const changePage = (page)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page)
    }

    useEffect(function(){
        getRules(props.ruleNodes)
    }, [props.ruleNodes])

    return (
        <>
            <Space direction='vertical' size={12}>
                <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                    <div>是否确定删除该{deletingIds.length}项规则？</div>
                </Modal>
                <SelectForm getSearch={searchRules} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: 925}}>
                    <Button type='primary' onClick={handleCreate}>创建规则</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='item_rule_id'
                    pagination={{onChange: changePage, current: current}}/>
            </Space>
        </>
    )
}
