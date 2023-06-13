/**
 * 将 json 格式的数据导出为 csv 文件
 * @param {string[]} titles 数据的标题，按顺序转化为表格的每一列标题。
 * @param {[{}]} data 数据内容，每行数据为一个 JSON/js 对象，其中属性顺序和标题顺序对应，一个属性为一列。
 * @param {string} fileName 导出的默认文件名。
 */
const jsonToExcel = (titles = ['标题1', '标题2', '标题3'],
                     data = [
                         {key1: '1', key2: '2', key3: '3'},
                         {key1: '4', key2: '5', key3: '6'},
                     ],
                     fileName = '未命名.csv') => {
    // 如果输入参数不是数组，就忽略（错误处理）
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
    
    csvStr = csvArr.join('')
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvStr)

    // 创建一个隐藏的 <a> 标签
    const link = document.createElement('a')

    // a 标签的 download 属性是 HTML5 的标准，下面这个判断是为预防兼容性问题
    if (typeof link.download === 'string') {
        // a 标签下载源
        link.href = uri
        // 对下载的文件默认命名。
        link.download = fileName
        // 触发这个 a 标签的 click 事件
        link.click()
        // 移除 a 标签
        link.remove()
    } else {
        // 如果浏览器不支持 download 属性，可以使用 Windows.open 直接打开 data url 下载
        // 缺点是没法指定默认的文件名。
        window.open(uri)
    }
}

export default jsonToExcel
