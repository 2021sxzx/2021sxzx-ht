import React, {useEffect, useState} from 'react'
import api from '../../../api/rule';
import {Modal} from 'antd'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import ItemManageRule from './ItemManageRule/ItemManageRule'
import ItemManageRegion from './ItemManageRegion/ItemManageRegion'
import ItemManageGuide from './ItemManageGuide/ItemManageGuide'
import ItemManageProcess from './ItemManageProcess/ItemManageProcess'
import ItemManageUnusual from './ItemManageUnusual/ItemManageUnusual';

export default function ItemManage(props) {
    // 父子组件路径匹配
    const {path} = useRouteMatch()
    const [userId, setUserId] = useState('')
    // 事项管理组件公用state
    const [ruleRoot, setRuleRoot] = useState({})
    const [regionRoot, setRegionRoot] = useState({})
    // 处理需要展示的绑定信息，一般是已绑定的规则或区划id
    const [bindedData, setBindedData] = useState({})
    const [jumpCode, setJumpCode] = useState(props.location.task_code)

    const showError = (str) => {
        Modal.warning({
            title: '初始化失败',
            content: str,
            centered: true
        })
    }

    const getRuleRoots = () => {
        // 获取规则树根节点，用来初始化规则创建
        api.GetRules({
            parentId: ['']
        }).then(response => {
            let data = response.data.data
            if (data.length !== 1) {
                showError('规则树根节点不唯一')
            } else {
                setRuleRoot({
                    'nodeId': data[0].rule_id,
                    'nodeName': data[0].rule_name
                })
            }
        }).catch(error => {
            showError('初始化规则树根节点失败:' + error.message)
        })
    }

    const getRegionRoots = () => {
        // 获取区划树根节点，用来初始化区划创建
        api.GetRegions({
            parentId: ['']
        }).then(response => {
            let data = response.data.data
            if (data.length !== 1) {
                showError('区划树根节点不唯一')
            } else {
                setRegionRoot({
                    'nodeId': data[0]._id,
                    'nodeName': data[0].region_name,
                    'nodeCode': data[0].region_code
                })
            }
        }).catch(error => {
            showError('初始化区划树根节点失败！' + error.message)
        })
    }

    const init = () => {
        // 获取规则和区划树
        getRuleRoots()
        getRegionRoots()
        // 获取用户id
        setUserId(localStorage.getItem('_id'))
    }

    const jumpToProcess = () => {
        // 跳转至流程管理界面
        props.history.push(path + '/process')
    }

    const jumpToUnusual = () => {
        // 跳转至异常处理界面
        props.history.push(path + '/unusual')
    }


    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <Switch>
                <Route path={`${path}/process`}
                       render={() => (<ItemManageProcess userId={userId} jumpCode={jumpCode}
                                                         bindedData={bindedData} setBindedData={setBindedData}
                                                         setJumpCode={setJumpCode}
                                                         regionRoot={regionRoot} ruleRoot={ruleRoot}/>)}/>

                <Route path={`${path}/guide`}
                       render={() => (<ItemManageGuide userId={userId}/>)}/>

                <Route path={`${path}/item-rule/rule`}
                       render={() => (
                           <ItemManageRule setBindedData={setBindedData} bindedData={bindedData} userId={userId}
                                           ruleRoot={ruleRoot} jumpToProcess={jumpToProcess}
                                           jumpToUnusual={jumpToUnusual}/>)}/>

                <Route path={`${path}/item-rule/region`}
                       render={() => (
                           <ItemManageRegion setBindedData={setBindedData} bindedData={bindedData} userId={userId}
                                             regionRoot={regionRoot} jumpToProcess={jumpToProcess}
                                             jumpToUnusual={jumpToUnusual}/>)}/>

                <Route path={`${path}/unusual`}
                       render={() => (<ItemManageUnusual userId={userId}
                                                         bindedData={bindedData} setBindedData={setBindedData}
                                                         regionRoot={regionRoot} ruleRoot={ruleRoot}/>)}/>
            </Switch>
        </div>

    )
}
