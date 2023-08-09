# 柯里化与反柯里化

## 一、柯里化

### 1. 定义

柯里化是将接受多个参数的函数转换成一系列只接受单个参数的函数的过程。柯里化函数的返回值仍然是一个函数，该函数接受一个参数，并返回一个新的函数，直到所有参数都被处理完毕，最终返回最终结果。

### 2. 优缺点

#### 2.1. 优点

- 灵活性：柯里化可以使得函数更加灵活，因为它可以将多个参数的函数转换成一系列只接受单个参数的函数，从而可以更灵活地组合和使用函数。
- 可复用性：柯里化可以使得函数更加可复用，因为它可以将柯里化函数的一部分参数预设，从而得到新的函数，该函数可以直接使用，也可以作为其他函数的参数使用。

#### 2.2. 缺点

- 可读性：柯里化可以使得函数的调用方式变得更加复杂，需要多次调用不同的函数才能得到最终结果，从而降低了代码的可读性。

### 3. 适用场景

- 部分应用函数：当函数需要传递一部分参数时，可以使用柯里化函数将该部分参数预设，从而得到新的函数。
- 简化参数传递：当函数需要多个参数时，可以使用柯里化函数将多个参数转换成一系列只接受单个参数的函数，从而简化参数传递。

### 4. 示例代码

#### 4.1. 两数相加

以下是一个简单的柯里化函数 `add` ，该函数将两个数字相加：

```js
function add(a) {
  return function(b) {
    return a + b;
  }
}

const addFive = add(5);

console.log(addFive(2)); // 输出 7
```

在上述代码中，我们定义了一个 `add` 函数，该函数接受一个数字 `a`，并返回一个新函数，该函数接受一个数字 `b`，并返回 `a + b` 的结果。然后我们使用 `add(5)` 得到一个新的函数 `addFive`，该函数接受一个数字 `b`，并返回 `5 + b` 的结果。最终，我们可以使用 `addFive(2)` 得到结果 `7`。

#### 4.2. 柯里化工具函数

以下是一个简单的柯里化工具函数的示例代码：

```js
// 柯里化工具函数
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            }
        }
    }
}
```

其中，`fn` 是需要进行柯里化处理的函数。这个柯里化函数返回一个新的函数，当新函数接收到足够的参数后，就会调用原始函数 `fn`，否则会返回一个新函数，继续接收参数。这样，我们就可以使用柯里化函数，将多个参数的函数转换为一系列单参数的函数。使用方法如下：

```js
function sum(a, b, c) {
    return a + b + c;
}

const sum_curried = curry(sum);

sum_curried(1, 2, 3); // 6
sum_curried(1, 2)(3); // 6
sum_curried(1)(2, 3); // 6
sum_curried(1)(2)(3); // 6
```

## 二、反柯里化

### 1. 定义

反柯里化是将柯里化函数转换成接受多个参数的函数的过程。反柯里化函数的返回值是一个函数，该函数接受一个对象作为参数，并调用该对象的原本方法并传递参数。

### 2. 优缺点

#### 2.1. 优点

- 可读性：反柯里化可以使得函数的调用方式变得更加简单，只需要调用一个函数并传递一个对象作为参数即可。
- 可复用性：反柯里化可以使得函数更加可复用，因为它可以将一个预设 this 对象的函数转换成接受 this 对象的函数，从而可以在不同的对象上复用该函数。

#### 2.2. 缺点

- 灵活性：反柯里化可以使得函数的 this 对象变得固定，从而降低了函数的灵活性。

### 3. 适用场景

- 复用函数：当多个对象需要调用同一个方法时，可以使用反柯里化函数将该方法转换成接受对象作为参数的函数，从而可以在不同的对象上复用该函数。
- 链式调用：当多个方法需要进行链式调用时，可以使用反柯里化函数将该方法转换成接受对象作为参数的函数，从而可以方便地进行链式调用。

### 4. 示例代码

#### 4.1 例子1

以下是一个简单的反柯里化函数 `bind`，该函数将预设 `this` 对象的函数转换成接受 `this` 对象的函数：

```js
function bind(fn, obj) {
  return function(...args) {
    return fn.apply(obj, args);
  }
}

const obj = { x: 1, y: 2 };
function sum() {
  return this.x + this.y;
}

const boundSum = bind(sum, obj);

console.log(boundSum()); // 输出 3
```

在上述代码中，我们定义了一个 `bind` 函数，该函数接受一个函数 `fn` 和一个对象 `obj`，并返回一个新的函数。该函数使用 `apply` 方法调用函数 `fn`，并传递对象 `obj` 和参数 `args`。然后我们使用 `bind(sum, obj)` 得到一个新的函数 `boundSum`，该函数调用 `sum` 函数，并传递对象 `obj` 作为 `this` 对象。最终，我们可以使用 `boundSum()` 得到结果 `3`。

#### 4.2 反柯里化工具函数

```js
// 方法一
Function.prototype.uncurry = function() {
    var self = this;
    return function() {
        return Function.prototype.call.apply(self, arguments);
        // <==> self.call(arguments)
    }
}

// 方法二
Function.prototype.uncurry = function() {
    var self = this;
    return function() {
      var obj = Array.prototype.shift.call(arguments); // 截取第一个对象
      return self.apply(obj, arguments);
    }
}

var push = Array.prototype.push.uncurry()

var obj = {
    "length": 1,
    "0": 1
}

push(obj, 2)

console.log(obj) // 输出 { 0: 1, 1: 2, length: 2}
```

## 总结

本文介绍了 `Javascript` 中的柯里化和反柯里化技术。柯里化可以将接受多个参数的函数转换成一系列只接受单个参数的函数，从而使得函数更加灵活、可复用和组合。反柯里化可以将柯里化函数转换成接受多个参数的函数，从而使得函数更加可读和复用。柯里化和反柯里化可以相互配合使用，从而进一步提高代码的可读性、可复用性和组合性。在实际开发中，我们可以根据具体的需求选择使用柯里化或反柯里化来优化代码。
