/**
 * 开启子线程执行数据处理、计算等操作
 */

self.addEventListener("message",async (event)=>{
    let data = event.data
    let result = await processData(data)
    self.postMessage(result)
    result = null
    self.close()
})

async function processData (datas) {
    const {titles, data, filename} = datas
    if (!(titles instanceof Array && data instanceof Array)) {
        console.log('data error in jsonToExcel')
        return
    }

    // 满足 csv 规范的字符串，用于生成 csv/excel 文件
    let csvStr = ''
    const csvArr = []

    // 将数据标题转化为 csv 字符串
    // e.g. csvStr = '"标题1","标题2","标题3"\n'
    titles.forEach(title => {
        //csvStr += `"${title}",`
        csvArr.push(`"${title}",`)
    })
    //csvStr += '\n'
    csvArr.push('\n')

    // 将数据内容拼接成 csv 规范的字符串
    // 增加\t为了不让表格显示科学计数法或者其他格式
    // e.g. csvStr = '"标题1","标题2","标题3"\n"1"\t,"2"\t,"3"\t,\n"4"\t,"5"\t,"6"\t,\n'
    for (let col of data) {
        for (let value of Object.values(col)) {
            if (typeof value !== 'string') value = '' // 屎山
            //csvStr += `"${value.replace(/"/g, '\"\"')}"\t,`
            csvArr.push(`"${value.replace(/"/g, '\"\"')}"\t,`)
        }
        // 一个数据结束后需要换行
        //csvStr += '\n'
        csvArr.push('\n')
    }

    // 使用 encodeURIComponent 可把字符串 str 作为 URI 进行编码，解决中文乱码
    // 'chartset' 规定了编码集。
    // Data URL，是以 data:[<mediatype>][;base64],<data> 为模式的URL，
    // data url 允许内容的创建者将较小的文件直接嵌入到文档中，而不是从外部文件载入。缺点是会带来性能问题。
    // 首行出现的 "\ufeff" 叫 BOM (Byte Order Mark，字节顺序标记), 用来声明该文件的编码信息。
    // utf-8 编码的文件时开头会有一个多余的字符 \ufeff。
    
    csvStr = csvArr.join()
    csvArr = []

    return csvStr;
}
