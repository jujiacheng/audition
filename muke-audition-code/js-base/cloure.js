/**
 * 闭包
 * 自由变量：未被定义就使用的变量，函数回想上查找，一直到找到为止，否则报错
 * 自由变量的查找是在函数定义的地方向上级作用域查找，而不是在执行的地方
 * */

// 函数作为返回值
function create() {
  const a = 100;
  return function () {
    console.log(a);
  };
}

const fn = create();
const a = 200;
fn(); // 100

// 函数作为参数被传递
function print(fn) {
  const b = 2;
  fn();
}
const b = 1;
function fn1() {
  console.log(b);
}
print(fn1);
