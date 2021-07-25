// 异步--不会阻塞代码的执行
console.log(100);
setTimeout(() => {
  console.log(200);
}, 1000);
console.log(300);

// 同步--会阻塞代码执行

console.log(100);
alert(200);
console.log(300);
