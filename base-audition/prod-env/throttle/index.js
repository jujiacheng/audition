// 单位时间内输入多次，但实际展示效果是，单位时间出发一次，排队执行
const div1 = document.getElementById('div1');

// let timer = null;
// div1.addEventListener('drag', function (e) {
//   if (timer) {
//     return;
//   }
//   timer = setTimeout(() => {
//     console.log(e.offsetX, e.offsetY);
//     timer = null;
//   }, 500);
// });
// 节流
function throttle(fn, delay = 100) {
  let timer = null;

  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

div1.addEventListener(
  'drag',
  throttle(function (e) {
    console.log(e.offsetX, e.offsetY);
  })
);

div1.addEventListener('drag', function (event) {});
