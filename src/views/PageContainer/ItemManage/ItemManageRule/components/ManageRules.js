import React, {cloneElement, useEffect, useState} from 'react'
import { Redirect } from 'react-router-dom'
import { DatePicker, Space, Dropdown, Menu, Button, Select, Table, Modal,Descriptions, Badge, message  } from 'antd';
import { getYMD } from "../../../../../utils/TimeStamp";
import api from '../../../../../api/rule';
import SelectForm from './SelectForm'

export default function ManageRules(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [unableCreate, setUnableCreate] = useState(true)
    const [tableLoading, setTableLoading] = useState(false)
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
            disabled: record.rule_id in props.ruleTree
        })
    }
    // 页数处理
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
            dataIndex: 'item_path',
            key: 'item_path'
        },
        {
            title: '业务部门',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 125
        },
        {
            title: '创建人',
            dataIndex: 'creator_name',
            key: 'creator_name',
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
                } trigger={['click']} placement='bottomCenter'>
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
        let str = '确定删除该节点吗？'
        Modal.confirm({
            centered: true,
            title: '删除确认',
            content: str,
            onOk: function(){
                finishDeleting([id])
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
        deleteRules()
    }, [deletingIds])

    const deleteRules = ()=>{
        let data = {
            rules: deletingIds
        } 
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRules(data).then(response=>{ 
            if ('code' in response.data.data){
                Modal.confirm({
                    title: '规则已绑定',
                    content: '所选部分规则已被部分事项绑定，若要删除则需要先进行解绑。是否跳转到事项流程管理？',
                    centered: true,
                    onOk: function(){
                        props.setBindedData({
                            rule_id: deletingIds
                        })
                    }
                })
            }
            else{
                props.deleteRuleSimulate(deletingIds)
                getRules()
                props.showSuccess()
            } 
        }).catch(error=>{
            // 删除报错时，弹出报错框并重新加载数据
            props.showError('删除规则失败！')
            props.getRuleTree()
        })
        setDeletingIds([])
    }

    useEffect(function(){
        for (let key in props.bindedData){
            props.jumpToProcess()
            break
        }  
    }, [props.bindedData])

    const getRules = ()=>{
        // 无搜索条件获取全数据
        // 由于数据量较小，不进行分页处理，全部拉取
        setTableLoading(true)
        api.GetRules({}).then(response=>{
            let rules = response.data.data
            for (let i = 0; i < rules.length; i++){
                rules[i]['department_name'] = rules[i].creator.department_name
                rules[i]['creator_name'] = rules[i].creator.name
            }
            setTableData(rules)
            setTableLoading(false)
        }).catch(error=>{
            setTableLoading(false)
            console.log(error)
            props.showError('获取规则失败！')
        })
    }

    const searchRules = (data)=>{
        setTableLoading(true)
        // 搜索
        api.GetRules(data).then(response=>{
            let rules = response.data.data
            setCurrent(1)
            for (let i = 0; i < rules.length; i++){
                rules[i]['department_name'] = rules[i].creator.department_name
                rules[i]['creator_name'] = rules[i].creator.name
            }
            setTableLoading(false)
            setTableData(rules)
        }).catch(error=>{
            setTableLoading(false)
            props.showError('搜索规则失败！')
        })
    }

    const modifyRule = (id)=>{
        // 获取该节点的整条父子关系路径并存储，供修改界面使用
        let nodes = getNodesByRuleId(id)
        props.setUpdatePath(nodes)
        props.setPageType(2)
    }

    const handleCreate = ()=>{
        // 无路径切换切面即为创建
        props.setUpdatePath('')
        props.setPageType(2)
    }

    const resetSearch = ()=>{
        // 回 归 本 源
        setCurrent(1)
        getRules()
    }

    const changePage = (page)=>{
        // 换页时清空选择
        setSelectedRowKeys([])
        setCurrent(page)
    }

    useEffect(function(){
        // 避开初始化时的查询
        for (let key in props.ruleTree){
            for (let key in props.ruleNodes){
                getRules()
                setCurrent(1)
                // ruleTree初始化完毕前不能进行节点创建，否则会报错
                setUnableCreate(false)
                break
            }
            break
        }
    }, [props.ruleTree, props.ruleNodes])

    return (
        <>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
                <SelectForm getSearch={searchRules} reset={resetSearch}></SelectForm>
                <Space direction='horizontal' size={12} style={{marginLeft: '75%'}}>
                    <Button type='primary' disabled={unableCreate} onClick={handleCreate}>创建规则</Button>
                    <Button type='primary' disabled={!isBatching}>批量导出</Button>
                    <Button type='primary' disabled={!isBatching} onClick={handleBatchDelete}>批量删除</Button>
                </Space>
                <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='rule_id'
                    pagination={{onChange: changePage, current: current}} loading={tableLoading} />
            </Space>
        </>
    )
}
