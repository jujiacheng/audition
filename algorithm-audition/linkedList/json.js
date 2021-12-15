/**
 * @description 使用链表指针获取JSON的节点值
 */
const json = {
  a: {
    b: {
      c: 1
    }
  },
  d: {
    e: 2
  }
};

const path = ['a', 'b', 'c'];
let p = json;
path.forEach((item) => {
  p = p[item];
});
console.log(p);
