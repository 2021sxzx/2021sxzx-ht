import React, {useEffect, useState} from 'react'
import {DatePicker, Form, Input, Button, Modal, Checkbox} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp"
import returnString from '../../../../../utils/returnString'
import moment from 'moment'

const {RangePicker} = DatePicker

export default function SelectForm(props) {
    const [form] = Form.useForm()
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [time, setTime] = useState([null, null])
    const [task_code, setTaskCode] = useState('')
    const [task_name, setTaskName] = useState('')
    const [serviceAgent, setServiceAgent] = useState('')
    const [creator, setCreator] = useState('')
    const [task_status, setTaskStatus] = useState([])

    useEffect(()=>{
        let searchData = props.searchData.current
        // 应用搜索参数
        setTaskCode(returnString(searchData.task_code))
        setTaskName(returnString(searchData.task_name))
        setServiceAgent(returnString(searchData.service_agent_name))
        setCreator(returnString(searchData.creator_name))
        setTime(
            searchData.start_time && searchData.end_time
            ? [moment(searchData.start_time), moment(searchData.end_time)]
            : [null, null]
        )
        setStartTime((searchData.start_time!==undefined)? searchData.start_time: '')
        setEndTime((searchData.end_time!==undefined)? searchData.end_time: '')
        props.setOriginData(searchData)
    },[])

    // useEffect(function () {
    //     setItemStatus(props.fullType)
    // }, [props.fullType])
    //初始化状态信息，设置为默认勾选
    useEffect(function(){
        setTaskStatus(props.fullType)
    },[props.fullType])

    const handleTaskCodeChange = (e) => {
        setTaskCode(e.target.value)
    }
    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value)
    }
    const handleServiceAgentChange = (e) => {
        setServiceAgent(e.target.value)
    }
    const handleCreatorChange = (e) => {
        setCreator(e.target.value)
    }
    const handleTaskStatusChange = (value) => {
        setTaskStatus(value)
    }
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
        if (inj_judge(task_code) || inj_judge(task_name) || inj_judge(creator) || inj_judge(serviceAgent)) {
            Modal.warning({
                centered: true,
                title: '非法输入',
                content: '输入信息中有非法输入内容，请检查输入！'
            })
        } else {
            if (start_time !== '') data['start_time'] = start_time
            if (end_time !== '') data['end_time'] = end_time
            if (task_code !== '') data['task_code'] = task_code
            if (task_name !== '') data['task_name'] = task_name
            if (serviceAgent !== '') data['service_agent_name'] = serviceAgent
            if (creator !== '') data['creator_name'] = creator
            data['task_status'] = task_status
            props.setOriginData(data)
            props.getSearch(data)

            props.searchData.current = data
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
        setTaskName('')
        setServiceAgent('')
        setCreator('')
        setStartTime('')
        setEndTime('')
        setTime([null, null])
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
                <Form.Item label='事项指南编码' style={{width: '25%'}}>
                    <Input value={task_code}
                           placeholder='请输入编码'
                           size='middle'
                           onChange={handleTaskCodeChange}
                           maxLength={64}
                           showCount
                           allowClear
                    />
                </Form.Item>
                <Form.Item label='事项指南名称' style={{width: '25%'}}>
                    <Input value={task_name}
                           placeholder='请输入名称'
                           size='middle'
                           onChange={handleTaskNameChange}
                           maxLength={64}
                           showCount
                           allowClear
                    />
                </Form.Item>
                <Form.Item label='实施主体名称' style={{width: '22%'}}>
                    <Input value={serviceAgent}
                           placeholder='请输入实施主体名称'
                           size='middle'
                           onChange={handleServiceAgentChange}
                           maxLength={64}
                           showCount
                           allowClear
                    />
                </Form.Item>
                {/*            <Form.Item label='机构' style={{width: '22%'}}>*/}
                {/*                <Input value={department}*/}
                {/*placeholder='请输入机构' size='middle' onChange={handleDepartmentChange}/>*/}
                {/*            </Form.Item>*/}
                <Form.Item label='负责人' style={{width: '22%'}}>
                    <Input value={creator}
                           placeholder='请输入负责人'
                           size='middle'
                           onChange={handleCreatorChange}
                           maxLength={64}
                           showCount
                           allowClear
                    />
                </Form.Item>

                <Form.Item label='起始时间' style={{marginTop: 10, width: '35%'}}>
                    <RangePicker value={time}
                                 style={{width: '100%'}}
                                 onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item label='状态' style={{marginTop: 10, width: '85%'}}>
                    <Checkbox.Group options={props.statusType} value={task_status} onChange={handleTaskStatusChange}/>
                </Form.Item>
                <Form.Item style={{ marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='default' onClick={reset} style={{width: '100%'}}>重置</Button>
                </Form.Item>
                <Form.Item style={{marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='primary' onClick={Search} style={{width: '100%'}}>查询</Button>
                </Form.Item>
            </Form>
        </>
    )
}
