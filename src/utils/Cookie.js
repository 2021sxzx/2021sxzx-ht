/**
 * 出于安全考虑，不要使用 cookie
 */
// import React from 'react'
//
// const Cookie = {
//     // 未找到 cookieValue 的标识
//     NotFound:null,
//     // 时间单位常量
//     timeUnitSet: {
//         months:'months',
//         weeks:'weeks',
//         days:'days',
//         hours:'hours',
//         minutes:'minutes'
//     },
//     // 默认 cookie 过期时间
//     defaultExpiredTime:1,
//     defaultTimeUnit:'days',
//     /**
//      * 计算过期时间。目前以 day 为单位。
//      * @param expiredTime 过期时间
//      * @param timeUnit 过期时间的单位，默认为 days。取值为：{'months','weeks','days','hours','minutes'}
//      * @returns {number}
//      */
//     calculateExpiredTime(expiredTime = this.defaultExpiredTime, timeUnit = this.timeUnitSet.days) {
//         switch (timeUnit) {
//             case this.timeUnitSet.months:
//                 // 30 天
//                 return expiredTime * 30 * 7 * 24 * 60 * 60 * 1000
//             case this.timeUnitSet.weeks:
//                 return expiredTime * 7 * 24 * 60 * 60 * 1000
//             case this.timeUnitSet.days:
//                 return expiredTime * 24 * 60 * 60 * 1000
//             case this.timeUnitSet.hours:
//                 return expiredTime * 60 * 60 * 1000
//             case this.timeUnitSet.minutes:
//                 return expiredTime * 60 * 1000
//             default:
//                 return expiredTime * 24 * 60 * 60 * 1000
//         }
//     },
//     /**
//      * 设置 cookie 数据
//      * @param cookieName cookie name
//      * @param cookieValue cookie value
//      * @param expiredTime expired time 过期时间，单位 days
//      * @param timeUnit 过期时间的单位，默认为 days。取值为：{'months','weeks','days','hours','minutes'}
//      * @returns {boolean} 是否添加成功
//      */
//     setCookie(cookieName, cookieValue, expiredTime = this.defaultExpiredTime, timeUnit = this.defaultTimeUnit) {
//         let d = new Date();
//         d.setTime(d.getTime() + this.calculateExpiredTime(expiredTime, timeUnit));
//         // 设置 cookie
//         document.cookie = cookieName + "=" + cookieValue + "; " + "expires=" + d.toGMTString();
//         return true
//     },
//     /**
//      * 获取 cookie 信息
//      * @param cookieName cookie name
//      * @returns {string|null} cookie value
//      */
//     getCookie(cookieName) {
//         const name = cookieName + "=";
//         const ca = document.cookie.split(';');
//         // 查询对应的 cookie value
//         for(let i=0; i<ca.length; i++)
//         {
//             let c = ca[i].trim();
//             if (c.indexOf(name)===0) {
//                 return c.substring(name.length, c.length)
//             }
//         }
//
//         return this.NotFound;
//     },
//
//     /**
//      * 获取 cookie，并重新设置过期时间。
//      * @param cookieName cookie name
//      * @param expiredTime 过期时间，默认为 1
//      * @param timeUnit 时间单位，默认 'days'.取值为：{'months','weeks','days','hours','minutes'}
//      * @returns {string|null} 是否有对应的 cookie
//      */
//     getAndResetCookie(cookieName, expiredTime = this.defaultExpiredTime, timeUnit = this.defaultTimeUnit) {
//         const cookieValue = this.getCookie(cookieName);
//         // 存在对应的 cookie
//         if (cookieValue !== this.NotFound) {
//             // 重新设置过期时间。
//             this.setCookie(cookieName, cookieValue, expiredTime,timeUnit);
//         }
//         return cookieValue
//     }
// }
//
// export default Cookie
