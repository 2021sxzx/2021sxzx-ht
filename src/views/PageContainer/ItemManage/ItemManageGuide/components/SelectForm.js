import React, {useEffect, useState} from 'react'
import {DatePicker, Space, Form, Input, Button, Select, Table, Modal,Descriptions, Badge} from 'antd'
import {getTimeStamp} from "../../../../../utils/TimeStamp";
const {RangePicker} = DatePicker

export default function SelectForm(props){
    const [form] = Form.useForm()
    const [start_time, setStartTime] = useState('')
    const [end_time, setEndTime] = useState('')
    const [time, setTime] = useState([null, null])
    const [item_rule_id, setItemRuleId] = useState('')
    const [item_rule_name, setItemRuleName] = useState('')
    const [department, setDepartment] = useState('')
    const [creator, setCreator] = useState('')

    const handleTaskCodeChange = (e)=>{
        setItemRuleId(e.target.value)
    }
    const handleTaskRuleChange = (e)=>{
        setItemRuleName(e.target.value)
    }
    const handleDepartmentChange = (e)=>{
        setDepartment(e.target.value)
    }
    const handleCreatorChange = (e)=>{
        setCreator(e.target.value)
    }

    const Search = ()=>{
        const data = {
            start_time,
            end_time,
            item_rule_id,
            item_rule_name,
            department,
            creator
        }
        clear()
        console.log(data)
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
        document.getElementById('itemRuleIdInput').value = ''
        document.getElementById('itemRuleNameInput').value = ''
        document.getElementById('departmentInput').value = ''
        document.getElementById('creatorInput').value = ''
        document.getElementById('timeInput').value = [null, null]
        setItemRuleId('')
        setItemRuleName('')
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
                <Form.Item label='规则编码'>
                    <Input id='itemRuleIdInput' value={item_rule_id}
                        placeholder='请输入编码' size='middle' style={{width: 288.4}} onChange={handleTaskCodeChange}></Input>
                </Form.Item>
                <Form.Item label='规则名称'>
                    <Input id='itemRuleNameInput' value={item_rule_name}
                        placeholder='请输入名称' size='middle' style={{width: 249}} onChange={handleTaskRuleChange}></Input>
                </Form.Item>
                <Form.Item label='业务部门'>
                    <Input id='departmentInput' value={department}
                        placeholder='请输入部门' size='middle' onChange={handleDepartmentChange}></Input>
                </Form.Item>
                <Form.Item label='创建人'>
                    <Input id='creatorInput' value={creator}
                        placeholder='请输入创建人' size='middle' onChange={handleCreatorChange}></Input>
                </Form.Item>

                <Form.Item label='起始时间' style={{marginTop: 10}}>
                    <RangePicker id='timeInput' value={time}
                        onChange={handleDateChange}/>      
                </Form.Item>
                <Form.Item style={{marginLeft: 696, marginTop: 10}}>
                    <Button type='default' onClick={reset}>重置</Button>
                </Form.Item>
                <Form.Item style={{marginTop: 10}}>
                    <Button type='primary' onClick={Search}>查询</Button>
                </Form.Item>
            </Form>
        </>
    )
}