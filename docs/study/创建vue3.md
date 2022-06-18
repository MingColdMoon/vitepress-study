### 1.创建vue3

```vue
pnpm create vite <project-name>
```

### 2.vue-route

```vue
pnpm add vue-router@4
```

#### 	2.1创建路由映射

```vue
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'base',
    component: () => import('views/Index.vue'),
    children: [
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login/Index.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

// 导航守卫
router.beforeEach((to) => {
})

export default router
```



### 3.pinia

```vue
pnpm add pinia
```

#### 	3.1全局引入pinia

```vue
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)
```

#### 	3.2 在根目录文件夹下定义pinia入口文件

```vue
// store/Index.ts
import { defineStore } from 'pinia'
```

#### 	3.3定义一个store

```vue
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: 'xtgy'
    }
  },
  actions: {
    changeUserName() {
      this.userName = 'xt'
    }
  }
})
```

#### 	3.4使用store

```vue
import { useUserStore } from './sotre/index'
const userData = useUserStore()
```

#### 	3.5将导出的store转为响应式

```vue
import { useUserStore } from './sotre/index'
import { storeToRefs } from 'pinia';
const userData = useUserStore()
const { userName } = storeToRefs(userData)
```

#### 	3.6清除store到默认值（$reset）

```vue
import { useUserStore } from 'store/Index'
const userData = useUserStore()
userData.$reset()
```

#### 	3.7修改store(store.$state)

```vue
userData.$state = { userName: 123 }
```

#### 	3.7使用$patch改变多个state

```vue
userData.$patch(state=>{
  state.todos.push({
    name:"yichuan",
    age:18
  })
  state.isTrue = true
})
```

#### 	3.8监听state变化

```vue
userData.$subscribe((mutation,state)=>{
  mutation.counter
  mutation.name
  mutation.isAdmin
  localStorage.setItem("numer",JSON.stringify(state))
})
```

##### 		3.8.1默认情况下，状态订阅被绑定到添加它们的组件上(如果存储在组件的setup()中)。这就以为着当组件被卸载的时候，将自动移除。如果你想再组件被移除后继续保持它们，可以通过设置`{detached:true}`作为第二个参数来从当前组件中分离状态订阅

```vue
userData.$subscribe(callback, { detached: true })
```

#### 	3.9 getters使用

##### 		3.9.1直接使用getters

```vue
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: 'xtgy'
    }
  },
  getters: {
	returnUser (state) {
		return state.userName = '111'
	}
  }
})
```

##### 		3.9.2通常情况下一个state只能有一个getters，但是可以通过store的实例引入更多getters

> 注意：使用此方法需要用到this，并且要表明返回类型

```vue
returnUser (state) {
	return state.userName = '111'
},
returnMore ():string {
	return this.userName = '666'
}
```

##### 		3.9.3 一个getters中引入其他getters

```vue
returnUser (state) {
	return state.userName = '111'
},
returnMore ():string {
	return this.returnUser()
}
```

##### 		3.9.4 给getters传入参数

```vue
returnUser (state) {
	return (argu) => state.userName = '111'
},

// 页面调用
const {returnUser} = userData
returnUser(1)
```

##### 		3.9.5 当前getters引入其他页面中的getters

```vu
import { usexxx } from './store/xx'
returnUser (state) {
	const useOtherData = usexxx()
	return useOtherData.state + state.userName
},
```

### 4.element-plus

```vue
pnpm install element-plus
```

#### 	4.1自动引入组件

```vue
pnpm install -D unplugin-vue-components unplugin-auto-import
```

#### 	4.2vite设置自动引入

```vue
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ]
})

```



### 5..editorconfig

```vue
# http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false

```

### 6..eslintrc.js

```vue
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
```

### 7..prettierignore

```vue
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

### 8..prettierrc

```vue
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false
}
```

### 9.tsconfig.json

#### 	9.1使用vite声明别名后如果在ts中使用，需要在tsconfig.json中配置

```vue
"paths":{
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
},
```

### 10.slot和template

#### 	10.1	使用slot时外层只能嵌套一个template

#### 	10.2	可以在template v-for 里面加入具名插槽

```vue
<template v-for="item in arr" :key="item" #[item.slotName]="scope">

</template>
```

#### 	10.3	在slot便签上直接传入属性可以在模板中使用scope接受

```vue
// faker.vue
<chidren>
	<template scope="scope">
    	{{ scope.row.value }}
    </template>
</chidren>

// chidren.vue
<el-table>
    <slot :row="text"></slot>
    ---------------or----------
    <template #default="scope">
    	<slot :row="scope"></slot>
    </template>
</el-table>
```

### 11.配置对象中可选属性被遍历导致报错

##### 	11.1使用

```vue
interface type {
	[xx: string]: string
}
```

## 4. 多语言i18n

```typescript
pnpm i vue-i18n
```

```typescript
// main.ts
import { createI18n } from 'vue-i18n'
const aaaaaa = createI18n({
  globalInjection: true,
  datetimeFormats: {
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'ja-JP': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }
    }
  }
})
console.log('11111', aaaaaa)
app.use(aaaaaa)
```

```vue
{{ $d(new Date(), 'long', 'ja-JP') }}
```

