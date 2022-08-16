import React, {useState} from 'react'
import {DatePicker, Form, Input, Button, Modal} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp"

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

    const splitIds = (id) => {
        let noEmpty = id.replace(/\s*/g, '').replace('，', ',')
        return noEmpty.split(',')
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
            props.getSearch(data)
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
            >
                <Form.Item label='指南编码' style={{width: '25%'}}>
                    <Input value={task_code}
                           placeholder='请输入编码'
                           size='middle'
                           onChange={handleTaskCodeChange}/>
                </Form.Item>
                <Form.Item label='指南名称' style={{width: '25%'}}>
                    <Input value={task_name}
                           placeholder='请输入名称'
                           size='middle'
                           onChange={handleTaskNameChange}/>
                </Form.Item>
                <Form.Item label='实施主体名称' style={{width: '22%'}}>
                    <Input value={serviceAgent}
                           placeholder='请输入实施主体名称'
                           size='middle'
                           onChange={handleServiceAgentChange}/>
                </Form.Item>
                {/*            <Form.Item label='机构' style={{width: '22%'}}>*/}
                {/*                <Input value={department}*/}
                {/*placeholder='请输入机构' size='middle' onChange={handleDepartmentChange}/>*/}
                {/*            </Form.Item>*/}
                <Form.Item label='创建人' style={{width: '22%'}}>
                    <Input value={creator}
                           placeholder='请输入创建人'
                           size='middle'
                           onChange={handleCreatorChange}/>
                </Form.Item>

                <Form.Item label='起始时间' style={{marginTop: 10, width: '35%'}}>
                    <RangePicker value={time}
                                 style={{width: '100%'}}
                                 onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item style={{marginLeft: '50%', marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='default' onClick={reset} style={{width: '100%'}}>重置</Button>
                </Form.Item>
                <Form.Item style={{marginTop: 10, width: '5%', minWidth: 62}}>
                    <Button type='primary' onClick={Search} style={{width: '100%'}}>查询</Button>
                </Form.Item>
            </Form>
        </>
    )
}
