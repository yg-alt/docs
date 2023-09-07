# 手写 call、apply、bind

## call

```javascript
Function.prototype.Call = function (context, ...args) {
  // 当 context 为 undefined 或 null 时，context 指向window
  if (!context || context === null) {
    context = window
  }
  // 使用 Symbol 创建唯一的 key 值，防止与原有属性冲突
  let fn = Symbol()
  // 将当前函数挂载到 context 对象下，this 指向调用 call 的函数
  context[fn] = this
  // 隐式绑定 this，如执行 obj.foo(), foo 内的 this 指向 obj
  const res = context[fn](...args)
  // 执行完毕后，删除新增的属性
  delete context[fn]
  return res
}
```

## apply

```javascript
// apply与call相似，只有第二个参数是一个数组，
Function.prototype.Apply = function (context, args) {
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol()
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}
```

## bind

```javascript
Function.prototype.Bind = function (context, ...args) {
  if (!context || context === null) {
    context = window
  }

  let fn = this
  let f = Symbol()

  const result = function (...args1) {
    if (this instanceof fn) {
      // result 如果作为构造函数被调用， ths 指向的是 new 出来的对象
      // this instanceof fn，判断 new 出来的对象是否为 fn 的实例
      this[f] = fn
      let res = this[f](...args, ...args1)
      delete this[f]
      return res
    } else {
      // bind 返回的函数作为普通函数被调用时
      context[f] = fn
      let res = context[f](...args, ...args1)
      delete context[f]
      return res
    }
  }
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用 Object.create
  result.prototype = Object.create(fn.prototype)
  return result
}
```
