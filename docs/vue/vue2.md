# Vue 响应式原理

`VUE` 的响应式原理是先将 `vue` 对象的所有属性遍历一遍，为每个属性都添加 `getter` 和 `setter` 方法，接着当 `render  function` 被渲染的时候，因为会读取所需对象的属性，因此会触发 `getter` 函数进行【依赖收集】，【依赖收集】的目的是将 `Watcher` 对象添加到当前闭包中的订阅者 `Dep` 的 `subs` 中。在修改对象的值时，会触发对应的 `setter` ， `setter` 通知之前【依赖收集】得到的 `Dep` 中的每一个 `Watcher` ，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 `Watcher` 就会开始调用 `update` 来更新视图。

## 订阅者 Dep

订阅者 `Dep` ，它的主要作用是用来存放 `Watcher` 观察者对象。主要有以下两个功能：

1. 用 `addSub` 方法可以在目前的 `Dep` 对象中增加一个 `Watcher` 的订阅操作；
1. 用 `notify` 方法通知目前 `Dep` 对象的 `subs` 中的所有 `Watcher` 对象触发更新操作。

```javascript
// 定义订阅者类 Dep
class Dep {
  constructor() {
    /* 初始化订阅队列，用来存放 Watcher 对象的数组 */
    this.subs = []
  }

  /* 增加订阅者，在 subs 中添加一个 Watcher 对象 */
  addSub(sub) {
    this.subs.push(sub)
  }

  /* 通知所有 Watcher 对象更新视图 */
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
```

## 观察者 Watcher

```javascript
class Watcher {
  constructor() {
    /* 在 new 一个 Watcher 对象时将该对象赋值给 Dep.target，在 get 中会用到 */
    Dep.target = this
  }

  /* 更新视图的方法 */
  update() {
    console.log('视图更新啦～')
  }
}

Dep.target = null
```

## 监听器 Observer

实现一个方法，这个方法会对需要监听的数据对象进行遍历、给它的属性加上定制的 getter 和 setter 函数。这样但凡这个对象的某个属性发生了改变，就会触发 setter 函数，进而通知到订阅者。

```javascript
// observe 方法遍历并包装对象属性
function observe(target) {
  // 若 target 是一个对象，则遍历它
  if (target && typeof target === 'object') {
    Object.keys(target).forEach((key) => {
      // defineReactive 方法会给目标属性装上 “监听器”
      defineReactive(target, key, target[key])
    })
  }
}

function defineReactive(obj, key, val) {
  /* 一个Dep类对象 */
  const dep = new Dep()
  /* 属性值也可能是 object 类型，这种情况下需要调用 observe 进行递归遍历 */
  observe(val)

  // 为当前属性安装监听器
  Object.defineProperty(obj, key, {
    // 可枚举
    enumerable: true,
    // 不可配置
    configurable: true,
    get: function reactiveGetter() {
      /* 将 Dep.target（即当前的 Watcher 对象存入 dep 的 subs 中） */
      dep.addSub(Dep.target)
      return val
    },
    // 监听器函数
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      /* 在 set 的时候触发 dep 的 notify 来通知所有的 Watcher 对象更新视图 */
      dep.notify()
    },
  })
}
```

## Vue 组装

```javascript
class Vue {
  constructor(options) {
    this._data = options.data
    observe(this._data)
    /* 新建一个 Watcher 观察者对象，这时候 Dep.target 会指向这个 Watcher 对象 */
    new Watcher()
    /* 在这里模拟 render 的过程，为了触发 test 属性的 get 函数 */
    console.log('render~', this._data.test)
  }
}
```

## 简单示例

```javascript
let vm = new Vue({
  data: {
    test: 'origin',
  },
})
vm._data.test = '测试更改！'

/* 运行结果
 * render~ origin
 * 视图更新啦～
 * "测试更改！"
 */
```
