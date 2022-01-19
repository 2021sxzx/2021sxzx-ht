import React, {useEffect, useState} from 'react'
import {DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge} from 'antd'

const {RangePicker} = DatePicker

export default function SelectForm(props){
    const [form] = Form.useForm()
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [taskCode, setTaskCode] = useState('')
    const [taskRule, setTaskRule] = useState('')
    const [department, setDepartment] = useState('')
    const [creator, setCreator] = useState('')

    const handleTaskCodeChange = (e)=>{
        setTaskCode(e.target.value)
    }
    const handleTaskRuleChange = (e)=>{
        setTaskRule(e.target.value)
    }
    const handleDepartmentChange = (e)=>{
        setDepartment(e.target.value)
    }
    const handleCreatorChange = (e)=>{
        setCreator(e.target.value)
    }

    const Search = ()=>{
        const data = {
            startTime,
            endTime,
            taskCode,
            taskRule,
            department,
            creator
        }
        props.getSearch(data)
    }

    const handleDateChange = (value, dataString)=>{
        if (value){
            setStartTime(getTimeStamp(dataString[0]))
            setEndTime(getTimeStamp(dataString[1]))
        }
        else{
            setEndTime('')
            setStartTime('')
        }
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
                <Form.Item label='规则编码'>
                    <Input placeholder='请输入编码' size='middle' style={{width: 288.4}} onChange={handleTaskCodeChange}></Input>
                </Form.Item>
                <Form.Item label='规则名称'>
                    <Input placeholder='请输入名称' size='middle' style={{width: 200}} onChange={handleTaskRuleChange}></Input>
                </Form.Item>
                <Form.Item label='业务部门'>
                    <Input placeholder='请输入部门' size='middle' onChange={handleDepartmentChange}></Input>
                </Form.Item>
                <Form.Item label='创建人'>
                    <Input placeholder='请输入创建人' size='middle' onChange={handleCreatorChange}></Input>
                </Form.Item>

                <Form.Item label='起始时间' style={{marginTop: 10}}>
                    <RangePicker onChange={handleDateChange}/>      
                </Form.Item>
                <Form.Item style={{marginLeft: 646, marginTop: 10}}>
                    <Button type='default' onClick={props.reset}>重置</Button>
                </Form.Item>
                <Form.Item style={{marginTop: 10}}>
                    <Button type='primary' onClick={Search}>查询</Button>
                </Form.Item>
            </Form>
        </>
    )
}