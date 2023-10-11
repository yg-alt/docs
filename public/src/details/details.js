/**
 * 解析模块
 */

const JUEJIN = require('./juejin/utils')

function voidDetailsWork() {
  var {
    JUEJIN_ARTICLE_LIST, // 用户所有文章
  } = global

  // 文章数据
  var articleMap = JUEJIN.getArticleMap(JUEJIN_ARTICLE_LIST)

  // 统计数据
  var countMap = JUEJIN.getCountArticles(JUEJIN_ARTICLE_LIST, articleMap)

  // 存入全局
  global.JUEJIN_ARTICLE_YYYYMM_MAP = articleMap // 所有文章（yymm分类）
  global.JUEJIN_ALL_COUNT_MAP = countMap // 添加统计放全局
}

module.exports = {
  voidDetailsWork,
}
