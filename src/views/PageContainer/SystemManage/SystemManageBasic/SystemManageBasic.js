import {useEffect, useState} from 'react'
import {Button, InputNumber, message, Tabs, Tag} from 'antd'
import api from '../../../../api/systemBasic'

const NumericInput = props => {
  return <InputNumber {...props} controls={false} onChange={
    inputValue => {
      if (/^\d*$/.test(inputValue)) props.setValue(inputValue)
    }
  }/>
}

const {TabPane} = Tabs
export default function SystemManageBasic() {
  const [value, setValue] = useState('')
  useEffect(async () => {
    setValue((await api.getTel()).data)
  }, [])
  return <>
    <div className="card-container">
      <Tabs type="card">
        <TabPane tab="业务数据" key="1">
          <p>咨询电话 <NumericInput value={value} setValue={setValue} maxLength={11} style={{width: '8em'}}/> <Button
            type="primary" onClick={async function () {
            const result = (await api.setTel({data: value})).data
            if (typeof result === 'boolean')
              if (result) message.success('咨询电话修改成功')
              else {
                // 正常情况下不能运行到此句
                message.info('咨询电话的修改因未知原因失败')
                console.error(`严重的程序错误：setTel接口返回${result}，但修改成功应返回true，修改失败应返回捕获的错误原因`)
              }
            else message.info(`咨询电话修改失败，服务器返回信息：${result}`)
          }
          }>确认修改</Button>
          </p>
          <p>事项状态 <Tag>未绑定</Tag> <Tag>已绑定</Tag> <Tag>未提交审核</Tag> <Tag>一级审核员审核中</Tag> <Tag>二级审核员审核中</Tag> <Tag>审核通过</Tag>
            <Tag>撤回待审核</Tag></p>
          {/* 别震惊了，确实就是写死的，写这里的时候状态没有修改的需求*/}
        </TabPane>
      </Tabs>
    </div>
  </>
}
