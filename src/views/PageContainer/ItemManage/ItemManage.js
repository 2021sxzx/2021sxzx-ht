import React, {useEffect, useState} from 'react'
import api from '../../../api/rule';
//import { Route, Switch } from 'react-router'
import { HashRouter as Router, Route, Link, Switch, useRouteMatch, useParams } from 'react-router-dom'
import ItemManageRule from './ItemManageRule/ItemManageRule'
import ItemManageGuide from './ItemManageGuide/ItemManageGuide'
import ItemManageProcess from './ItemManageProcess/ItemManageProcess'

export default function ItemManage() {
    // 父子组件路径匹配
    const {path} = useRouteMatch()
    // 事项管理组件公用state
    const [ruleTree, setRuleTree] = useState({})
    const [regionTree, setRegionTree] = useState({})
    const [ruleRoot, setRuleRoot] = useState({
        'nodeId': '',
        'nodeName': '',
        'isRegion': false
    })
    const [regionRoot, setRegionRoot] = useState([])

    const [rule2region, setRule2region] = useState({})
    const [region2rule, setRegion2rule] = useState({})
    // 临时存储获取到的所有节点，用于生成规则或区划路径
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})

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
            let root = []
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
                    root.push({
                        nodeId: key,
                        nodeName: node.region_name,
                        isRegion: true
                    })
                }
            }
            setRegionRoot(root)
            setRegionTree(tree)
        }).catch(error=>{
        })
    }

    const buildRuleNRegionTree = ()=>{
        api.GetItems({}).then(response=>{
            let ruleDict = {}
            let regionDict = {}
            for (let item in response.data.data){
                ruleDict[item.item_rule_id] = item.task_code
                regionDict[item.task_coded] = item.item_rule_id
            }
            setRule2region(ruleDict)
            setRegion2rule(regionDict)
        }).catch(error=>{

        })
    }

    const init = ()=>{
        // 通过设置延迟确保先获取规则和区划树
        // 再进行路径的生成
        getTree()
        getRegionTree()
    }

    useEffect(()=>{
        init()
    }, [])

    return (
        <Switch>
            <Route path={`${path}/process`} 
                component={()=><ItemManageProcess/>}/>
            <Route path={`${path}/guide`} 
                component={()=><ItemManageGuide region2rule={region2rule}/>}/>
            <Route path={`${path}/item-rule/rule`} 
                component={()=><ItemManageRule regionNodes={regionNodes} ruleNodes={ruleNodes} rule2region={rule2region}
                    regionTree={regionTree} ruleTree={ruleTree} regionRoot={regionRoot} ruleRoot={ruleRoot} init={init}/>}/>
        </Switch>
    )
}