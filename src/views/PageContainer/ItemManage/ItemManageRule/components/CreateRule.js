import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule';

export default function CreateRule(props){
    // 页面中用以展示的基础数据
    const [taskCode, setTaskCode] = useState('-')
    const [taskRule, setTaskRule] = useState(props.ruleRoot.nodeName + '\\')
    const [extraHeight, setExtraHeight] = useState(0)
    // 选择过程中的已选择、待选择节点
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '暂无',
        'nodeId': '12345'
    }])
    // 已选择节点的规则id以及区划id
    const [currRuleId, setCurrRuleId] = useState('')
    const [currRegionId, setCurrRegionId] = useState('')
    // 创建自定义节点
    const [isCreating, setIsCreating] = useState(false)
    const [newNode, setNewNode] = useState('')
    const [newNodeList, setNewNodeList] = useState([])
    const [realNewId, setRealNewId] = useState('')
    // 是否已经可以创建
    const [chooseEnd, setChooseEnd] = useState(false)
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currChildren = []
        let currChosen = []
        currChosen.push(props.ruleRoot)
        for (let i = 0; i < (props.ruleTree[props.ruleRoot.nodeId]).length; i++){
            currChildren.push((props.ruleTree[props.ruleRoot.nodeId])[i])
        }
        setEnabledTags(currChildren)
        setChosenTags(currChosen)
    },[])

    const chooseTag = (index, type)=>{
        // 暂不处理推荐事项
        if (type !== '1') return

        // 获取选取的节点，渲染其子节点并处理规则路径
        let tag = enabledTags[index]
        chosenTags.push(tag)
        let currChildren = []
        if (tag.isRegion){
            // 是区划节点
            if (tag.nodeId in props.regionTree){
                // 选择了一个有子节点的区划节点
                for (let i = 0; i < props.regionTree[tag.nodeId].length; i++){
                    currChildren.push(props.regionTree[tag.nodeId][i])
                }
            }
            else{
                // 区划节点选择完毕
                // 只有当全部选择完毕的时候才可以进行创建或修改
                confirmItemRules({
                    rule_id: currRuleId,
                    region_id: tag.nodeId
                })
            }
            setCurrRegionId(tag.nodeId)
        }
        else{
            // 是规则节点
            if (tag.nodeId in props.ruleTree){
                // 选择了一个有子节点的分类规则节点
                for (let i = 0; i < props.ruleTree[tag.nodeId].length; i++){
                    currChildren.push(props.ruleTree[tag.nodeId][i])
                }
            }
            else{
                // 分类规则选择完毕，切换为区划
                currChildren = props.regionRoot
            }
            setCurrRuleId(tag.nodeId)
        }
        
        let currRule = taskRule + tag.nodeName + '\\'
        setEnabledTags(currChildren)
        setTaskRule(currRule)
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
        setChooseEnd(false)

        let returnTag = chosenTags[index]
        for (let i = 0; i <= index; i++){
            // 把现在已选择的节点列表还原到选中的节点为止
            currChosen.push(chosenTags[i])
            currRule += (chosenTags[i].nodeName + '\\')
            if (chosenTags[i].nodeId[0] == 't'){
                // 若其中有待创建队列，则重新推入队列
                currNewNodeList.push(newNodeList[listIndex++])
            }
        }
        setNewNodeList(currNewNodeList)

        if (returnTag.isRegion){
            // 判断返回的节点是规则还是区划，从对应的树中获取其子节点
            for (let i = 0; i < props.regionTree[returnTag.nodeId].length; i++){
                currChildren.push(props.regionTree[returnTag.nodeId][i])
            }
            // 只需回退区划Id
            setCurrRegionId(returnTag.nodeId)
        }
        else{
            if (!(returnTag.nodeId in props.ruleTree)){
                // 若返回的节点不在树中，说明是叶子节点，将区划根节点推入即可
                currChildren = props.regionRoot
            }
            else{
                for (let i = 0; i < props.ruleTree[returnTag.nodeId].length; i++){
                    currChildren.push(props.ruleTree[returnTag.nodeId][i])
                }
            }
            // 回退到规则Id时，区划Id尚未选择，所以清零
            setCurrRegionId('')
            setCurrRuleId(returnTag.nodeId)
        }
        setChosenTags(currChosen)
        setTaskRule(currRule)
        setEnabledTags(currChildren)
    }

    const handleCancel = ()=>{
        props.setPageType(1)
    }

    const handleCreate = ()=>{
        setIsLoading(true)
        if (newNodeList.length != 0){
            // 若有新建的规则，则先创建规则
            let list = {
                rules: newNodeList
            }
            createRules(list)
        }
        else{
            let data = {
                itemRules: [
                    {
                        rule_id: currRuleId,
                        region_id: currRegionId
                    }
                ]
            }
            createItemRules(data)
        }
    }

    const handleModify = ()=>{
        setIsLoading(true)
        if (newNodeList.length != 0){
            // 若有新建的规则，则先创建规则
            let list = {
                rules: newNodeList
            }
            createRules(list)
        }
        else{
            let data = {
                itemRules: [
                    {
                        item_rule_id: props.modifyId,
                        rule_id: currRuleId,
                        region_id: currRegionId
                    }
                ]
            }
            updateItemRules(data)
        }
    }

    const confirmItemRules = (data)=>{
        api.GetItemRules(data).then(response=>{
            let rules = response.data.data
            if (rules.length === 0){
                setChooseEnd(true)
            }
            else{
                Modal.error({
                    title: '已有规则',
                    content: '该事项规则已经存在，请重新选择！',
                    centered: true
                })
            }
        }).catch(error=>{
        })
    }

    useEffect(function(){
        if (realNewId == ''){
            return
        }
        // 用获取的规则id进行事项规则的创建
        // 为了防止state更新的延迟，用hook实现
        if (props.modifyId == ''){
            let data = {
                itemRules: [
                    {
                        rule_id: realNewId,
                        region_id: currRegionId
                    }
                ]
            }
            createItemRules(data)
        }
        else{
            let data = {
                itemRules: [
                    {
                        item_rule_id: props.modifyId,
                        rule_id: realNewId,
                        region_id: currRegionId
                    }
                ]
            }
            updateItemRules(data)
        } 
    },[realNewId])

    const createItemRules = (data)=>{
        api.CreateItemRules(data).then(response=>{
            setIsLoading(false)
            props.showSuccess()
            props.init()
            props.setPageType(1)
        }).catch(error=>{
            returnError()
        })
    }

    const updateItemRules = (data)=>{
        api.UpdateItemRules(data).then(response=>{
            setIsLoading(false)
            props.showSuccess()
            props.init()
            props.setPageType(1)
        }).catch(error=>{
            // 若修改过程出错，可能是库已经发生改变，树和事项都刷新
            returnError()
        })
    }

    const createRules = (data)=>{
        // 调用创建规则接口
        api.CreateRules(data).then(response=>{
            let dict = response.data.data
            console.log(dict)
            // 对照字典查询新建节点的正式id并设置state
            for (let i = 0; i < dict.length; i++){
                if (dict[i].temp_id == newNodeList[newNodeList.length - 1].temp_id){
                    setRealNewId(dict[i].rule_id)
                }
            }
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            returnError()
        })
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
        setTaskRule(taskRule + node.nodeName + '\\')
        setEnabledTags(props.regionRoot)
        setCurrRuleId(node.nodeId)
    }

    const returnError = ()=>{
        props.init()
        props.showError()
        props.setPageType(1)
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
            <Modal centered destroyOnClose={true} title='自定义标签' visible={isCreating} onCancel={endCreating} onOk={finishCreating}>
                <Input id='creatingInput' placeholder='请输入自定义标签名' size='middle' onChange={handleCreatingInputChange}/>
            </Modal>

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    事项指南编码：
                </div>
                <div className={style.itemContent}>
                    {taskCode}
                </div>
            </div>

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    事项指南：
                </div>
                <div className={style.itemContent}>
                    <Button size='small' type='primary'>绑定指南</Button>
                </div>
            </div>

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    创建事项规则：
                </div>
                <div className={style.itemContent}>
                    <div className={style.ruleText}>
                        {taskRule}
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

                    <div className={style.chooseBoxSubTitle} style={{top: 120 + extraHeight, display: currRegionId == '' ? 'block' : 'none'}}>
                        用户自定义：
                    </div>
                    <div className={style.createTag} style={{display: currRegionId == '' ? 'block' : 'none', top: 125 + extraHeight}}
                        onClick={startCreating}>
                        自定义标签+
                    </div>
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                    onClick={props.modifyId == '' ? handleCreate : handleModify} disabled={!chooseEnd} loading={isLoading}>
                    {props.modifyId == '' ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}