# 组合模式

> 组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，是的用户对单个对象和组合对象的使用具有一致性。

## 一、组合模式特点：

- 表示属性结构。组合模式可以非常方便地描述对象部分-整体层次结构。
- 利用对象多态性统一对待组合对象和单个对象。在组合模式中，客户将统一地使用组合结构中的所有对象，而无需关心它究竟是组合对象还是单个对象。

## 二、注意的事项

1. **组合模式不是父子关系。**

组合模式是一种 **HAS-A**（聚合）的关系，而不是 **IS-A**。组合对象包括一组叶对象，但叶对象不是组合对象的子类。组合对象把请求委托给它包含的所有叶对象，它们能够合作的关键是拥有相同的接口。

2. **对叶对象操作的一致性。**

组合模式除了要求组合对象和叶对象拥有相同的接口之外，还有一个必要条件，就是对一组叶对象的操作必须具有一致性。

3. **用职责链模式提高组合模式性能。**

在合租模式中，如果树的结构比较复杂，节点数量很多，在遍历树的过程中，性能方面也许表现得不够理想。有时候我们确实可以借助一些技巧，在实际操作中避免遍历整棵树，有一种线程得方案是借助 `职责链模式`。`职责链模式`一般需要我们手动去设置链条，但在组合模式中，父对象和子对象之间实际上形成了天然得职责链。让请求顺着链条从父对象往子对象传递，或者是反过来从子对象往父对象传递，直到遇到可以处理该请求得对象为止，这也是`职责链模式`得经典运用场景之一。

## 三、何时使用组合模式

组合模式适用于以下这两种情况：

1. **表示对象的部分-整体层次接口。**
2. **客户希望统一对待树中的所有对象。**

## 四、例子

### 1. 扫描文件夹

文件夹和文件之间的关系，非常适合用组合模式来描述。文件夹里既可以包含文件，又可以包含其他文件夹，最终可能组合成一棵树。

```javascript
const Folder = function(name) {
  this.name = name
  this.files = []
}

Folder.prototype.add = function(file) {
  this.files.push(file)
}

Folder.prototype.scan = function() {
  console.log('开始扫描文件夹：' + this.name)
  for( let i = 0, file, files = this.files; file = files[i++];) {
    file.scan()
  }
}

```

```javascript
const File = function(name) {
  this.name = name
}

File.prototype.add = function() {
  throw new Error('文件下面不能再添加文件')
}

File.prototype.scan = function() {
  console.log('开始扫描文件：' + this.name)
}
```

```javascript
const folder = new Folder('学习资料')
const folder1 = new Folder('JavaScript')
const folder2 = new Folder('jQuery')

const file1 = new File('JavaScript 设计模式与开发实践')
const file2 = new File('精通 jQuery')
const file3 = new File('重构与模式')

folder1.add(file1)
folder2.add(file2)

folder.add(folder1)
folder.add(folder2)
folder.add(file3)

const folder3 = new Folder('Nodejs')
const file4 = new File('深入浅出 Node.js')
folder3.add(file4)

const file5 = new File('JavaScript 语言精粹与编程实践')
folder.add(folder3)
folder.add(file5)


folder.scan()
```