const FileUtils = require('../common/FileUtils')
const BASE_DATA = require('../common/base')
const BASE_ARTICLE_DATA = require('../common/base-article')

function updateArticleMap(articleMap, countMap) {
  var yymmMapList = [] // 年月日的已经排序好，不过是倒序的，所以遍历一般好让年月的时间正序起来
  articleMap.forEach((strMap, yymm) => {
    yymmMapList.push({
      yymm,
      strMap,
    })
  })
  console.log(yymmMapList)
  // return;
  for (var backIndex in yymmMapList) {
    var oneMap = yymmMapList[yymmMapList.length - backIndex - 1]
    var { yymm, strMap } = oneMap
    const { str } = strMap
    console.log(countMap)
    updateCommon(yymm, str, BASE_DATA.DOCS_SORT_PATH, countMap)
  }
}

// 更新进行一步的公共部分
function updateCommon(startyymm, addData, dirPath, countMap) {
  var isMkDir = FileUtils.mkdirsSync(dirPath)
  if (!isMkDir) {
    console.log('新建文件夹有误！', 'isMkDir：', isMkDir)
    return
  }
  updateAll(startyymm, addData, dirPath, countMap)
}

// 更新总的文档（all.md）
function updateAll(startyymm, addData, dirPath, countMap) {
  // 更新文档
  // 判断该文档是否存在
  // console.log(dirPath)
  const fileName = 'all'
  var filePath = dirPath + fileName + '.md' // 文件路径
  var fileData = FileUtils.getFileData(filePath, BASE_DATA.ALL_TEMPLATE_PATH) // 获取文件内容（不存在则获取模板内容）
  // 添加
  var findPosition = fileData.indexOf('&{postTotal}&')
  if (findPosition !== -1) {
    // 存在更新
    fileData = fileData.replaceAll('&{postTotal}&', countMap['postTotal']) // 所有文章总数
    fileData = initYearTotal(fileData, countMap) // 初始化的年文章数量
  }
  // 添加月的文章总数（这个可以到写入月数据时添加）
  FileUtils.updateArticleFile(filePath, fileData, addData, startyymm, countMap)
}

// 初始化年文章的统计
function initYearTotal(content, countMap) {
  var yytemplateStr = '**　&{yy}&年**　'
  // console.log(countMap)
  var updateContent = ''
  var updateList = []
  var yyyyMap = new Map()
  for (var yy in countMap) {
    yy = String(yy)
    if (yy === 'postTotal') {
      continue
    }
    // console.log(yy, yy.length)
    const count = countMap[yy]
    var mm = ''
    if (yy.length > 4) {
      mm = yy.substring(4)
      yy = yy.substring(0, 4)
    }
    var yyyyData = yyyyMap.get(yy)
    var repName = '&{' + mm + '}&'
    if (yyyyData) {
      // 不为空直接替换
      yyyyData = yyyyData.replaceAll('&{monthTotal}&', count).replaceAll(repName, count)
    } else {
      // 为空的时候，获取模板，并进行修改
      yyyyData = BASE_ARTICLE_DATA.AllMonthSortTemplate.replaceAll('&{monthName}&', yy).replaceAll('&{monthTotal}&', count) + '\r\n'
      yyyyMap.set(yy, yyyyData)
    }
    yyyyMap.set(yy, yyyyData)
  }
  // 把其他的值都置为 -
  const regex = /&\{(0[1-9]|1[0-2])\}&/g
  // for (const [key, value] of yyyyMap) {
  //     yyyyMap.set(key, value.replace(regex, '-'));
  // }
  // console.log(yyyyMap)
  var yyyyList = Array.from(yyyyMap.values()).slice().reverse()
  var yyyyListStr = yyyyList.join('').replace(regex, '-')
  // console.log(yyyyMap)
  // console.log(content)
  // console.log(countMap)
  // console.log(yyyyList)
  // console.log(yyyyListStr)

  const templateValue = '<!-- 目录总的模板 -->'
  var findTemplatePosition = content.indexOf(templateValue)
  content = FileUtils.updateOptPosition(findTemplatePosition, yyyyListStr, content)
  // console.log(content)
  // throw new Error('抛出错误');
  return content
}

module.exports = {
  updateArticleMap,
}
