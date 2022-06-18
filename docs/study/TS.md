

### Typescript

#### 基本类型

> string number boolean undefind null symbol bigint

#### 复杂类型

##### 数组类型

```typescript
let xjj : string[] = ['xjj1', "xjj2"]
```

##### void类型

该类型没有返回值或者设置为空

```typescript
function a():void{return;}
```

##### never类型

该类型通常用于报出错误

```typescript
function a():nerve {throws new '报错了'}
```

##### tuple类型

固定的数组长度，比数组更高效

```typescript
let i : [string,number] = ["123",456]
```

##### enum类型

```typescript
enum Gendedr{
    man=0,
    wuman=1
}
```

##### unknow类型

> 类似于readonly，比any更安全，只读不可更改

##### 别名

```javascript
type myType = string;
let a : myType;
```

#### tsconfig配置文件

```typescript
{"include":[],	//配置需要编译的文件路径  例如:"./src/**/*"  **表示所有目录 *表示所有文件
"exclude":[],	//配置不需要编译的文件路径
"extends":"",	//继承某个文件
"files": []		//配置需要编译的单个文件
 "compilerOptions": {
        "target": "ES3",	//编译后的代码是什么标准
        "module": "",		//模块化的标准
        "outDir": "",		//编译后的文件放再哪里
      	"strict": true,		//启动严格模式
        "noEmitOnError": true,	//代码报错就不会编译文件
    }
}
```

#### 对象

##### 实体类

```typescript
class name{
     name : string;
    age : number;
     constructor(name:string, age:number) {
        this.name = name;
        this.age = age;
    }
     say(){
        console.log('我是' + this.name, '我今年' + this.age)
    }
}
```

##### 继承

```typescript
class Wife extends Person {
    constructor(name:string, age:number) {
        super(name, age);
    }
}
```

#### 抽象类

抽象类只能被继承，可以创建自身方法

```typescript
abstract class Name {
     name : string;
         constructor(name : string) {
             this.name = name;
         }
         abstract say():void;
     }
```

#### 接口

```typescript
interface Person {
    name : string;
    getName():void;
}
interface Person {
    age: number
}
class sun implements Person {
    name : string;
    constructor(name : string){
        this.name = name;
    }

    getName(){
        console.log(123)
    }
}

// 继承
interface Person extends Human
```

#### 类型

```typescript
type a = {
	name: string
}
// 合并类型
type b = {age: number} & a
```

#### 类型和接口区别

> 1. 类型被定义后可以赋值给其他类型，接口不行
> 2. 接口可以同名重复定义（会自动合并），类型不行
> 3. 类型必须先声明在export，接口直接export

#### set和get

```typescript
 class Person {
     constructor(private _name : string, private _age : number) {
        
     }
     get name(){
         return this._name;
     }
     set age(num : number){
         this._age = num;
     }
 }
```

````typescript

title: 111
collapse:open
icon:bug
color:235,77,75

~~~javascript
throw
````

### [] 下标获取类型

```typescript
type type1 = {
    name: string
}
type type2 = type1['name'] // string
--------------or---------
type type2 = type1['name' | 'age']
```

### typeof

> 检测一个对象/实体类的类型
>
> 可以和keyof一起用 Keyof typeof Person
>
> typeof a[number] 可以获取a每个的type，返回一个联合类型

### keyof

> 返回一个类型的键值对（返回多个时是联合类型）
>
> keyof 的一个典型用途是限制访问对象的 key 合法化，因为 any 做索引是不被接受的。
>
> 可以用在function a (name : keyof Person) {}，也可以直接配合类型去访问
>
> 注意：keyof检测索引类型时，key只会返回string | number

```tsx
type type1 = {
    name: string,
    age: number
}
type type2 = keyof type1 // 'name' | 'age'
----------or-------------
type type2 = type1['name']
type type3 = type1[keyof type1]
---------or ---------
interface type1 = {
    [key: string]: boolean
}
const fun: type1 =  true // false
const fun: type1 = '123' // true
const fun: type1 = 123 // true
```

