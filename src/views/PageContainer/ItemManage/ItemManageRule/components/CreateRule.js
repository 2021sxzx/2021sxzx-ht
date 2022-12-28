import React, {useEffect, useState} from 'react'
import style from './CreateRule.module.scss'
import {Space, Input, Button, Modal} from 'antd'
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule'

export default function CreateRule(props) {
    /* 页面中用以展示的基础数据 */
    const [pathName, setPathName] = useState('')
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)

    /* 选择过程中的已选择、待选择节点 */
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])

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
    // 是否已经可以创建
    const [chooseEnd, setChooseEnd] = useState(false)

    // 是否展示更多规则项
    const [showMore, setShowMore] = useState(false)

    const [isRuleLoading, setIsRuleLoading] = useState(false)

    useEffect(() => {
        // 初始化分类规则树的根节点
        let currChosen = []
        let len = props.updatePath.length
        if (len === 0) {
            // 若是创建，则用规则树根节点进行处理
            chooseTagApi(props.ruleRoot)
        } else if (len === 1) {
            // 特殊情况处理：修改根节点
            // 只允许修改名字，其他的啥也别干
            setOriginPath(props.ruleRoot.nodeName + '\\')
            setPathName('')
            setUpdatingNode(props.updatePath[0])
            setIsUpdatingRoot(true)
        } else {
            initUpdatePath(props.updatePath)
        }
        setChosenTags(currChosen)
    }, [])

    const initUpdatePath = (path) => {
        // 正在修改的节点id需要被跳过
        let len = path.length
        let skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId

        setIsRuleLoading(true)

        api.GetRules({
            parentId: [path[len - 2].nodeId]
        }).then(response => {
            let data = response.data.data
            let tempPath = ''
            let chosen = []
            let children = []
            for (let i = 0; i < len - 1; i++) {
                chosen.push(path[i])
                tempPath += (path[i].nodeName + '\\')
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].rule_id === skip) continue
                children.push({
                    'nodeId': data[i].rule_id,
                    'nodeName': data[i].rule_name
                })
            }
            setChosenTags(chosen)
            setEnabledTags(children)
            setUpdatingNode(path[len - 1])
            setPathName(tempPath)
            setOriginPath(tempPath + path[len - 1].nodeName + '\\')
        }).catch(error => {
            props.showError('初始化修改节点失败！' + error.message)
        }).finally(() => {
            setIsRuleLoading(false)
        })
    }

    const chooseTagApi = (tag) => {
        // 已选择节点处理
        const chosen = [...chosenTags]
        chosen.push(tag)
        // 规则名称处理
        let path = pathName + tag.nodeName + '\\'

        setIsRuleLoading(true)

        // 获取子规则项
        getRulesWithPaging(tag).then((res) => {
            // 更新state
            setEnabledTags(res)
            setChosenTags(chosen)
            setPathName(path)
        }).catch(err => {
            props.showError('获取子节点失败！' + err.message)
        }).finally(() => {
            setIsRuleLoading(false)
        })
    }

    /**
     * 使用分页的方式获取规则项
     * @param tag
     * @return {Promise<[]>} 规则项数组
     */
    const getRulesWithPaging = (tag) => {
        // 正在修改的节点id需要被跳过
        const skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId

        return new Promise(((resolve, reject) => {
            // 点击某个节点
            api.GetRules({
                parentId: [tag.nodeId],
                page_num: 0,
                page_size: 10
            }).then(response => {
                const data = response.data.data.data

                // 大于 10 条，说明还有一些规则项没展示出来，显示“更多”按钮
                const total = response.data.data.total
                setShowMore(total > 20)

                // 子节点处理
                let children = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].rule_id === skip) continue
                    children.push({
                        nodeId: data[i].rule_id,
                        nodeName: data[i].rule_name
                    })
                }

                resolve(children)
            }).catch(error => {
                reject(error)
            })
        }))
    }

    /**
     * 不使用分页获取规则项，
     * TODO(zzj):目前只获取第一页（前十条），后面重构的时候加形参可以控制获取的页数和页长
     * @param tag
     * @return {Promise<unknown>} 规则项数组
     */
    const getRulesWithoutPaging = (tag) => {
        return new Promise((resolve, reject) => {
            // 正在修改的节点id需要被跳过
            const skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId

            // 获取最后选择的节点的全部规则项
            api.GetRules({
                parentId: [tag.nodeId],
            }).then(response => {
                const data = response.data.data

                // 子节点处理
                let children = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].rule_id === skip) continue
                    children.push({
                        nodeId: data[i].rule_id,
                        nodeName: data[i].rule_name
                    })
                }

                // 更新展示的规则项内容
                resolve(children)
            }).catch(error => {
                reject(error)
            })
        })
    }

    /**
     * 隐藏“显示更多”的文字，并展示所有规则项
     */
    const showMoreRules = () => {
        // 隐藏“显示更多”的文字
        setShowMore(false)

        setIsRuleLoading(true)

        // 展示所有规则项
        getRulesWithoutPaging(chosenTags[chosenTags.length - 1]).then((res) => {
            setEnabledTags(res)
        }).catch(err => {
            setEnabledTags([])
            props.showError('获取子节点失败！' + err.message)
        }).finally(() => {
            setIsRuleLoading(false)
        })
    }

    const getBackApi = (tag, index) => {
        // 将已选择节点与规则名称回滚到所选的位置
        const chosen = []
        const tempNew = []
        let newNodeIndex = 0
        let end = false
        let path = ''
        for (let i = 0; i <= index; i++) {
            chosen.push(chosenTags[i])
            path += (chosenTags[i].nodeName + '\\')
            if (chosenTags[i].nodeId[0] === 't') {
                tempNew.push(newNodeList[newNodeIndex++])
                end = true
            }
        }

        // 回滚状态
        setChosenTags(chosen)
        setPathName(path)
        setNewNodeList(tempNew)
        setChooseEnd(end)

        // 获取对应的子规则
        if (tag.nodeId[0] !== 't') {
            setIsRuleLoading(true)
            // 回滚到的位置不是新创建的规则，就正常请求规则内容
            getRulesWithPaging(tag).then((res) => {
                // 更新state
                setEnabledTags(res)
            }).catch(err => {
                props.showError('获取子节点失败！' + err.message)
            }).finally(() => {
                setIsRuleLoading(false)
            })
        } else {
            // 如果回滚到新节点，就不用请求了
            setEnabledTags([])
        }
    }

    const chooseTag = (index, type) => {
        // 选择了一个待选择节点
        // 暂不处理推荐节点
        if (type !== '1') return

        // 获取选取的节点，渲染其子节点并处理规则路径
        let tag = enabledTags[index]
        chooseTagApi(tag)
    }

    const getBack = (index) => {
        // 选择了一个已选择节点
        if (index === chosenTags.length - 1) {
            // 原地tp
            return
        }

        let returnTag = chosenTags[index]
        getBackApi(returnTag, index)
    }

    const handleCancel = () => {
        // 点击取消按钮
        props.setPageType(1)
    }

    const handleCreate = () => {
        // 点击创建按钮
        let str = '确认创建规则：“' + pathName + '”吗？'
        Modal.confirm({
            centered: true,
            title: '确认创建',
            content: str,
            onOk: function () {
                setIsLoading(true)
                let list = {
                    user_id: props.userId,
                    rules: newNodeList
                }
                createRules(list)
            }
        })
    }

    const handleUpdate = () => {
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
            onOk: function () {
                setIsLoading(true)
                updateRule()
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const updateRule = () => {
        if (newNodeList.length === 0) {
            // 若没有新建节点，则直接进行修改
            let data = {
                rules: [{
                    rule_id: updatingNode.nodeId,
                    rule_name: updatingNode.nodeName,
                    parentId: chosenTags[chosenTags.length - 1].nodeId
                }]
            }
            updateRules(data)
        } else {
            // 若有新建节点，则先创建节点，再修改
            let data = {
                user_id: props.userId,
                rules: newNodeList
            }
            let tempNodeId = newNodeList[newNodeList.length - 1].temp_id
            // 获取临时节点的真实id，再用来修改节点
            api.CreateRules(data).then(response => {
                let dict = response.data.data
                setRealId(dict[tempNodeId].rule_id)
            }).catch(error => {
                props.showError('创建规则节点失败！' + error.message)
            })
        }
    }

    // 获取到了创建后节点的id后，再进行父节点修改
    useEffect(function () {
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
    const handleNodeCreatingInputChange = (e) => {
        setNewNode(e.target.value)
    }

    const startNodeCreating = () => {
        setIsNodeCreating(true)
    }

    const endNodeCreating = () => {
        setIsNodeCreating(false)
    }

    const finishNodeCreating = () => {
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

    const createNewNode = (node) => {
        // 放进待处理数组
        newNodeList.push({
            temp_id: node.nodeId,
            rule_name: node.nodeName,
            parentId: chosenTags[chosenTags.length - 1].nodeId
        })
        // 处理页面展示内容
        chosenTags.push(node)
        setPathName(pathName + node.nodeName + '\\')
        setEnabledTags([])
    }

    // 修改节点名字
    const handleUpdatingInputChange = (e) => {
        setNewName(e.target.value)
    }

    const startUpdating = () => {
        setIsUpdating(true)
    }

    const endUpdating = () => {
        setIsUpdating(false)
    }

    const finishUpdating = () => {
        let newNode = ({
            nodeId: updatingNode.nodeId,
            nodeName: newName
        })
        setUpdatingNode(newNode)
        setIsUpdating(false)
        setIsNameUpdated(true)
    }

    const createRules = (data) => {
        // 调用创建规则接口
        api.CreateRules(data).then(() => {
            props.showSuccess()
            props.setPageType(1)
        }).catch(error => {
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            setIsLoading(false)
            props.showError('创建规则失败！' + error.message)
        })
    }

    const updateRules = (data) => {
        // 调用创建规则接口
        api.UpdateRules(data).then(() => {
            props.showSuccess()
            props.setPageType(1)
        }).catch(error => {
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            setIsLoading(false)
            props.showError('修改规则失败！' + error.message)
        })
    }

    return (
        <Space className={style.mainSpace} direction='vertical' size={15}>
            <Modal
                centered destroyOnClose={true}
                title='自定义节点'
                visible={isNodeCreating}
                onCancel={endNodeCreating}
                onOk={finishNodeCreating}>
                <Input
                    id='NodeCreatingInput'
                    placeholder='请输入自定义节点名'
                    size='middle'
                    onChange={handleNodeCreatingInputChange}
                    maxLength={64}
                    showCount={true}
                />
            </Modal>
            <Modal
                centered destroyOnClose={true}
                title='修改节点名称'
                visible={isUpdating}
                onCancel={endUpdating}
                onOk={finishUpdating}>
                <Input
                    id='updateingInput'
                    placeholder='请输入新节点名'
                    size='middle'
                    onChange={handleUpdatingInputChange}
                    maxLength={64}
                    showCount={true}
                />
            </Modal>
            {
                updatingNode.nodeId !== 'none' &&
                <div className={style.ruleItem}>
                    <div className={style.itemTitle}>
                        节点名称：
                    </div>
                    <div className={style.itemContent} style={{display: 'flex'}}>
                        <div className={style.btnText}>{updatingNode.nodeName}</div>
                        <Button size='small' type='primary' onClick={startUpdating}>修改节点名称</Button>
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
                                <div
                                    className={style.chosenTag}
                                    key={'c' + tag.nodeId + (tag.isRegion ? 'r' : 'n')}
                                    onClick={
                                        () => {
                                            getBack(index)
                                        }
                                    }>
                                    <div className={style.tagContent}>
                                        {tag.nodeName}
                                    </div>
                                </div>
                            )
                        }
                        <div
                            className={style.chosenTag}
                            onClick={startUpdating}
                            style={{
                                backgroundColor: 'orange',
                                display: updatingNode.nodeId === 'none' ? 'none' : 'flex'
                            }}>
                            <div className={style.tagContent}>
                                {updatingNode.nodeName}
                            </div>
                        </div>
                    </Space>
                </div>

                <div className={style.chooseBox}>
                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle1}>
                            可选业务规则项：
                        </div>
                        {
                            isRuleLoading ?
                                <div className={style.chooseBoxTitle1}>正在加载中...</div> :
                                (<>
                                    <TagsArea tags={enabledTags} chooseTag={chooseTag} type={'1'}/>
                                    <div className={style.chooseBoxTitle1} onClick={showMoreRules} style={{
                                        display: showMore ? "flex" : "none",
                                    }}>
                                        <a>显示更多...</a>
                                    </div>
                                </>)
                        }
                        <br/>
                    </div>

                    <div className={style.separator1}/>

                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle3}>
                            新建事项规则项：
                        </div>
                        <div
                            className={style.createTag}
                            style={{display: isUpdatingRoot ? 'none' : 'block'}}
                            onClick={startNodeCreating}>
                            自定义标签+
                        </div>
                    </div>
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                        onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                        onClick={props.updatePath.length === 0 ? handleCreate : handleUpdate}
                        disabled={!(chooseEnd || isNameUpdated || (props.updatePath.length > 1 && chosenTags.length > 0 && chosenTags[chosenTags.length - 1].nodeId !== props.updatePath[props.updatePath.length - 1].rule_id))}
                        loading={isLoading}>
                    {props.updatePath.length === 0 ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}
