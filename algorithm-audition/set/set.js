/**
 * @description es6的set操作符
 */

let mySet = new Set();
mySet.add(1);

// 只会有一个5
mySet.add(5);
mySet.add(5);

mySet.add('some text');
// 两个对象都可以被添加进去
const o = { a: 1, b: 2 };
mySet.add(o);
mySet.add({ a: 1, b: 2 });

// 为false
const has = mySet.has({ a: 1, b: 2 });
// 为true
const has1 = mySet.has(o);

mySet.delete(5);
mySet.size;

// 遍历,可遍历keys{},values或entries()
for (let item of mySet) {
  console.log(item);
}

const arr = [...mySet];
const arr1 = Array.from(mySet);

const mySet2 = new Set([1, 2, 3, 4]);

// 交集
const intersection = new Set([...mySet].filter((x) => mySet2.has(x)));

//差集
const difference = new Set([...mySet].filter((x) => !mySet2.has(x)));
