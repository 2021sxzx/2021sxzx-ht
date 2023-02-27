import React from "react";
import { getYMD } from "../utils/TimeStamp";

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
        return e.message
    }
};
