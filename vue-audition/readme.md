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

```
import myMixin from '../../aaa';
export defalut{ mixns: ['myMixin'], data() {

} }
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

### 响应式

- vue2 通过 Object.defineProperty 改写数据的 get 与 set 实现对 对象 变化的监听

```
Object.defineProperty(data, 'name', {
  get: function() {
    return name
  },
  set: function(newVal) {
    name = newwVal
  }
})
```
