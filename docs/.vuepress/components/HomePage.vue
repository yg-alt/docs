<template>
  <div class="home-page">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <div class="overview">
      <div v-for="item in modules" class="box">
        <h3 class="module-name" @click="jumpUrl(item)">{{ item.name }}</h3>
        <p class="summar">{{ item.summar }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '前端小站',
      description: '起风了 唯有努力生存！',
      modules: [{ name: '设计模式', url: '/design/', summar: '学习和理解设计模式在 JS 中的使用，编写出更高级的代码。' }],
    }
  },
  methods: {
    jumpUrl(item) {
      console.log(this.$router)
      this.$router.push(item.url)
    },
  },
}
</script>

<style scoped>
.home-page {
  text-align: center;
}
.overview {
  height: 250px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box {
  width: 200px;
  text-align: center;
}
.module-name {
  cursor: pointer;
  font-weight: bold;
}
.summar {
  margin-top: 20px;
  color: #999;
}
</style>
