# vue-audition

## 基础使用

### 指令、插值

- v-html：有 xss 风险，且会覆盖原有的子组件

- computed: 有缓存，data 不变则不会重新计算
- watch:引用类型需要深度监听

```
info:{
	handler(oldVal,val){
		// 引用类型拿不到oldVal
	},
	deep:true
}
```

- v-if 和 v-show：
  - v-if:不显示的不渲染,不频繁的切换时使用
  - v-show:不显示的用 display:none，频繁切换时使用
- v-for:key 的重要性，最好写一个与业务相关的(v-for 和 v-if 不能同时使用!v-for 的优先级比 v-if 高)

### 事件：

```
@click="click('aa',$event)"
click(str,event){
	//event是一个原生的js对象
	//event.target 事件挂载在哪里
	//event.currentTarget 事件在哪里被触发的
}
```

### 事件修饰符：

- .stop：阻止冒泡（通俗讲就是阻止事件向上级 DOM 元素传递）
- .prevent：阻止默认事件的发生
- .capture：捕获冒泡，即有冒泡发生时，有该修饰符的 dom 元素会先执行，如果有多个，从外到内依次执行，然后再按自然顺序执行触发的事件。
- .self：将事件绑定到自身，只有自身才能触发，通常用于避免冒泡事件的影响
- .once：设置事件只能触发一次，比如按钮的点击等。

### 组件间通讯：

- props 和$emit：
  - $emit 的父子组件自定义事件：

```
    			// 子组件:
    		<template>
    		    <div>
    		        <span @click="giveMsg">点击</span>
    		    </div>
    		</template>
    		<script>
    		    export default {

    		        data() {
    		            return {
    		                // 定义一个数组
    		                postMsg:['Yes','No','Maybe']
    		            };
    		        },
    		        methods: {
    		           giveMsg(){
    		            //    通过Math.random()生成一个随机数，乘以当前数组postMsg的长度，然后通过Math.floor()向下四舍五入取整
    		               var r=Math.floor(Math.random()*this.postMsg.length);
    		            //    通过$emit自定义一个事件sendClick，取数组postMsg随机一个下标
    		               this.$emit('sendClick',this.postMsg[r]);
    		           }
    		        }
    		    };
    		</script>
    		// 父组件：
    		<template>
    		    <div>
    		        <!-- 把$emit自定义的事件名sendClick绑定到子组件上,给定一个方法showMsg -->
    		        <myB @sendClick='showMsg'></myB>
    		    </div>
    		</template>
    		<script>
    		    import myB from "./myB"; //导入子组件
    		    export default {
    		        //注册子组件
    		        components: {
    		            myB
    		        },
    		        data() {
    		            return {
    		            };
    		        },
    		        methods: {
    		        //    注：如果$emit传过来的事件有参数，在父组件中也必须有参数
    		           showMsg(a){
    		               alert(a)
    		           }
    		        }

    				</script>
```

### 组件生命周期：

- 父组件 beforeCreated-->父组件 created-->父组件 beforeMounted-->子组件 beforeCreated -->子组件 created-->子组件 beforeMounted-->子组件 mounted-->父组件 mounted

* 父 beforeUpdate->子 beforeUpdate->子 updated->父 updated
* 父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

### vue 高级特性：

#### 自定义 v-model:

```
<input type='text' :value='text1' @input="$emit('change', $event.target.value)">
  			model: {
  				prop: 'text1', // 对应props内的text
  				event: 'change'
  			},
  			props：{
  				text1: String
  			}
  			// 上面的input使用了：value而不是v-model
  			// 上面的change和model.event要对应起来
  			// text1属性要对应
```

#### $nextTick & ref：

- vue 是一个一部渲染的框架，data 改变之后，dom 不会立刻去渲染，$nextTick 会在 dom 渲染完成之后触发，以获取最新的 dom 节点

```
this.$nextTick(()=>{
  // 页面渲染完之后在做里面的事
  //  页面渲染时会将data的修改做整合，多  data修改只会渲染一次
  this.$refs.a // 获取 dom 节点
})
```

#### slot（插槽） 动态组件：

