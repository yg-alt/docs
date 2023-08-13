# 防抖与节流

**防抖**（Debounce）和 **节流**（Throttle）是两种常见的前端性能优化技术，用于限制事件处理函数的执行频率，从而减少浏览器的计算负担，提升页面性能。

## 一、防抖

防抖的原理是在事件触发后，等待一段时间（比如100毫秒），如果在这段时间内没有再次触发该事件，那么执行事件处理函数；如果在等待时间内再次触发了该事件，那么重新计时，等待一段时间后再执行事件处理函数。

防抖常用于处理一些高频触发的事件，例如窗口大小调整、输入框输入等。下面是一个简单的防抖函数的示例代码：

```js
/**
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function debounce(fn, time, flag) {
    let timer;
    return function(...args) {
        // 在 time 时间段内重复执行，会清空之前的定时器，然后重新计时
        timer && clearTimeout(timer);
        if (flag && !timer) {
            // flag 为 true，第一次默认执行
            fn.apply(this, args);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    };
}
```
其中，`fn` 是需要进行防抖处理的事件处理函数，`time` 是等待时间，单位毫秒，`flag` 表示第一次是否执行。这个防抖函数返回了一个新的函数，当事件触发时，新函数会在等待时间内清除之前的计时器，并重新设置计时器，从而实现防抖效果。

## 二、节流

节流的原理是在一段时间内只执行一次事件处理函数，例如每隔100毫秒执行一次，而不管事件触发了多少次。

节流常用于处理一些频繁触发但不需要立即响应的事件，例如滚动事件、鼠标移动事件等。下面是一个简单的节流函数的示例代码：

```js
/**
 * @param {function} fn - 需要节流的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function throttle(fn, time, flag) {
    let timer;
    return function(...args) {
        // flag 控制第一次是否立即执行
        if (flag) {
            fn.apply(this, args);
            // 第一次执行完后，flag 变为 false；否则以后每次都会执行
            flag = false;
        }
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                // 每次执行完重置timer
                timer = null
            }, time);
        }
    };
}
```

其中，`fn` 是需要进行节流处理的事件处理函数，`time` 是执行间隔时间，单位毫秒，`flag` 表示第一次是否执行。这个节流函数返回了一个新的函数，当事件触发时，新函数会在等待时间内判断上一次是否执行过事件处理函数，如果没有，则执行事件处理函数，并重新设置计时器，从而实现节流效果。
