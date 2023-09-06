# Vuex 小记

## 1. 当 `Store` 无其它模块时，使用方法如下：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    // 使用载荷 payload 对应进行传值
    increment(state, payload) {
      state.count += payload.amount
    },
    // 直接传值
    incrementBy(state, n) {
      state.count += n
    },
  },
  actions: {
    incrementAsync(context) {
      context.commit('increment')
    },
    incrementByAsync({ commit }) {
      commit('increment')
    },
  },
})
```

`Vue` 组件内容如下，建议通过 `action` 中的方法来同步更改 `state` 中的内容

```js
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    localComputed() {
      /* ... */
    },

    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState({
      // 箭头函数可使代码更简练
      count: (state) => state.count,

      // 传字符串参数 'count' 等同于 `state => state.count`
      countAlias: 'count',

      // 为了能够使用 `this` 获取局部状态，必须使用常规函数
      countPlusLocalState(state) {
        return state.count + this.localCount
      },
    }),
  },
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy', // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),

    ...mapMutations({
      add: 'increment', // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),

    normalMethod() {
      // Mution 通过 store.commit 方法触发：
      this.$store.commit('increment', { amount: 10 })
      this.$store.commit({
        type: 'increment',
        amount: 10,
      })

      // Action 通过 store.dispatch 方法触发：
      this.$store.dispatch('increment', { amount: 10 })
      this.$store.dispatch('incrementAsync', 10)
      // 以对象形式分发
      this.$store.dispatch({
        type: 'increment',
        amount: 10,
      })
    },

    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy', // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),

    ...mapActions({
      add: 'increment', // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    }),
  },
}
```

## 2. 当 `Store` 存在其他模块时，使用方法如下,设置 `namespaced` 可以使得模块成为带命名空间的模块

```javascript
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      state: () => ({
        count: 2
      }),

      // 对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：
      getters: {
        // -> getters['account/sumWithRootCount']
        sumWithRootCount (state, getters, rootState) {
          return state.count + rootState.count
        }
      },

      mutations: {
        // -> commit('account/increment')
        increment(state) {
          // 这里的 `state` 对象是模块的局部状态
          state.count++
        }
      },

      actions: {
        // -> dispatch('account/incrementAsync')
        incrementAsync(context) {
          context.commit('increment')
        },
        // 根节点状态则为 context.rootState
        incrementIfOddOnRootSum ({ state, commit, rootState }) {
          if ((state.count + rootState.count) % 2 === 1) {
            commit('increment')
          }
        }
      },
      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

## 3. 带模块的 `Store` 在应用组件中的使用方法如下：

- 方法 1：使用辅助函数

```javascript
// 通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数。
// 它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('account')

export default {
  computed: {
    // 在模块 `account` 中查找
    ...mapState({
      count: (state) => state.count,
    }),
  },
  methods: {
    // 在模块 `account` 中查找
    ...mapActions(['incrementAsync', 'incrementIfOddOnRootSum']),
  },
}
```

- 方法 2：不使用辅助函数

```javascript
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    // 在模块 `account` 中查找
    ...mapState({
      count: (state) => state.account.count,
    }),
  },
  methods: {
    // 在模块 `account` 中查找
    ...mapActions([
      'account/incrementAsync', // -> this['account/incrementAsync']()
      'account/incrementIfOddOnRootSum', // -> this['account/incrementIfOddOnRootSum']()
    ]),
    ...mapActions('account', [
      'incrementAsync', // -> this.incrementAsync()
      'incrementIfOddOnRootSum', // -> this.incrementIfOddOnRootSum()
    ]),
  },
}
```
