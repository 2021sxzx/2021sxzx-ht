import React, {useEffect, useState} from 'react'
import style from './CreateProcess.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import GuideModal from './GuideModal.js';
import api from '../../../../../api/rule';

export default function CreateProcess(props){
    // 页面中用以展示的基础数据
    const [taskCode, setTaskCode] = useState('')
    const [taskName, setTaskName] = useState('')
    const [choosingGuide, setChoosingGuide] = useState(false)
    const [taskRule, setTaskRule] = useState(props.ruleRoot.nodeName + '\\')
    const [taskRegion, setTaskRegion] = useState(props.regionRoot.nodeName + '\\')
    // 选择过程中的已选择、待选择节点
    const [chosenRules, setChosenRules] = useState([])
    const [chosenRegions, setChosenRegions] = useState([])
    const [ruleTags, setRuleTags] = useState([])
    const [regionTags, setRegionTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '暂无',
        'nodeId': '12345'
    }])
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currRuleTags = []
        let currRegionTags = []
        let currRules = []
        let currRegions = []
        // 根节点默认为已选择
        currRules.push(props.ruleRoot)
        currRegions.push(props.regionRoot)
        // 两种类型的子节点处理
        for (let i = 0; i < (props.ruleTree[props.ruleRoot.nodeId]).length; i++){
            currRuleTags.push((props.ruleTree[props.ruleRoot.nodeId])[i])
        }
        for (let i = 0; i < (props.regionTree[props.regionRoot.nodeId]).length; i++){
            currRegionTags.push((props.regionTree[props.regionRoot.nodeId])[i])
        }
        setRuleTags(currRuleTags)
        setRegionTags(currRegionTags)
        setChosenRules(currRules)
        setChosenRegions(currRegions)
    },[])

    const startChoosingGuide = ()=>{
        setChoosingGuide(true)
    }

    const chooseTag = (index, type)=>{
        // 暂不处理推荐事项
        if (type === '3'){
            Modal.info({
                title: '暂不处理',
                content: '推荐项暂未进行处理',
                centered: true
            })
        }

        let currTags = []
        if (type === 'rule'){
            let tag = ruleTags[index]
            // 将当前节点推入已选择队列
            chosenRules.push(tag)
            if (tag.nodeId in props.ruleTree){
                // 处理子节点
                for (let i = 0; i < props.ruleTree[tag.nodeId].length; i++){
                    currTags.push(props.ruleTree[tag.nodeId][i])
                }
            }
            let currRule = taskRule + tag.nodeName + '\\'
            setTaskRule(currRule)
            setRuleTags(currTags)
        }
        else if (type === 'region'){
            let tag = regionTags[index]
            // 将当前节点推入已选择队列
            chosenRegions.push(tag)
            if (tag.nodeId in props.regionTree){
                // 处理子节点
                for (let i = 0; i < props.regionTree[tag.nodeId].length; i++){
                    currTags.push(props.regionTree[tag.nodeId][i])
                }
            }
            let currRegion = taskRegion + tag.nodeName + '\\'
            setTaskRegion(currRegion)
            setRegionTags(currTags)
        }   
    }

    const getBack = (index, type)=>{
        // 已选择节点的回退
        if (type === 'rule'){
            if (index === chosenRules.length - 1) return

            let currRules = []
            let currChildren = []
            let currTaskRule = ''

            for (let i = 0; i <= index; i++){
                // 已选择节点的放入
                currRules.push(chosenRules[i])
                currTaskRule += (chosenRules[i].nodeName + '\\')
            }
            for (let i = 0; i < props.ruleTree[chosenRules[index].nodeId].length; i++){
                // 将当前节点的子节点放入队列
                currChildren.push(props.ruleTree[chosenRules[index].nodeId][i])
            }

            setChosenRules(currRules)
            setRuleTags(currChildren)
            setTaskRule(currTaskRule)
        }
        else{
            if (index === chosenRegions.length - 1) return

            let currRegions = []
            let currChildren = []
            let currTaskRegion = ''

            for (let i = 0; i <= index; i++){
                // 已选择节点的放入
                currRegions.push(chosenRegions[i])
                currTaskRegion += (chosenRegions[i].nodeName + '\\')
            }
            for (let i = 0; i < props.regionTree[chosenRegions[index].nodeId].length; i++){
                // 将当前节点的子节点放入队列
                currChildren.push(props.regionTree[chosenRegions[index].nodeId][i])
            }

            setChosenRegions(currRegions)
            setRegionTags(currChildren)
            setTaskRegion(currTaskRegion)
        }
    }

    const handleCancel = ()=>{
        props.setPageType(1)
    }

    const createItem = ()=>{
        setIsLoading(true)
        let items = [{
            task_code: taskCode,
            rule_id: chosenRules[chosenRules.length - 1].nodeId,
            region_code: chosenRegions[chosenRegions.length - 1].nodeCode,
            region_id: chosenRegions[chosenRegions.length - 1].nodeId
        }]
        api.CreateItems({
            user_id: props.userId,
            items: items
        }).then(response=>{
            setIsLoading(false)
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            setIsLoading(false)
            props.showError('绑定事项失败')
        })
    }

    const handleCreate = ()=>{
        if (taskCode === ''){
            Modal.info({
                title: '未选择指南',
                content: '请选择要绑定的事项指南！',
                centered: true
            })
            return
        }
        api.GetItems({
            rule_id: chosenRules[chosenRules.length - 1].nodeId,
            region_id: chosenRegions[chosenRegions.length - 1].nodeId
        }).then(response=>{
            let rules = response.data.data
            if (rules.length !== 0){
                Modal.error({
                    title: '已有规则',
                    content: '该事项规则已经存在，请重新选择！',
                    centered: true
                })
            }
            else{
                let str = '确认绑定规则\“' + taskRule + taskRegion + '\”' +
                    '和指南\“' + taskName + '”吗？'
                Modal.confirm({
                    title: '确认绑定',
                    content: str,
                    centered: true,
                    onOk: createItem
                })
            }
        }).catch(error=>{
            props.showError('判断规则是否已存在失败！')
        })
    }

    return (
        <Space direction='vertical' size={15}>
            <GuideModal setTaskCode={setTaskCode} setTaskName={setTaskName} showError={props.showError}
                choosingGuide={choosingGuide} setChoosingGuide={setChoosingGuide}/>

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
                    <div className={style.guide}>
                        <Button size='small' type='primary' onClick={startChoosingGuide}>绑定指南</Button>
                        <div className={style.taskName}>{taskName}</div>
                    </div>
                </div>
            </div>

            <div className={style.ruleItem}>
                <div className={style.itemTitle}>
                    事项规则：
                </div>
                <div className={style.itemContent}>
                    <div className={style.ruleText}>
                        {taskRule + taskRegion}
                    </div>
                    <div className={style.ps}>
                        （备注：通过下面的事项规则库，逐级选择规则项，完成绑定）
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
                            chosenRules.map((tag, index) =>
                                <div className={style.chosenRule} key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')} onClick={
                                    value=>{
                                        getBack(index, 'rule')
                                    }
                                }>
                                    <div className={style.tagContent}>
                                        {tag.nodeName}
                                    </div>
                                </div>
                            )
                        }
                        {
                            chosenRegions.map((tag, index) =>
                                <div className={style.chosenRegion} key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')} onClick={
                                    value=>{
                                        getBack(index, 'region')
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

                <div className={style.chooseBox}>
                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle1}>
                            可选业务规则项：
                        </div>
                        <TagsArea tags={ruleTags} chooseTag={chooseTag} type={'rule'}/>
                    </div>
                    
                    <div className={style.separator1}/>

                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle2}>
                            可选区划规则项：
                        </div>
                        <TagsArea tags={regionTags} chooseTag={chooseTag} type={'region'}/>
                    </div>
                    
                    <div className={style.separator2}/>
                    
                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle3}>
                            候选事项规则项：
                        </div>

                        <div className={style.chooseBoxSubTitle}>
                            推荐规则项：
                        </div>
                        <TagsArea tags={recommendedTags} chooseTag={chooseTag} type={'3'}/>
                    </div>
                    

                    {/*<div className={style.chooseBoxSubTitle} style={{top: 120 + extraHeight, display: currRegionId == '' ? 'block' : 'none'}}>
                        用户自定义：
                    </div>
                    <div className={style.createTag} style={{display: currRegionId == '' ? 'block' : 'none', top: 125 + extraHeight}}
                        onClick={startCreating}>
                        自定义标签+
                    </div>*/}
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                    onClick={handleCreate} loading={isLoading}>
                    绑定
                </Button>
            </div>
        </Space>
    )
}