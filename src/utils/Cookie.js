import React from 'react'

const Cookie = {
    // 未找到
    NotFound:null,
    // 时间单位常量
    timeUnitSet: {
        months:'months',
        weeks:'weeks',
        days:'days',
        hours:'hours',
        minutes:'minutes'
    },
    /**
     * 计算过期时间。目前以 day 为单位。
     * @param expiredTime 过期时间
     * @param timeUnit 过期时间的单位，默认为 days。取值为：{'months','weeks','days','hours','minutes'}
     * @returns {number}
     */
    calculateExpiredTime(expiredTime, timeUnit = this.timeUnitSet.days) {
        switch (timeUnit) {
            case this.timeUnitSet.months:
                // 30 天
                return expiredTime * 30 * 7 * 24 * 60 * 60 * 1000
            case this.timeUnitSet.weeks:
                return expiredTime * 7 * 24 * 60 * 60 * 1000
            case this.timeUnitSet.days:
                return expiredTime * 24 * 60 * 60 * 1000
            case this.timeUnitSet.hours:
                return expiredTime * 60 * 60 * 1000
            case this.timeUnitSet.minutes:
                return expiredTime * 60 * 1000
            default:
                return expiredTime * 24 * 60 * 60 * 1000
        }
    },
    /**
     * 设置 cookie 数据
     * @param cookieName cookie name
     * @param cookieValue cookie value
     * @param expiredTime expired time 过期时间，单位 days
     * @param timeUnit 过期时间的单位，默认为 days。取值为：{'months','weeks','days','hours','minutes'}
     * @returns {boolean} 是否添加成功
     */
    setCookie(cookieName, cookieValue, expiredTime = 1, timeUnit = this.timeUnitSet.days) {
        let d = new Date();
        d.setTime(d.getTime() + this.calculateExpiredTime(expiredTime, timeUnit));
        // 设置 cookie
        document.cookie = cookieName + "=" + cookieValue + "; " + "expires=" + d.toGMTString();
        return true
    },
    /**
     * 获取 cookie 信息
     * @param cookieName cookie name
     * @returns {string} cookie value
     */
    getCookie(cookieName) {
        const name = cookieName + "=";
        const ca = document.cookie.split(';');
        // 查询对应的 cookie value
        for(let i=0; i<ca.length; i++)
        {
            let c = ca[i].trim();
            if (c.indexOf(name)===0) return c.substring(name.length,c.length);
        }
        // TODO（钟卓江）：这里应该要加一个报错信息？
        return this.NotFound;
    },
    /**
     *
     * @param cookieName
     * @param expiredTime
     * @returns {boolean}
     */
    /**
     * 检查是否有对应的 cookie，并重新设置过期时间。
     * @param cookieName cookie name
     * @param expiredTime 过期时间，默认为 1
     * @param timeUnit 时间单位，默认 'days'.取值为：{'months','weeks','days','hours','minutes'}
     * @returns {boolean} 是否有对应的 cookie
     */
    checkAndResetCookie(cookieName, expiredTime = 1, timeUnit = this.timeUnitSet.days) {
        const cookieValue = this.getCookie(cookieName);
        if (cookieValue !== this.NotFound) {
            this.setCookie(cookieName, cookieValue, expiredTime,timeUnit);
            return true
        } else {
            if (cookieValue !== "" && cookieValue != null) {

            }
        }
    }
}

export default Cookie