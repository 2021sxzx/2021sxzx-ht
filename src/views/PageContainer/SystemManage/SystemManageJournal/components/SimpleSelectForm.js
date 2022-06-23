import {Button, Checkbox, Form, Radio, Space} from "antd";
import React, {useContext, useState} from "react";
import api from "../../../../../api/log";
import {journalContext} from '../SystemManageJournal'

const SimpleSelectForm = () => {
    const [topForm] = Form.useForm();
    const [underForm] = Form.useForm();
    const [myself, setMyself] = useState(false);
    const [myselfID, setMyselfID] = useState('');
    const [today, setToday] = useState(false);
    const [thisWeek, setThisWeek] = useState(false);
    const [groupVal, setGroupVal] = useState(0);
    const {setTableData} = useContext(journalContext)

    const handleToday = e => {
        setToday(true);
        setThisWeek(false);
        // console.log("today:",today,".week:",thisWeek)
    }
    const handleWeek = e => {
        setToday(false);
        setThisWeek(true);
        // console.log("week:",thisWeek,".today:",today)
    }
    const handleRadio = (e) => {
        // console.log('value:',val)
        // if (val === 4) {
        //   setToday(false);
        //   setThisWeek(false);
        // }
        // console.log('radio checked',e.target.value);
        setGroupVal(e.target.value);
        if (e.target.value === 1) {
            handleToday()
        } else if (e.target.value === 2) {
            handleWeek()
        }
    }

    // 简易查询
    const Search = () => {
        // console.log('::',myself,'--',myselfID)
        const data = {
            myselfID,
            today,
            thisWeek,
        };

        api.SearchLog(data).then((response) => {
            setTableData(response.data.data);
        }).catch((error) => {
        });

    };
    const onReset = () => {
        topForm.resetFields();
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    // 搜索日志
    const getSearchLog = (data) => {
        // console.log(data);
        api.SearchLog(data).then((response) => {
            // console.log("searchData=", response.data.data);
            setTableData(response.data.data);
        }).catch((error) => {
        });
    };

    return (
        <div>
            {/* <Form form={topForm} layout="inline">
          <Form.Item>
            <Button htmlType="button" onClick={onReset}>查询日志</Button>
          </Form.Item>
          <Form.Item name="InputSearch">
            <Input style={{width: 600}} /> */}
            {/* <Input style={{ width: 600 }} enterButton="查询日志"></Input> */}
            {/* </Form.Item>
        </Form> */}
            <Form layout={"inline"} form={underForm}>
                <Form.Item>
                    <Space>
                        {/* <DataBindCheckbox></DataBindCheckbox> */}
                        <Checkbox
                            onChange={(e) => {
                                setMyself(e.target.checked);
                                // console.log('1:',myself,e.target.checked)
                                if (e.target.checked) {
                                    setMyselfID(localStorage.getItem("_id"));
                                } else {
                                    // console.log('2',myself,e.target.checked)
                                    setMyselfID("");
                                }
                                // console.log('3')
                                // console.log('myself:',myself,' myselfID:',myselfID)
                            }
                            }
                            checked={myself}
                        >
                            查询操作人为您
                        </Checkbox>
                        <Radio.Group onChange={handleRadio} value={groupVal}>
                            <Radio value={1}>查询今天创建更新</Radio>
                            <Radio value={2}>查询本周创建更新</Radio>
                        </Radio.Group>
                        {/* <Button icon={<SyncOutlined />}>高级查询</Button> */}
                        <Form.Item>
                            <Button
                                htmlType="button"
                                onClick={() => {
                                    // topForm.resetFields();
                                    setMyself(false);
                                    setToday(false);
                                    setThisWeek(false);
                                    setMyselfID('');
                                    // console.log(myself, today, thisWeek);
                                    setGroupVal(0);
                                }}
                            >
                                重置
                            </Button>
                        </Form.Item>
                        <Button type="primary" onClick={Search}>
                            查询
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SimpleSelectForm
