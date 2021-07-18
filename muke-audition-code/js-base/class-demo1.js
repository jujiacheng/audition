class Student {
  constructor(name, number) {
    this.name = name;
    this.number = number;
  }

  sayHi() {
    console.log(`name:${this.name},number:${this.number}`);
  }
}

// 通过类声明对象/实例

const xialuo = new Student('夏洛', 100);
console.log(xialuo.name);
console.log(xialuo.number);
xialuo.sayHi();

const madongmei = new Student('马冬梅', 101);
console.log(madongmei.name);
console.log(madongmei.number);
madongmei.sayHi();
