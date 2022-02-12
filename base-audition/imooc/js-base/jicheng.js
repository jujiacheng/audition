function Human(name) {
  this.name = name;
}
Human.prototype.run = function () {};

function Man(name) {
  // 属性继承
  Human.call(this, name);
  this.gender = '男';
}
var f = function () {};
// 继承Human 方法
f.prototype = Human.prototype;
Man.prototype = new f();

Man.prototype.fight = function () {};
