import React, {useEffect, useState} from 'react'
import {Space, Dropdown, Menu, Button, Table, Modal, message} from 'antd'
import {getYMD} from "../../../../../utils/TimeStamp"
import api from '../../../../../api/rule'
import jsonToExcel from "../../../../../utils/JsonToExcel";
import SelectForm from './SelectForm'
import {
    detailTitle,
    getDetailOnExportFormat,
    getGuideDetail,
    getGuideTableData,
} from "../../../../../api/regionAdapter";
export default function ManageRegions(props) {
    // 页面的基础数据
    const [tableData, setTableData] = useState([]);
    const [originData, setOriginData] = useState({});
    const [unableCreate, setUnableCreate] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
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
    const [current, setCurrent] = useState(0);
    const [currPageSize, setCurrPageSize] = useState(10);
    const [totalSize, setTotalSize] = useState(0);

    const tableColumns = [
        {
            title: "区划编码",
            dataIndex: "region_code",
            key: "region_code",
            width: 120,
        },
        {
            title: "区划路径",
            dataIndex: "region_path",
            key: "region_path",
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
                                        modifyRegion(record._id);
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
                                            deleteSingleItem(record._id);
                                        }}
                                    >
                                        删除
                                    </Button>
                                </Menu.Item>
                            )}
                        </Menu>
                    }
                    placement="bottomCenter"
                    trigger={["click", "hover"]}
                    getPopupContainer={(triggerNode) => {
                        return triggerNode.parentNode;
                    }}
                >
                    <Button type="primary">操作</Button>
                </Dropdown>
            ),
        },
    ];

    /**
     * 导出全部的规则成csv
     * @param {string[]} regionCodeArray 
     * @return {Promise<void>}
     */
    const exportAllRules = async () => {
        try {
            // let allDetails = [];
            
            let response = await api.GetRegions()
            let regionData = response.data.data;

            // 获取符合导出格式的事项详情数据
            console.log(regionData)
            let detailArray = await getDetailOnExportFormat(regionData);

            // 导出
            console.log(detailArray)
            jsonToExcel(Object.values(detailTitle), detailArray, "未命名.csv");
            message.info("正在导出...");
        } catch (err) {
            console.log(err.message)
            message.error("导出错误，请稍后重试");
        }
    };
    


    const deleteSingleItem = (id) => {
        // 删除单个事项，将事项id设为deletingIds
        let str = "确定删除该节点吗？";
        let nodes = [id];
        Modal.confirm({
            centered: true,
            title: "删除确认",
            content: str,
            onOk: function () {
                finishDeleting(nodes);
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
                finishDeleting(selectedRowKeys);
            },
            style: { whiteSpace: "pre-wrap" },
        });
    };

    const finishDeleting = (id) => {
        // 确定删除，调用接口，通过hook触发
        setDeletingIds(id);
    };

    useEffect(
        function () {
            // 避免初始化触发或误触发
            if (deletingIds.length === 0) return;
            deleteRegions();
        },
        [deletingIds]
    );

    const deleteRegions = () => {
        let data = {
            regions: deletingIds,
        };
        // 根据事项规则id删除事项规则，删除完之后重新载入事项规则
        api.DeleteRegions(data)
            .then((response) => {
                if ("code" in response.data.data) {
                    Modal.confirm({
                        title: "规则已绑定",
                        content:
                            "所选部分规则已被部分事项绑定，若要删除则需要先进行解绑。是否跳转到事项流程管理？",
                        centered: true,
                        onOk: function () {
                            let codes = [];
                            for (let i = 0; i < deletingIds.length; i++) {
                                codes.push(
                                    props.regionNodes[deletingIds[i]]
                                        .region_code
                                );
                            }
                            props.setBindedData({
                                region_code: codes,
                            });
                        },
                    });
                } else {
                    getRegions();
                    props.showSuccess();
                }
            })
            .catch((error) => {
                // 删除报错时，弹出报错框并重新加载数据
                props.showError("删除规则失败！");
                props.getRegionTree();
                setCurrent(0);
            });
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

    const getRegions = () => {
        setTableLoading(true);
        // 获取数据
        let data = originData;
        data["page_num"] = current;
        data["page_size"] = currPageSize;
        api.GetRegions(data)
            .then((response) => {
                let regions = response.data.data.data;
                setTotalSize(response.data.data.total);
                for (let i = 0; i < regions.length; i++) {
                    regions[i]["is_leaf"] = regions[i].children.length === 0;
                    regions[i]["department_name"] =
                        regions[i].creator.department_name;
                    regions[i]["creator_name"] = regions[i].creator.name;
                }
                setTableData(regions);
                setTableLoading(false);
            })
            .catch((error) => {
                props.showError("获取规则失败！");
                setTableLoading(false);
            });
    };

    const searchRegions = (data) => {
        setTableLoading(true);
        // 搜索时重置table
        setOriginData(data);
        let totalData = data;
        totalData["page_num"] = 0;
        totalData["page_size"] = currPageSize;
        api.GetRegions(totalData)
            .then((response) => {
                let regions = response.data.data.data;
                setCurrent(0);
                setTotalSize(response.data.data.total);
                for (let i = 0; i < regions.length; i++) {
                    regions[i]["is_leaf"] = regions[i].children.length === 0;
                    regions[i]["department_name"] =
                        regions[i].creator.department_name;
                    regions[i]["creator_name"] = regions[i].creator.name;
                }
                setTableData(regions);
                setTableLoading(false);
            })
            .catch((error) => {
                props.showError("搜索规则失败！");
                setTableLoading(false);
            });
    };

    const modifyRegion = (id) => {
        // 获取该节点的整条父子关系路径并存储，供修改界面使用
        // console.dir(tableData)
        api.GetRegionPaths({
            region_id: [id],
        })
            .then((response) => {
                // console.log(response.data)
                let data = [];
                for (let key in response.data.data) {
                    data = response.data.data[key];
                    break;
                }
                let path = [];
                for (let i = 0; i < data.length; i++) {
                    path.push({
                        nodeCode: data[i].region_code,
                        nodeId: data[i]._id,
                        nodeName: data[i].region_name,
                    });
                }
                props.setUpdatePath(path);
            })
            .catch((error) => {
                props.showError("获取规则路径节点失败！");
            });
    };

    const handleCreate = () => {
        // 无路径切换切面即为创建
        props.setUpdatePath([]);
        props.setPageType(2);
    };

    const resetSearch = () => {
        // 回 归 本 源
        setOriginData({});
        setCurrent(0);
        setTableLoading(true);
        api.GetRegions({
            page_num: 0,
            page_size: currPageSize,
        })
            .then((response) => {
                let regions = response.data.data.data;
                setTotalSize(response.data.data.total);
                for (let i = 0; i < regions.length; i++) {
                    regions[i]["is_leaf"] = regions[i].children.length === 0;
                    regions[i]["department_name"] =
                        regions[i].creator.department_name;
                    regions[i]["creator_name"] = regions[i].creator.name;
                }
                setTableData(regions);
                setTableLoading(false);
            })
            .catch((error) => {
                props.showError("重置失败！");
                setTableLoading(false);
            });
    };

    const changePage = (page, pageSize) => {
        // 换页时清空选择
        setSelectedRowKeys([]);
        // 更新页面数据
        setCurrent(page - 1);
        setCurrPageSize(pageSize);
        // 只是换页的话还是用上一次的搜索条件进行筛查
        let totalData = originData;
        totalData["page_num"] = page - 1;
        totalData["page_size"] = pageSize;
        setTableLoading(true);
        api.GetRegions(totalData)
            .then((response) => {
                let regions = response.data.data.data;
                let table = [];
                for (let i = 0; i < regions.length; i++) {
                    regions[i]["is_leaf"] = regions[i].children.length === 0;
                    regions[i]["department_name"] =
                        regions[i].creator.department_name;
                    regions[i]["creator_name"] = regions[i].creator.name;
                    table.push(regions[i]);
                }
                setTableData(table);
                setTableLoading(false);
            })
            .catch((error) => {
                props.showError("换页时获取规则失败！");
                setTableLoading(false);
            });
    };

    useEffect(
        function () {
            // 避开初始化时执行查询
            for (let key in props.regionRoot) {
                setCurrent(0);
                getRegions();
                // regionTree初始化完毕前不能进行节点创建，否则会报错
                setUnableCreate(false);
                break;
            }
        },
        [props.regionRoot]
    );

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <SelectForm
                    getSearch={searchRegions}
                    reset={resetSearch}
                    setOriginData={setOriginData}
                />
                <Space
                    direction="horizontal"
                    size={12}
                    style={{ marginLeft: "75%" }}
                >
                    <Button
                        type="primary"
                        onClick={handleCreate}
                        disabled={unableCreate}
                    >
                        创建规则
                    </Button>
                    <Button 
                        type="primary"
                        onClick={exportAllRules}>
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
                    rowKey="_id"
                    expandable={{ childrenColumnName: "no" }}
                    pagination={{
                        onChange: changePage,
                        current: current + 1,
                        total: totalSize,
                    }}
                    loading={tableLoading}
                />
            </Space>
        </>
    );
}
