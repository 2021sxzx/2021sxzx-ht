import React, {useEffect, useState} from 'react'
import api from '../../../api/rule';
//import { Route, Switch } from 'react-router'
import { HashRouter as Router, Route, Link, Switch, useRouteMatch, useParams } from 'react-router-dom'
import ItemManageRule from './ItemManageRule/ItemManageRule'
import ItemManageRegion from './ItemManageRegion/ItemManageRegion'
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

    const [ruleDict, setRuleDict] = useState({})
    const [regionDict, setRegionDict] = useState({})
    // 临时存储获取到的所有节点，用于生成规则或区划路径
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})

    const getRuleTree = ()=>{
        // 构建父子关系树
        api.GetRuleTree({}).then(response=>{
            let nodes = response.data.data 
            let tree = {}
            let size = 0
            for (let key in nodes){
                size++
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
            setRuleNodes(nodes)
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
                            nodeCode: node.region_code,
                            isRegion: true
                        })
                    }
                    else{
                        tree[node.parentId] = [{
                            nodeId: key,
                            nodeName: node.region_name,
                            nodeCode: node.region_code,
                            isRegion: true
                        }]
                    }
                }
                else{
                    setRegionRoot({
                        nodeId: key,
                        nodeName: node.region_name,
                        nodeCode: node.region_code,
                        isRegion: true
                    })
                }
            }
            setRegionTree(tree)
        }).catch(error=>{
        })
    }

    const buildRuleNRegionTree = ()=>{
        api.GetItems({}).then(response=>{
            let items = response.data.data
            let ruleDict = {}
            let regionDict = {}
            for (let i = 0; i < items.length; i++){
                if (!(items[i].rule_id in ruleDict)){
                    ruleDict[items[i].rule_id] = true
                }
                if (!(items[i]._id in regionDict)){
                    regionDict[items[i]._id] = true
                }
            }
            setRuleDict(ruleDict)
            setRegionDict(regionDict)
        }).catch(error=>{

        })
    }

    const createRuleSimulate = (rules)=>{
        // 传入的是id，名称以及父节点id
        let nodes = ruleNodes
        let tree = ruleTree
        for (let i = 0; i < rules.length; i++){
            let rule = rules[i]
            // 直接加入nodes
            nodes[rule.rule_id] = rule
            // 在树中调整父子关系
            if (rule.parentId in tree){
                tree[rule.parentId].push({
                    nodeId: rule.rule_id,
                    nodeName: rule.rule_name,
                    isRegion: false
                })
            }
            else{
                tree[rule.parentId] = [{
                    nodeId: rule.rule_id,
                    nodeName: rule.rule_name,
                    isRegion: false
                }]
            }
        }
        setRuleNodes(nodes)
        setRuleTree(tree)
    }

    const deleteRuleSimulate = (rules)=>{
        // 传入的是要删除的元素的id
        let nodes = ruleNodes
        let tree = ruleTree
        for (let i = 0; i < rules.length; i++){
            // 将节点从其父节点的子节点数组中移除
            let parent = nodes[rules[i]].parentId
            let newChildren = []
            let children = tree[parent]
            for (let j = 0; j < children.length; j++){
                if (children[j].nodeId !== rules[i]){
                    newChildren.push(children[j])
                }
            }
            // 若是最后一个子节点，那就直接移除
            if (newChildren.length === 0){
                delete tree[parent]
            }
            else{
                tree[nodes[rules[i]].parentId] = newChildren
            }
            // 移除该节点
            delete nodes[rules[i]]
        }
        setRuleNodes(nodes)
        setRuleTree(tree)
    }

    const updateRuleSimulate = (rules)=>{
        let nodes = ruleNodes
        let tree = ruleTree
        for (let i = 0; i < rules.length; i++){
            let rule = rules[i]
            // 原parent
            let parent = nodes[rule.rule_id].parentId
            let children = tree[parent]
            let newChildren = []
            // 先从原来的parent下移除
            for (let j = 0; j < children.length; j++){
                if (children[j].nodeId !== rule.rule_id){
                    newChildren.push(children[j])
                }
            }
            if (newChildren.length === 0){
                delete tree[parent]
            }
            else{
                tree[nodes[rule.rule_id].parentId] = newChildren
            }
            // 再加入到新的parent下
            if (rule.parentId in tree){
                tree[rule.parentId].push({
                    nodeId: rule.rule_id,
                    nodeName: rule.rule_name,
                    isRegion: false
                })
            }
            else{
                tree[rule.parentId] = [{
                    nodeId: rule.rule_id,
                    nodeName: rule.rule_name,
                    isRegion: false
                }]
            }
            // 最后调整nodes中key对应的value
            nodes[rule.rule_id] = rule
        }
        setRuleNodes(nodes)
        setRuleTree(tree)
    }

    const createRegionSimulate = (region)=>{
        let nodes = regionNodes
        let tree = regionTree

        // 直接加入nodes
        nodes[region._id] = region
        // 在树中调整父子关系
        if (region.parentId in tree){
            tree[region.parentId].push({
                nodeId: region._id,
                nodeCode: region.region_code,
                nodeName: region.region_name,
                isRegion: true
            })
        }
        else{
            tree[region.parentId] = [{
                nodeId: region._id,
                nodeCode: region.region_code,
                nodeName: region.region_name,
                isRegion: true
            }]
        }
        
        setRegionNodes(nodes)
        setRegionTree(tree)
    }

    const deleteRegionSimulate = (regions)=>{
        // 传入的是要删除的元素的id
        let nodes = regionNodes
        let tree = regionTree
        for (let i = 0; i < regions.length; i++){
            // 将节点从其父节点的子节点数组中移除
            let parent = nodes[regions[i]].parentId
            let newChildren = []
            let children = tree[parent]
            for (let j = 0; j < children.length; j++){
                if (children[j].nodeId !== regions[i]){
                    newChildren.push(children[j])
                }
            }
            // 若是最后一个子节点，那就直接移除
            if (newChildren.length === 0){
                delete tree[parent]
            }
            else{
                tree[parent] = newChildren
            }
            // 移除该节点
            delete nodes[regions[i]]
        }
        setRegionNodes(nodes)
        setRegionTree(tree)
    }

    const updateRegionSimulate = (region)=>{
        let nodes = regionNodes
        let tree = regionTree

        // 原parent
        let parent = nodes[region._id].parentId
        let children = tree[parent]
        let newChildren = []
        // 先从原来的parent下移除
        for (let j = 0; j < children.length; j++){
            if (children[j].nodeId !== region._id){
                newChildren.push(children[j])
            }
        }
        if (newChildren.length === 0){
            delete tree[parent]
        }
        else{
            tree[nodes[region._id].parentId] = newChildren
        }
        // 再加入到新的parent下
        if (region.parentId in tree){
            tree[region.parentId].push({
                nodeId: region._id,
                nodeCode: region.region_code,
                nodeName: region.region_name,
                isRegion: false
            })
        }
        else{
            tree[region.parentId] = [{
                nodeId: region._id,
                nodeCode: region.region_code,
                nodeName: region.region_name,
                isRegion: false
            }]
        }
        // 最后调整nodes中key对应的value
        nodes[region._id] = region
        
        setRegionNodes(nodes)
        setRegionTree(tree)
    }

    const init = ()=>{
        // 通过设置延迟确保先获取规则和区划树
        // 再进行路径的生成
        getRuleTree()
        getRegionTree()
    }

    useEffect(()=>{
        init()
    }, [])

    return (
        <div>
            <Switch>
                <Route path={`${path}/process`} 
                    render={()=>(<ItemManageProcess regionNodes={regionNodes} ruleNodes={ruleNodes} ruleDict={ruleDict}
                    regionTree={regionTree} ruleTree={ruleTree} regionRoot={regionRoot} ruleRoot={ruleRoot} init={init}/>)}/>

                <Route path={`${path}/guide`} 
                    render={()=>(<ItemManageGuide regionDict={regionDict}/>)}/>

                <Route path={`${path}/item-rule/rule`} 
                    render={()=>(<ItemManageRule ruleNodes={ruleNodes} ruleDict={ruleDict}
                        ruleTree={ruleTree} ruleRoot={ruleRoot} getRuleTree={getRuleTree}
                        createRuleSimulate={createRuleSimulate} deleteRuleSimulate={deleteRuleSimulate}
                        updateRuleSimulate={updateRuleSimulate}/>)}/>

                <Route path={`${path}/item-rule/region`} 
                    render={()=>(<ItemManageRegion regionNodes={regionNodes} regionDict={regionDict}
                        regionTree={regionTree} regionRoot={regionRoot} getRegionTree={getRegionTree}
                        createRegionSimulate={createRegionSimulate} updateRegionSimulate={updateRegionSimulate}
                        deleteRegionSimulate={deleteRegionSimulate}/>)}/>
            </Switch>
        </div>
        
    )
}