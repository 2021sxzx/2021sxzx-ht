import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule';

export default function CreateRule(props){
    // 页面中用以展示的基础数据
    const [taskCode, setTaskCode] = useState('-')
    const [taskRule, setTaskRule] = useState(props.ruleRoot.nodeName + '\\')
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
        console.log(tag)
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
                setChooseEnd(true)
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
                currChildren.push(props.regionRoot)
            }
            setCurrRuleId(tag.nodeId)
        }
        
        let currRule = taskRule + tag.nodeName + '\\'
        setEnabledTags(currChildren)
        console.log(tag)
        setTaskRule(currRule)
    }

    const getBack = (index)=>{
        if (index === chosenTags.length - 1){
            // 原地tp
            return
        }
        let currChosen = []
        let currChildren = []
        let currRule = ''
        setChooseEnd(false)

        let returnTag = chosenTags[index]
        for (let i = 0; i <= index; i++){
            // 把现在已选择的节点列表还原到选中的t节点为止
            currChosen.push(chosenTags[i])
            currRule += (chosenTags[i].nodeName + '\\')
        }

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
                currChildren.push(props.regionRoot)
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
        let data = {
            itemRules: [
                {
                    rule_id: currRuleId,
                    region_id: currRegionId
                }
            ]
        }
        api.CreateItemRules(data).then(response=>{
            setIsLoading(true)
            setTimeout(function(){
                props.init()
                props.setPageType(1)
                setIsLoading(false)
            }, 1000)
        }).catch(error=>{
        })
    }

    const handleModify = ()=>{
        let data = {
            itemRules: [
                {
                    item_rule_id: props.modifyId,
                    rule_id: currRuleId,
                    region_id: currRegionId
                }
            ]
        }
        api.UpdateItemRules(data).then(response=>{
            setIsLoading(true)
            setTimeout(function(){
                props.init()
                props.setPageType(1)
                setIsLoading(false)
            }, 1000)
        }).catch(error=>{
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
        // createNewNode(newNode)
        document.getElementById('creatingInput').value = ''
        setNewNode('')
        setIsCreating(false)
    }

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

            <div className={style.createBox} style={{height: 352 + (enabledTags.length - 7) * 32, minHeight: 352}}>
                <div className={style.chosenTags}>
                    {
                        chosenTags.map((tag, index) =>
                            <div className={style.chosenTag} key={'c' + tag.nodeId} onClick={
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
                </div>
                
                <div className={style.createTitle} style={{top: 50, left: 15}}>
                    事项规则库：
                </div>
                <div className={style.chooseBox} style={{height: 276 + (enabledTags.length - 7) * 32, minHeight: 276}}>
                    <div className={style.chooseBoxTitle} style={{left: 30, top: 15}}>
                        可选事项规则项：
                    </div>
                    <div className={style.enabledTags}>
                        <TagsArea tags={enabledTags} chooseTag={chooseTag} type={'1'}/>
                    </div>

                    <div className={style.separator} style={{height: 240 + (enabledTags.length - 7) * 32, minHeight: 240}}></div>
                    
                    <div className={style.chooseBoxTitle} style={{left: 450, top: 15}}>
                        候选事项规则项：
                    </div>

                    <div className={style.chooseBoxSubTitle} style={{left: 480, top: 40}}>
                        推荐规则项：
                    </div>
                    <div className={style.textRankTags}>
                        <TagsArea tags={recommendedTags} chooseTag={chooseTag} type={'2'}/>
                    </div>

                    <div className={style.chooseBoxSubTitle} style={{left: 480, bottom: 55}}>
                        用户自定义：
                    </div>
                    <div className={style.tag} style={{position: 'absolute', width: 90, bottom: 20, left: 500, cursor: 'pointer'}}
                        onClick={startCreating}>
                        自定义标签+
                    </div>
                </div>
            </div>

            <div style={{display: 'block'}}>
                <Button type='default' size='middle' style={{left: 400, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{left: 500, width: 100}}
                    onClick={props.modifyId == '' ? handleCreate : handleModify} disabled={!chooseEnd} loading={isLoading}>
                    {props.modifyId == '' ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}