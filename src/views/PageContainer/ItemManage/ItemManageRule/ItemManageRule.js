import React, {useEffect, useState} from 'react'
import api from '../../../../api/rule';
import ManageRules from './components/ManageRules'
import CreateRule from './components/CreateRule'
import {Modal} from 'antd'

export default function ItemManageRule() {
    // 页面的基础数据
    const [pageType, setPageType] = useState(1)
    // 用于创建事项规则页面的两棵树以及根节点
    const [ruleTree, setRuleTree] = useState({})
    const [regionTree, setRegionTree] = useState({})
    const [ruleRoot, setRuleRoot] = useState({
        'nodeId': '',
        'nodeName': '',
        'isRegion': false
    })
    const [regionRoot, setRegionRoot] = useState([])
    // 临时存储获取到的所有节点，用于生成规则或区划路径
    const [ruleNodes, setRuleNodes] = useState({})
    const [regionNodes, setRegionNodes] = useState({})
    // 记录正在修改的事项规则的id
    const [modifyId, setModifyId] = useState('')

    const showError = ()=>{
        Modal.error({
            title: '出错啦！',
            content: '本次操作出现了错误，请稍后重试！',
            centered: true
        })
    }

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
    
    const init = ()=>{
        // 通过设置延迟确保先获取规则和区划树
        // 再进行路径的生成
        getTree()
        getRegionTree()
    }

    useEffect(()=>{
        init()
    },[])

    return (
        <>
            {
                pageType === 1 &&
                <ManageRules ruleNodes={ruleNodes} regionNodes={regionNodes}
                    setPageType={setPageType} setModifyId={setModifyId} init={init} showError={showError}/>
            }
            {
                pageType === 2 &&
                <CreateRule setPageType={setPageType} ruleTree={ruleTree} regionTree={regionTree}
                    ruleRoot={ruleRoot} regionRoot={regionRoot} init={init} modifyId={modifyId} showError={showError}/>
            }
        </>
    )
}