- is 必须是动态的 <compoment :is="compont-name"/> 根据数据，动态渲染组件

#### 异步组件：

- 组件比较大的时需要异步加载

1. import()函数，按需加载,什么时候用什么时候加载 在 `components:{ componentA: ()=>import('../../url') } `

#### keep-alive（缓存组件）：

- 频繁切换，不需要重复渲染。 在需要频繁切换的组件外使用<keep-alive></keep-alive>包裹 与 v-show 的区别 v-show 是通过 css 来控制，keep-alive 是在框架层来控制。

#### mixin：

- 多个组件有相同逻辑，抽离出来。 写一个公共 js 引入后

```js
import myMixin from '../../aaa';
export defalut{ mixns: ['myMixin'], data() {

}}
// 问题：1、变量来源不明确，不利于阅读。2、多 mixn 可能会造成命名冲突
// 3、mixin 可能与组件会出现多对多的关系，复杂都会变高
```

### vuex：

- state：驱动应用的数据源
  - getters：为组件提供经过处理的数据源，只读的过滤方法
  - actions：组件通过 actions 来提交
  - mutation，业务逻辑，不涉及页面 mutation：用来改变 state 的唯一标准方式 赋值 this.$store.commit('updateUserIn', data.userId)
  - modules：每个 module 都有自己的 state，getters，mutation，action 实现大型应用中业务模块数据的分治

## vue 原理
### 组件化(如何理解MVVM模型)
- 传统组件，只是静态渲染，还要依赖操作DOM
- 现在实现了数据驱动视图-MVVM
- model--》viewModel--》DOM
- vue通过Object.defineProperty和发布订阅者模式实现了数据驱动视图，get中通过dep收集依赖，然后在set中发布消息给watcher，watcher订阅了dep，收到消息后，更新视图
### 响应式

- vue2 通过 Object.defineProperty 改写数据的 get 与 set 实现对 对象 变化的监听
  - 缺点：深度监听，需要一次性递归到底，计算量大
  - 新增删除属性监听不到，要使用 Vue.set,Vue.delete
  - 无法原生监听数组，需要特殊处理

```js
Object.defineProperty(data, 'name', {
  get: function () {
    return name;
  },
  set: function (newVal) {
    name = newwVal;
  }
});
```

### 虚拟 dom

- vdom：用 js 模拟 dom 结构，计算出最小变更，操作 dom，数据驱动视图的模式下，有效控制 dom 操作
- vdom 参考 snabdom

### diff 算法

- vdom 的核型
- diff 算法能在日常使用中体现出来(key)
- 原始的 diff 算法时间复杂度为 O(n^3),优化后为 O(n):只比较同一层级，不跨级比较；tag 不同，则直接删掉重建，不再深度比较；tag 和 key，两者相同，则认为相同节点，不再深度比较

#### diff 算法总结：

1.  判断是否 sameVnode（就是看 key 和 tag 是否相同）
2.  是的话，patchVnode，进一步比较；否，直接替换成新的，没有比较的价值
3.  patchVnode: 1）只是文本不一样，修改文本 2）旧的有子节点，新的没有子节点，删除子节点 3）新的没有子节点，旧的有子节点，新增子节点 4）新的旧的都有子节点，且子节点不相同，updateChildren
4.  updateChildren:
    1.  新旧两组子节点，首尾置指针
    2.  比较，若相同，往另一头移动
        1. newStart oldStart，相同，移动
        2. newStart oldEnd，相同，oldEnd 移动到 newStart 前，移动
        3. newEnd oldEnd，相同，移动
        4. newEnd oldStart，相同，oldStart 移动到 newEnd 后，移动
        5. 都不同，比较 newStart 和 old 数组的 key，匹配，移动到 oldStart 6）都没找到，新建 newStart，放前面
    3.  新旧两列其中之一 start > end ,停止，将另一个剩余的部分添加或移除

### 模板编译

#### with 语法

- 改变{}内自由变量的查找规则，当作 obj 的属性查找，如果找不到对应的属性，则报错

#### 编译模板

