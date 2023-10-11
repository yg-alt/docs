// 掘金相关处理
const { post, get, sleep } = require('../../../common/utils/Http')
const JUEJIN_BASE = require('./base') // 静态变量

// 文章列表信息请求（post 请求
const userArtMapPost = async (userId) => {
  console.log('开始-获取个人所有文章')
  // 获取个人所有文章
  var userArticleList = await juejinCommonPost(JUEJIN_BASE.ARTICLE_API, getArticleParams(userId), 10)
  return {
    userArticleList, // 用户所有文章
  }
}

// juejin请求相关公共接口（post请求
const juejinCommonPost = async (url, requestBody, cursorTimes) => {
  // 记录请求列表
  var resList = []
  var i = 0
  var isOver = false
  while (!isOver) {
    // 专栏文章参数、专栏列表不需要*10;个人文章需要*10
    requestBody.cursor = String(i * cursorTimes)
    console.log(requestBody)
    var res = await post(url, requestBody)
    var isBadWebCount = 0
    while ((!res || !res.data) && isBadWebCount < 5) {
      // 有可能网络异常，数据请求不到，那就重复5次
      res = await post(url, requestBody)
      isBadWebCount++
    }
    if (isBadWebCount >= 5) {
      // 三次之后还是有问题就抛出异常（事不过五）
      console.log('请求故障，请重试！')
      throw new Error('请求故障，请重试！')
    }
    if (0 != res.data.err_no || !res.data.data || res.data.data.length == 0) {
      // console.log("已经获取全部数据！");
      break
    }
    var resDataData = res.data.data
    // console.log("resDataData.length：", resDataData.length);
    resList = resList.concat(resDataData)
    // console.log("resList.length：" + resList.length);
    i++
    await sleep()
  }
  return resList
}

// 获取文章的请求参数
const getArticleParams = (user_id) => {
  return {
    sort_type: 2,
    user_id, // 用户id
  }
}

module.exports = {
  userArtMapPost,
}
