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

## Semigroup（半群）

`Semigroup` 是**闭合**于**结合**性**二元运算**之下的集合 S 构成的代数结构。核心是实现了 `concat` 函数

加法半群

```js
// 定义一个类型为 Add 的 Semigroup 盒子
const Add = (value) => ({
  value,
  // concat 接收一个类型为 Add 的 Semigroup 盒子作为入参
  concat: (box) => Add(value + box.value),
})

// 输出一个 value=6 的 Add 盒子
Add(1).concat(Add(2)).concat(Add(3))
```

## Monoid（幺半群）

> `Monoid` 是一种介于 `Semigroup` 和 `group` 之间的代数结构，它是一个拥有了 `identity element` 的半群。

**Monoid = Semigroup + identity element**

`identity element` 在数学上叫做“单位元”。 单位元的特点在于，它和任何运算数相结合时，都不会改变那个运算数。

在函数式编程中，单位元也是一个函数，我们一般把它记为“empty() 函数”

也就是说，Monoid = Semigroup + empty() 函数

```js
// 定义一个类型为 Add 的 Semigroup 盒子
const Add = (value) => ({
  value,
  // concat 接收一个类型为 Add 的 Semigroup 盒子作为入参
  concat: (box) => Add(value + box.value),
})

// 这个 empty() 函数就是加法运算的单位元
Add.empty = () => Add(0)

// 输出一个 value=3 的 Add 盒子
Add.empty().concat(Add(1)).concat(Add(2))
```

在实践中，`Monoid` 常常被放在 `reduce` 的 `callback` 中参与计算。如下：

```js
// 定义一个类型为 Add 的 Monoid 盒子
const Add = (value) => ({
  value,
  // concat 接收一个类型为 Add 的 Monoid 盒子作为入参
  concat: (box) => Add(value + box.value),
})
Add.empty = () => Add(0)

// 把 Add 盒子放进 reduce 的 callback 里去
const res = [1, 2, 3, 4].reduce((monoid, num) => monoid.concat(Add(num)), Add.empty())
```

## foldMap

foldMap 的作用是实现 n 元的 Monoid 盒子运算

```js
// 这里我以 map+reduce 的写法为例，抽象 foldMap() 函数
const foldMap = (Monoid, arr) => arr.map(Monoid).reduce((prevMonoid, currentMonoid) => prevMonoid.concat(currentMonoid), Monoid.empty())

// 定义 Multi 盒子
const Multi = (value) => ({
  value,
  concat: (box) => Multi(value * box.value),
})
Multi.empty = () => Multi(1)

// 使用 foldMap 实现 Multi 盒子求积功能
const res = foldMap(Multi, [1, 2, 3, 4])

// 输出 24， 求积成功
console.log(res.value)
```
