## Vue3

## 新特性

1. teleport
2. 片段（每个vue文件可以用多个root标签）
3. setup
4. style scope
5. v-bind可以影响style
6. composistion API
7. 一些值的重写(emit, props)

## 1.1 teleport

```vue
```

## 1. 2 重写emits, v-model

### 1.2.1 emits名称简写

```vue 
//father.vue
<my-component @my-submit ></my-component>
// myCompnent.vue
@emit('mySubmit')
```

### 1.2.2 emit检验方法

```vue
vue.component('my-component', {
    emit: {
		 // 没有验证
        click: null,

        // 验证 foo 事件
        foo: ({ email, password }) => {
          if (email && password) {
            return true
          } else {
            console.warn('Invalid submit event payload!')
            return false
          }
        }
	},
	methods: {
		func() {
			this.$emit('foo', {email, password})
		}
	}
})
```

### 1.2.3 v-model的新特性

> v-model默认格式为v-model:modelValue="xxx"，子组件可以使用props接受和通过update:modalValue改变

```vue
// father.vue
<my-component v-modal="test"></my-component>
// myComponent.vue
prop: [{
   modalValue: string
}]
emits: ['update: modalValue']
this.$emit('update: modalValue')
```

> 绑定多个v-model

```vue
// father.vue
<my-component v-modal:test="test" v-model:test2="test2"></my-component>
// myComponent.vue
prop: [{
   test: string,
   test2: string
}]
emits: ['update: test', 'update: test2']
this.$emit('update: test')
this.$emit('update: test2')
```

> 处理v-model修饰符，当给定自定义修饰符后可以通过arg + Modifiers访问自定义修饰符
>
> v-model="test"  // props: ['modelModifiers']
>
> v-model:test="test" // props: ['testModifers']

```vue
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```

### setUp初始化

> 当返回一个对象时，模板可以直接调用
>
> 当返回一个渲染函数时，会替换当前模板
>
> 注：setUP前不能使用async

```vue
<template>
	<h1>
        {{ name }}
    </h1>
	<h2 @click="sayHello">
        
    </h2>
</template>

import {h} from 'vue' // 当setUp返回渲染函数时引用

setUp () {
	// 声明变量
	let name = 'xtgy'
	// 声明函数
	function sayHello () {
		console.log('您好啊')
	}
	
	// 返回声明的值给模板调用
	return {
		name,
		sayHello
	}
	// 返回渲染函数
	return () => h('h1', 'hello')
}
```

#### props和context

```typescript
props: [],
emits: ['xxx']
setUp(props, context) {
    // props接受父组件的参数，使用后需要加入props标识
    props.xx
    
    // context有slots,emit,attrs,expose   attrs和slots是动态的，建议使用解构emit和expose
    context.slots
    
    context.emit('xxx')
    
    context.attrs
    
    const testExpose = ():number => {
        return 1
    }
    expose({
        testExpose
    })
    
    return {
        xxx,
        testExpose
    }
}
```



### ref方法（引用实现）

> 通过ref方法来完成数据的响应式，将需要响应式的值交给ref，改变ref.value即可实现
>
> ref 定义基本类型的时候使用的是Object.defineProperty
>
> ref 定义引用类型的时候使用的是reactive(Proxy)

```vue
import {ref} from 'vue'
setUp () {
	let name = ref('xtgy')
	let obj = {
		a: 123
	}
	function changeName () {
		name.value = 'nonono'
		obj.value.a = 111
	}
}
}
```

### reactive 方法 

> 定义一个对象（数组）类型的响应式数据
>
> 可以递归深层次的数据
>
> reactive内部使用的是Proxy对象进行实例化
>
> 注：使用reactive方法解构赋值出来的不是响应式

```vue
setUp () {
	let obj = reactive({
		name: 'xtgy'
	})
	obj.name = 'xxxx'
}
```

### Proxy对象

> 通过new Proxy(obj, {})来将obj（源对象）实例化成一个代理对象
>
> |           第二个参数配置项            |
> | :-----------------------------------: |
> |         get(propName, value)          |
> |     set(target, propName, value)      |
> | deletePropty(target, propName, value) |

### Reflect对象

> 将Object中的常用方法移植到Reflect中，并且重复使用不会报错
>
> |                        API                         |
> | :------------------------------------------------: |
> |             Reflect.get(target, prop)              |
> |          Reflect.ets(target, prop, value)          |
> |        Reflect.deleteProperty(target, prop)        |
> | Reflect.defineProperty \|\| 同Object.defineProerty |
>
> V3将reactive后面的对象转换成Proxy对象，通过Reflect修改值

