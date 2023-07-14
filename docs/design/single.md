# 单例模式

> 定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

`Vue` 中对应的体现就是 `Vuex`，一个 `Vue` 实例只会有一个全局的 Store。

## 一、JavaScript 中的单例模式

在 JavaScript 开发中，我们经常会把全局变量当成单例来使用，但是这样容易造成命名空间污染。我们有必要尽量减少全局变量的使用，即使需要，也应该把污染降到最低。

### 1. 使用命名空间

适当的使用命名空间，并不会杜绝全局变量，但可以减少全局变量的数量。

```javascript
let MyApp = {};

MyApp.namespace = (name) => {
  const parts = name.split('.')
  let current = MyApp
  for (var i in parts) {
    const key = parts[i]
    if ( !current[key] ) {
      current[key] = {}
    }
    current = current[key]
  }
};

MyApp.namespace('event')
MyApp.namespace('dom.stype')

console.dir(MyApp)

// 上述代码等价于

let MyApp = {
  event: {},
  dom: {
    style: {}
  }
};
```

### 2. 使用闭包封装私有变量

把一些变量封装到闭包内部，只暴露一些接口跟外界通信：

```javascript
const user = (() => {
  const _name = 'sven', _age = 29
  return {
    getUserInfo: () => {
      return _name + '-' + _age
    }
  }
})();

console.log(user.getUserInfo())
```

## 二、惰性单例

惰性单例指的是在需要的时候才创建对象实例。

```javascript
// 管理单例
const getSingle = function(fn) {
  let result
  return () => {
    return result || ( result = fn.apply(this, arguments) )
  }
}

const createLoginLayer = () => {
  const div = document.createElement('div')
  div.innerHTML = '我是登录浮窗'
  document.body.appendChild(div)
  return div
}

const createSingleLoginLayer = getSingle(createLoginLayer)
var loginLayer = createSingleLoginLayer()
var loginLayer = createSingleLoginLayer()
var loginLayer = createSingleLoginLayer()


const createSingleIframe = getSingle(() => {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  return iframe
})
var iframe = createSingleIframe()
var iframe = createSingleIframe()
var iframe = createSingleIframe()
```

## 三、例子

- 描述（**实现一个 Storage）**
实现 Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。

- 实现 1 **（闭包实现 Storage）**

```javascript
function StoreBase(){}
StoreBase.prototype.getItem = (key) => {
  return localStorage.getItem(key)
}
StoreBase.prototype.setItem = (key, val) => {
  localStorage.setItem(key, val)
}

const Store = (() => {
  let instance = null
  return () => {
    if (!instance) {
      instance = new StoreBase()
    }
    return instance
  }
})()

const store1 = Store()
const store2 = Store()

store1.setItem('name', '张三')

store2.getItem('name') // 张三
store1.getItem('name') // 张三

console.log(store1 === store2) //
```

- 实现 2 **（静态类实现 Storage）**

```javascript
class Storage {
  static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }
  getItem(key) {
    return localStorage.getItem(key)
  }
  setItem(key, value) {
    localStorage.setItem(key, value)
  }
}

const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '张三')
storage1.getItem('name')
storage2.getItem('name')

console.log(storage1 === storage2)
```
