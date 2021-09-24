import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import{DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'

const {confirm} = Modal

export default function RightList() {
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    axios.get('http://localhost:5000/rights?_embed=children').then(res=>{
    const list = res.data
    list.forEach(item=>{
      if(item.children.length===0){
        item.children = ''
      }
    })
    setDataSource(res.data)
    })
  },[])

  const columns = [
    {
      title:'ID',
      dataIndex:'id',
      render:(id)=>{
        return<b>{id}</b>
      }
    },
    {
      title:'权限名称',
      dataIndex:'title',
      // key:'age',
    },
    {
      title:'权限路径',
      dataIndex:'key',
      render:(key)=>{
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title:'操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined></DeleteOutlined>} onClick={()=>{
            confirmMethod(item)
          }}></Button>

          <Popover content={<div style={{textAlign:"center"}}>
            <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}/>
            </div>} title='页面配置项' trigger={item.pagepermisson===undefined?'':'click'}>
            <Button type='primary' shape='circle' icon={<EditOutlined></EditOutlined>} disabled={item.pagepermisson===undefined}></Button>
          </Popover>
        </div>
      }
    },
  ]

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

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson ===1?0:1
    console.log(item);
    setDataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  const deleteMethod = (item)=>{
    if(item.grade === 1) {
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }
    else {
      // console.log(item.rightId);
      let list = dataSource.filter(data=>data.id===item.rightId)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      // console.log(list);
      setDataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  return (
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{
          pageSize:5
        }}></Table>
      </div>
  )
}
