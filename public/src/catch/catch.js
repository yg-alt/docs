/**
 * 获取模块
 */
const JUEJIN = require('./juejin/utils')

async function voidCatchWork(bodyJson) {
  const { juejin_user_id } = bodyJson
  // 用户文章和专栏
  await userArticleWork(juejin_user_id)
}

// 获取用户文章列表信息（包括专栏情况）
async function userArticleWork(userId) {
  // 获取个人所有文章
  var {
    userArticleList, // 用户所有文章
  } = await JUEJIN.userArtMapPost(userId)
  console.log('获取到该用户的所有文章数量：' + userArticleList.length)
  // 存入全局
  global.JUEJIN_ARTICLE_LIST = userArticleList
}

module.exports = {
  voidCatchWork,
}
