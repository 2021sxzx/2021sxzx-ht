import React, {useEffect, useState} from 'react'
import {DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp";
const {RangePicker} = DatePicker

export default function SelectForm(props){
    const [form] = Form.useForm()
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [time, setTime] = useState([null, null])
    const [rule_id, setRuleId] = useState('')
    const [rule_name, setRuleName] = useState('')
    const [department, setDepartment] = useState('')
    const [creator, setCreator] = useState('')

    const handleTaskCodeChange = (e)=>{
        setRuleId(e.target.value)
    }
    const handleTaskRuleChange = (e)=>{
        setRuleName(e.target.value)
    }
    const handleDepartmentChange = (e)=>{
        setDepartment(e.target.value)
    }
    const handleCreatorChange = (e)=>{
        setCreator(e.target.value)
    }

    const Search = ()=>{
        const data = {}
        if (start_time !== '') data['start_time'] = start_time
        if (end_time !== '') data['end_time'] = end_time
        if (rule_id !== '') data['rule_id'] = rule_id
        if (rule_name !== '') data['rule_name'] = rule_name
        if (department !== '') data['department'] = department
        if (creator !== '') data['creator'] = creator
        clear()
        props.getSearch(data)
    }

    const handleDateChange = (value, dataString)=>{
        if (value){
            setStartTime(getTimeStamp(dataString[0]))
            setEndTime(getTimeStamp(dataString[1]))
            setTime(value)
        }
        else{
            setEndTime('')
            setStartTime('')
            setTime([null, null])
        }
    }

    const clear = ()=>{
        document.getElementById('ruleIdInput').value = ''
        document.getElementById('ruleNameInput').value = ''
        document.getElementById('departmentInput').value = ''
        document.getElementById('creatorInput').value = ''
        document.getElementById('timeInput').value = [null, null]
        setRuleId('')
        setRuleName('')
        setDepartment('')
        setCreator('')
        setStartTime('')
        setEndTime('')
        setTime([null, null])
    }

    const reset = ()=>{
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
                <Form.Item label='规则编码' style={{width: '25%'}}>
                    <Input id='ruleIdInput' value={rule_id}
                        placeholder='请输入编码' size='middle' onChange={handleTaskCodeChange}></Input>
                </Form.Item>
                <Form.Item label='规则名称' style={{width: '25%'}}>
                    <Input id='ruleNameInput' value={rule_name}
                        placeholder='请输入名称' size='middle' onChange={handleTaskRuleChange}></Input>
                </Form.Item>
                <Form.Item label='业务部门' style={{width: '22%'}}>
                    <Input id='departmentInput' value={department}
                        placeholder='请输入部门' size='middle' onChange={handleDepartmentChange}></Input>
                </Form.Item>
                <Form.Item label='创建人' style={{width: '22%'}}>
                    <Input id='creatorInput' value={creator}
                        placeholder='请输入创建人' size='middle' onChange={handleCreatorChange}></Input>
                </Form.Item>

                <Form.Item label='起始时间' style={{marginTop: 10, width: '35%'}}>
                    <RangePicker id='timeInput' value={time} style={{width: '100%'}} 
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