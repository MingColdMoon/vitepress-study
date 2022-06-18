## React

> 注意事项：
>
> 1.当为动态值得时候需要使用{}的方式
>
> 2.在标签中使用循环语句的时候需要使用map等返回语句
>
> 3.

### state属性

```javascript
class Preson extends React.Component{
    state = {'a':1}

	let { a } = this.state
    
    //渲染方法
    render(){
        return (
        	<ul>
            	<li>{a}<li>
            </ul>
        )
    }

	//自定义方法
	say = ()=>{
        this.setState({'b':2})
    }
}
ReactDOM.render(<Preson />, domcument.getElementById('test'))
```

### props属性

```javascript
class Preson extends React.Component{

	let { name } = this.props
    
    //渲染方法
    render(){
        return (
        	<ul>
            	<li>{name}<li>
            </ul>
        )
    }

	//自定义方法
	say = ()=>{
    }
}
//单个值
ReactDOM.render(<Preson name="xtgy" />, domcument.getElementById('test'))
//多个值传递
let p = {'name':'xtgy', 'age': 18}
//通过扩展运算符遍历出传递过来的值
ReactDOM.render(<Preson {...p} />, domcument.getElementById('test'))
```

#### 对传递过来的值进行规范化或者限制

```javascript
引入propTypes.js
static propTypes = {
    name:PropTypes.string.isRequired, //限制name必传，且为字符串
    age:PropTypes.number,
    sex:PropTypres.func
}
```

#### 对传递过来的值进行默认值修改

```javascript
引入propTypes.js
static defaultProps={
    sex:'难',
    age:18
}
```

### ref属性

#### 使用es6解构赋值

```javascript
const {a} = this.getNode 
const {a:{aVlue}} = this.getNode 	//取出getNode.value的值
const {a: rename} = this.getNode 	//给value重命名

//渲染方法
    render(){
        return (
        	<ul>
            	<li ref={c => this.getNode = c}>{name}<li>
            </ul>
        )
    }
```



#### 使用内联样式（但是react调佣的时候会触发两次赋值）

```javascript
class Preson extends React.Component{

	let { name } = this.props
	getNode = () => {
        console.log(123)
    }    

    //渲染方法
    render(){
        return (
        	<ul>
            	<li ref={c => this.getNode = c}>{name}<li>
            </ul>
        )
    }

	//自定义方法
	say = ()=>{
    }
}
```

解决方法

```javascript
 render(){
        return (
        	<ul>
            	<li ref={this.getNode}>{name}<li>
            </ul>
        )
    }
```

#### 使用React.createRef

```java
myRef = React.createRef()
click = ()=> {
    this.myRef.current.value
}
    
render(){
        return (
        	<ul>
            	<li onClick={this.click} ref={this.myRef}>{name}<li>
            </ul>
        )
    }
```

### 事件传递值，高阶函数，函数柯里化

```javascript
Change = (data)=>{
    return (event)=>{
        this.setState({[data]:event.target.value})
    }
}
render(){
    return (
        <input onChange={this.Change('username')} />
	)
}
```

简化

```javascript
Change = (data, event)=>{
     this.setState({[data]:event.target.value})
}
render(){
    return (
        <input onChange={ event => this.Change('username', event) } />
	)
}
```

### 卸载组件

```javascript
ReactDOM.unmountComponentAtNode(document.getElementById('test'))
```

### 生命周期

#### 挂载完毕

```javascript
componentDidMount(){}
```

#### 将要卸载

```javascript
componentWillUnmount(){}
```

#### 组件将要接受参数

```java
componentWillReceiveProps()
```

#### 是否执行更新

```javascript
shouldComponentUpdate
```

#### 在更新之前获取快照

```javascript
getSnapshotBeforeUpdate()
```



### 强制更新生命周期

```javascript
forceUpdate
```



### 子传父

```javascript
//子组件

this.props.method()

//父组件
methond(){}
< Childern method={this.method} />
```

### 代理配置

```javascript
//setupProxy.js
const proxy = require('http-proxy-middleware')
module.exports = function (app){
    app.use(
    	proxy('/api', {
            target:'http://localhost:5000',
            changeOrigin:true,
            pathRewrite:{'^/api':''}
        })
    )
}
```

### react-router-dom

```javascript
npm install --save react-router-dom

import {NavLink, BrowserRouter, Route, Link} from 'react-router-dom'

//navLink可以在改标签被点击后添加一个class类名
<NavLink activeClassName="demo" to="/xxx"></NavLink>
<Link to="/xxx">Demo</Link>
<Route path={/home} component={home} />

```

```javascript
//index.js
React.render(<BrowserRouter><App/></BrowserRouter>)
//React.render(<HashRouter><App/></HashRouter>)
```

#### 封装navLink

> 标签体中的文字也算是一个特殊的属性，所以可以通过react自带的children属性拿到

```javascript
<NavLink {...this.props}></NavLink>
<MyNavLink  children="我是标签体" />
```

#### switch

> 当路由条目为两个以上的时候，可以使用Switch进行路由包裹可以避免路由一直向下匹配

```javascript
<Switch>
    <Route component={test}>
    <Route component={test}>
</Switch>
```

#### 精准匹配

```javascript
<Route exact path={/home} component={home} />
```

#### 重定向

```javascript
<Redirect to="/">
```

#### 路由传参方法

1.params传参

> this.props.match.params   可查看传递过来的参数

```javascript
<Link to="/xxx/01/123" />
```

```javascript
<Route to="/xxx/:id/:title" component={test}>
```

2.search传参

> 引入自带解析的库
>
> import qs from querystring
>
> 解析urlencoded : qs.parse(this.props.location.search.slice(1))
>
> 编译成urlencoded: qs.strinify(xxx)
>
> 获取参数：this.props.location.search

```javascript
<Link to={`/xxx?id=${id}&title=${title}`} />
```

```javascript
<Route to="/xxx/" component={test}>
```

3.state传参

> 获取参数：this.props.location.state

```javascript
<Route to="/xxx/" component={test}>
```

```javascript
<Link to={{pathname:'/xxx', state:{id:123,title:123}}} />
```





### 解决多级路径刷新丢失样式的问题

```javascript
1.public/index.html 引入css样式的时候，采用/而不是./
2.				  使用%PUBLIC_URL%
3.使用HashRouter
```