- 模板不是 html，有指令，插值，js 表达式，判断，循环
- html 是标签语言，只有 js 才能实现，判断，循环（图灵完备的）
- 因此，模板一定是转换为某种 js 代码，即模板编译
- 模板编译为 render 函数，执行 render 函数返回 vnode
- 基于 vnode 再执行 patch 和 diff
- 使用 webpack vue-loader 会在开发环境下编译模板

### 组建渲染更新的过程

#### 初次渲染

1. 解析模板为 render 函数(或者在开发环境已经完成，vue-loader)
2. 触发响应式，监听 data，属性 getter 和 setter
3. 执行 render 函数，生成 v 弄的，patch(elem, vnode)

#### 更新过程

1. 修改 data，触发 setter(此前在 getter 中已被监听)
2. 重新执行 render 函数，生成 newVnode
3. patch(vnode, newVnode)

### 异步渲染

- 汇总 data 修改，一次性修改视图
- 减少操作 dom 次数，提高性能

## 前端路由

### hash

1. hash 会触发网页跳转，即浏览器前进后退
2. hash 不会刷新页面，SPA 必须的特点
3. hash 永远不会提交到 server 端

### history

1. 用 url 规范的路由，但跳转时不刷新页面
2. history.pushState window.onpopState

## vue 真题

### v-show 和 v-if 的区别

- v-show 通过 CSS 的 display 控制显示隐藏
- v-if 是组建真正的渲染和销毁，而不是显示和隐藏
- 当频繁切换时用 v-show 否则用 v-if

### 为何在 v-for 中使用 key

- 必须用 key，不能用 index 和 random
- diff 算法使用过 tag 和 key 来判断，是否是 sameNode
- 减少渲染次数，提升渲染性能

### 组件生命周期

- 父组件 beforeCreated-->父组件 created-->父组件 beforeMounted-->子组件 beforeCreated -->子组件 created-->子组件 beforeMounted-->子组件 mounted-->父组件 mounted

- 父 beforeUpdate->子 beforeUpdate->子 updated->父 updated
- 父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

### 组件件通讯

- 父子组件 props 和 this.$emit
- 兄弟组件 event.$on和envent.$emit
- vuex

### 双向数据绑定 v-model 实现原理

- input 元素的 value = this.name
- 绑定 input 事件，this.name = $event.target.value
- data 更新触发 re-render

### MVVM 的理解

### computed 的特点

- 缓存，data 不变不会重新计算
- 提高性能

### 组件的 data 为什么必须是一个函数

- 编译出来的组件是个 class，使用的时候 vue 会实例化若 data 是个对象，会导致 data 被共享

### ajax 应该放在哪里

- mounted：js 是单线程，ajax 异步获取数据；放在 mounted 之前没用，只会让逻辑更加混乱

### 如何将组件所有 props 传给所有的自组件

- $props
`vue
<User v-bind='$props'/> `

### 自己实现 v-models

- 见上面

### 多组件相同逻辑抽离

- mixin

### 何时使用异步组件

- 加载大组件
- 路由异步加载

### 何时使用 keep-alive

- 缓存组件，不需要重复渲染
- 如过个静态的 tab 页切换

### 何时使用 beforeDestory

- 解除自定义事件绑定 event.$off
- 清除定时器
- 清除自定义的 dom 事件，如 window.scroll

### 作用域插槽

### Vuex 中 action 和 mutation 的操作

- action 中处理异步，mutation 不可以
- mutation 做源自操作
- action 可以整合多个 mutation

### diff 算法过程

- patch

### vue 为何是异步渲染，$nextTick 何用

- 异步渲染，以提高渲染性能（合并 data 修改）
- $nextTick 在 dom 更新完之后，触发回调

### vue 性能优化

- 合理使用 v-show 和 v-if
- 合理使用 computed
- v-for 时加 key，避免和 v-if 同时使用
- 自定义事件，dom 事件要及时销毁
- 合理使用异步组件
- 合理使用 keep-alive
- data 层级不要太深
- 使用 vue-loader 在开发环境做模板编译(预编译)
- 图片懒加载
- 使用 SSR

## vue3

### vue3 比 vue2 有什么优势

