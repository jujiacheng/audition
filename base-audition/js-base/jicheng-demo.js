function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 第二次调用 Parent()
  this.age = age;
}

Child.prototype = new Parent(); // 第一次调用 Parent()

var child1 = new Child('xiaopao', 18);
var child2 = new Child('lulu', 19);
