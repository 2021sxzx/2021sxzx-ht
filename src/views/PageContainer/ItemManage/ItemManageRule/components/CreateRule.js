import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'

export default function CreateRule(props){
    const [taskCode, setTaskCode] = useState('11440117007517547R4442111820008')
    const [taskRule, setTaskRule] = useState('\\' + props.ruleRoot.nodeName + '\\')
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '2',
        'nodeId': '12345'
    }])
    const [isCreating, setIsCreating] = useState(false)
    const [newNode, setNewNode] = useState('')

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currChildren = []
        let currChosen = []
        currChosen.push(props.ruleRoot)
        console.log(props)
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
        if (tag.nodeId in props.ruleTree){
            // 选择了一个有子节点的分类规则节点
            for (let i = 0; i < props.ruleTree[tag.nodeId].length; i++){
                currChildren.push(props.ruleTree[tag.nodeId][i])
            }
        }
        else if (tag.nodeId in props.regionTree){
            // 选择了一个有子节点的区划节点
            for (let i = 0; i < props.regionTree[tag.nodeId].length; i++){
                currChildren.push(props.regionTree[tag.nodeId][i])
            }
        }
        else if ('isRegion' in tag){
            // 区划节点选择完毕
            alert('选择完毕')
            return
        }
        else{
            // 分类规则选择完毕，切换为区划
            currChildren.push(props.regionRoot)
        }
        let currRule = taskRule + tag.nodeName + '\\'
        setEnabledTags(currChildren)
        setTaskRule(currRule)
    }

    const getBack = (index)=>{
        if (index === chosenTags.length - 1){
            return
        }
        let currChosen = []
        let currChildren = []
        let currRule = '\\'

        let returnId = chosenTags[index].nodeId
        for (let i = 0; i <= index; i++){
            currChosen.push(chosenTags[i])
            currRule += (chosenTags[i].nodeName + '\\')
        }

        if (returnId in props.ruleTree){
            // 加个判断处理选择分类规则叶子节点的情况
            for (let i = 0; i < props.ruleTree[returnId].length; i++){
                currChildren.push(props.ruleTree[returnId][i])
            }
        }
        else if (returnId in props.regionTree){
            for (let i = 0; i < props.regionTree[returnId].length; i++){
                currChildren.push(props.regionTree[returnId][i])
            }
        }
        else{
            currChildren.push(props.regionRoot)
        }
        
        setChosenTags(currChosen)
        setTaskRule(currRule)
        setEnabledTags(currChildren)
    }

    const handleCancel = ()=>{
        props.setPageType(1)
    }

    const handleCreate = ()=>{

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

                <Modal centered destroyOnClose={true} title='Creating' visible={isCreating} onCancel={endCreating} onOk={finishCreating}>
                    <Input id='creatingInput' placeholder='请输入自定义标签名' size='middle' onChange={handleCreatingInputChange}/>
                </Modal>
                
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
                    <div className={style.tag} style={{position: 'absolute', width: 90, bottom: 20, left: 500}}
                        onClick={startCreating}>
                        自定义标签+
                    </div>
                </div>
            </div>

            <div style={{display: 'block'}}>
                <Button type='default' size='middle' style={{left: 400, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{left: 500, width: 100}}>创建</Button>
            </div>
        </Space>
    )
}