1. 性能更好
2. 体积更小
3. 更好的 ts 支持
4. 更好的代码组织
5. 更好的逻辑抽离
6. 更多的新功能

### vue3 生命周期

#### options API

1. beforeDestory 改为 beforeUnmounted
2. destory 改为 unmounted
3. 其他沿用 vue2 生命周期

#### Composition API

#### Composition API

```
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue';
// 等于beforeCreate和create
setup() {
  console.log('setup');
  onBeforeMount(() => {
    console.log('onBeforeMount');
  });
  onMounted(() => {
    console.log('onMounted');
  });
  onBeforeUpdate(() => {
    console.log('onBeforeUpdate');
  });
  onUpdated(() => {
    console.log('onUpdated');
  });
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount');
  });
  onUnmounted(() => {
    console.log('onUnmounted');
  });
}
```

### Composition API 对比 Optios API

#### Composition API dailaileshenm

- 更好的代码组织
- 更好的逻辑复用
- 更好的类型推导

#### 如何选择

- 不建议共用，会引起混乱
- 小型项目、业务逻辑简单用 Options API
- 大型项目，逻辑复杂，用 Composition API

### ref，toRef 和 toRefs

#### ref

- 生成值类型的响应式数据
- 可以用于模板和 reactive
- 通过.value 修改值

#### toRef 与 torefs

- 针对一个响应式对象(reactive 封装)的 prop
- 创建一个 ref，具有响应式
- 两者保持引用关系

#### 最佳用法

- 用 reactive 做对象的响应式，用 ref 做值类型的响应式
- setup 中返回 torefs(state),或者 toRef(state, 'xxx')
- ref 命名使用 xxxRef 的方式
- 合成函数返回响应式对象时，使用 toRefs，有助于使用方对对象进行结构

#### 为什么要用 ref

- 返回值类型，会丢失响应式
- 在 setup，computed，合成函数，都有可能返回值类型
- Vue 如不定义 ref，用户将自造 ref，反而混乱

#### 为什么需要.value

- ref 是一个对象(不丢失响应式)，value 存储值
- 通过.value 属性的 get 和 set 实现响应式
- 用于模板，reactive，不需要.value，其他情况都需要

#### 为什么需要 toRef 和 toRefs

- 初衷：在不丢失响应式的情况下，把对象数据分解/扩散
- 前提：针对响应式对象(reactive),非普通对象
- 注意：不创造响应式，而是延续响应式

### vue3 升级了哪些功能

- createApp
- emits 属性
- 生命周期
- 多事件
- fragment（template 里面不再需要包裹）
- 移除.sync
- 异步组件的写法（defineAsyncComponent(()=>import('...'))）
- 移除 filter
- teleport
- Suspense
- Composition API

### Composition API 实现逻辑复用

- 抽离代码到一个函数
- 函数命名 useXxx 格式
- 在 setup 中引用 useXxxx

### vue3 如何实现响应式

- proxy

### watch 和 watchEffect 的区别

- 两者都可以监听 data 属性变化
- watch 需要明确监听的属性
- watchEffect 自动监听

### setup 中如何获取组件实例

- setup 和其他 Composition API 中没有 this
- 通过 getCurrentInstance 获取当前实例
- 若使用 Options API 可照常使用 this

### vue3 为什么比 vue2 快

- proxy 响应式
- patchFlag
- hoistStatic
- cacheHandler
- SSR 优化
- tree-shaking

#### patchFlag

- 编译模板是，动态节点做标记
- 标记，分为不同类型，如 TEXT， PROPS
- diff 算法时，可以区分静态节点，以及不同类型的动态节点

#### hoistStatic

- 将静态节点的定义，提升到付作用域，缓存起来
- 多个相邻静态节点，会被合并起来
- 拿空间换时间

### cacheHandler

- 缓存事件

### SSR 优化

- 静态节点直接输出，绕过了 vdom
- 动态节点还是动态渲染

### tree shaking

- 根据不同的情况引入不同的 API

### vite 为何启动很快

- 开发环境使用 ES6 Module，无需打包--非常快
- 生成环境使用 rollup，并不会快很多
