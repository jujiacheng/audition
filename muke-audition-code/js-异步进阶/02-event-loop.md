# event loop

+js 是单线程，异步要基于回调来实现，event loop 就是异步回调的实现原理 +每一行代码执行完毕后，调用栈会被清空，等到所有同步代码被执行完毕，Event Loop 开始工作。Event Loop 轮询查找 Callback Queue，如果有则移动到 Call Stack 中执行，然后继续轮询查找（永动机一样）。

```js
console.log('Hi');

setTimeout(function cb1() {
  console.log('cb1'); // cb 即 callback
}, 5000);

console.log('Bye');
```

---

DOM 事件，也用 event loop

```html
<button id="btn1">提交</button>

<script>
  console.log('Hi');

  $('#btn1').click(function (e) {
    console.log('button clicked');
  });

  console.log('Bye');
</script>
```
