import { Button, Modal, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import{DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import confirm from 'antd/lib/modal/confirm'

export default function RoleList() {
  const [dataSource,setDataSource] = useState([])
  const [isModalVisible,setIsModalVisible] = useState(true)
  const columns = [
    {
      title: 'ID',
      dataIndex:'id'
    },
    {
      title:'角色名称',
      dataIndex:'roleName'
    },
    {
      title:'操作',
      render:(item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>{
            confirmMethod(item)
          }}></Button>
          <Button type='primary' shape='circle' icon={<EditOutlined/>}></Button>
        </div>
      }
    }
  ]
  useEffect(()=>{
    axios.get('http://localhost:5000/roles').then(res=>{
      console.log(res.data);
      setDataSource(res.data)
    })
  },[])

  const confirmMethod = (item)=>{
    confirm({
      title: '你确定要删除？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`http://localhost:5000/rights/${item.id}`)
}

  const handleOk = ()=>{
    
  }
  const handleCancel = ()=>{
    setIsModalVisible(false)
  }
  return (
      <div>
          <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
          <Modal title='权限分配' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>somecontent</p>
            <p>somecontent</p>
            <p>somecontent</p>
          </Modal>
      </div>
  )
}
