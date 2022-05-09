import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Table, Modal } from 'antd'
import api from '../../../../../../api/rule'

export default function PrincipleModal(props){
    const [users, setUsers] = useState([])
    const [department, setDepartment] = useState('')
    const [userName, setUserName] = useState('')

    const userTable = {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word', 
        wordBreak: 'break-all'
    }

    const init = ()=>{
        if (!props.choosingPrinciple) return
        api.GetItemUsers().then(response=>{
            let data = response.data.data
            setUsers(data)
        }).catch(error=>{
            props.showError('选择指南初始化失败')
        })
    }

    useEffect(function(){
        // 当面板打开时获取首页指南
        init()
    }, [props.choosingPrinciple])

    const handleDepartmentChange = (e)=>{
        setDepartment(e.target.value)
    }

    const handleUserNameChange = (e)=>{
        setUserName(e.target.value)
    }

    const clear = ()=>{
        // 清空搜索框
        document.getElementById('departmentInput').value = ''
        document.getElementById('userNameInput').value = ''
        setDepartment('')
        setUserName('')
        // 重新初始化数据
        init()
    }

    const processData = ()=>{
        let data = {}
        if (userName !== '') data['user_name'] = userName
        if (department !== '') data['department_name'] = department  
        search(data)
    }

    const search = (data)=>{
        // 搜索
        api.GetItemUsers(data).then(response=>{
            let data = response.data.data
            setUsers(data)
        }).catch(error=>{
            console.log(error)
            props.showError('搜索失败')
        })
    }

    const endChoosingPrinciple = ()=>{
        props.setChoosingPrinciple(false)
        setUsers([])
        setDepartment('')
        setUserName('')
    }

    const userColumns = [
        {
            title: '用户名称',
            dataIndex: 'user_name',
            key: 'user_name'
        },
        {
            title: '用户身份',
            dataIndex: 'role_name',
            key: 'role_name'
        },
        {
            title: '业务部门',
            dataIndex: 'department_name',
            key: 'department_name'
        },
        {
            title: '选择',
            key: 'choose',
            width: 100,
            render: (text, record)=>(
                <Button type='primary' onClick={function(){
                    props.setPrinciple(record.user_name)
                    props.setPrincipleId(record._id)
                    endChoosingPrinciple()
                }}>
                    选择
                </Button>
            )
        }
    ]

    return (
        <Modal width={800} centered destroyOnClose={true} title='选择指南' visible={props.choosingPrinciple} footer={false} onCancel={endChoosingPrinciple}>
            <Form
                layout='inline'
                initialValues={{
                    layout: 'inline'
                }}
                style={{marginBottom: 10}}
            >
                <Form.Item label='业务部门' style={{width: '37%'}}>
                    <Input id='departmentInput' value={department}
                        placeholder='请输入业务部门' onChange={handleDepartmentChange} />
                </Form.Item>
                <Form.Item label='用户名称' style={{width: '37%'}}>
                    <Input id='userNameInput' value={userName}
                        placeholder='请输入用户名称' onChange={handleUserNameChange} />
                </Form.Item>
                <Form.Item style={{width: '8%'}}>
                    <Button type='default' onClick={clear}>重置</Button>
                </Form.Item>
                <Form.Item style={{width: '8%'}}>
                    <Button type='primary' onClick={processData}>搜索</Button>
                </Form.Item>
            </Form>
            <Table class={userTable} columns={userColumns} dataSource={users} rowKey='department' />
        </Modal>
    )
}