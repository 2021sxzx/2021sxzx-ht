import React, {useEffect, useState} from 'react'
import style from './CreateRegion.module.scss'
import { DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge  } from 'antd';
import TagsArea from './TagsArea.js'
import api from '../../../../../api/rule';

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
    const [pathName, setPathName] = useState(props.regionRoot.nodeName + '\\')
    const [extraHeight, setExtraHeight] = useState(0)
    // 加载效果
    const [isLoading, setIsLoading] = useState(false)

    /* 选择过程中的已选择、待选择节点 */
    const [chosenTags, setChosenTags] = useState([])
    const [enabledTags, setEnabledTags] = useState([])
    const [recommendedTags, setRecommendedTags] = useState([{
        'nodeName': '暂无',
        'nodeId': '12345'
    }])

    /* 创建自定义节点 */
    const [isNodeCreating, setIsNodeCreating] = useState(false)
    const [newNode, setNewNode] = useState('')
    const [newNodeList, setNewNodeList] = useState([])
    
    /* 处理修改功能 */
    const [isUpdatingRoot, setIsUpdatingRoot] = useState(false)
    // 原节点的路径
    const [originPath, setOriginPath] = useState('')
    // 自定义节点后当前节点的真实parentId
    const [realId, setRealId] = useState('')

    /* 创建或修改功能的总处理 */
    // 已选择节点的规则id以及区划id
    const [currRegionId, setCurrRegionId] = useState(null)
    // 是否已经可以创建
    const [chooseEnd, setChooseEnd] = useState(false)

    useEffect(()=>{
        // 初始化分类规则树的根节点
        let currChildren = []
        let currChosen = []
        if (props.updatePath.length === 0){
            // 若是创建，则用规则树根节点进行处理
            currChosen.push(props.regionRoot)
            // 初始化可选节点
            for (let i = 0; i < (props.regionTree[props.regionRoot.nodeId]).length; i++){
                let node = props.regionTree[props.regionRoot.nodeId][i]
                currChildren.push(node)
            }  
            setCurrRegionId(props.regionRoot.nodeCode) 
        }
        else if (props.updatePath.length === 1){
            // 特殊情况处理：修改根节点
            // 只允许修改名字，其他的啥也别干
            setOriginPath(props.regionRoot.nodeName + '\\')
            setTaskCode(props.updatePath[0].nodeCode)
            setNodeName(props.updatePath[0].nodeName)
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
            for (let i = 0; i < props.regionTree[props.updatePath[1].nodeId].length; i++){
                let node = props.regionTree[props.updatePath[1].nodeId][i]
                if (node.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(node)
            }
            setCurrRegionId(props.updatePath[1].nodeCode)
            setTaskCode(props.updatePath[0].nodeCode)
            setNodeName(props.updatePath[0].nodeName)
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
        let currRegion = pathName + tag.nodeName + '\\'
        chosenTags.push(tag)
        
        let currChildren = []
        if (tag.nodeId in props.regionTree){
            // 选择的节点有子节点，则处理子节点
            for (let i = 0; i < props.regionTree[tag.nodeId].length; i++){
                let node = props.regionTree[tag.nodeId][i]
                if (props.updatePath.length === 0 || node.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(node)
            }
        }

        setCurrRegionId(tag.nodeCode)
        setEnabledTags(currChildren)
        setPathName(currRegion)
    }

    const getBack = (index)=>{
        if (index === chosenTags.length - 1){
            // 原地tp
            return
        }
        let currChosen = []
        let currChildren = []
        //let currNewNodeList = []
        //let listIndex = 0
        let currRegion = ''
        
        let returnTag = chosenTags[index]
        for (let i = 0; i <= index; i++){
            // 把现在已选择的节点列表还原到选中的节点为止
            currChosen.push(chosenTags[i])
            currRegion += (chosenTags[i].nodeName + '\\')
            /*if (chosenTags[i].nodeId[0] == 't'){
                // 若其中有待创建队列，则重新推入队列，同时可以完成创建
                currNewNodeList.push(newNodeList[listIndex++])
            }*/
        }
        
        if (returnTag.nodeId in props.regionTree){
            // 若回退节点有子节点，则显示
            for (let i = 0; i < props.regionTree[returnTag.nodeId].length; i++){
                let child = props.regionTree[returnTag.nodeId][i]
                // 不显示正在修改的节点本身
                if (props.updatePath.length === 0 || child.nodeId !== props.updatePath[0].nodeId)
                    currChildren.push(child)
            }
        }

        // 将新的状态返回
        setCurrRegionId(returnTag.nodeCode)
        //setNewNodeList(currNewNodeList)
        setChosenTags(currChosen)
        setPathName(currRegion)
        setEnabledTags(currChildren)
    }

    const handleCancel = ()=>{
        // 点击取消按钮
        props.setPageType(1)
    }

    const handleCreate = ()=>{
        // 点击创建按钮
        if (taskCode === '' || nodeName === ''){
            Modal.warning({
                centered: true,
                title: '信息不全',
                content: '请将区划编码和区划名称填写完毕后再进行创建！'
            })
            return
        }
        let str = '确认创建规则：“' + pathName + nodeName + '\\”吗？'
        Modal.confirm({
            centered: true,
            title: '确认创建',
            content: str,
            onOk: function(){
                setIsLoading(true)
                createRegions({
                    region_code: taskCode,
                    region_name: nodeName,
                    region_level: chosenTags.length,
                    parentId: chosenTags[chosenTags.length - 1].nodeId
                })
            }
        })
    }

    const handleUpdate = ()=>{
        // 点击修改按钮
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
                    _id: props.updatePath[0].nodeId,
                    region_code: taskCode,
                    region_name: nodeName,
                    region_level: chosenTags.length,
                    parentId: chosenTags[chosenTags.length - 1].nodeId
                })
            },
            style: {whiteSpace: 'pre-wrap'}
        })
    }

    useEffect(function(){
        if (realId === '') return
        let node = [{
            region_id: props.updatePath[0].nodeId,
            region_name: nodeName,
            parentId: realId
        }]
        let data = {
            regions: node
        }
        updateRegions(data)
    }, [realId])

    const createNewNode = (node)=>{
        // 放进待处理数组
        newNodeList.push({
            temp_id: node.nodeId,
            region_name: node.nodeName,
            parentId: currRegionId
        })
        // 处理页面展示内容
        chosenTags.push(node)
        setPathName(pathName + node.nodeName + '\\')
        setEnabledTags([])
        setCurrRegionId(node.nodeId)
    }

    const createRegions = (data)=>{
        // 调用创建规则接口
        api.CreateRegions(data).then(response=>{
            // 应该返回_id
            props.createRegionSimulate(response.data.data)
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            props.getRegionTree()
            props.showError('创建规则失败！')
            console.log(error)
            props.setPageType(1)
        })
    }

    const updateRegions = (data)=>{
        let regions = {
            regions: [data]
        }
        // 调用创建规则接口
        api.UpdateRegions(regions).then(response=>{
            //props.getRegionTree()
            props.updateRegionSimulate(data)
            props.showSuccess()
            props.setPageType(1)
        }).catch(error=>{
            // 若创建过程出错，可能是库已经发生改变，树和事项都刷新
            props.getRegionTree()
            props.showError('更新规则失败！')
            props.setPageType(1)
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

                <div className={style.chooseBox} style={{height: 276 + extraHeight, minHeight: 276}}>
                    <div className={style.chooseBoxTitle1}>
                        可选事项规则项：
                    </div>
                    <div className={style.enabledTags}>
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