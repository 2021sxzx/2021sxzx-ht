import React from "react";
import { getYMD } from "../utils/TimeStamp";

export const detailTitle = {
    rule_id: "规则编码", // 0（索引，下标）
    rule_path: "规则路径", // 1
    creator: "创建人", // 2
    create_time: "创建时间", // 3
};

export const getDetailOnExportFormat = async (ruleData) => {
    try {
        const detailArray = [];
        // Object.assign(detail, await getItemGuideData(regionCode));

        for (let i = 0; i < ruleData.length; i++) {
            let temp = {};

            temp.rule_id = ruleData[i].rule_id;
            temp.rule_path = ruleData[i].rule_path;
            temp.creator = ruleData[i].creator.name;
            temp.create_time = getYMD(ruleData[i].create_time);

            if (temp.rule_id === undefined) temp.rule_id = ""
            if (temp.rule_path === undefined) temp.rule_path = "";
            if (temp.creator === undefined) temp.creator = "";
            if (temp.create_time === undefined) temp.create_time = "";


            detailArray.push(temp);
        }

        return detailArray;
    } catch (e) {
        // console.log(e.message);
        return e.message;
    }
};
