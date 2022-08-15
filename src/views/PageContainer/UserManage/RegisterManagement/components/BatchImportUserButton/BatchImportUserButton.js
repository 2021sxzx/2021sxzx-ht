import React, {useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import './BatchImportUserButton.css';
import api from '../../../../../../api/user'
import apiRole from '../../../../../../api/role'
import apiUnit from '../../../../../../api/unit'
import {message} from "antd";

const BatchImportUserButton = (props) => {

    const [xlsxData, setXlsxData] = useState([]);
    const initialPassword = props.initialPassword ? props.initialPassword : '11AAaa@@';
    let unitSet = null

    // 文件字段错误情况和对应的错误提示信息
    const errorMsg = new Map([
        ['accountError', '批量导入文件中账号要求为电话号码，请修改后重新提交。'],
        ['passwordError', '批量导入文件中密码要求长度为 8 到 32 位，并同时使用大小写字母，数字和部分特殊字符(@#$%&*_+-=)，不支持空格，请修改后重新提交。'],
        ['roleNameError', '批量导入文件中角色名称要求长度为 1 到 32 位，请修改后重新提交。'],
        ['userNameError', '批量导入文件中用户名称要求长度为 1 到 32 位，请修改后重新提交。'],
        ['unitNameError', '批量导入文件中机构名称要求长度为 1 到 32 位，请修改后重新提交。'],
        ['noUnit', '该机构不存在，请重新检查机构名称'],
        ['roleUnavailableError', '批量导入文件中存在不可用的角色名称，请修改后重新提交。'],
    ])

    // 用于批量导入的触发
    useEffect(async () => {
        if (Array.isArray(xlsxData) && xlsxData.length > 0) {
            // 标志文件是否合法的变量，可以记录错误类型
            let errorCase = 'noError'
            // 记录出错数据的账号，方便用户定位错误
            let errorAccount = ''
            // 向服务器请求角色信息，构造角色集合
            let rolesData = await apiRole.GetRole();
            let role = new Set();
            for (let roleData of rolesData.data.data) {
                console.log(roleData);
                role.add(roleData.role_name);
            }
            console.log(role);

            // 重新获取所有部门名称，用于验证批量导入的部门信息
            unitSet = new Set()
            apiUnit.GetUnit().then(res => {
                if (Array.isArray(res.data)) {
                    for (let unitInfo of res.data) {
                        unitSet.add(unitInfo.department_name)
                    }
                }
            })

            // 检查文件各个字段是否合法并输出错误信息
            for (let item of xlsxData) {
                // 判断文件各个字段是否合法
                !(typeof item.unit_name === 'string' && item.unit_name.length <= 32 && item.unit_name.length >= 1) ?
                    errorCase = 'unitNameError' : null;
                // 检查批量导入的机构是否存在
                if (!unitSet.has(item.unit_name)) {
                    errorCase = 'noUnit'
                }
                !(typeof item.user_name === 'string' && item.user_name.length <= 32 && item.user_name.length >= 1) ?
                    errorCase = 'userNameError' : null;
                !(typeof item.role_name === 'string' && item.role_name.length <= 32 && item.role_name.length >= 1) ?
                    errorCase = 'roleNameError' : null;
                !role.has(item.role_name) ? errorCase = 'roleUnavailableError' : null;
                !(typeof item.password === 'string' && item.password.length <= 32 && item.password.length >= 8 &&
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*_\-+=])[\w\d@#$%&*_\-+=]*$/.test(item.password)) ?
                    errorCase = 'passwordError' : null;
                !(typeof item.account === 'string' &&
                    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(item.account)) ?
                    errorCase = 'accountError' : null;

                // 只要遇到不合法字段就先让用户去修改文件，停止继续判断
                if (errorCase !== 'noError') {
                    errorAccount = item.account;
                    break;
                }
            }

            // 如果文件合法，就向后端请求批量导入用户
            if (errorCase === 'noError') {
                api.BatchImportUser(xlsxData).then((data) => {
                    if (data.data.msg === '添加失败，存在不可用的角色') {
                        // 正常情况下不能执行到该语句，否则表示服务器发现角色不可用但前端未发现
                        console.error('严重的程序错误：角色可用性检查不一致');
                        message.error('添加失败，存在不可用的角色').then();
                    } else message.success('批量导入用户成功').then();
                }).catch(() => {
                    message.error('批量导入失败，请稍后重试').then();
                })
            } else {
                message.warn(`${errorMsg.get(errorCase)}发生错误的账号为：${errorAccount}`);
            }
        }
    }, [xlsxData])

    // 用于清除file文件导致的onChange的不触发问题
    const clearFile = (e) => {
        e.target.value = ''
    }

    const getXlsxData = (e) => {
        // 读取excel文件并写入到数组中
        const files = e.target.files

        if (files.length <= 0) {
            return false;
        } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
            alert('文件传格式不正确')
            return false
        }

        const fileReader = new FileReader();
        // 监听
        fileReader.onload = (ev) => {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
                type: 'binary'
            });
            const wsname = workbook.SheetNames[0]//取第一张表
            const res = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]).map(item => {
                return {
                    user_name: item['用户名'],
                    role_name: item['角色'],
                    account: String(item["系统账号"]),
                    password: initialPassword,
                    activation_status: 1,
                    unit_name: item["单位"]
                }
            });
            setXlsxData(res);
        }
        fileReader.readAsBinaryString(files[0]);
    }

    return (
        <a href="" className="file" style={{
            color: '#FFFFFF',
            fontSize: '',
            margin: '0px',
            width: '90px',
        }}>
            导入用户
            <input type="file" name="" id="" onChange={getXlsxData} onClick={clearFile}/>
        </a>
    );
}

export default BatchImportUserButton;
