# 发布订阅模式

## 一、概述

发布订阅模式是一种常用的设计模式，它定义了一种一对多的关系，让多个订阅者对象同时监听某一个主题对象，当主题对象发生变化时，它会通知所有订阅者对象，使它们能够自动更新 。

## 二、优缺点

### 1. 优点：

- 实现了发布者和订阅者之间的解耦，提高了代码的可维护性和复用性。
- 支持异步处理，可以实现事件的延迟触发和批量处理。
- 支持多对多的通信，可以实现广播和组播的功能。

### 2. 缺点：

- 可能会造成内存泄漏，如果订阅者对象没有及时取消订阅，就会一直存在于内存中。
- 可能会导致程序的复杂性增加，如果订阅者对象过多或者依赖关系不清晰，就会增加程序的调试难度。
- 可能会导致信息的不一致性，如果发布者在通知订阅者之前或之后发生了变化，就会造成数据的不同步。

## 三、适用场景

发布订阅模式适用于以下场景：

- 当一个对象的状态变化需要通知其他多个对象时，可以使用发布订阅模式来实现松耦合的通信
- 当一个事件或消息需要广泛传播或分发给多个接收者时，可以使用发布订阅模式来实现高效的消息分发
- 当一个系统需要支持异步处理或批量处理时，可以使用发布订阅模式来实现事件的延迟触发或批量触发

## 四、代码示例

在JavaScript中，实现发布订阅模式的基本思想是：

- 定义一个发布者对象，它有一个缓存列表，用于存放订阅者对象的回调函数
- 定义一个订阅方法，用于向缓存列表中添加回调函数
- 定义一个取消订阅方法，用于从缓存列表中移除回调函数
- 定义一个发布方法，用于遍历缓存列表，依次执行回调函数，并传递相关参数

下面是一个简单的发布订阅模式的代码示例 ：

```javascript
// 定义一个发布者对象
var pub = {
  // 缓存列表，存放订阅者回调函数
  list: {},
  // 订阅方法
  subscribe: function(key, fn) {
    // 如果没有该消息的缓存列表，就创建一个空数组
    if (!this.list[key]) {
      this.list[key] = [];
    }
    // 将回调函数推入该消息的缓存列表
    this.list[key].push(fn);
  },
  // 取消订阅方法
  unsubscribe: function(key, fn) {
    // 如果有该消息的缓存列表
    if (this.list[key]) {
      // 遍历缓存列表
      for (var i = this.list[key].length - 1; i >= 0; i--) {
        // 如果存在该回调函数，就从缓存列表中删除
        if (this.list[key][i] === fn) {
          this.list[key].splice(i, 1);
        }
      }
    }
  },
  // 发布方法
  publish: function() {
    // 获取消息类型
    var key = Array.prototype.shift.call(arguments);
	// 获取该消息的缓存列表
	var fns = this.list[key];
	// 如果没有订阅该消息，就返回
	if (!fns || fns.length === 0) {
  	return;
	}
	// 遍历缓存列表，执行回调函数
	for (var i = 0; i < fns.length; i++) {
  		fns[i].apply(this, arguments);
	}
  }
};

// 定义一个订阅者对象A 
var subA = function(name) { console.log('A收到了消息：' + name); };
// 定义一个订阅者对象B 
var subB = function(name) { console.log('B收到了消息：' + name); };

// A订阅了test消息 
pub.subscribe('test', subA);
// B订阅了test消息 
pub.subscribe('test', subB);

// 发布了test消息，传递了参数 'hello'
pub.publish('test', 'hello');
// 输出： 
// A收到了消息：hello 
// B收到了消息：hello

// A取消订阅了test消息 
pub.unsubscribe('test', subA);

// 发布了test消息，传递了参数 'world'
pub.publish('test', 'world');
// 输出： // B收到了消息：world
```

## 五、 Vue2 响应式系统实现原理

在 `Vue` 中，每个组件实例都有相应的 `watcher` 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。

### 1. 监听器

实现一个方法，这个方法会对需要监听的数据对象进行遍历、给它的属性加上定制的 `getter` 和 `setter` 函数。这样但凡这个对象的某个属性发生了改变，就会触发 `setter` 函数，进而通知到订阅者。

