import React, {useEffect, useState} from 'react'
import style from './CreateProcess.module.scss'
import {Space, Button, Modal, Tooltip} from 'antd'
import TagsArea from './TagsArea.js'
import GuideModal from './GuideModal.js'
import api from '../../../../../api/rule'

export default function CreateProcess(props) {
    // 页面中用以展示的基础数据
    const [taskCode, setTaskCode] = useState('')
    const [taskName, setTaskName] = useState('')
    const [choosingGuide, setChoosingGuide] = useState(false)
    const [taskRule, setTaskRule] = useState('')
    const [taskRegion, setTaskRegion] = useState('')
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

    useEffect(() => {
        // 两种类型的子节点处理
        chooseRuleApi(props.ruleRoot)
        chooseRegionApi(props.regionRoot)
    }, [])

    const startChoosingGuide = () => {
        setChoosingGuide(true)
    }

    const chooseTag = (index, type) => {
        // 暂不处理推荐事项
        if (type === '3') {
            Modal.info({
                title: '暂不处理',
                content: '推荐项暂未进行处理',
                centered: true
            })
        }

        if (type === 'rule') {
            let tag = ruleTags[index]
            chooseRuleApi(tag)
        } else if (type === 'region') {
            let tag = regionTags[index]
            chooseRegionApi(tag)
        }
    }

    const chooseRuleApi = (tag) => {
        // 点击某个节点
        api.GetRules({
            parentId: [tag.nodeId]
        }).then(response => {
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++) {
                children.push({
                    nodeId: data[i].rule_id,
                    nodeName: data[i].rule_name
                })
            }
            // 已选择节点处理
            let chosen = []
            for (let i = 0; i < chosenRules.length; i++) {
                chosen.push(chosenRules[i])
            }
            chosen.push(tag)
            // 规则名称处理
            let path = taskRule + tag.nodeName + '\\'
            // 更新state
            setChosenRules(chosen)
            setTaskRule(path)
            setRuleTags(children)
        }).catch(error => {
            props.showError('获取规则子节点失败！')
        })
    }

    const chooseRegionApi = (tag) => {
        api.GetRegions({
            parentId: [tag.nodeId]
        }).then(response => {
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++) {
                children.push({
                    nodeId: data[i]._id,
                    nodeCode: data[i].region_code,
                    nodeName: data[i].region_name
                })
            }
            // 已选择节点处理
            let chosen = []
            for (let i = 0; i < chosenRegions.length; i++) {
                chosen.push(chosenRegions[i])
            }
            chosen.push(tag)
            // 规则名称处理
            let path = taskRegion + tag.nodeName + '\\'
            // 更新state
            setRegionTags(children)
            setChosenRegions(chosen)
            setTaskRegion(path)
        }).catch(error => {
            props.showError('获取子节点失败！')
        })
    }

    const getBackRuleApi = (index) => {
        api.GetRules({
            parentId: [chosenRules[index].nodeId]
        }).then(response => {
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++) {
                children.push({
                    nodeId: data[i].rule_id,
                    nodeName: data[i].rule_name
                })
            }
            // 已选择节点与规则名称处理
            let chosen = []
            let path = ''
            for (let i = 0; i <= index; i++) {
                chosen.push(chosenRules[i])
                path += (chosenRules[i].nodeName + '\\')
            }
            // 更新state
            setChosenRules(chosen)
            setTaskRule(path)
            setRuleTags(children)
        }).catch(error => {
            props.showError('获取子节点失败！')
        })
    }

    const getBackRegionApi = (index) => {
        api.GetRegions({
            parentId: [chosenRegions[index].nodeId]
        }).then(response => {
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++) {
                children.push({
                    nodeId: data[i]._id,
                    nodeCode: data[i].region_code,
                    nodeName: data[i].region_name
                })
            }
            // 已选择节点与规则名称处理
            let chosen = []
            let path = ''
            for (let i = 0; i <= index; i++) {
                chosen.push(chosenRegions[i])
                path += (chosenRegions[i].nodeName + '\\')
            }
            // 更新state
            setChosenRegions(chosen)
            setTaskRegion(path)
            setRegionTags(children)
        }).catch(error => {
            props.showError('撤回失败！')
        })
    }

    const getBack = (index, type) => {
        // 已选择节点的回退
        if (type === 'rule') {
            if (index === chosenRules.length - 1) return
            getBackRuleApi(index)
        } else {
            if (index === chosenRegions.length - 1) return
            getBackRegionApi(index)
        }
    }

    const handleCancel = () => {
        props.setPageType(1)
    }

    const createItem = () => {
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
        }).then(response => {
            setIsLoading(false)
            props.showSuccess()
            props.setPageType(1)
        }).catch(error => {
            setIsLoading(false)
            props.showError('绑定事项失败')
        })
    }

    const handleCreate = () => {
        if (taskCode === '') {
            Modal.info({
                title: '未选择指南',
                content: '请选择要绑定的事项指南！',
                centered: true
            })
            return
        }
        api.GetItems({
            rule_id: [chosenRules[chosenRules.length - 1].nodeId],
            region_id: [chosenRegions[chosenRegions.length - 1].nodeId]
        }).then(response => {
            let rules = response.data.data
            if (rules.length !== 0) {
                Modal.error({
                    title: '已有规则',
                    content: '该事项规则已经存在，请重新选择！',
                    centered: true
                })
            } else {
                let str = '确认绑定规则\“' + taskRule + taskRegion + '\”' +
                    '和指南\“' + taskName + '”吗？'
                Modal.confirm({
                    title: '确认绑定',
                    content: str,
                    centered: true,
                    onOk: createItem
                })
            }
        }).catch(error => {
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
                                <div className={style.chosenRule} key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')}
                                     onClick={
                                         value => {
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
                                <div className={style.chosenRegion} key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')}
                                     onClick={
                                         value => {
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
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                        onClick={handleCancel}>取消</Button>
                {
                    ruleTags.length > 0 ?
                        <Tooltip title={'请不要在业务规则的中间节点上绑定事项指南'}>
                            <Button type='primary' size='middle' style={{width: 100}}
                                    onClick={handleCreate} loading={isLoading} disabled>
                                绑定
                            </Button>
                        </Tooltip>
                        :
                        <Button type='primary' size='middle' style={{width: 100}}
                                onClick={handleCreate} loading={isLoading}>
                            绑定
                        </Button>

                }
            </div>
        </Space>
    )
}
