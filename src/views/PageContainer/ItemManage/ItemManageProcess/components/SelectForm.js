import React, {useEffect, useState} from 'react'
import {DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp";
const {RangePicker} = DatePicker

export default function SelectForm(props){
    const [form] = Form.useForm()
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [time, setTime] = useState([null, null])
    const [task_code, setTaskCode] = useState('')
    const [item_name, setItemRuleName] = useState('')
    const [department, setDepartment] = useState('')
    const [creator, setCreator] = useState('')
    const [rule_id, setRuleId] = useState('')
    const [region_code, setRegionCode] = useState('')

    const handleTaskCodeChange = (e)=>{
        setTaskCode(e.target.value)
    }
    const handleItemNameChange = (e)=>{
        setItemRuleName(e.target.value)
    }
    const handleDepartmentChange = (e)=>{
        setDepartment(e.target.value)
    }
    const handleCreatorChange = (e)=>{
        setCreator(e.target.value)
    }
    const handleRuleIdChange = (e)=>{
        setRuleId(e.target.value)
    }
    const handleRegionCodeChange = (e)=>{
        setRegionCode(e.target.value)
    }

    useEffect(function(){
        // 初始化搜索栏中的信息
        for (let key in props.bindedData){
            if ('rule_id' in props.bindedData){
                let rule_id = parseIds(props.bindedData.rule_id)
                setRuleId(rule_id)
            }
            if ('region_code' in props.bindedData){
                let region_code = parseIds(props.bindedData.region_code)
                setRegionCode(region_code)
            }
            break
        }
    }, [props.bindedData])

    const splitIds = (id)=>{
        let ids = []
        let noEmpty = id.replace(/\s*/g, '')
        ids = noEmpty.split(',')
        return ids
    }

    const parseIds = (ids)=>{
        let result = ''
        for (let i = 0; i < ids.length; i++){
            if (result !== '') result +=','
            result += ids[i]
        }
        return result
    }

    const Search = ()=>{
        const data = {}
        if (start_time !== '') data['start_time'] = start_time
        if (end_time !== '') data['end_time'] = end_time
        if (task_code !== ''){
            let code = splitIds(task_code)
            data['task_code'] = code
        } 
        if (item_name !== '') data['item_name'] = item_name
        if (department !== '') data['department_name'] = department
        if (creator !== '') data['creator_name'] = creator
        if (rule_id !== ''){
            let id = splitIds(rule_id)
            data['rule_id'] = id
        } 
        if (region_code !== ''){
            let code = splitIds(region_code)
            data['region_code'] = code
        } 
        // clear()
        props.setOriginData(data)
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
        document.getElementById('taskCodeInput').value = ''
        document.getElementById('itemNameInput').value = ''
        document.getElementById('departmentInput').value = ''
        document.getElementById('creatorInput').value = ''
        document.getElementById('ruleIdInput').value = ''
        document.getElementById('regionCodeInput').value = ''
        document.getElementById('timeInput').value = [null, null]
        setTaskCode('')
        setItemRuleName('')
        setDepartment('')
        setCreator('')
        setRuleId('')
        setRegionCode('')
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
                <Form.Item label='指南编码' style={{width: '25%'}}>
                    <Input id='taskCodeInput' value={task_code}
                        placeholder='请输入编码' size='middle' onChange={handleTaskCodeChange}></Input>
                </Form.Item>
                <Form.Item label='指南名称' style={{width: '25%'}}>
                    <Input id='itemNameInput' value={item_name}
                        placeholder='请输入名称' size='middle' onChange={handleItemNameChange}></Input>
                </Form.Item>
                <Form.Item label='业务部门' style={{width: '22%'}}>
                    <Input id='departmentInput' value={department}
                        placeholder='请输入部门' size='middle' onChange={handleDepartmentChange}></Input>
                </Form.Item>
                <Form.Item label='创建人' style={{width: '22%'}}>
                    <Input id='creatorInput' value={creator}
                        placeholder='请输入创建人' size='middle' onChange={handleCreatorChange}></Input>
                </Form.Item>

                <Form.Item label='业务规则编码' style={{marginTop: 10, width: '25%'}}>
                    <Input id='ruleIdInput' value={rule_id}
                        placeholder='请输入业务规则编码' size='middle' onChange={handleRuleIdChange}></Input>
                </Form.Item>
                <Form.Item label='区划规则编码' style={{marginTop: 10, width: '25%'}}>
                    <Input id='regionCodeInput' value={region_code}
                        placeholder='请输入区划规则编码' size='middle' onChange={handleRegionCodeChange}></Input>
                </Form.Item>
                <Form.Item label='起始时间' style={{marginTop: 10, width: '32%'}}>
                    <RangePicker id='timeInput' value={time} style={{width: '100%'}} 
                        onChange={handleDateChange}/>      
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