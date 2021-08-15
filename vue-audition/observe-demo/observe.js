// 触发视图更新
function updateView() {
  console.log('视图更新');
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向 oldArrayProperty，再拓展新方法，不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach((methodName) => {
  arrProto[methodName] = function () {
    updateView(); // 触发视图更新
    oldArrayProperty[methodName].call(this, ...arguments);
    // Array.prototype.push.call(this, ...arguments)
  };
});

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
  // 深度监听
  observer(value);
  // 核心API
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        // 深度监听
        observer(newVal);

        // 设置新值，注意：value一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
        value = newVal;
        // 触发视图更新
        updateView();
      }
    }
  });
}

// 监听对象属性
function observer(target) {
  if (typeof target !== 'object' || target === null) {
    // 不是对象或数组
    return target;
  }

  if (Array.isArray(target)) {
    target.__proto__ = arrProto;
  }
  // 重新定义各个属性(for in 也可以遍历数组)
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      defineReactive(target, key, target[key]);
    }
  }
}

// 准备数据
const data = {
  name: 'zhangsan',
  age: 20,
  info: {
    a: {
      b: 1
    },
    address: '北京' // 需要深度监听
  },
  nums: [10, 20, 30]
};
// 监听数据
observer(data);
// 测试
// data.name = 'lisi';
// data.age = 21;
// data.info.address = '上海'; // 深度监听
// data.info.a.b = '上海'; // 深度监听
data.nums.push(4); // 监听数组
