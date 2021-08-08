// this取什么值是在函数执行的时候确定的而不是在函数定义的时候确定的

function fn1() {
  console.log('fn1', this);
}
// 普通函数
fn1(); // window
// 使用call,apply,bind
fn1.call({ x: 100 }); // {x:100}
const fn2 = fn1.bind({ x: 200 });
fn2(); // {x:200}
// 作为对象方法被调用
const zhangsan = {
  name: 'zhangsan',
  sayHi() {
    // this即指当前对象
    console.log('zhangsansayHi', this);
  },
  wait() {
    setTimeout(function () {
      // this === window
      console.log('zhangsanwait', this);
    });
  },
  waitAgain() {
    setTimeout(() => {
      // this即当前对象，箭头函数的this永远是取他上级作用域的this
      console.log('zhangsanwaitAgain', this);
    });
  }
  // waitAgain: () => {
  //   // this即当前对象，箭头函数的this永远是取他上级作用域的this
  //   console.log('zhangsanwaitAgain11111111111', this);
  // }
};
// 在class中调用
class People {
  constructor(name) {
    this.name = name;
    this.age = 20;
  }
  sayHi() {
    console.log('People', this);
  }
}
const zhangsan1 = new People('zhangsan');
zhangsan1.sayHi(); // zhangsan对象
zhangsan.wait(); // zhangsan对象
zhangsan.waitAgain(); // zhangsan对象
