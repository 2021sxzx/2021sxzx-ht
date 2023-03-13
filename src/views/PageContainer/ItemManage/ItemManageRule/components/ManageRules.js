import React, {useEffect, useState} from 'react'
import {Space, Dropdown, Menu, Button, Table, Modal, message} from 'antd'
import {getYMD} from "../../../../../utils/TimeStamp"
import api from '../../../../../api/rule'
import SelectForm from './SelectForm'

import {
    detailTitle,
    getDetailOnExportFormat,
} from "../../../../../api/ruleAdapter";
import jsonToExcel from "../../../../../utils/JsonToExcel";

export default function ManageRules(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([]);
    const [originData, setOriginData] = useState({});
    const [unableCreate, setUnableCreate] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    // 删除队列
    const [deletingIds, setDeletingIds] = useState([]);
    // 用于获取批量处理的事项规则id
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isBatching, setIsBatching] = useState(false);

    const onSelectionChange = (keys) => {
        setIsBatching(keys.length > 0);
        setSelectedRowKeys(keys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
        getCheckboxProps: (record) => ({
            // 不允许删除中间节点
            disabled: !record.is_leaf,
        }),
    };
    // 页数处理
    const [current, setCurrent] = useState(1);
    const [currPageSize, setCurrPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);
    const tableColumns = [
            {
                title: "规则编码",
                dataIndex: "rule_id",
                key: "rule_id",
                width: 120,
            },
            {
                title: "规则路径",
                dataIndex: "rule_path",
                key: "rule_path",
            },
            // {
            //     title: '机构',
            //     dataIndex: 'department_name',
            //     key: 'department_name',
            //     width: 125
            // },
            {
                title: "创建人",
                dataIndex: "creator_name",
                key: "creator_name",
                width: 100,
            },
            {
                title: "创建时间",
                key: "create_time",
                width: 120,
                render: (text, record) => (
                    <Space size="middle">{getYMD(record.create_time)}</Space>
                ),
            },
            {
                title: "操作",
                key: "operation",
                width: 120,
                render: (text, record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="0">
                                    <Button
                                        type="primary"
                                        onClick={function () {
                                            modifyRule(record.rule_id);
                                        }}
                                    >
                                        编辑
                                    </Button>
                                </Menu.Item>
                                {record.is_leaf && (
                                    <Menu.Item key="2">
                                        <Button
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                            }}
                                            onClick={function () {
                                                deleteSingleItem(record.rule_id);
                                            }}
                                        >
                                            删除
                                        </Button>
                                    </Menu.Item>
                                )}
                            </Menu>
                        }
                        trigger={["click", "hover"]}
                        getPopupContainer={(triggerNode) => {
                            return triggerNode.parentNode;
                        }}
                        placement="bottomCenter"
                    >
                        <Button type="primary">操作</Button>
                    </Dropdown>
                ),
            },
        ];

        /**
         * 导出全部的规则成csv
         * @return {Promise<void>}
         */
        const exportAllRules = async () => {
            try {
                let response = await api.GetRules();
                let ruleData = response.data.data;

                // 获取符合导出格式的事项详情数据
                let detailArray = await getDetailOnExportFormat(ruleData);

                // 导出
                // console.log(detailArray);
                jsonToExcel(Object.values(detailTitle), detailArray, "未命名.csv");
                message.info("正在导出...");
            } catch (err) {
                console.log(err.message);
                message.error("导出错误，请稍后重试");
            }
        };



        const deleteSingleItem = (id) => {
            // 删除单个事项，将事项id设为deletingIds
            let str = "确定删除该节点吗？";
            Modal.confirm({
                centered: true,
                title: "删除确认",
                content: str,
                onOk: function () {
                    setDeletingIds([id]);
                },
            });
        };

        const handleBatchDelete = () => {
            // 删除多个事项，将selectedRowKeys全部推进deletingIds
            let str = "确定删除该" + selectedRowKeys.length + "个节点吗？";
            Modal.confirm({
                centered: true,
                title: "删除确认",
                content: str,
                onOk: function () {
                    setDeletingIds(selectedRowKeys);
                },
                style: {whiteSpace: "pre-wrap"},
            });
        };

        useEffect(
        function() {
            // 避免初始化触发或误触发
            if (deletingIds.length === 0) return;
            deleteRules();
        },
        [deletingIds]
)
    ;

    const deleteRules = () => {
        let data = {
            rules: deletingIds,
        };
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRules(data)
            .then((response) => {
                if ("code" in response.data.data) {
                    Modal.confirm({
                        title: "规则已绑定",
                        content:
                            "所选部分规则已被部分事项绑定，若要删除则需要先进行解绑。是否跳转到事项流程管理？",
                        centered: true,
                        onOk: function () {
                            props.setBindedData({
                                rule_id: deletingIds,
                            });
                        },
                    });
                } else {
                    getRules();
                    props.showSuccess();
                }
            })
            .catch(() => {
                // 删除报错时，弹出报错框并重新加载数据
                props.showError("删除规则失败！");
                getRules();
            });
        setDeletingIds([]);
    };

    useEffect(
        function () {
            for (let key in props.bindedData) {
                props.jumpToProcess();
                break;
            }
        },
        [props.bindedData]
    );

    const getRules = () => {
        // 无搜索条件获取全数据
        setTableLoading(true);
        api.GetRules({
            page_num: 0,
            page_size: currPageSize
        }).then((response) => {
            let rules = response.data.data.data;
            // let table = []
            setTotalSize(response.data.data.total)
            for (let i = 0; i < rules.length; i++) {
                rules[i]["is_leaf"] = rules[i].children.length === 0;
                rules[i]["department_name"] =
                    rules[i].creator.department_name;
                rules[i]["creator_name"] = rules[i].creator.name;
                // table.push(rules[i])
            }
            setTableData(rules);
            setTableLoading(false);
        })
            .catch(() => {
                setTableLoading(false);
                props.showError("获取规则失败！");
            });
    };

    const modifyRule = (id) => {
        api.GetRulePaths({
            rule_id: [id],
        })
            .then((response) => {
                let data = [];
                for (let key in response.data.data) {
                    data = response.data.data[key];
                    break;
                }
                let path = [];
                for (let i = 0; i < data.length; i++) {
                    path.push({
                        nodeId: data[i].rule_id,
                        nodeName: data[i].rule_name,
                    });
                }
                props.setUpdatePath(path);
            })
            .catch(() => {
                props.showError("获取规则路径节点失败！");
            });
    };

    const searchRules = (data) => {
        setTableLoading(true);
        // 搜索
        setOriginData(data);
        let totalData = data;
        totalData["page_num"] = 0;
        totalData["page_size"] = currPageSize;
        api.GetRules(totalData)
            .then((response) => {
                let rules = response.data.data.data;
                // console.log(rules)
                // let table = []
                setTotalSize(response.data.data.total);
                setCurrent(0);
                for (let i = 0; i < rules.length; i++) {
                    rules[i]["is_leaf"] = rules[i].children.length === 0;
                    rules[i]["department_name"] =
                        rules[i].creator.department_name;
                    rules[i]["creator_name"] = rules[i].creator.name;
                    // table.push(rules[i])
                }
                setTableData(rules);
                setTableLoading(false);
            })
            .catch((error) => {
                // console.log("Word");
                console.log(error);
                setTableLoading(false);
                props.showError("搜索规则失败！");
            });
    };

    const handleCreate = () => {
        // 无路径切换切面即为创建
        props.setUpdatePath([]);
        props.setPageType(2);
    };

    const resetSearch = () => {
        // 初始化搜索
        setOriginData({});
        setCurrent(0);
        getRules();
    };

    const changePage = (page, pageSize) => {
        // 换页时清空选择
        setSelectedRowKeys([]);
        setCurrent(page - 1);
        setCurrPageSize(pageSize);

        let totalData = originData;
        totalData["page_num"] = page - 1;
        totalData["page_size"] = pageSize;

        setTableLoading(true);
        api.GetRules(totalData)
            .then((response) => {
                let rules = response.data.data.data;
                // let table = []
                // setCurrent(0);
                for (let i = 0; i < rules.length; i++) {
                    rules[i]["is_leaf"] = rules[i].children.length === 0;
                    rules[i]["department_name"] =
                        rules[i].creator.department_name;
                    rules[i]["creator_name"] = rules[i].creator.name;
                    // table.push(rules[i])
                }
                setTableData(rules);
                setTableLoading(false);
            })
            .catch((error) => {
                console.log("Hello")
                console.log(error)
                setTableLoading(false);
                props.showError("搜索规则失败！");
            });
    };

    useEffect(
        function () {
            for (let key in props.ruleRoot) {
                resetSearch();
                setUnableCreate(false);
                break;
            }
        },
        [props.ruleRoot]
    );

    return (
        <>
            <Space direction="vertical" size={12} style={{width: "100%"}}>
                <SelectForm
                    getSearch={searchRules}
                    reset={resetSearch}
                    setOriginData={setOriginData}
                    searchData={props.searchData}
                />
                <Space
                    direction="horizontal"
                    size={12}
                    style={{marginLeft: "75%"}}
                >
                    <Button
                        type="primary"
                        disabled={unableCreate}
                        onClick={handleCreate}
                    >
                        创建规则
                    </Button>
                    <Button type="primary" onClick={exportAllRules}>
                        全量导出
                    </Button>
                    <Button
                        type="primary"
                        disabled={!isBatching}
                        onClick={handleBatchDelete}
                    >
                        批量删除
                    </Button>
                </Space>
                <Table
                    rowSelection={rowSelection}
                    columns={tableColumns}
                    dataSource={tableData}
                    rowKey="rule_id"
                    pagination={{
                        onChange: changePage,
                        current: current + 1,
                        total: totalSize, // zzt
                    }}
                    loading={tableLoading}
                    expandable={{childrenColumnName: "no"}}
                />
            </Space>
        </>
    );
}
