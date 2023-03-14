import React, {useEffect, useState} from 'react'
import {DatePicker, Checkbox, Form, Input, Button, Modal} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp"
import returnString from '../../../../../utils/returnString'

const {RangePicker} = DatePicker

export default function SelectForm(props) {
    const [form] = Form.useForm()
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [time, setTime] = useState([null, null])
    const [task_code, setTaskCode] = useState('')
    const [item_name, setItemRuleName] = useState('')
    const [serviceAgent, setServiceAgent] = useState('')
    const [creator, setCreator] = useState('')
    const [rule_id, setRuleId] = useState('')
    const [region_code, setRegionCode] = useState('')
    const [item_status, setItemStatus] = useState([])

    useEffect(()=>{
        console.log(props.searchData.current)
        let searchData = props.searchData.current
        // 应用搜索参数
        setTaskCode(returnString(searchData.task_code))
        setItemRuleName(returnString(searchData.item_name))
        setServiceAgent(returnString(searchData.service_agent_name))

        // TODO
        // setTime()

        setCreator(returnString(searchData.creator_name))
        setRuleId(returnString(searchData.rule_id))
        setRegionCode(returnString(searchData.region_code))
        setItemStatus((searchData.item_status!==undefined)? searchData.item_status: [])

        props.setOriginData(searchData)
    },[])

    const handleTaskCodeChange = (e) => {
        setTaskCode(e.target.value)
    }
    const handleItemNameChange = (e) => {
        setItemRuleName(e.target.value)
    }
    const handleServiceAgentChange = (e) => {
        setServiceAgent(e.target.value)
    }
    const handleCreatorChange = (e) => {
        setCreator(e.target.value)
    }
    const handleRuleIdChange = (e) => {
        setRuleId(e.target.value)
    }
    const handleRegionCodeChange = (e) => {
        setRegionCode(e.target.value)
    }
    const handleItemStatusChange = (value) => {
        setItemStatus(value)
    }

    useEffect(function () {
        // 初始化搜索栏中的信息
        for (let key in props.bindedData) {
            if ('rule_id' in props.bindedData) {
                let rule_id = parseIds(props.bindedData.rule_id)
                setRuleId(rule_id)
            }
            if ('region_code' in props.bindedData) {
                let region_code = parseIds(props.bindedData.region_code)
                setRegionCode(region_code)
            }
            break
        }
        if (props.jumpCode && props.jumpCode !== '') {
            setTaskCode(props.jumpCode)
        }
    }, [props.bindedData, props.jumpCode])

    useEffect(function () {
        setItemStatus(props.fullType)
    }, [props.fullType])

    const splitIds = (id) => {
        let noEmpty = id.replace(/\s*/g, '').replace('，', ',')
        return noEmpty.split(',')
    }

    const parseIds = (ids) => {
        let result = ''
        for (let i = 0; i < ids.length; i++) {
            if (result !== '') result += ','
            result += ids[i]
        }
        return result
    }

    // 输入字段的安全检查
    const inj_judge = (str) => {
        let inj_str = ['delete', 'and', 'exec', 'insert', 'update', 'count', 'master', 'select',
            'char', 'declare', 'or', '|', 'delete', 'not', '/*', '*/', 'find']
        for (let i = 0; i < inj_str.length; i++) {
            if (str.indexOf(inj_str[i]) >= 0) {
                return true
            }
        }
        return false
    }

    const Search = () => {
        const data = {}
        if (inj_judge(task_code) || inj_judge(item_name) || inj_judge(creator) || inj_judge(serviceAgent)
            || inj_judge(rule_id) || inj_judge(region_code)) {
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        } else {
            if (start_time !== '') data['create_start_time'] = start_time
            if (end_time !== '') data['create_end_time'] = end_time
            if (task_code !== '') data['task_code'] = splitIds(task_code)
            if (item_name !== '') data['item_name'] = item_name
            if (serviceAgent !== '') data['service_agent_name'] = serviceAgent
            if (creator !== '') data['creator_name'] = creator
            if (rule_id !== '') data['rule_id'] = splitIds(rule_id)
            if (region_code !== '') data['region_code'] = splitIds(region_code)
            data['item_status'] = item_status
            props.setOriginData(data)
            props.getSearch(data)

            props.searchData.current = data
            // window.localStorage.setItem('searchData', JSON.stringify(data))
        }
    }

    const handleDateChange = (value, dataString) => {
        if (value) {
            setStartTime(getTimeStamp(dataString[0]))
            setEndTime(getTimeStamp(dataString[1]))
            setTime(value)
        } else {
            setEndTime('')
            setStartTime('')
            setTime([null, null])
        }
    }

    const clear = () => {
        setTaskCode('')
        setItemRuleName('')
        setServiceAgent('')
        // setDepartment('')
        setCreator('')
        setRuleId('')
        setRegionCode('')
        setStartTime('')
        setEndTime('')
        setTime([null, null])
        setItemStatus(props.fullType)
    }

    const reset = () => {
        clear()
        props.reset()
    }

    return (
        <>
            <Form
                layout='inline'
                form={form}
                initialValues={{
                    layout: 'inline'
                }}
                onKeyDown={(e) => {
                    // 当按下enter时，触发搜索功能
                    if (e.key === 'Enter') {
                        Search()
                    }
                }}
            >
                <Form.Item label='指南编码' style={{width: '25%'}}>
                    <Input value={task_code}
                           placeholder='请输入编码'
                           size='middle'
                           onChange={handleTaskCodeChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>
                <Form.Item label='指南名称' style={{width: '25%'}}>
                    <Input value={item_name}
                           placeholder='请输入名称'
                           size='middle'
                           onChange={handleItemNameChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>
                <Form.Item label='实施主体名称' style={{width: '22%'}}>
                    <Input value={serviceAgent}
                           placeholder='请输入实施主体名称'
                           size='middle'
                           onChange={handleServiceAgentChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>
                {/*            <Form.Item label='机构' style={{width: '22%'}}>*/}
                {/*                <Input value={department}*/}
                {/*placeholder='请输入机构' size='middle' onChange={handleDepartmentChange}/>*/}
                {/*            </Form.Item>*/}
                <Form.Item label='创建人' style={{width: '22%'}}>
                    <Input value={creator}
                           placeholder='请输入创建人'
                           size='middle'
                           onChange={handleCreatorChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>

                <Form.Item label='业务规则编码' style={{marginTop: 10, width: '25%'}}>
                    <Input value={rule_id}
                           placeholder='请输入业务规则编码'
                           size='middle'
                           onChange={handleRuleIdChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>
                <Form.Item label='区划规则编码' style={{marginTop: 10, width: '25%'}}>
                    <Input value={region_code}
                           placeholder='请输入区划规则编码'
                           size='middle'
                           onChange={handleRegionCodeChange}
                           maxLength={64}
                           showCount
                    />
                </Form.Item>
                <Form.Item label='起始时间' style={{marginTop: 10, width: '45%'}}>
                    <RangePicker value={time}
                                 style={{width: '100%'}}
                                 onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item label='事项状态' style={{marginTop: 10, width: '85%'}}>
                    <Checkbox.Group options={props.statusType} value={item_status} onChange={handleItemStatusChange}/>
                </Form.Item>
                <Form.Item style={{marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='default' onClick={reset} style={{width: '100%'}}>重置</Button>
                </Form.Item>
                <Form.Item style={{marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='primary' onClick={Search} style={{width: '100%'}}>查询</Button>
                </Form.Item>
            </Form>
        </>
    )
}
