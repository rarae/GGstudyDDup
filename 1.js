var ListNode = function (key, val, prev, next) {
  this.key = key;
  this.val = val;
  this.prev = prev || null;
  this.next = next || next;
};
var LRUCache = function (capacity) {
  this.head = new ListNode(-1);
  this.tail = new ListNode(-1);
  this.head.next = this.tail;
  this.tail.prev = this.head;
  this.map = new Map();
  this.capacity = capacity;
  this.size = 0;
};

LRUCache.prototype.get = function (key) {
  if (this.map.has(key)) {
    let node = this.map.get(key);
    node.prev.next = node.next;
    node.next.prev = node.prev;

    let tmp = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = tmp;
    tmp.prev = node;
    return node.val;
  }
  return -1;
};

LRUCache.prototype.put = function (key, value) {
  if (this.map.has(key)) {
    let node = this.map.get(key);
    node.val = value;
    node.prev.next = node.next;
    node.next.prev = node.prev;

    let tmp = this.head.next;
    this.head.next = node;
    node.prev = this.head;
    node.next = tmp;
    tmp.prev = node;
  } else {
    let newNode = new ListNode(key, value);
    this.map.set(key, newNode);

    let tmp = this.head.next;

    this.head.next = newNode;
    newNode.prev = this.head;
    newNode.next = tmp;
    tmp.prev = newNode;

    this.size++;

    if (this.size > this.capacity) {
      tmp = this.tail.prev;
      this.tail.prev = tmp.prev;
      tmp.prev.next = this.tail;
      this.map.delete(tmp.key);
      this.size--;
    }
    console.log(key, value);
  }
};

let lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1); // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2); // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1); // 返回 -1 (未找到)
lRUCache.get(3); // 返回 3
lRUCache.get(4); // 返回 4