结合[]使用

```tsx
type type1 = {
    name: string,
    age: number
}
type type2 = type1[keyof type1] // 'string' | 'number'
```

### in

> 遍历枚举类型

```typescript
// 这个类型可以将任何类型的键值转化成number类型
type TypeToNumber<T> = {  
    [key **in** keyof T]: number 
}
```

### 泛型

> 在普通类型、类、函数中定义和使用时，对无法确定的类型进行判断

```typescript
type typeName<T> = {
  name: T
}
type typeName2<T> = T
const type1 : typeName<number> = { name: 123 }
console.log('我是普通类型声明', type1)

class Dog<T> {
  public name : T
  constructor (name: T) {
    this.name = name
  }
}
const dog1 : Dog<typeName2<string>> = new Dog('xx')
```

#### 	限制类型

```typescript
function a<T> (num: T) {
    console.log(num)
}
a<number>(1)
```

#### 	使用keyof进行动态推测

```typescript
type type1<T> = {
    num: number,
    obj: (keyof T)[]
}
const fun: type1<{a: 'xxx', b: 'yyy'}> = {
    num: 1,
    obj: {
        a: 'xxx',
        b: 'yyy'
    }
}
```



### 类型推断

> 如果不声明变量类型，则ts会根据上下文自行推断
>
> 只有let 可以，const不行
>
> 如果定义时没有被赋值和声明类型，则为any

```typescript
let typeName = "string" // === let typeName: String = "string"
const typeName = "string" // === 不等价于 const typeName: String = "string"

let anyName; // === let anyName: any
anyName = 123
anyName = 'string'
```

### 类型断言

#### 	1.使用as进行断言

> 下列方法会被ts识别为3或者undefined，又因为greaterThan2为number类型不能被赋值为undefined，所以使用as进行强制类型确定

```typescript
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
====== 断言后
const greaterThan2: number = arrayNumber.find(num => num > 2) as number; // ok
```

场景2：当引用类或者对象后，想读取其中的属性但是却读取不到（类似store只能在compositionAPI使用）

```typescript
import store from './sotre'
(store as xxx).state.xxx
```



#### 	2.非空断言，在类型后使用！来断言

> 声明有空类型后，使用部分方法后空类型会报错，再该类型后使用！即可

```typescript
let testMehods: null | undefined | string
testMethods.toString() // tsc
===== 非空断言
testMethods!.toString()
```

#### 	3.确定赋值断言，声明类型后加入！

> 声明变量类型的时候，会出现还未赋值就使用，使用赋值断言可以防止报错

```typescript
let testName: string;
console.log(testName) // tsc
====== 使用赋值断言
let testName!:string
```

### 字面量类型

> 直接使用字面量去赋值给类型，不同于基本类型，字面量类型是基本类型的子集

```typescript
let strType: '123' = '123' // 自动赋值为123字符串类型
let strType2: string = '123'
strType = strType2 // false
strType2 = strType // true
```

## 构造签名

> 起因：在类中使用泛型T直接构造函数

```typescript
class ConstuctText<T> () {
    constructor (): T {
        return new T();
    }
}
```

> 会直接报错，因为T作为变量被引用

改进 --------------------------------

> 使用接口中带有new xxx() 来描述构造函数（构造签名）

### 构造函数类型

> - 包含一个或多个构造签名的对象类型被称为构造函数类型；
> - 构造函数类型可以使用构造函数类型字面量或包含构造签名的对象类型字面量来编写。

```typescript
interface People () {
    new People(x: string, y: number)
    x: string,
    y: number
}
```

> 这样写会报错，必须把接口中的属性和构造函数类型分开

```typescript
interface People () {
    name: string,
    age: number
}

interface ConstructFunType () {
    return new ()
}
```

最终----------

