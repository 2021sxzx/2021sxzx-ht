/*引入Button */
import {Button, Checkbox, Divider, Form, message, Radio, Space} from 'antd'
import React, {useContext} from 'react'
import api from '../../../../../api/log'
import {journalContext} from '../SystemManageJournal'

const SimpleSelectForm = () => {
  const [selectForm] = Form.useForm()
  const {setTableData, setTableLoading} = useContext(journalContext)

  // 表单初始化数据
  const initialValues = {
    selectMyself: false,
    selectTimeRange: 'all'
  }

  // 简易查询
  const onSearch = () => {
    // 设置表格加载状态
    setTableLoading(true)

    api.SearchLog({
      myselfID: selectForm.getFieldValue('selectMyself') ? localStorage.getItem('_id') : '',
      today: selectForm.getFieldValue('selectTimeRange') === 'today',
      thisWeek: selectForm.getFieldValue('selectTimeRange') === 'week',
    }).then((response) => {
      setTableData(response.data.data)
      // console.log(response.data.data)
      message.success('查询日志成功')
    }).catch(() => {
      message.error('查询日志失败，请稍后尝试')
    }).finally(() => {
      // 设置表格加载状态
      setTableLoading(false)
    })
  }
  const handleDownloadCSV = (data) => {
    const tHeader = '编号,时间,操作描述,操作人,账号'
    const filterVal = [
      'log_id',
      'create_time',
      'content',
      'user_name',
      'idc'
    ]
    // this.list.unshift(Headers)
    const list = data
    let csvString = tHeader
    csvString += '\r\n'
    list.map(item => {
      filterVal.map(key => {
        let value = item[key]
        csvString += value + ','
      })
      csvString += '\r\n'
    })
    //解决中文乱码
    csvString = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvString)
    let link = document.createElement('a')
    link.href = csvString
    //对下载的文件命名
    link.download = '简单查询导出数据.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const Output = () => {

    // 设置表格加载状态
    setTableLoading(true)
    //请求如今的数据
    api.SearchLog({
      myselfID: selectForm.getFieldValue('selectMyself') ? localStorage.getItem('_id') : '',
      today: selectForm.getFieldValue('selectTimeRange') === 'today',
      thisWeek: selectForm.getFieldValue('selectTimeRange') === 'week',
    }).then((response) => {
      handleDownloadCSV(response.data.data)
      message.success('导出日志成功')
    }).catch(() => {
      message.error('导出日志失败，请稍后尝试')
    }).finally(() => {
      // 设置表格加载状态
      setTableLoading(false)
    })
  }

  return (
    <Form
      form={selectForm}
      layout={'inline'}
      initialValues={initialValues}
      onChange={onSearch}
    >
      <Form.Item
        name={'selectMyself'}
        valuePropName="checked"
        label={'操作人为您'}
      >
        <Checkbox/>
      </Form.Item>

      <Form.Item>
        {/*分割线*/}
        <Divider type="vertical"/>
      </Form.Item>

      <Form.Item
        label={'时间范围'}
        name={'selectTimeRange'}
      >
        <Radio.Group>
          <Radio value={'today'}>今天内</Radio>
          <Radio value={'week'}>最近一周</Radio>
          <Radio value={'all'}>全部时间</Radio>
        </Radio.Group>
        {/* 新增导出 */}

      </Form.Item>
      {/* style={{marginLeft:"1100px"}} */}
      <Space>
        <Button type="primary" htmlType="submit" onClick={Output}>
          导出
        </Button>
        <Button onClick={() => api.DeleteAllLog().then(() => location.reload())}>删除所有日志</Button>
      </Space>
    </Form>
  )
}

export default SimpleSelectForm
