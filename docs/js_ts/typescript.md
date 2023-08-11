# TypeScript 使用指南

## 基本类型

```typescript
const num: number = 1
const bool: boolean = false
const string: string = '111'
const nullObj: null = null
const u: undefined = undifined
const anyValue: any = any

// 联合类型
let myFavoriteNumber: string | number
myFavoriteNumber = 'seven'
myFavoriteNumber = 7

let arr: string[] = ['ss', 'a']
arr.push('aaa')
```

## 函数

```typescript
// 函数定义
function test(): void {
  console.log(111)
}

function test1(name: string, age: number): string {
  return `My name is ${name}, I'm ${age} years old;`
}

const test3 = (name: string): string => {
  return `My name is ${name}`
}

// 用 interface 定义函数
interface Func {
  (foo: string): string
}

// 用别名定义函数
type Func = (foo: string) => string

// 在函数逻辑中注入可选参数默认值
function foo1(name: string, age?: number): number {
  const inputAge = age || 18 // 或使用 age ?? 18
  return name.length + inputAge
}

// 函数重载
interface Overloaded {
  (foo: string): string
  (foo: number): number
}

// 直接为可选参数声明默认值
function foo2(name: string, age: number = 18): number {
  const inputAge = age
  return name.length + inputAge
}

function stringOrNumber(foo: number): number
function stringOrNumber(foo: string): string
function stringOrNumber(foo: any): any {
  if (typeof foo === 'number') {
    return foo * foo
  } else if (typeof foo === 'string') {
    return `hello ${foo}`
  }
}
const overloaded: Overloaded = stringOrNumber

// 使用
const str = overloaded('') // str 被推断为 'string'
const num = overloaded(123) // num 被推断为 'number'
```

## 数组

```typescript
/* [类型 + 方括号] 表示 */
type IArr1 = number[]
/* 泛型表示 */
type IArr2 = Array<string | number | Record<string, number>>
/* 元组表示 */
type Iarr3 = [number, number, string, string]
/* 接口表示 */
interface Iarr4 {
  [key: number]: any
}

const arr1: IArr1 = [1, 2, 3, 4, 5, 6]
const arr2: IArr2 = [1, 2, '3', '4', { a: 1 }]
const arr3: IArr3 = [1, 2, '3', '4']
const arr4: IArr4 = ['string', () => null, {}, []]
```

## 接口

```typescript
// 接口定义类
interface Person {
  name: string
  age?: number
  readonly id: number
  [propName: string]: string | number // 当任意属性的类型为 string 时，确定属性和可选属性必须是它的子类型
}

const tom: Person = {
  name: 'Tom',
  age: 18,
  id: 1,
  test: 214,
  test2: '24151',
}

// 接口定义函数
interface FuncDefine {
  (source: string, subString: string): boolean
}

let mySearch: FuncDefine
mySearch = function (source: string, subString: string) {
  return source.search(subString) !== -1
}

// 接口定义数组
interface NumberArray {
  [index: number]: number
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5]
```

## 别名

```typescript
type Foo = {
  readonly bar: number
  readonly bas: number
}

// 初始化
const foo: Foo = { bar: 123, bas: 456 }

// 不能被改变
foo.bar = 456 // Error: foo.bar 为仅读属性

type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}
```

## 断言

1. 当 S 类型是 T 类型的子集，或者 T 类型是 S 类型的子集时，S 能被成功断言成 T
2. 断言的用途在于还不确定类型的时候就访问其中一个类型特有的属性或方法

```typescript
interface Cat {
  name: string
  run(): void
}
interface Fish {
  name: string
  swim(): void
}

function isFish(animal: Cat | Fish) {
  // 将 animal 断言为 Fish
  if (typeof (animal as Fish).swim === 'function') {
    return true
  }
  return false
}

function handler(event: Event) {
  const mouseEvent = event as MouseEvent
}
```

## 枚举

枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

console.log(Days['Sun'] === 0) // true
console.log(Days['Mon'] === 1) // true
console.log(Days['Tue'] === 2) // true
console.log(Days['Sat'] === 6) // true

console.log(Days[0] === 'Sun') // true
console.log(Days[1] === 'Mon') // true
console.log(Days[2] === 'Tue') // true
console.log(Days[6] === 'Sat') // true
```

手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 1

```typescript
enum Days {
  Sun = 7,
  Mon = 1.5,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

console.log(Days['Sun'] === 7) // true
console.log(Days['Mon'] === 1.5) // true
console.log(Days['Tue'] === 2.5) // true
console.log(Days['Sat'] === 6.5) // true
```

## 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

- 基本用法

```typescript
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray<string>(3, 'x') // ['x', 'x', 'x']
```

- 多个泛型参数

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]]
}

swap([7, 'seven']) // ['seven', 7]
```

- 泛型接口

```typescript
interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>
}

let createArray: CreateArrayFunc<any>
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}

