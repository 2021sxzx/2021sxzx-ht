import React,{cloneElement, useEffect,useState} from 'react'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import {getYMD,getTimeStamp} from "../../../../utils/TimeStamp";
import api from '../../../../api/rule';
import SelectForm from './components/SelectForm'
import CreateRule from './components/CreateRule'

export default function ItemManageRule() {
    const [tableData, setTableData] = useState([])
    const [pageType, setPageType] = useState(1)

    let ruleNodes = {}
    let regionNodes = {}
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

    const tableColumns = [
        {
            title: '事项规则编码',
            dataIndex: 'item_rule_id',
            key: 'item_rule_id'
        },
        {
            title: '事项规则',
            dataIndex: 'rule_path',
            key: 'rule_path',
            max_width: 500
        },
        {
            title: '业务部门',
            dataIndex: 'department',
            key: 'department',
            width: 150
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 120
        },
        {
            title: '创建时间',
            key: 'create_time',
            width: 130,
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
                <Space size='small'>
                    <Button type='primary'>修改</Button>
                    <Button type='default'>删除</Button>
                </Space>
            )
        }
    ]

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
            console.log(nodes)
            let tree = {}
            for (let key in nodes){
                let node = nodes[key]
                if (node.parentId !== ''){
                    if (node.parentId in tree){
                        tree[node.parentId].push({
                            nodeId: key,
                            nodeName: node.rule_name
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: key,
                            nodeName: node.rule_name
                        }]
                    }
                }
                else{
                    setRuleRoot({
                        'nodeId': key,
                        'nodeName': node.rule_name
                    })
                }
            }
            setRuleTree(tree)
            ruleNodes = nodes
        }).catch(error=>{
        })
    }

    const getRegionTree = ()=>{
        api.GetRegionTree({}).then(response=>{
            let nodes = response.data.data
            console.log(nodes)
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
                        'nodeId': key,
                        'nodeName': node.region_name,
                        'isRegion': true
                    })
                }
            }
            setRegionTree(tree)
            regionNodes = nodes
        }).catch(error=>{
        })
    }

    const getPathByRuleId = (id)=>{
        let parent = ruleNodes[id].parentId
        if (parent == '' || parent == id){
            return ruleNodes[id].rule_name         
        }
        else{
            return (getPathByRuleId(parent) + '\\' + ruleNodes[id].rule_name)
        } 
    }

    const getPathByRegionId = (id)=>{
        let parent = regionNodes[id].parentId
        if (parent == '' || parent == id){
            return regionNodes[id].region_name
        }
        else{
            return (getPathByRegionId(parent) + '\\' + regionNodes[id].region_name)
        }
    }

    const getItemRules = ()=>{
        api.GetItemRules({}).then(response=>{
            console.log('getItemRules')
            let rules = response.data.data
            for (let i = 0; i < rules.length; i++){
                rules[i]['rule_path'] = getPathByRuleId(rules[i]['rule_id']) + '\\' + getPathByRegionId(rules[i]['region_id'])
            }
            setTableData(rules)
        }).catch(error=>{

        })
    }
    
    const init = ()=>{
        setTimeout(function(){
            getTree()
        }, 0)
        setTimeout(function(){
            getRegionTree()
        }, 100)
        setTimeout(function(){
            getItemRules()
        }, 200)
    }

    useEffect(()=>{
        init()
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
                    <Table columns={tableColumns} dataSource={tableData} rowKey='item_rule_id'/>
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
