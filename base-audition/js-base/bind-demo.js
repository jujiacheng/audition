// 手写bind函数

// function fn1(a, b) {
//   console.log('this', this);
//   console.log(a, b);
//   return 'this is fn1';
// }
// const fn2 = fn1.bind({ x: 100 }, 10, 20, 30);
// const res = fn2();
// console.log(res);

Function.prototype.bind1 = function () {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments);

  // 获取this(数组第一项)
  const t = args.shift();
  // fn1.bind中的fn1
  const self = this;
  return function () {
    return self.apply(t, args);
  };
};

function fn1(a, b) {
  console.log('this', this);
  console.log(a, b);
  return 'this is fn1';
}
const fn2 = fn1.bind1({ x: 100 }, 10, 20, 30);
const res = fn2();
console.log(res);
