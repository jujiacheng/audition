class MinHeap {
  constructor() {
    this.heap = [];
  }
  getParentIndex(i) {
    // 等同于除以二取商
    return (i - 1) >> 1;
  }
  getLeftIndex(i) {
    return i * 2 + 1;
  }
  getRightIndex(i) {
    // 等同于除以二取商
    return i * 2 + 2;
  }
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }
  shiftUp(index) {
    if (index === 0) {
      return;
    }
    const parentIndex = this.getParentIndex(index);
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index);
      this.shiftUp(parentIndex);
    }
  }
  shiftDown(index) {
    const leftIndex = this.getLeftIndex(index);
    const rightIndex = this.getRightIndex(index);
    if (this.heap[leftIndex] < this.heap[index]) {
      this.swap(leftIndex, index);
      this.shiftDown(leftIndex);
    }
    if (this.heap[rightIndex] < this.heap[index]) {
      this.swap(rightIndex, index);
      this.shiftDown(rightIndex);
    }
  }
  /*
   * 插入
    1. 将值插入堆的底部，即数组的尾部
    2. 然后上移：将这个值和他的父节点进行交换，直到父节点小于等于这个插入的值
    3. 大小为k的堆中插入元素的时间复杂度为O(logk)
  */
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  /* 
   * 删除堆顶
    1. 用数组尾部元素替换堆顶（直接删除元素会破坏堆结构）。
    2. 然后下移：将新堆顶和他的字节点进行交换，直到字节点大于等于这个新堆顶
    3.大小为k的堆中删除堆顶的时间复杂度为O(logk)
  */
  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}
const h = new MinHeap();
h.insert(3);
h.insert(2);
h.insert(1);
