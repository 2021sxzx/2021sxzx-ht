import React,{useEffect,useState} from 'react'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import {getYMD,getTimeStamp} from "../../../../utils/TimeStamp";
import api from '../../../../api/rule';
import SelectForm from './components/SelectForm'
import CreateRule from './components/CreateRule'

const tableColumns = [
    {
        title: '事项规则编码',
        dataIndex: ['rule', 'rule_code'],
        key: 'rule.rule_code'
    },
    {
        title: '事项规则',
        dataIndex: ['rule', 'rule_name'],
        key: 'rule.rule.name'
    },
    {
        title: '业务部门',
        dataIndex: 'department',
        key: 'department'
    },
    {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator'
    },
    {
        title: '创建时间',
        key: 'create_time',
        render: (text, record)=>(
            <Space size='middle'>
                {getYMD(record.create_time)}
            </Space>
        )
    },
    {
        title: '操作',
        key: 'operation',
        render: (text, record)=>(
            <Space size='middle'>
                事项详情
            </Space>
        )
    }
]

export default function ItemManageRule() {
    const [tableData, setTableData] = useState([])
    const [pageType, setPageType] = useState(1)
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

    const getTasks = (data)=>{
        api.GetRule(data).then(response=>{
            setTableData(response.data.data)
            console.log('response.data.data=', response.data.data)
        }).catch(error=>{  
        })
    }

    const getSearchTask = (data)=>{
        api.SearchRule(data).then(response=>{
            console.log('searchData=', response.data.data)
            setTableData(response.data.data)
        }).catch(error=>{
        })
    }

    const handleCreate = ()=>{
        setPageType(2)
    }

    const reset = ()=>{
        getSearchTask({})
    }

    const getTree = ()=>{
        // 构建父子关系树
        api.GetRuleTree({}).then(response=>{
            let nodes = response.data.data
            let tree = {}
            for (let i = 0; i < nodes.length; i++){
                let node = nodes[i]
                if (node.parentId !== ''){
                    if (node.parentId in tree){
                        tree[node.parentId].push({
                            nodeId: node.rule_id,
                            nodeName: node.rule_name
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: node.rule_id,
                            nodeName: node.rule_name
                        }]
                    }
                }
                else{
                    setRuleRoot({
                        'nodeId': node.rule_id,
                        'nodeName': node.rule_name
                    })
                }
            }
            setRuleTree(tree)
        }).catch(error=>{
        })
    }

    const getRegionTree = ()=>{
        api.GetRegionTree({}).then(response=>{
            let nodes = response.data.data
            console.log(response)
            let tree = {}
            for (let i = 0; i < nodes.length; i++){
                let node = nodes[i]
                if (node.parentId !== ''){
                    if (node.parentId in tree){
                        tree[node.parentId].push({
                            nodeId: node.region_id,
                            nodeName: node.region_name,
                            isRegion: true
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: node.region_id,
                            nodeName: node.region_name,
                            isRegion: true
                        }]
                    }
                }
                else{
                    setRegionRoot({
                        'nodeId': node.region_id,
                        'nodeName': node.region_name,
                        'isRegion': true
                    })
                }
            }
            setRegionTree(tree)
        }).catch(error=>{

        })
    }

    useEffect(()=>{
        getTree()
        getRegionTree()
    },[])

    return (
        <>
            {
                pageType === 1 &&
                <Space direction='vertical' size={12}>
                    <SelectForm getSearch={getSearchTask} reset={reset}></SelectForm>
                    <Space direction='horizontal' size={12} style={{marginLeft: 875}}>
                        <Button type='primary' onClick={handleCreate}>创建事项</Button>
                        <Button type='primary'>批量导出</Button>
                        <Button type='primary'>批量删除</Button>
                    </Space>
                    <Table columns={tableColumns} dataSource={tableData}/>
                </Space>
            }
            {
                pageType === 2 &&
                <CreateRule setPageType={setPageType} ruleTree={ruleTree} regionTree={regionTree}
                    ruleRoot={ruleRoot} regionRoot={regionRoot}/>
            }
        </>
    )
}
