import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Dropdown, Menu, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageRules(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [originData, setOringinData] = useState({})
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
        getCheckboxProps: (record)=>({
            disabled: record.rule_id in props.ruleTree
        })
    }
    // 页数处理
    const [current, setCurrent] = useState(0)
    const [currPageSize, setCurrPageSize] = useState(10)
    const [totalSize, setTotalSize] = useState(0)

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
            key: 'rule_path'
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
                        {
                            !(record.rule_id in props.ruleTree) &&
                            <Menu.Item key='2'>
                                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={function(){
                                    deleteSingleItem(record.rule_id)
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
        let str = ''
        let nodes = [id]
        if (id in props.ruleTree){
            str = '该节点为中间节点，若删除则会连同其子节点一起删除，确定要删除吗？'
        }
        else{
            str = '确定删除该节点吗？'
        }
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                if (id in props.ruleTree){
                    return
                }
                finishDeleting(nodes)
            }
        })
    }

    const handleBatchDelete = ()=>{
        // 删除多个事项，将selectedRowKeys全部推进deletingIds
        let nodes = []
        let str = '以下节点为中间节点：\n'
        let wow = false
        for (let i = 0; i < selectedRowKeys.length; i++){
            if (selectedRowKeys[i] in props.ruleTree){
                wow = true
                str += '    “' + getPathByRuleId(selectedRowKeys[i]) + '”\n'
            }
            nodes.push(selectedRowKeys[i])
        }
        if (wow){
            str += '若删除，则会连同其子节点一起删除，确定要删除吗？'
        }
        else{
            str = '确定删除该' + selectedRowKeys.length + '个节点吗？'
        }
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                if (wow){
                    return
                }
                finishDeleting(nodes)
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const endDeleting = ()=>{
        setIsDeleting(false)
    }

    const finishDeleting = (id)=>{
        // 确定删除，调用接口
        setDeletingIds(id)
    }

    useEffect(function(){
        if (deletingIds.length === 0) return
        deleteRules()
    }, [deletingIds])

    const deleteRules = ()=>{
        let data = {
            rules: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRules(data).then(response=>{ 
            // 等规则路径问题处理完后只需要刷新ruleItems
            props.deleteRuleSimulate(deletingIds)
            props.showSuccess()
            getRules()
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError()
            props.getRuleTree()
        })
        setDeletingIds([])
    }

    const getRules = ()=>{
        api.GetRules({}).then(response=>{
            let rules = response.data.data
            let table = []
            for (let i = 0; i < rules.length; i++){
                rules[i]['rule_path'] = getPathByRuleId(rules[i].rule_id)
                table.push(rules[i])
            }
            setTableData(table)
        }).catch(error=>{
            console.log(error)
        })
    }

    const searchRules = (data)=>{
        api.GetRules(data).then(response=>{
            let rules = response.data.data
            let table = []
            for (let i = 0; i < rules.length; i++){
                rules[i]['rule_path'] = getPathByRuleId(rules[i].rule_id)
                table.push(rules[i])
            }
            setTableData(table)
        }).catch(error=>{

        })
    }

    const modifyRule = (id)=>{
        let nodes = getNodesByRuleId(id)
        props.setUpdatePath(nodes)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        props.setUpdatePath('')
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        setCurrent(0)
        props.getRuleTree()
    }

    const changePage = (page, pageSize)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page - 1)
        setCurrPageSize(pageSize)
    }

    useEffect(function(){
        // 避开初始化时的查询
        for (let key in props.ruleTree){
            getRules()
            break
        }
    }, [props.ruleTree])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
                <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                    是否确定删除该{deletingIds.length}项规则?
                </Modal>
                <SelectForm getSearch={searchRules} reset={resetSearch} setOringinData={setOringinData}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: '75%'}}>
                    <Button type='primary' onClick={handleCreate}>创建规则</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='rule_id'
                    pagination={{onChange: changePage, current: current + 1}}/>
            </Space>
        </>
    )
}