### computed

> 使用前需要引入
>
> import {computed} from 'vue'

```typescript
// 使用computed传参

<div style="color: #fff;">
   {{ testNum(123) }}
</div>
const testNum = computed({
    get() {
        return function(params: number) {
            return 1 + params
        }
    },
    set() {
        console.log('我是computed')
    }
})

-------------------or------------
<div style="color: #fff;">
   {{ testNum }}
</div>
const testNum = computed(() => 123)
```

### watch

> 使用前需引入
>
> import {watch} from 'vue'
>
> 如果被监听的是对象，仍然需要 `deep` 选项设置为 true。
>
> 当监听的是对象或者数组并需要使用上一次的值，则建议使用深拷贝

#### 写法

```typescript
const num = ref(0)
const watchNum = watch(num, (newValue, oldValue)=> {} , { immediate: true })

------------------or-------------
const num = reactive({
    name: 'xtgy'
})
const watchNum = watch(num, (() => num.name, oldValue)=> {} , { immediate: true })    
```

```typescript
// 监听对象并需要使用上一次的值
import _ from 'lodash'

const state = reactive({
  id: 1,
  attributes: {
    name: '',
  }
})

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(state.attributes.name, prevState.attributes.name)
  }
)

state.attributes.name = 'Alex' // 日志: "Alex" ""
```

### 全局方法

在main文件下使用app.use来调用全局注册方法后使用config.globalProperties

```typescript
// main.ts
import type { App, app } from 'vue'
import registerFun from './registerFun'
const app = createApp(App)
app.use(registerFun)
```

```typescript
// registerFun.ts
import type { App } from 'vue'
export default function (app: APP) {
    app.use(fun)
    app.config.globalProperties.$fun = fun2
} 
```

### 熟练使用slot

#### 具名插槽

```vue
// 父组件
<div>
    <slot name="test" :row="scope.row"></slot>
</div>
```

```vue
// 子组件
<slot-div>
	<template #test="scope"> // #test = v-slot:test  scope为插槽传过来的值
    
    </template>
</slot-div>
```

#### 动态插槽

```vue
// 子组件
<slot :name="data"></slot>
```

```vue
// 父组件
<children #[item.slotName]="scope"></children>
```



### 使用props进行双向绑定的坑

> 当子组件直接使用props进行ref或者reactive绑定数据时，父组件如果要进行修改必须使用key = value，不能直接赋值，否则子组件无法变化

```vue
// 父组件
<children :data="data"></children>
setUp() {
	const data = ref({
		name: '123'
	})
	data.name = '456'
	return {
		data
	}
}
```

```vue
// 子组件
setUp(props, {emit}) {
	const newData = ref({ ...props.data })
}
```

## ·····························项目级别

## project-1.1 axios的封装请求类型

```typescript
import { AxiosRequestConfig } from 'axios';
/**
 * 自定义扩展axios模块
 * @author Maybe
 */
declare module 'axios' {
    export interface AxiosInstance {
        <T = any>(config: AxiosRequestConfig): Promise<T>;
        request<T = any>(config: AxiosRequestConfig): Promise<T>;
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    }
}
```

## 函数式组件

> 使用defineComponent定义一个组件，可传入options，options为组件的基本配置，如setup，onmouted。传入后通过h方法将组件渲染为vnode，如 `return () => h(string | component)`，可传入一个标签名或者一个组件类型。第二个参数可传入为 `ref`，`onVnodeMounted`，`onVnodeUpdated`， `onVnodeUnmounted`，第三个参数为子组件的渲染条件 `[h('div')]` 或者直接渲染一个文本节点`h('div', 1111)

```vue
/* eslint-disable vue/one-component-per-file */
import type { Component } from 'vue'
import { h } from 'vue'
export function createDiv<T extends Component>(component?: T) {
  const compA = defineComponent({
    setup(prop, ctx) {
      const el = ref<HTMLElement>()
      return () => h('div', { ref: el }, [ctx.slots.default ? h(ctx.slots.default) : null])
    },
  })

  const compB = defineComponent({
    setup() {
      return () => h('div', [component ? h(component) : '我是函数式组件B'])
    },
  })

  return {
    compA,
    compB,
  }
}
```
