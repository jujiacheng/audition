/**
 * 深拷贝
 */

const obj1 = {
  name: 'zhangsan',
  age: 20,
  address: {
    city: 'beijing'
  },
  arr: ['a', 'b', 'c']
};

const obj2 = deepClone(obj1);
obj2.address.city = 'shanghai';
console.log(obj1.address.city);

/**
 *
 * @param {object} obj
 */
function deepClone(obj = {}) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }
  for (let key in obj) {
    // 保证key 不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 递归
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
