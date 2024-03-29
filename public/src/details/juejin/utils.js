const { JUEJIN_USER_URL, JUEJIN_POST_URL, JUEJIN_COLUMN_URL } = require('./base') // 静态变量

const DateUtils = require('../../../common/utils/DateUtils') // 请求
const BASE_ARTICLE_DATA = require('../../generate/common/base-article')

// 统计模块
function getCountArticles(userArticleList, articleMap) {
  // 添加统计数据操作
  var countMap = {
    // 添加总文章数
    postTotal: userArticleList.length,
  }
  articleMap.forEach((strMap, yymm) => {
    // console.log(yymm, strMap);
    if (yymm.length > 4) {
      const yy = yymm.substring(0, 4)
      // 添加年月统计
      countMap[yymm] = strMap['count']
      var yyCount = countMap[yy]
      if (!yyCount) {
        yyCount = 0
      }
      yyCount += strMap['count']
      countMap[yy] = yyCount
    }
  })
  return countMap
}

// 解析文章列表
function getArticleMap(articleList) {
  var articleMap = new Map() // 记录时间的
  if (!articleList) {
    console.log('getArticleMap（）articleList参数为空', articleList)
    return
  }
  // console.log("getArticleMap（）", articleList)
  articleList = unique(articleList) // 数组去重和排序
  for (var item of articleList) {
    // console.log("articleBean", item);
    var articleBean = getArticleInfo(item)
    var ctime = parseInt(articleBean.ctime + '000')
    var dateMap = DateUtils.getMapByString(ctime) // 获取年月日 map 存储
    const { YMD, YYYYMM } = dateMap
    articleBean['YM'] = YYYYMM
    articleBean['YMD'] = YMD // 新增 转换年月日的（格式：x年x月x日）
    var strMap = articleMap.get(YYYYMM)
    if (!strMap) {
      strMap = {
        str: '',
        count: 0,
      }
    }
    var { str, count } = strMap
    str += article2MD(articleBean)
    count++
    strMap = {
      str,
      count,
    }
    articleMap.set(YYYYMM, strMap)
  }
  return articleMap
}

// 解析、处理文章
function getArticleInfo(article) {
  var { article_info } = article
  var {
    cover_image, // 专栏导图（有可能没有）
    article_id, // 文章id
    title, // 标题
    brief_content, // 摘要
    ctime, // 创建时间
    view_count, // 阅读量
    collect_count, // 收藏数
    digg_count, // 点赞数
  } = article_info
  var articleBean = {
    cover_image,
    article_id,
    title,
    postUrl: JUEJIN_POST_URL + article_id, // 文章地址
    brief_content,
    ctime,
    hot: false,
  }
  if (view_count >= 900 || collect_count >= 5 || digg_count >= 5) {
    // 当阅读过 900 或点赞和收藏过 5 就算热文
    articleBean.hot = true
  }
  return articleBean
}

// 数组去重和排序
function unique(arr) {
  const res = new Map()
  arr = arr.filter((item) => !res.has(item.article_info.ctime) && res.set(item.article_info.ctime, 1)) // 数组去重
  return arr.sort((star, next) => {
    // 降序排序（根据时间）
    return next.article_info.ctime - star.article_info.ctime // 保证所有文章是降序
    // return star.article_info.ctime - next.article_info.ctime;
  })
}

// 文章转化为md文档格式
function article2MD(articleBean) {
  var txt = '\r\n- [' + articleBean.YMD + '：' + articleBean.title + '](' + articleBean.postUrl + ')'
  var reg = /<[^>]+>/gi
  txt = txt.replace(reg, function (match) {
    return '`' + match + '`'
  }) // 替换所有有标签的标题，加引号 `<标签>`
  if (articleBean.hot) txt += BASE_ARTICLE_DATA.BadgeLabelMap.hot
  return txt
}

module.exports = {
  getArticleMap,
  getCountArticles,
}
