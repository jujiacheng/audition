// 防抖：用户输入结束或暂停时，才会触发change事件--单位时间内只出发一次
const input1 = document.getElementById('input1');
// let timer = null;
// input1.addEventListener('keyup', function () {
//   // console.log(this);
//   if (timer) {
//     clearTimeout(timer);
//   }
//   timer = setTimeout(() => {
//     // 模拟触发change时间
//     console.log(input1.value);
//     // 清空定时器
//     timer = null;
//   }, 500);
// });

function debounce(fn, delay = 500) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

input1.addEventListener(
  'keyup',
  debounce(function (e) {
    console.log(e.target);
    console.log(input1.value);
  }, 600)
);
