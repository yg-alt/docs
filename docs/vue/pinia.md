# Pinia

## 1. 引入 Pinia

在 `main.js` 中引入 `Pinia`

```javascript
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

## 2. 定义 Store

定义一个 `Store`

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 选项式配置
export const userCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0,
    }
  },
  getters: {
    count() {
      return this.count
    },
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

// 函数式配置
export const userCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
})
```

## 3. 在组件中使用

```html
<script setup>
  import { useCounterStore } from '@/stores/counter'

  const counterStore = useCounterStore()
  // 以下三种方式都会被 devtools 跟踪
  counterStore.count++
  counterStore.$patch({ count: counterStore.count + 1 })
  counterStore.increment()
</script>

<template>
  <div>{{ counterStore.count }}</div>
  <div>{{ counterStore.doubleCount }}</div>
</template>
```

## 4. 响应式

由于 `store` 是一个用 `reactive` 包裹的对象，直接解构会失去响应性。可以使用需要用 `storeToRefs` 方法包裹 `store` 对象，如

```html
<script setup>
  import { storeToRefs } from 'pinia'
  import { useCounterStore } from '@/stores/counter'

  const counterStore = useCounterStore()
  const { count, doubleCount } = storeToRefs(counterStore)
</script>

<template>
  <div>{{ count }}</div>
  <div>{{ doubleCount }}</div>
</template>
```

## 5. 修改状态

修改 `store` 状态可以直接调用 `store` 的方法，也可以调用 `$patch` 方法进行修改

```html
<script setup>
  import { useCounterStore } from '@/stores/counter'

  const counterStore = useCounterStore();

  counterStore.increment()

  // 参数类型1：对象
  counterStore.$patch({
    name: hello pingan8787 ,
    age: 18 ,
    addr: xiamen ,
  })

  // 参数类型2：方法，该方法接收 store 中的 state 作为参数
  counterStore.$patch(state => {
    state.name = hello pingan8787 ;
    state.age = 18 ;
    state.addr = xiamen ;
  })
</script>
```

## 6. 实现本地存储

```javascript
// 安装插件
npm i pinia-plugin-persist

// 引入插件，并将此插件传递给 pinia ：
// src/main.js
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)

// 接着在定义 store 时开启 persist 即可
// src/stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 1 }),
    // 开启数据缓存
    persist: {
      enabled: true,
      strategies: [
            {
                key: 'myCounter', // 存储的 key 值，默认为 storeId
                storage: localStorage, // 存储的位置，默认为 sessionStorage
                paths: ['name', 'age'], // 需要存储的 state 状态，默认存储所有的状态
            }
        ]
    }
})
```
