// 获取dom节点
/**const div1 = document.getElementById('div1');
console.log('div1', div1);

const divList = document.getElementsByTagName('div'); // 集合
console.log('divList', divList);

const containerList = document.getElementsByClassName('container');
console.log('containerList', containerList);

const pList = document.querySelectorAll('p');
console.log('pList', pList);*/

// dom节点的property--对dom元素的js变量做的修改，不会提现到html结构中
/**const pList = document.querySelectorAll('p');
const p1 = pList[0];
p1.style.width = '100px';
p1.className = 'red';
console.log(p1.style.width);
console.log(p1.className);
console.log(p1.nodeName);
console.log(p1.nodeType);*/

// attribute--修改的是dom元素的节点属性，会体改变html结构，尽量使用property
// p1.setAttribute('data-name', 'imooc');
// console.log(p1.getAttribute('data-name'));
// p1.setAttribute('style', 'font-size: 50px;');
// console.log(p1.getAttribute('style'));

// dom结构操作

const div1 = document.getElementById('div1');
// 新建节点
const newP = document.createElement('p');
newP.innerHTML = 'this is newP';
div1.appendChild(newP);

// 移动节点
const div2 = document.getElementById('div2');
const p1 = document.getElementById('p1');
div2.appendChild(p1);

//获取父元素
console.log(p1.parentNode);
// 获取子元素列表
const div1ChildNodes = div1.childNodes;
console.log(div1.childNodes);
const div1ChildNodesP = Array.prototype.slice.call(div1.childNodes).filter((child) => {
  if (child.nodeType === 1) {
    return true;
  }
  return false;
});
console.log('div1ChildNodesP', div1ChildNodesP);

// div1.removeChild(div1ChildNodesP[0]);

const list = document.getElementById('list');

// 创建一个文档片段，此时还没有插入到 DOM 结构中
const frag = document.createDocumentFragment();

for (let i = 0; i < 20; i++) {
  const li = document.createElement('li');
  li.innerHTML = `List item ${i}`;

  // 先插入文档片段中
  frag.appendChild(li);
}

// 都完成之后，再统一插入到 DOM 结构中
list.appendChild(frag);

console.log(list);
