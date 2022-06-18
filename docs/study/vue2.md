## Vue2源码解析

### 通过mergeOptions来合并配置

### init初始化

#### 在非生产环境下initProxy

> 初始化vm为proxy对象

#### initLifeCycle

> 初始化关系树，如$parent，$children等等

#### initEvents

> 初始化自定义事件，如<com@click></com@click>，如果是子组件则将事件监听给自己

#### initRender

> 解析插槽信息，将插槽付给vm.$slot，得到createElement方法，即h函数

#### 调用beforeCreate钩子函数

#### initInjections

> 初始化inject配置项，使用递归去找祖代中key: {
>
> ​	providesKey: {
>
> ​		from: xxx,
>
> ​		default: xxx	
>
> ​	}
>
> }
>
> 跟自身provided所对应的key值，如果有则返回result[providedKey] = value 格式，反之则返回default值

#### initState

> 初始化响应式数据，data，props，watch，method

#### initProvide

> 如果祖代组件有provided，则挂载到自身



## 响应式原理

1. vue执行到initState方法后判断options是否有data，如果有则进行initData方法传入当前组件实例，如果没有则直接observer当前组件实例
2. initData方法中，如果当前组件实例的data为函数则执行getData，更新自身data后执行observe（data，true）方法
3. observer方法中将接受的data实例化成Observer，给data加入_ob_属性后执行walk（data）方法传入，walk方法执行defineReactive（obj，key[i]）将data对象中的每一项进行Object.defineProperty，get方法设置为当有Dep.target时dep.target.addDep(this)，set方法设置为通知dep.notify()执行订阅者的update方法