createArray(3, 'x') // ['x', 'x', 'x']
```

- 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
  return x + y
}
```

- 泛型约束

```typescript
/* 对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量 */
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

/* 多个类型参数之间也可以互相约束 */
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id]
  }
  return target
}

let x = { a: 1, b: 2, c: 3, d: 4 }

copyFields(x, { b: 10, d: 20 })
```

- 泛型参数默认类型

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
  let result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}
```

## 高级类型

### keyof （索引类型查询）

`keyof` 后面接对象，会得到该对象的所有键的联合类型。例如

```typescript
interface Foo {
  age: 1
  599: 2
}

type FooKeys = keyof Foo // "age" | 599

interface Foo1 {
  propA: number
  propB: boolean
  propC: string
}

type PropTypeUnion = Foo1[keyof Foo1] // string | number | boolean
```

### in (映射类型)

关键字 `in` 表示映射类型，能够将联合类型中的每一个元素都映射出来

```typescript
type Stringify<T> = {
  [K in keyof T]: string
}

interface Foo {
  prop1: string
  prop2: number
  prop3: boolean
  prop4: () => void
}

type StringifiedFoo = Stringify<Foo>

// 等价于
interface StringifiedFoo {
  prop1: string
  prop2: string
  prop3: string
  prop4: string
}
```

### Partial（可选）

Partial 可以将对象的所有属性映射为可选，实现原理如下：

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

使用方法如下：

```typescript
interface Foo {
  prop1: string
  prop2: string
  prop3: string
}

type PartialFoo = Partial<Foo>
/**
  PartialFoo {
    prop1?: string
    prop2?: string
    prop3?: string
  }
 */
```

### Required（必填）

Required 可以将对象的所有属性置为必填，实现原理如下：

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

使用方法如下：

```typescript
interface Foo {
  prop1: string
  prop2?: string
  prop3?: string
}

type RequiredFoo = Required<Foo>
/**
  RequiredFoo {
    prop1: string
    prop2: string
    prop3: string
  }
 */
```

### Readonly（只读）

Readonly 可以将对象的所有属性置为只读，实现原理如下：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

使用方法如下：

```typescript
interface Foo {
  prop1: string
  prop2: string
  prop3: string
}

type ReadonlyFoo = Readonly<Foo>
/**
  ReadonlyFoo {
    readonly prop1: string
    readonly prop2: string
    readonly prop3: string
  }
 */
```

### Pick（提取属性）

Pick 可以提取对象的一部分属性，组成新的对象，实现原理如下：

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

使用方法如下：

```typescript
interface Foo {
  prop1: string
  prop2: string
  prop3: string
}

type PickFoo = Pick<Foo, 'prop1' | 'prop2'>
/**
  PickFoo {
    prop1: string
    prop2: string
  }
 */
```

### Exclude（不包含）

Exclude 意思是不包含，`Exclude<T, U>` 会返回 联合类型 **T** 中不包含 联合类型 **U** 的部分。实现原理如下：

```typescript
type Exclude<T, U> = T extends U ? never : T
```

使用方法如下：

```typescript
type Test = Exclude<'a' | 'b' | 'c', 'a'>
// 'b' | 'c'
```

### Extract（交集）

Extract 是取交集，能提取联合类型 **T** 和联合类型 **U** 的所有交集。实现原理如下：

```typescript
type Exclude<T, U> = T extends U ? T : never
```

使用方法如下：

```typescript
type Test = Exclude<'a' | 'b' | 'c', 'a' | 'c' | 'd'>
// 'a' | 'c'
```

### Omit（差集）

Omit 表示差集， `Omit<T, U>` 从类型 **T** 中剔除 **U** 中的所有属性。实现原理如下：

```typescript
/** 实现一 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

/** 实现二 */
type Omit2<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}
```

使用方法如下：

```typescript
interface Foo {
  name: string
  age: number
}

type OmitFoo = Omit<Foo, 'age'>
/**
 OmitFoo {
    name: string
 }
 */
```

### NonNullable（过滤非空）

`NonNullable<T>` 用来过滤类型中的 null 及 undefined 类型。实现原理如下：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T
```

使用方法如下：

```typescript
type T0 = NonNullable<string | number | undefined> // string | number
type T1 = NonNullable<string[] | null | undefined> // string[]
```

### Parameters（获取函数参数）

Parameters 获取函数的参数类型，将每个参数类型放在一个元组中。实现原理如下：

```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
```

使用方法如下：

```typescript
type T1 = Parameters<() => string> // []

type T2 = Parameters<(arg: string) => void> // [string]

type T3 = Parameters<(arg1: string, arg2: number) => void> // [arg1: string, arg2: number]
```

### ReturnType（获取函数返回值）

ReturnType 获取函数的返回值类型。实现原理如下：

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

使用方法如下：

```typescript
type T0 = ReturnType<() => string> // string

type T1 = ReturnType<(s: string) => void> // void
```
