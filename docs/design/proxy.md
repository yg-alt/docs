# 代理模式

> 代理模式使为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本地对象。

## 一、代理和本体接口的一致性

当代理和本体接口保持一致时，在客户看来，代理对象和本体对象是一致的，代理接手请求的过程对于用户来说是透明的，用户并不清楚代理和本体的却别，这样做有两个好处：

- 用户可以放心地请求代理，他只关心是否能得到想要的结果
- 在任何使用本体的地方都可以替换成使用代理

## 二、虚拟代理

### 1. 图片预加载

在 Web 开发中，图片预加载是一种常用的技术，如果直接给某个 `img` 标签节点设置 `src` 属性，由于图片过大或网络不佳，图片的位置往往有段时间回事一片空白。

常见的做法是先用一张 `loading` 图片占位，接着用异步的方法加载图片，等图片加载好后再把它填充到 `img` 节点中。由于此时我们读取的是目标图片的缓存，因此从 `loading`图片切换到 `img`图片的速度会非常快。

```javascript
/** 本体对象，加载图片 */
const myImage = (function () {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)

  return {
    setSrc: function (src) {
      imgNode.src = src
    },
  }
})()

/** 代理对象，创建个 Image 对象来加载图片，等待图片加载完毕再将图片填充回 img 节点 */
const proxyImage = (function () {
  const img = new Image()

  img.onload = function () {
    myImage.setSrc(this.src)
  }

  return {
    setSrc: function (src) {
      myImage.setSrc('本地的loading图片')
      img.src = src
    },
  }
})()

// 使用虚拟代理预加载图片
proxyImage.setSrc('你要加载的图片')
```

## 三、缓存代理

缓存代理可以为一些开销较大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数与之前的一致，可以直接返回之前存储的运算结果。

### 1. 计算乘积

首先创建一个用于求乘积的函数：

```javascript
const mult = function () {
  console.log('开始计算乘积')
  let a = 1
  for (let i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}

mult(2, 3) // 输出：6
mult(2, 3, 4) // 输出： 24
```

接着加入缓存代理函数:

```javascript
const proxyMult = (function () {
  const cache = {}
  return function () {
    const args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = mult.apply(this, arguments))
  }
})()

proxyMult(1, 2, 3, 4) // 输出：24
proxyMult(1, 2, 3, 4) // 输出：24
```

## 四、其他代理模式

- **防火墙代理：** 控制网络资源的访问，保护主机不让“坏人”接近。
- **远程代理：** 为一个对象在不同的地址空间提供局部代表， 在 Java 中，远程代理可以时另一个虚拟机中的对象。
- **保护代理：** 用户对象应该有不同访问权限的情况。
- **智能引用代理：** 取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数。
- **写时复制代理：** 通常用于复制一个庞大对象的情况。写时复制代理延迟了复制的过程，当对象被真正修改时，才对它进行复制操作。写时复制代理时虚拟代理的一种变体， DLL （操作系统中的动态链接库）时其典型运用场景。
