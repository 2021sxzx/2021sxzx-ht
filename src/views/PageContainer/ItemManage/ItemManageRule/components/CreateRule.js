import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule';

export default function CreateRule(props){
    // 页面中用以展示的基础数据
    const [taskCode, setTaskCode] = useState('-')
    const [pathName, setPathName] = useState(props.ruleRoot.nodeName + '\\')
    const [extraHeight, setExtraHeight] = useState(0)
    // 选择过程中的已选择、待选择节点
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '暂无',
        'nodeId': '12345',
        'disabled': false
    }])
    // 已选择节点的规则id以及区划id
    const [currRuleId, setCurrRuleId] = useState('')
    // 创建自定义节点
    const [isCreating, setIsCreating] = useState(false)
    const [newNode, setNewNode] = useState('')
    const [newNodeList, setNewNodeList] = useState([])
    // 是否已经可以创建
    const [chooseEnd, setChooseEnd] = useState(false)
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)
    // 处理修改功能
    const [isModifying, setIsModifying] = useState(false)
    const [modifyingNode, setModifyingNode] = useState({
        'nodeName': '',
        'nodeId': 'none'
    })
    const [newName, setNewName] = useState('')

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currChildren = []
        let currChosen = []
        if (props.modifyPath.length === 0){
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
        }
        else{
            // 否则，用传进来的路径进行处理
            let pathName = ''
            for (let i = props.modifyPath.length - 1; i > 0; i--){
                currChosen.push(props.modifyPath[i])
                pathName = pathName + props.modifyPath[i].nodeName + '\\'
            }
            for (let i = 0; i < props.ruleTree[props.modifyPath[1].nodeId].length; i++){
                let node = props.ruleTree[props.modifyPath[1].nodeId][i]
                if (node.nodeId in props.ruleTree){
                    node['disabled'] = false
                }
                else{
                    node['disabled'] = true
                }
                currChildren.push(node)
            }
            setModifyingNode(props.modifyPath[0])
            setPathName(pathName)
        }
        
        setEnabledTags(currChildren)
        setChosenTags(currChosen)
    }, [])

    const chooseTag = (index, type)=>{
        // 暂不处理推荐事项
        if (type !== '1') return

        // 获取选取的节点，渲染其子节点并处理规则路径
        let tag = enabledTags[index]
        chosenTags.push(tag)
        let currChildren = []
        
        // 是规则节点
        if (tag.nodeId in props.ruleTree){
            // 选择了一个有子节点的分类规则节点
            for (let i = 0; i < props.ruleTree[tag.nodeId].length; i++){
                let node = props.ruleTree[tag.nodeId][i]
                if (node.nodeId in props.ruleTree){
                    node['disabled'] = false
                }
                else{
                    node['disabled'] = true
                }
                currChildren.push(node)
            }
        }

        setCurrRuleId(tag.nodeId)
        let currRule = pathName + tag.nodeName + '\\'
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
                currChildren.push(props.ruleTree[returnTag.nodeId][i])
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
        props.setPageType(1)
    }

    const handleCreate = ()=>{
        setIsLoading(true)

        let list = {
            rules: newNodeList
        }
        CreateRules(list)
    }

    const handleModify = ()=>{

    }

    const handleCreatingInputChange = (e)=>{
        setNewNode(e.target.value)
    }

    const startCreating = ()=>{
        setIsCreating(true)
    }

    const endCreating = ()=>{
        setIsCreating(false)
    }

    const finishCreating = ()=>{
        // 点击OK则将规则推入待创建队列
        let tempNode = {
            nodeId: 'temp' + newNodeList.length,
            nodeName: newNode,
            isRegion: false
        }
        createNewNode(tempNode)
        // 然后清空创建窗口
        document.getElementById('creatingInput').value = ''
        setNewNode('')
        setChooseEnd(true)
        setIsCreating(false)
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

    const handleModifyingInputChange = (e)=>{
        setNewName(e.target.value)
    }

    const startModifying = ()=>{
        setIsModifying(true)
    }

    const endModifying = ()=>{
        setIsModifying(false)
    }

    const finishModifying = ()=>{
        let newNode = ({
            nodeId: modifyingNode.nodeId,
            nodeName: newName
        })
        setModifyingNode(newNode)
        setIsModifying(false)
    }

    const returnError = ()=>{
        props.getRuleTree()
        props.showError()
        props.setPageType(1)
    }

    const CreateRules = (data)=>{
        // 调用创建规则接口
        api.CreateRules(data).then(response=>{
            props.showSuccess()
            props.getRuleTree()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            returnError()
        })
    }

    useEffect(function(){
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
            <Modal centered destroyOnClose={true} title='自定义节点' visible={isCreating} onCancel={endCreating} onOk={finishCreating}>
                <Input id='creatingInput' placeholder='请输入自定义节点名' size='middle' onChange={handleCreatingInputChange}/>
            </Modal>
            <Modal centered destroyOnClose={true} title='修改节点名称' visible={isModifying} onCancel={endModifying} onOk={finishModifying}>
                <Input id='modifyingInput' placeholder='请输入新节点名' size='middle' onChange={handleModifyingInputChange}/>
            </Modal>
            {
                modifyingNode.nodeId !== 'none' &&
                <div className={style.ruleItem}>
                    <div className={style.itemTitle}>
                        节点名称：
                    </div>
                    <div className={style.itemContent} style={{display: 'flex'}}>
                        <div className={style.btnText}>{modifyingNode.nodeName}</div>
                        <Button size='small' type='primary' onClick={startModifying}>修改节点名称</Button>
                    </div>
                </div>
            }

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    创建事项规则：
                </div>
                <div className={style.itemContent}>
                    <div className={style.ruleText}>
                        {pathName + (modifyingNode.nodeId === 'none' ? '' : modifyingNode.nodeName + '\\')}
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
                        <div className={style.chosenTag} onClick={startModifying}
                            style={{backgroundColor: 'orange', display: modifyingNode.nodeId === 'none' ? 'none' : 'flex'}}>
                            <div className={style.tagContent}>
                                {modifyingNode.nodeName}
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

                    <div className={style.chooseBoxSubTitle} style={{top: 120 + extraHeight}}>
                        用户自定义：
                    </div>
                    <div className={style.createTag} style={{top: 125 + extraHeight}}
                        onClick={startCreating}>
                        自定义标签+
                    </div>
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                    onClick={props.modifyPath.length === 0 ? handleCreate : handleModify} disabled={!chooseEnd} loading={isLoading}>
                    {props.modifyPath.length === 0 ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}