```javascript
// observe 方法遍历并包装对象属性
function observe(target) {
  // 若target是一个对象，则遍历它
  if(target && typeof target === 'object') {
    Object.keys(target).forEach((key)=> {
      // defineReactive方法会给目标属性装上“监听器”
      defineReactive(target, key, target[key])
    })
  }
}

// 定义 defineReactive 方法
function defineReactive (obj, key, val) {
  /* 一个 Dep 类对象 */
  const dep = new Dep();
  /* 属性值也可能是 object 类型，这种情况下需要调用 observe 进行递归遍历 */
  observe(val);

  // 为当前属性安装监听器
  Object.defineProperty(obj, key, {
    // 可枚举
    enumerable: true,
    // 不可配置
    configurable: true,
    get: function reactiveGetter () {
      /* 将 Dep.target（即当前的 Watcher 对象存入 dep 的 subs 中） */
      dep.addSub(Dep.target);
      return val;         
    },
    // 监听器函数
    set: function reactiveSetter (newVal) {
      if (newVal === val) return;
      /* 在 set 的时候触发 dep 的 notify 来通知所有的 Watcher 对象更新视图 */
      dep.notify();
    }
  });
}

```

### 2. 订阅者

```javascript
// 定义订阅者类 Dep
class Dep {
  constructor () {
    /* 初始化订阅队列 */
    this.subs = [];
  }

  /* 增加订阅者，在 subs 中添加一个 Watcher 对象 */
  addSub (sub) {
    this.subs.push(sub);
  }

  /* 通知所有 Watcher 对象更新视图 */
  notify () {
    this.subs.forEach((sub) => {
      sub.update();
    })
  }
}

```

### 3. 观察者

```javascript
class Watcher {
  constructor () {
    /* 在 new 一个 Watcher 对象时将该对象赋值给 Dep.target，在 get 中会用到 */
    Dep.target = this;
  }

  /* 更新视图的方法 */
  update () {
    console.log("视图更新啦～");
  }
}

Dep.target = null;
```

### 4. Vue 组装

```javascript
class Vue {
  constructor(options) {
    this._data = options.data;
    observe(this._data);
    /* 新建一个 Watcher 观察者对象，这时候 Dep.target 会指向这个 Watcher 对象 */
    new Watcher();
    /* 在这里模拟 render 的过程，为了触发 test 属性的 get 函数 */
    console.log('render~', this._data.test);
  }
}
let vm = new Vue({
  data:{
    test:"origin"
  }
});

vm._data.test="测试更改！";

/* 运行结果
 * render~ origin
 * 视图更新啦～
 * "测试更改！"
*/
```

## 六、实现一个 Event Bus / Event Emitter

**Event Bus** / **Event Emitter** 作为全局事件总线，它起到的是一个**沟通桥梁**的作用。我们可以把它理解为一个事件中心，我们所有事件的订阅/发布都不能由订阅方和发布方“私下沟通”，必须要委托这个事件中心帮我们实现。

```javascript
class EventEmitter {
  constructor() {
    // handlers是一个map，用于存储事件与回调之间的对应关系
    this.handlers = {}
  }

  // on方法用于安装事件监听器，它接受目标事件名和回调函数作为参数
  on(eventName, cb) {
    // 先检查一下目标事件名有没有对应的监听函数队列
    if (!this.handlers[eventName]) {
      // 如果没有，那么首先初始化一个监听函数队列
      this.handlers[eventName] = []
    }

    // 把回调函数推入目标事件的监听函数队列里去
    this.handlers[eventName].push(cb)
  }

  // emit方法用于触发目标事件，它接受事件名和监听函数入参作为参数
  emit(eventName, ...args) {
    // 检查目标事件是否有监听函数队列
    if (this.handlers[eventName]) {
      // 这里需要对 this.handlers[eventName] 做一次浅拷贝，主要目的是为了避免通过 once 安装的监听器在移除的过程中出现顺序问题
      const handlers = this.handlers[eventName].slice()
      // 如果有，则逐个调用队列里的回调函数
      handlers.forEach((callback) => {
        callback(...args)
      })
    }
  }

  // 移除某个事件回调队列里的指定回调函数
  off(eventName, cb) {
    const callbacks = this.handlers[eventName]
    const index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  // 为事件注册单次监听器
  once(eventName, cb) {
    // 对回调函数进行包装，使其执行完毕自动被移除
    const wrapper = (...args) => {
      cb(...args)
      this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}


// 使用方法
const eventBus = new EventEmitter()
eventBus.on('test', (val) => {
    console.log(val, "===test")
})
eventBus.emit('test', 21) // 输出： 21,===test
```

## 七、总结

发布订阅模式是一种常用的设计模式，它可以实现对象间的松耦合通信，支持异步处理和多对多的通信。它也有一些缺点，比如可能会造成内存泄漏、程序复杂性增加和信息不一致性。在使用发布订阅模式时，需要注意合理地设计发布者和订阅者之间的关系，避免出现不必要的问题。