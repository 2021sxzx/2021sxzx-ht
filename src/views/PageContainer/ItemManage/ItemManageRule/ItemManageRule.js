import React, {cloneElement, useEffect, useState} from 'react'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import { getYMD } from "../../../../utils/TimeStamp";
import api from '../../../../api/rule';
import SelectForm from './components/SelectForm'
import CreateRule from './components/CreateRule'

export default function ItemManageRule() {
    // 页面的基础数据
    const [tableData, setTableData] = useState([])
    const [pageType, setPageType] = useState(1)
    // 用于创建事项规则页面的两棵树以及根节点
    const [ruleTree, setRuleTree] = useState({})
    const [regionTree, setRegionTree] = useState({})
    const [ruleRoot, setRuleRoot] = useState({
        'nodeName': '',
        'nodeId': ''
    })
    const [regionRoot, setRegionRoot] = useState({
        'nodeName': '',
        'nodeId': ''
    })
    // 临时存储获取到的所有节点，用于生成规则或区划路径
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})
    // 是否正在删除，以及删除队列
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingIds, setDeletingIds] = useState([])
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const onSelectionChange = keys=>{
        setSelectedRowKeys(keys)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
    }
    // 当前展示的页数，用于重置时归零
    const [current, setCurrent] = useState(1)
    // 记录正在修改的事项规则的id
    const [modifyId, setModifyId] = useState('')

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

    const getTree = ()=>{
        // 构建父子关系树
        api.GetRuleTree({}).then(response=>{
            let nodes = response.data.data
            setRuleNodes(nodes)
            let tree = {}
            for (let key in nodes){
                let node = nodes[key]
                if (node.parentId !== ''){
                    if (node.parentId in tree){
                        tree[node.parentId].push({
                            nodeId: key,
                            nodeName: node.rule_name,
                            isRegion: false
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: key,
                            nodeName: node.rule_name,
                            isRegion: false
                        }]
                    }
                }
                else{
                    setRuleRoot({
                        nodeId: key,
                        nodeName: node.rule_name,
                        isRegion: false
                    })
                }
            }
            setRuleTree(tree)
        }).catch(error=>{
        })
    }

    const getRegionTree = ()=>{
        // 构建区划父子关系树
        api.GetRegionTree({}).then(response=>{
            let nodes = response.data.data
            setRegionNodes(nodes)
            let tree = {}
            for (let key in nodes){
                let node = nodes[key]
                if (node.parentId !== ''){
                    if (node.parentId in tree){
                        tree[node.parentId].push({
                            nodeId: key,
                            nodeName: node.region_name,
                            isRegion: true
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: key,
                            nodeName: node.region_name,
                            isRegion: true
                        }]
                    }
                }
                else{
                    setRegionRoot({
                        nodeId: key,
                        nodeName: node.region_name,
                        isRegion: true
                    })
                }
            }
            setRegionTree(tree)
        }).catch(error=>{
        })
    }
    
    const getPathByRuleId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = ruleNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = ruleNodes[currId].rule_name + '\\' + res
            currId = parent
            parent = ruleNodes[currId].parentId
        }
        res = ruleNodes[currId].rule_name + '\\' + res
        return res
    }

    const getPathByRegionId = (id)=>{
        // 获取规则id对应的规则路径
        let parent = regionNodes[id].parentId
        let currId = id
        let res = ''
        while (parent !== '' && parent !== currId){
            res = regionNodes[currId].region_name + '\\' + res
            currId = parent
            parent = regionNodes[currId].parentId
        }
        res = regionNodes[currId].region_name + '\\' + res
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
        setModifyId(id)
        setPageType(2)
    }

    const handleCreate = ()=>{
        setModifyId('')
        setPageType(2)
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
    
    const init = ()=>{
        // 通过设置延迟确保先获取规则和区划树
        // 再进行路径的生成
        getTree()
        getRegionTree()
    }

    useEffect(()=>{
        init()
    },[])

    useEffect(()=>{
        getItemRules()
    },[ruleNodes, regionNodes])

    return (
        <>
            {
                pageType === 1 &&
                <Space direction='vertical' size={12}>
                    <Modal centered destroyOnClose={true} title='删除确认' visible={isDeleting} onCancel={endDeleting} onOk={finishDeleting}>
                        <div>是否确定删除该{deletingIds.length}项规则？</div>
                    </Modal>
                    <SelectForm getSearch={searchItemRules} reset={resetSearch}></SelectForm>
                    <Space direction='horizontal' size={12} style={{marginLeft: 925}}>
                        <Button type='primary' onClick={handleCreate}>创建事项</Button>
                        <Button type='primary'>批量导出</Button>
                        <Button type='primary' onClick={handleBatchDelete}>批量删除</Button>
                    </Space>
                    <Table rowSelection={rowSelection} columns={tableColumns} dataSource={tableData} rowKey='item_rule_id'
                        pagination={{onChange: changePage, current: current}}/>
                </Space>
            }
            {
                pageType === 2 &&
                <CreateRule setPageType={setPageType} ruleTree={ruleTree} regionTree={regionTree}
                    ruleRoot={ruleRoot} regionRoot={regionRoot} init={init} modifyId={modifyId}/>
            }
        </>
    )
}