```typescript
// Point构造函数的属性
interface Point {
  x: number;
  y: number;
}

// PointConstructor构造函数类型
interface PointConstructor {
  new (x: number, y: number): Point;  // 构造签名
}

class Point2D implements Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function newPoint(
  pointConstructor: PointConstructor,
  x: number,
  y: number
): Point {
  return new pointConstructor(x, y);	// 构造从外部传入的类
}

const point: Point = newPoint(Point2D, 1, 2);
```

## 索引类型

> 当在使用声明的类型进行遍历的时候如果有新增的字段，但是类型中没有，就会报错，这个时候需要使用索引类型进行约束
>
> 注意：只能用string，number，string | number的类型
>
> 注意：keyof检测索引类型时，key只会返回string | number

```typescript
interface xx () {
    name: string,
    [key: string]: string
    ----or-------
    [key: string | number]: string | number
}
------------or---------------
interface type1 = {
    [key: string]: boolean
}
const fun: type1 =  true // false
const fun: type1 = '123' // true
const fun: type1 = 123 // true
```

### 索引访问类型

#### 使用keyof遍历类型后使用索引访问得到具体类型

```typescript
type type1 = {
    name: string,
    age: number
}
type type2 = type1[keyof type1] // string | age
--------- 例子：通过传入一个值来返回该值的类型-----------
type type1 = {
    xx: string
    xxx: number
}
function fun<T extends keyof type1> (t: T): type1[T] {
    return t ==='xx'? 'xx' as type1[T] : 666 as type1[T]
}
const a = fun('xx')
const a2 = fun('xxx')
```



> 使用typeof访问变量时可以加入[number]来确定是数组类型，从而得到一个对象类型

```typescript
type type1 = typeof test[number]
const test = [{
    name: '123',
    age: 123
}, {
    name: '123',
    age: 123
}]
```

## as const 类型断言

> 和as type as 类似，可以进行类型断言，as const省去了写类型常使用与数组对象，对其中的值添加readonly字段

```typescript
let obj = {
    name: 'xtgy',
    age: 12
} as const
// 等价于
let obj = {
    readonly name: string,
    readonly age: number
}
```

## 函数重载(TS重载只是签名重载，并不是函数重载)

```typescript
function add(a: number, b: number, cb: (res: number) => void): void
function add(a: number, b: number): Promise<number>
// 上面2个方法是为了兼容语法不会报错
function add(
  a: number,
  b: number,
  cb?: (res: number) => void
): Promise<number> | void {
  const res = a + b
  if (cb) {
    cb(res)
  } else {
    return Promise.resolve(res)
  }
}
// 下面两种方法都是有提示的
add(1, 2, (res) => console.log(res))
add(1, 2).then((res) => console.log(res))
    
```

## 条件类型运用(使用extends)

### 	条件类型

```typescript
type Type<T> = T extend string ? string : T
type Type2 = Type<string> // string
```

### extends和泛型搭配

> 当extends配搭泛型时，会把泛型的参数分布给判断条件（a判断一次,b判断一次），返回联合类型

```typescript
type type1<T> = T extends string ? 'x' : 'a'
type type2 = type1<'a' | 'b'>
```

> 如果不想被分布，则可以使用元祖类型将泛型包裹

```typescript
type type1<T> = [T] extends string ? 'x' : 'a'
type type2 = type1<'a' | 'b'>
```

### 	infer类型推断

> infer必须搭配条件类型使用，并且后面跟上泛型变量，**推断后返回的类型**交给泛型变量，下列例子中可以把U先当成any，等式成立后再来推断

```typescript
type Type<T> = T extend Array<infer U> ? U : T 
```

## 类型保护

> 作用：优化减少代码中出现的类型断言

### 	typeof

### 	instace of

### 	is

> `target is Element`是类型谓词。谓词为`parameterName is Type`这种形式，`parameterName`必须是来自于当前函数签名里的一个参数名，并且函数的返回值也必须为`boolean`类型。

