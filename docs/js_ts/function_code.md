# 函数式编程

## pipe

`pipe` 的作用是按顺序从左到右串联起一系列 **一元函数**，并最终返回一个函数

```js
// 使用展开符来获取数组格式的 pipe 参数
function pipe(...funcs) {
  function callback(input, func) {
    return func(input)
  }

  return function (param) {
    return funcs.reduce(callback, param)
  }
}
```

使用

```js
function add4(num) {
  return num + 4
}

function multiply3(num) {
  return num * 3
}

function divide2(num) {
  return num / 2
}

const compute = pipe(add4, multiply3, divide2)

// 输出 21
console.log(compute(10))
```

## Compose

`Compose` 的作用是按顺序从右到左串联起一系列 **一元函数**，并最终返回一个函数

```js
// 使用展开符来获取数组格式的 pipe 参数
function compose(...funcs) {
  function callback(input, func) {
    return func(input)
  }

  return function (param) {
    return funcs.reduceRight(callback, param)
  }
}
```

使用

```js
function add4(num) {
  return num + 4
}

function multiply3(num) {
  return num * 3
}

function divide2(num) {
  return num / 2
}

const compute = compose(add4, multiply3, divide2)

// 输出 19
console.log(compute(10))
```

## Function（函子）

`Functor` 指的是一个实现了 `map` 方法的数据结构。

### 1. Identity Functor

```js
const Identity = (x) => ({
  map: (f) => Identity(f(x)),
  valueOf: () => x,
  inspect: () => `Identity {${x}}`,
})
```

### 2. Maybe Functor

定义

```js
const isEmpty = (x) => x === undefined || x === null

const Maybe = (x) => ({
  map: (f) => (isEmpty(x) ? Maybe(null) : Maybe(f(x))),
  valueOf: () => x,
  inspect: () => `Maybe {${x}}`,
})
```

使用

```js
function add4(x) {
  return x + 4
}

function add8(x) {
  x + 8 // 没有 return，函数返回 undefined
}

function toString(x) {
  return x.toString()
}

function addX(x) {
  return x + 'X'
}

function add10(x) {
  return x + '10'
}

const res = Maybe(10).map(add4).map(add8).map(toString).map(addX).inspect()

// 输出 Maybe {null}
console.log(res)
```

## Monad（单子）

`Monad` 是一个同时实现了 `map` 方法和 `flatMap` 方法的盒子。

`map` 预期 `f(x)` 会输出一个具体的值。这个值会作为下一个“基础行为”的回调入参传递下去。

而 `flatMap` 预期 `f(x)` 会输出一个 `Functor`，它会像剥洋葱一样，把 `Functor` 里包裹的值给“剥”出来。确保最终传递给下一个“基础行为”的回调入参，仍然是一个具体的值。

定义

```js
const Monad = (x) => ({
  map: (f) => Monad(f(x)),
  // flatMap 直接返回 f(x) 的执行结果
  flatMap: (f) => f(x),

  valueOf: () => x,
  inspect: () => `Monad {${x}}`,
})
```

使用

```js
const monad = Monad(1)
const nestedMonad = Monad(monad)

// 试试会发生什么？
console.log(nestedMonad.flatMap((x) => x))
```
