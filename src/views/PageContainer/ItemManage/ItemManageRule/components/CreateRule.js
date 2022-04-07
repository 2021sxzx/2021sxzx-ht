import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule';

export default function CreateRule(props){
    /* 页面中用以展示的基础数据 */
    const [taskCode, setTaskCode] = useState('-')
    const [pathName, setPathName] = useState(props.ruleRoot.nodeName + '\\')
    const [extraHeight, setExtraHeight] = useState(0)
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)

    /* 选择过程中的已选择、待选择节点 */
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '暂无',
        'nodeId': '12345',
        'disabled': false
    }])

    /* 创建自定义节点 */
    const [isNodeCreating, setIsNodeCreating] = useState(false)
    const [newNode, setNewNode] = useState('')
    const [newNodeList, setNewNodeList] = useState([])
    
    /* 处理修改功能 */
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUpdatingRoot, setIsUpdatingRoot] = useState(false)
    const [isNameUpdated, setIsNameUpdated] = useState(false)
    const [updatingNode, setUpdatingNode] = useState({
        'nodeName': '',
        'nodeId': 'none'
    })
    const [newName, setNewName] = useState('')
    // 原节点的路径
    const [originPath, setOriginPath] = useState('')
    // 自定义节点后当前节点的真实parentId
    const [realId, setRealId] = useState('')

    /* 创建或修改功能的总处理 */
    // 已选择节点的规则id以及区划id
    const [currRuleId, setCurrRuleId] = useState(null)
    // 是否已经可以创建
    const [chooseEnd, setChooseEnd] = useState(false)

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currChildren = []
        let currChosen = []
        if (props.updatePath.length === 0){
            // 若是创建，则用规则树根节点进行处理
            currChosen.push(props.ruleRoot)
            // 初始化可选节点
            for (let i = 0; i < (props.ruleTree[props.ruleRoot.nodeId]).length; i++){
                let node = props.ruleTree[props.ruleRoot.nodeId][i]
                if (node.nodeId in props.ruleTree){
                    node['disabled'] = false
                }
                else{
                    node['disabled'] = true
                }
                currChildren.push(node)
            }  
            setCurrRuleId(props.ruleRoot.nodeId) 
        }
        else if (props.updatePath.length === 1){
            // 特殊情况处理：修改根节点
            // 只允许修改名字，其他的啥也别干
            setOriginPath(props.ruleRoot.nodeName + '\\')
            setPathName('')
            setUpdatingNode(props.updatePath[0])
            setIsUpdatingRoot(true)
        } 
        else{
            // 若是修改，用传进来的路径进行处理
            let pathName = ''
            // 已选择节点
            for (let i = props.updatePath.length - 1; i > 0; i--){
                currChosen.push(props.updatePath[i])
                pathName = pathName + props.updatePath[i].nodeName + '\\'
            }
            // 子节点处理
            for (let i = 0; i < props.ruleTree[props.updatePath[1].nodeId].length; i++){
                let node = props.ruleTree[props.updatePath[1].nodeId][i]
                if (node.nodeId in props.ruleTree){
                    node['disabled'] = false
                }
                else{
                    node['disabled'] = true
                }
                if (node.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(node)
            }
            setCurrRuleId(props.updatePath[1].nodeId)
            setUpdatingNode(props.updatePath[0])
            setPathName(pathName)
            setOriginPath(pathName + props.updatePath[0].nodeName)
        }   
        setEnabledTags(currChildren)
        setChosenTags(currChosen)
    }, [])

    const chooseTag = (index, type)=>{
        // 选择了一个待选择节点
        // 暂不处理推荐节点
        if (type !== '1') return
        
        // 获取选取的节点，渲染其子节点并处理规则路径
        let tag = enabledTags[index]
        let currRule = pathName + tag.nodeName + '\\'
        chosenTags.push(tag)
        
        let currChildren = []
        if (tag.nodeId in props.ruleTree){
            // 选择的节点有子节点，则处理子节点
            for (let i = 0; i < props.ruleTree[tag.nodeId].length; i++){
                let node = props.ruleTree[tag.nodeId][i]
                if (node.nodeId in props.ruleTree){
                    node['disabled'] = false
                }
                else{
                    node['disabled'] = true
                }
                if (props.updatePath.length === 0 || node.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(node)
            }
        }

        setCurrRuleId(tag.nodeId)
        setEnabledTags(currChildren)
        setPathName(currRule)
    }

    const getBack = (index)=>{
        if (index === chosenTags.length - 1){
            // 原地tp
            return
        }
        let currChosen = []
        let currChildren = []
        let currNewNodeList = []
        let listIndex = 0
        let currRule = ''
        let end = false
        
        let returnTag = chosenTags[index]
        for (let i = 0; i <= index; i++){
            // 把现在已选择的节点列表还原到选中的节点为止
            currChosen.push(chosenTags[i])
            currRule += (chosenTags[i].nodeName + '\\')
            if (chosenTags[i].nodeId[0] == 't'){
                // 若其中有待创建队列，则重新推入队列，同时可以完成创建
                currNewNodeList.push(newNodeList[listIndex++])
                end = true
            }
        }
        
        if (returnTag.nodeId in props.ruleTree){
            // 若回退节点有子节点，则显示
            for (let i = 0; i < props.ruleTree[returnTag.nodeId].length; i++){
                let child = props.ruleTree[returnTag.nodeId][i]
                if (props.updatePath.length === 0 || child.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(child)
            }
        }

        // 将新的状态返回
        setChooseEnd(end)
        setCurrRuleId(returnTag.nodeId)
        setNewNodeList(currNewNodeList)
        setChosenTags(currChosen)
        setPathName(currRule)
        setEnabledTags(currChildren)
    }

    const handleCancel = ()=>{
        // 点击取消按钮
        props.setPageType(1)
    }

    const handleCreate = ()=>{
        // 点击创建按钮
        let str = '确认创建规则：“' + pathName + '”吗？'
        Modal.confirm({
            centered: true,
            title: '确认创建',
            content: str,
            onOk: function(){
                setIsLoading(true)
                let list = {
                    rules: newNodeList
                }
                createRules(list)
            }
        })
    }

    const handleUpdate = ()=>{
        // 点击修改按钮
        let str = '正在将规则：\n' +
                  '    “' + originPath + '”\n\n' + 
                  '修改为：\n' + 
                  '    “' + pathName + updatingNode.nodeName + '”\n\n' +
                  '确认修改吗？'
        Modal.confirm({
            centered: true,
            title: '确认修改',
            content: str,
            onOk: updateRule,
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const updateRule = ()=>{
        if (newNodeList.length === 0){
            // 若没有新建节点，则直接进行修改
            let data = {
                rules: [{
                    rule_id: updatingNode.nodeId,
                    rule_name: updatingNode.nodeName,
                    parentId: currRuleId
                }]
            }
            updateRules(data)
        }
        else{
            // 若有新建节点，则先创建节点，再修改
            let data = {
                rules: newNodeList
            }
            let tempNodeId = newNodeList[newNodeList.length - 1].temp_id
            // 获取临时节点的真实id，再用来修改节点
            api.CreateRules(data).then(response=>{
                let dict = response.data.data
                let rules = []
                for (let i = 0; i < newNodeList.length; i++){
                    let rule = {
                        rule_id: dict[newNodeList[i].temp_id].rule_id,
                        rule_name: newNodeList[i].rule_name,
                        parentId: (newNodeList[i].parentId in dict ?
                            dict[newNodeList[i].parentId].rule_id : newNodeList[i].parentId)
                    }
                    rules.push(rule)
                }
                props.createRuleSimulate(rules)
                setRealId(dict[tempNodeId].rule_id)
            }).catch(error=>{
                props.getRuleTree()
                props.showError('创建规则节点失败！')
            })
        }
    }

    useEffect(function(){
        if (realId === '') return
        let nodes = [{
            rule_id: updatingNode.nodeId,
            rule_name: updatingNode.nodeName,
            parentId: realId
        }]
        let data = {
            rules: nodes
        }
        updateRules(data)
    }, [realId])

    // 自定义节点
    const handleNodeCreatingInputChange = (e)=>{
        setNewNode(e.target.value)
    }

    const startNodeCreating = ()=>{
        setIsNodeCreating(true)
    }

    const endNodeCreating = ()=>{
        setIsNodeCreating(false)
    }

    const finishNodeCreating = ()=>{
        // 点击OK则将规则推入待创建队列
        let tempNode = {
            nodeId: 'temp' + newNodeList.length,
            nodeName: newNode,
            isRegion: false
        }
        createNewNode(tempNode)
        // 然后清空创建窗口
        document.getElementById('NodeCreatingInput').value = ''
        setNewNode('')
        setChooseEnd(true)
        setIsNodeCreating(false)
    }

    const createNewNode = (node)=>{
        // 放进待处理数组
        newNodeList.push({
            temp_id: node.nodeId,
            rule_name: node.nodeName,
            parentId: currRuleId
        })
        // 处理页面展示内容
        chosenTags.push(node)
        setPathName(pathName + node.nodeName + '\\')
        setEnabledTags([])
        setCurrRuleId(node.nodeId)
    }

    // 修改节点名字
    const handleUpdatingInputChange = (e)=>{
        setNewName(e.target.value)
    }

    const startupdateing = ()=>{
        setIsUpdating(true)
    }

    const endUpdating = ()=>{
        setIsUpdating(false)
    }

    const finishUpdating = ()=>{
        let newNode = ({
            nodeId: updatingNode.nodeId,
            nodeName: newName
        })
        setUpdatingNode(newNode)
        setIsUpdating(false)
        setIsNameUpdated(true)
    }

    const createRules = (data)=>{
        // 调用创建规则接口
        api.CreateRules(data).then(response=>{
            let dict = response.data.data
            let rules = []
            for (let i = 0; i < newNodeList.length; i++){
                let rule = {
                    rule_id: dict[newNodeList[i].temp_id].rule_id,
                    rule_name: newNodeList[i].rule_name,
                    parentId: (newNodeList[i].parentId in dict ?
                        dict[newNodeList[i].parentId].rule_id : newNodeList[i].parentId)
                }
                rules.push(rule)
            }
            props.createRuleSimulate(rules)
            props.showSuccess()
            // props.getRuleTree()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            props.getRuleTree()
            props.showError('创建规则失败！')
        })
    }

    const updateRules = (data)=>{
        // 调用创建规则接口
        api.UpdateRules(data).then(response=>{
            props.showSuccess()
            props.updateRuleSimulate(data.rules)
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            props.getRuleTree()
            props.showError('修改规则失败！')
        })
    }

    useEffect(function(){
        // 根据节点数量动态调整选择框高度
        let height = 0
        if (enabledTags.length > 7 || recommendedTags.length > 4){
            if (enabledTags.length - 7 > recommendedTags.length - 4){
                height = enabledTags.length - 7
            }
            else{
                height = recommendedTags.length - 4
            }
        }
        setExtraHeight(height * 32)
    },[enabledTags, recommendedTags])

    return (
        <Space direction='vertical' size={15}>
            <Modal centered destroyOnClose={true} title='自定义节点' visible={isNodeCreating} onCancel={endNodeCreating} onOk={finishNodeCreating}>
                <Input id='NodeCreatingInput' placeholder='请输入自定义节点名' size='middle' onChange={handleNodeCreatingInputChange}/>
            </Modal>
            <Modal centered destroyOnClose={true} title='修改节点名称' visible={isUpdating} onCancel={endUpdating} onOk={finishUpdating}>
                <Input id='updateingInput' placeholder='请输入新节点名' size='middle' onChange={handleUpdatingInputChange}/>
            </Modal>
            {
                updatingNode.nodeId !== 'none' &&
                <div className={style.ruleItem}>
                    <div className={style.itemTitle}>
                        节点名称：
                    </div>
                    <div className={style.itemContent} style={{display: 'flex'}}>
                        <div className={style.btnText}>{updatingNode.nodeName}</div>
                        <Button size='small' type='primary' onClick={startupdateing}>修改节点名称</Button>
                    </div>
                </div>
            }

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    创建事项规则：
                </div>
                <div className={style.itemContent}>
                    <div className={style.ruleText}>
                        {pathName + (updatingNode.nodeId === 'none' ? '' : updatingNode.nodeName + '\\')}
                    </div>
                    <div className={style.ps}>
                        （备注：通过下面的事项规则库，逐级选择规则项，完成创建）
                    </div>
                </div>
            </div>

            <Space className={style.createBox} direction='vertical' size={0}>
                <div>
                    <div className={style.createTitle}>
                        事项规则库：
                    </div>
                    <Space className={style.chosenTags} direction='horizontal' size={[12, 4]} wrap>
                        {
                            chosenTags.map((tag, index) =>
                                <div className={style.chosenTag} key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')} onClick={
                                    value=>{
                                        getBack(index)
                                    }
                                }>
                                    <div className={style.tagContent}>
                                        {tag.nodeName}
                                    </div>
                                </div>
                            )
                        }
                        <div className={style.chosenTag} onClick={startupdateing}
                            style={{backgroundColor: 'orange', display: updatingNode.nodeId === 'none' ? 'none' : 'flex'}}>
                            <div className={style.tagContent}>
                                {updatingNode.nodeName}
                            </div>
                        </div>
                    </Space>
                </div>

                <div className={style.chooseBox} style={{height: 276 + extraHeight, minHeight: 276}}>
                    <div className={style.chooseBoxTitle1}>
                        可选事项规则项：
                    </div>
                    <div className={style.enabledTags}>
                        <TagsArea tags={enabledTags} chooseTag={chooseTag} type={'1'}/>
                    </div>

                    <div className={style.separator} style={{height: 240 + extraHeight, minHeight: 240}}></div>
                    
                    <div className={style.chooseBoxTitle2}>
                        候选事项规则项：
                    </div>

                    <div className={style.chooseBoxSubTitle}>
                        推荐规则项：
                    </div>
                    <div className={style.textRankTags}>
                        <TagsArea tags={recommendedTags} chooseTag={chooseTag} type={'2'}/>
                    </div>

                    <div className={style.chooseBoxSubTitle} style={{top: 120 + extraHeight, display: isUpdatingRoot ? 'none' : 'block'}}>
                        用户自定义：
                    </div>
                    <div className={style.createTag} style={{top: 125 + extraHeight, display: isUpdatingRoot ? 'none' : 'block'}}
                        onClick={startNodeCreating}>
                        自定义标签+
                    </div>
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                    onClick={props.updatePath.length === 0 ? handleCreate : handleUpdate} 
                    disabled={!(chooseEnd || isNameUpdated || (props.updatePath.length > 1 && currRuleId !== props.updatePath[1].nodeId))} loading={isLoading}>
                    {props.updatePath.length === 0 ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}