```typescript
const onClick = (e: MouseEvent) => {
  const scrollLeft = (e.target as Element).scrollLeft
  const scrollTop = (e.target as Element).scrollTop
}
======= 优化后
// 我们可以不做任何事，单纯类型判断
function isElement(target: EventTarget): target is Element {
  return true
}
const onClick = (e: MouseEvent) => {
  // 这个时候 e.target 为 EventTarget
  if (isElement(e.target)) {
    // 这个时候 e.target 为 Element
     const scrollLeft = e.target.scrollLeft
     const scrollTop = e.target.scrollTop
  }
}
```

## 断言签名

> 假设现在有一个断言函数`assert`，当传入的值为真时不会有任何影响，传入假值则会抛出错误并提示给用户。

```typescript
function is<T>(value: any): value is T {
    return true
}
function compilerType (val: boolean): asserts val {
    if (!val) {
        throw Error('nono')
    }
}
let context: any
context = '123'
compilerType(is<string>(context))
// 后续使用context会有提示
```

## 全局类型定义和外部模块定义

### 	全局类型定义

```typescript
// .d.ts
interface Test {
    name: string
}
// 全局变量
declare const a: Test
// 注意，这里的声明是 var，使用 var 可以把变量挂载到 globalThis 这个全局对象上
declare var globalTest: Test
// 我们就可以使用类似 global.globalTest 的方法来使用变量了
```

### 	为window加入全局类型

```typescript
interface Window {
  example: string
}
```

### 	外部模块定义

```typescript
declare module xxx {
    export interface type {
        name: string
    }
    export type a ={
        age: number
    }
}
```

#### 	让ts识别css

```typescript
declare module '*.css'
```

### 	修改第三方库定义

```typescript
// vur-router.d.ts
export * from 'vue-router'
declare module "Router" {
    export interface RouterRaw {
        [key: string]: string
    }
}
```

## 模板字符串类型(v4.1+)

> 可以允许一个字符串类型中通过``引用另一个字符串类型

```typescript
// 基本使用
type type1 = '我是父亲'
type type2 = `我是儿子，我要引用父亲${type1}`
```

```typescript
// 拓展使用
type enumType = 'top' | 'left' | 'right'
type enumType2 = 'top' | 'left' | 'right'
function paramFun (params: `${enumType}-${enumType2}`) {}
paramFun('top-top') // OK
paramFun('top-bottom') // error
----------------配额infer使用
type Type1<T> = T extends `${infer P}.${infer U}` ? `${P}+${U}` : never
type type1 = Type1<'a.b'> // a+b
```

## 类型体操

### 	1. infer实战

#### 		1.1 当infer作为返回值时，如果为真返回的是联合类型（|）

```typescript
type a<T> = T extends (infer U)[]? U : T
type b = a<[1,2,3]>
```

#### 		1.2当infer作为返回值时，如果为真返回的是交叉类型（&）

```typescript
type a<T> = T extends {a: (x: infer U) => void, b: (x: infer U) => void} ? U : T
type c = a<{a: (x: 123) => void, b: (x: '123') => void}> // number & string 由于没有类型满足这个条件， 所以为never
```

### 	2. 模式匹配（类似于正则的匹配，匹配到则取值）

#### 		2.1 实现shift方法

```typescript
type a<T> = T extends [infer First, ...infer last] ? First : T
type b = a<[1,2,3]>
```

#### 		2.2 实现trim

```typescript
type a<T> = T extends `${' ' | '\n' | '\t'}${infer U}` ? a<U> : T
type b = a<'   123'>
```

### 解构赋值参数后进行别名和类型声明

> 别名写在参数后面，类型声明写在：后面和结构复制一样写法

```typescript
function fun({ a: 别名a, b: 别名b }: { a: number, b: string }) {
    return a,b
}
fun({ a: 123, b: '123' })
```



