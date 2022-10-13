import React from "react";
import { getYMD } from "../utils/TimeStamp";

export const serviceType = {
    1: "自然人",
    2: "企业法人",
    3: "事业法人",
    4: "社会组织法人",
    5: "非法人企业",
    6: "行政机关",
    9: "其他组织",
};

export const necessityType = {
    1: "必要",
    2: "非必要",
    3: "容缺后补",
};

export const typesType = {
    1: "证件证书证明",
    2: "申请表格文书",
    3: "其他",
};

export const formType = {
    1: "纸质",
    2: "电子化",
    3: "纸质/电子化",
};

export const requiredType = {
    0: "否",
    1: "是",
};

export const guideStatus = {
    0: "未绑定",
    1: "已绑定",
};

export const detailTitle = {
    region_code: "区划编码", // 0（索引，下标）
    region_path: "区划路径", // 1
    creator: "创建人", // 2
    create_time: "创建时间", // 3
};

export const getDetailOnExportFormat = async (regionData) => {
    try {
        const detailArray = [];
        // Object.assign(detail, await getItemGuideData(regionCode));

        for(let i = 0; i < regionData.length; i++) {
            let temp = {}

            temp.region_code = regionData[i].region_code
            temp.region_path = regionData[i].region_path
            temp.creator = regionData[i].creator.name
            temp.create_time = getYMD(regionData[i].create_time);

            if (temp.region_code === undefined) temp.region_code = "";
            if (temp.region_path === undefined) temp.region_path = "";
            if (temp.creator === undefined) temp.creator = "";
            if (temp.create_time === undefined) temp.create_time = "";

            detailArray.push(temp)
        }

        return detailArray;
    } catch (e) {
        console.log(e.message);
        return e.message
    }
};
