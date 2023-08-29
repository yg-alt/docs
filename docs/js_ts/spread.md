# 展开层叠数组的六种方法

## 前言

当前存在一个复杂数组 `[1, [2, [3, [4, 5]]], 6]` ，我们需要将其展开成普通数组 `[1, 2, 3, 4, 5, 6]`，下面是几种转换方法：

## 方法 1：使用拓展运算符

```javascript
// 只要有一个元素有数组，那么循环继续
let ary = [1, [2, [3, [4, 5]]], 6]
while (ary.some(Array.isArray)) {
  ary = [].concat(...ary)
}
```

## 方法 2：调用 ES6 的 flat 方法

```javascript
let ary = [1, [2, [3, [4, 5]]], 6]
arr = ary.flat(Infinity)
```

## 方法 3：`replace` + `split` ，这种方法会使得数组内的元素类型都变成字符串

```javascript
let ary = [1, [2, [3, [4, 5]]], 6]
let str = JSON.stringify(ary)
arr = str.replace(/(\[|\])/g, '').split(',')
```

## 方法 4：`replace` + `JSON.parse`

```javascript
let ary = [1, [2, [3, [4, 5]]], 6]
let str = JSON.stringify(ary)
str = str.replace(/(\[|\])/g, '')
str = '[' + str + ']'
ary = JSON.parse(str)
```

## 方法 5：利用 reduce 函数迭代

```javascript
function flatten(ary) {
  return ary.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}
let ary = [1, [2, [3, [4, 5]]], 6]
console.log(flatten(ary))
```

## 方法 6：采用递归的方法来对数组的每个元素进行操作

若该元素是个数组，则继续调用此函数并将调用返回的值 **concat** 到结果数组当中;否则将该元素 **push** 到结果数组中

```javascript
function steamroller(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) result = result.concat(steamroller(arr[i]))
    else {
      result.push(arr[i])
    }
  }
  return result
}
steamroller([1, [2, [3, [4, 5]]], 6])
```

## 总结

本文介绍了六种拍平数组的方法，其中，直接调用数组的 flat 方法可以节省代码量，帮助用户写出更加简洁的代码。
