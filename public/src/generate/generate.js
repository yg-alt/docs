/**
 * 生成模块
 */
const JUEJIN = require('./juejin/utils')

function voidGenrateWork() {
  var {
    JUEJIN_ARTICLE_YYYYMM_MAP, // 所有文章（yymm分类）
    JUEJIN_ALL_COUNT_MAP, // 添加统计放全局
  } = global

  // 时间分类的文章
  generateTimeSortArticle(JUEJIN_ARTICLE_YYYYMM_MAP, JUEJIN_ALL_COUNT_MAP)
}

// 创建时间分类的文章
function generateTimeSortArticle(articleMap, countMap) {
  JUEJIN.updateArticleMap(articleMap, countMap)
}

module.exports = {
  voidGenrateWork,
}
