import React, { useEffect, useState } from 'react'
import style from './CreateRegion.module.scss'
import { Space, Input, Button, Modal } from 'antd'
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule'

export default function CreateRegion(props){
    /* 页面中用以展示的基础数据 */
    const [taskCode, setTaskCode] = useState('')
    const handleCodeInputChange = (e)=>{
        setTaskCode(e.target.value)
    }
    const [nodeName, setNodeName] = useState('新区划')
    const handleNameInputChange = (e)=>{
        setNodeName(e.target.value)
    }
    const [pathName, setPathName] = useState('')
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)

    /* 选择过程中的已选择、待选择节点 */
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])

    // 原节点的路径
    const [originPath, setOriginPath] = useState('')

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let len = props.updatePath.length
        let currChosen = []
        if (len === 0){
            // 若是创建，则用规则树根节点进行处理
            chooseTagApi(props.regionRoot)
        }
        else if (len === 1){
            // 特殊情况处理：修改根节点
            // 只允许修改名字，其他的啥也别干
            setOriginPath(props.regionRoot.nodeName + '\\')
            setTaskCode(props.updatePath[len - 1].nodeCode)
            setNodeName(props.updatePath[len - 1].nodeName)
        } 
        else{
            // 若是修改，用传进来的路径进行处理
            initUpdatePath(props.updatePath)   
            setTaskCode(props.updatePath[len - 1].nodeCode)
            setNodeName(props.updatePath[len - 1].nodeName) 
        }   
        setChosenTags(currChosen)
    }, [])

    const initUpdatePath = (path)=>{
        // 正在修改的节点id，需要被跳过
        let len = path.length
        let skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId
        api.GetRegions({
            parentId: path[len - 2].nodeId
        }).then(response=>{
            let data = response.data.data
            let tempPath = ''
            let chosen = []
            let children = []
            for (let i = 0; i < len - 1; i++){
                chosen.push({
                    'nodeId': path[i].nodeId,
                    'nodeName': path[i].nodeName
                })
                tempPath += (path[i].nodeName + '\\')
            }
            for (let i = 0; i < data.length; i++){
                if (data[i]._id === skip) continue
                children.push({
                    'nodeId': data[i]._id,
                    'nodeName': data[i].region_name
                })
            }
            setChosenTags(chosen)
            setEnabledTags(children)
            setPathName(tempPath)
            setOriginPath(tempPath + path[len - 1].nodeName + '\\')
        }).catch(error=>{
            props.showError('初始化修改节点失败！')
        })
    }

    const chooseTagApi = (tag)=>{
        // 正在修改的节点id，需要被跳过
        let skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId
        // 点击某个节点
        api.GetRegions({
            parentId: [tag.nodeId]
        }).then(response=>{
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++){
                if (data[i]._id === skip) continue
                children.push({
                    nodeId: data[i]._id,
                    nodeName: data[i].region_name
                })
            }
            // 已选择节点处理
            let chosen = []
            for (let i = 0; i < chosenTags.length; i++){
                chosen.push(chosenTags[i])
            }
            chosen.push(tag)
            // 规则名称处理
            let path = pathName + tag.nodeName + '\\'
            // 更新state
            setEnabledTags(children)
            setChosenTags(chosen)
            setPathName(path)
        }).catch(error=>{
            props.showError('获取子节点失败！')
        })
    }

    const getBackApi = (tag, index)=>{
        // 正在修改的节点id，需要被跳过
        let skip = props.updatePath.length === 0 ? 'noSkip' : props.updatePath[props.updatePath.length - 1].nodeId
        // 点击回归某个节点
        api.GetRegions({
            parentId: [tag.nodeId]
        }).then(response=>{
            let data = response.data.data
            // 子节点处理
            let children = []
            for (let i = 0; i < data.length; i++){
                if (data[i]._id === skip) continue
                children.push({
                    nodeId: data[i]._id,
                    nodeName: data[i].region_name
                })
            }
            // 已选择节点与规则名称处理
            let chosen = []
            let path = ''
            for (let i = 0; i <= index; i++){
                chosen.push(chosenTags[i])
                path += (chosenTags[i].nodeName + '\\')
            }
            // 更新state
            setChosenTags(chosen)
            setPathName(path)
            setEnabledTags(children)
        }).catch(error=>{
            props.showError('撤回失败！')
        })
    }

    const chooseTag = (index, type)=>{
        // 选择了一个待选择节点
        // 暂不处理推荐节点
        if (type !== '1') return
        
        // 获取选取的节点，渲染其子节点并处理规则路径
        let tag = enabledTags[index]
        chooseTagApi(tag)
    }

    const getBack = (index)=>{
        if (index === chosenTags.length - 1){
            // 原地tp
            return
        }
        
        let returnTag = chosenTags[index]
        getBackApi(returnTag, index)
    }

    const handleCancel = ()=>{
        // 点击取消按钮
        props.setPageType(1)
    }

    const inj_judge = (str)=>{
        // 输入检测
        let inj_str = ['delete', 'and', 'exec', 'insert', 'update', 'count', 'master', 'select',
            'char', 'declare', 'or', '|', 'delete', 'not', '/*', '*/', 'find']
        for (let i = 0; i < inj_str.length; i++){
            if (str.indexOf(inj_str[i]) >= 0){
                return true
            }
        }
        return false
    }

    const handleCreate = ()=>{
        // 点击创建按钮
        if (taskCode === '' || nodeName === ''){
            Modal.warning({
                centered: true,
                title: '信息不全',
                content: '请将区划编码和区划名称填写完毕后再进行创建！'
            })
        }
        else if (inj_judge(taskCode) || inj_judge(nodeName)){
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        }
        else{
            api.GetRegions({
                region_code: [taskCode]
            }).then(response=>{
                if (response.data.data.length === 0){
                    // 若非已有区划编码，则确认创建
                    confirmCreate()
                }
                else{
                    Modal.warning({
                        centered: true,
                        title: '已有编码',
                        content: '该规则编码已存在，请重新输入！'
                    })
                }
            })
        }
    }

    const handleUpdate = ()=>{
        // 点击修改按钮
        if (taskCode === '' || nodeName === ''){
            Modal.warning({
                centered: true,
                title: '信息不全',
                content: '请将区划编码和区划名称填写完毕后再进行创建！'
            })
            return
        }
        else if (inj_judge(taskCode) || inj_judge(nodeName)){
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        }
        else{
            if (taskCode === props.updatePath[props.updatePath.length - 1].nodeCode){
                // 若区划编码没有变更，则直接确认更改
                confirmUpdate()
            }
            else{
                // 否则需要查询是否已有该编码
                api.GetRegions({
                    region_code: [taskCode]
                }).then(response=>{
                    if (response.data.data.length === 0){
                        // 若非已有区划编码，则确认修改
                        confirmUpdate()
                    }
                    else{
                        Modal.warning({
                            centered: true,
                            title: '已有编码',
                            content: '该规则编码已存在，请重新输入！'
                        })
                    }
                })
            }
        }
    }

    const confirmCreate = ()=>{
        let str = '确认创建规则：“' + pathName + nodeName + '\\”吗？'
        Modal.confirm({
            centered: true,
            title: '确认创建',
            content: str,
            onOk: function(){
                setIsLoading(true)
                createRegions({
                    user_id: props.userId,
                    region_code: taskCode,
                    region_name: nodeName,
                    region_level: chosenTags.length,
                    parentId: chosenTags[chosenTags.length - 1].nodeId
                })
            }
        })
    }

    const confirmUpdate = ()=>{
        let str = '正在将规则：\n' +
                  '    “' + originPath + '\\”\n\n' + 
                  '修改为：\n' + 
                  '    “' + pathName + nodeName + '\\”\n\n' +
                  '确认修改吗？'
        Modal.confirm({
            centered: true,
            title: '确认修改',
            content: str,
            onOk: function(){
                setIsLoading(true)
                updateRegions({
                    _id: props.updatePath[props.updatePath.length - 1].nodeId,
                    region_code: taskCode,
                    region_name: nodeName,
                    region_level: chosenTags.length,
                    parentId: chosenTags[chosenTags.length - 1].nodeId
                })
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    const createRegions = (data)=>{
        // 调用创建规则接口
        api.CreateRegions(data).then(response=>{
            // 应该返回_id
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            setIsLoading(false)
            props.showError('创建规则失败！')
        })
    }

    const updateRegions = (data)=>{
        let regions = {
            regions: [data]
        }
        // 调用创建规则接口
        api.UpdateRegions(regions).then(response=>{
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            setIsLoading(false)
            props.showError('更新规则失败！')
        })
    }

    return (
        <Space direction='vertical' size={15}>
            <div className={style.regionItem}>
                <div className={style.itemTitle}>
                    区划编码：
                </div>
                <div className={style.itemContent} style={{display: 'flex'}}>
                    <Input onChange={handleCodeInputChange} value={taskCode} style={{top: -4}} placeholder='请输入区划的编码'/>
                </div>
            </div>

            <div className={style.regionItem}>
                <div className={style.itemTitle}>
                    节点名称：
                </div>
                <div className={style.itemContent} style={{display: 'flex'}}>
                    <Input onChange={handleNameInputChange} value={nodeName} style={{top: -4}} placeholder='请输入区划的名称'/>
                </div>
            </div>
            
            <div className={style.regionItem}>
                <div className={style.itemTitle}>
                    创建区划规则：
                </div>
                <div className={style.itemContent}>
                    <div className={style.regionText}>
                        {pathName + nodeName + '\\'}
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
                        <div className={style.chosenTag}
                            style={{backgroundColor: 'orange'}}>
                            <div className={style.tagContent}>
                                {nodeName}
                            </div>
                        </div>
                    </Space>
                </div>

                <div className={style.chooseBox}>
                    <div className={style.chooseTagArea}>
                        <div className={style.chooseBoxTitle1}>
                            可选业务规则项：
                        </div>
                        <TagsArea tags={enabledTags} chooseTag={chooseTag} type={'1'}/>
                    </div>
                </div>
            </Space>

            <div style={{display: 'block', textAlign: 'center'}}>
                <Button type='default' size='middle' style={{marginRight: 60, width: 100}}
                    onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' style={{width: 100}}
                    onClick={props.updatePath.length === 0 ? handleCreate : handleUpdate} loading={isLoading}>
                    {props.updatePath.length === 0 ? '创建' : '修改'}
                </Button>
            </div>
        </Space>
    )
}