[toc]

# js执行
## js代码是怎么执行的 执行栈->执行上下文->变量对象
![执行](https://img-blog.csdnimg.cn/2021061318010125.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)
1. 浏览器开辟一个==执行环境栈（ECStack）==， js的所有代码都会到这里执行，并且存储基本类型值
2. 为了区分全局和其他作用域，会有全局执行上下文（EC（G））和其他执行上下文（私有上下文，块级上下文）
3. 全局执行上下文里面有一个全局变量对象（VO（G）），记录了当前上下文的所声明的变量，当然还会记录全局对象（GO），比如说window
4. var a = 12; 执行的三个过程
   1. 先在栈区开辟一个内存空间，用来存放基础数据类型12，得到一个地址
   2. 声明a变量，添加到当前上下文的变量对象中
   3. 将a和第一步得到的地址进行关联
   4. ？这里有一个问题：变量与指针关联，那怎么知道变量要去栈找值还是到堆找值？是根据地址的位数吗，堆的地址是0x000000形式的

## 阿里面试题
要考虑运算的优先级，优先级没分析对，肯定会做错
![阿里面试题](https://img-blog.csdnimg.cn/20210613184753749.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)

## 重点 有函数的执行过程  和浏览器的垃圾回收机制
![函数](https://img-blog.csdnimg.cn/20210613195822217.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)

预备知识：
- js中的上下文
  - 全局上下文EC（G）
  - 函数执行会形成私有上下文EC（FN）
  - 块级私有上下文
  - 。。。
- 创建一个函数（跟定义变量是类似的）
  1. 开辟一个堆内存空间，以“字符串”的形式存放代码，并且存储了它的作用域\[\[scope]]，在哪个上下文中创建的，作用域就是谁
  2. 声明一个函数名称的全局变量，并存储在全局变量对象中VO（G）
  3. 将第一步的地址跟第二步的变量做一个关联

函数执行的过程（重点）：
1. 形成一个==私有的上下文（EC（FN））==，（AO）私有变量对象也都有了，然后进栈执行
2. 在代码执行之前
   1. 初始化作用域链scope-chain, <当前自己的私有上下文，函数的作用域>，链的右侧是当前上下文的“上级上下文”
   2. 初始化this
   3. 初始化arguments
   4. 形参赋值，在当前的私有上下文中，在AO中创建一个形参变量，并把传递的实参跟它关联起来。（js都是按值传递的，也就是会拷贝一份）
   5. 变量提升
3. 代码执行
4. 出栈释放

## 有闭包的执行过程
![闭包](https://img-blog.csdnimg.cn/20210613221207117.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)
跟有函数的执行过程是一样的，只不过是这个私有上下文不会被释放
>闭包：函数的一种执行机制
函数执行会形成一个私有上下文，如果当前上下文的某些内容（一般是指堆内存地址）被其他上下文的变量占用，则当前上下文不能够被释放，（是根据浏览器的垃圾回收机制决定的）

>还有一种说法是只要函数执行就会形成闭包，只不过正常的函数运行一下子就被释放掉了，而有一种不能够被马上释放
保护/保存机制

在程序上有一种一般性的写法：
```javascript
let fn = (function() {
    return function() {  //在当前上下文中创建的堆内存地址被全局上下文的fn变量占用
        console.log('这种自执行函数的写法，天然就是为闭包而生的')
    }
})();
```
### 闭包应用
```javascript
//使用闭包实现“惰性函数”，提升性能
//只需在第一次执行的时候走if，其余都直接走重构的getCss
function getCss(ele, attr) {
    if (window.getComputedStyle) {
        getCss = function(ele, attr) {
            return window.getComputedStyle(ele)[attr];
        }
    } else {
        getCss = function(ele, attr) {
            return ele.currentStyle[attr];
        }
    }
    return getCss(ele, attr);
}
```
```javascript
//防抖  频繁点击，只操作一次，多用于点击
/*
immediate 控制是开始触发还是结尾触发,默认是结尾触发
*/
function debounce(cbFn, wait=300, immediate=false) {
    let now = immediate && timer===null;
    let timer = null;

    return function (...params) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            !immediate ? cbFn.call(this, ...params) : null;
        }, wait);

        now ? cbFn.call(this, ...params) : null;
    }
}
```

```javascript
//节流  多用于滚动scroll和输入过程中的模糊匹配keyDown
function throttle(cbFn, wait = 300) {
    let timer = null,
        previous = 0; //记录上一次操作的时间

    return function (...params) {
        let now = new Data(),
            remaining = wait - (now - previous);

        if (remaining <= 0) { //两次操作的时间间隔超过了wait
            clearTimeout(timer);
            timer = null;
            previous = now;
            cbFn.call(this, ...params);
        } else if (!timer) { //两次操作的时间间隔没有超过wait， 且没有设置定时器
            timer = setTimeout(() => {
                timer = null;
                previous = new Date();
                cbFn.call(this, ...params);
            }, remaining);
        }
    }
}
```


## let VS var

### var存在变量声明提升
js是解释性语言，js引擎在执行js代码时有两个步骤
1. 解释，在当前上下文(全局、函数私有、块级私有)，扫描所有的代码，然后把==var声明提升到顶端（let const是不会提升的）==，~~先提升函数，后提升变量~~,按顺序提升（注意变量定义是不提升的，但是函数的函数体是会提升的）
2. 执行
```javascript cmd="node"
console.log(a)
var a
```
相当于
```javascript cmd="node"
var a
console.log(a)
```

```javascript cmd="node"
foo()
function foo(){
    console.log(1)
}
```

```javascript cmd="node"
foo()
foo = function() {   //foo被提升，但只是一个变量，不能用foo()执行
    console.log(1)
}
```
### var跟顶层对象有关系
在全局上下文中，用var声明的变量，除了是一个全局变量，还相当于给GO（全局对象window）添加一个属性。但是用let声明的变量，就只是一个全局变量，跟GO毫无关系。
变量不用let const关键字，相当于在顶层对象比如global, window里添加属性
```javascript cmd="node"
a = 1  //不用let等，表示在宿主global对象下定义了a===1
console.log(a) //相当于global.a
console.log(global.a)
```
```javascript 
var a = 1
//在chrome v8 里输出1，node环境输境global输出undefined
console.log(window.a) 
```

```javascript
//这种情况下不会去找window.n，除非你先声明了n
//过程是这样的，先去找全局变量有没有n，没有，再去找全局对象有没有n属性，也没有，然后报错
console.log(n) //ReferenceError: n is not defined
```

### var可以重复声明
在同一个上下文中，var可以重复声明。但是let不可以，不管你之前用什么方式（var等）声明了，都不可以
```javascript
//在词法分析阶段，如果发现使用const/let声明的变量有重复的，直接报语法错误
var n = 1;
let n = 1; //SyntaxError: Identifier 'n' has already been declared
```

### 存在暂时性死区（浏览器暂存的BUG）
```javascript
//基于typeof检测一个未被定义的变量，程序不会报错，输出undefined
console.log(typeof n) //undefined
```


### var--全局作用域 let--块级作用域
let/const/function会产生==块级私有上下文==
var会穿透for，if等， 等同于“全局变量”
```javascript cmd="node" 
// 本质是没有创建一个私有上下文，始终都在全局上下文中执行，在VO（G）中会有a
{
  var a = 1;
}
console.log(a); //1
console.log(window.a); // 1
```

let是块级作用域，不能穿透{}，如果声明在块内，那么只在块内有效
```javascript 
//本质是在{}块内形成一个私有上下文，let变量a会存在当前上下文的AO
{
    let a = 1 
    console.log(a)  // 1
}
console.log(a) //ReferenceError: a is not defined
```

==不论是var，还是let，在js执行前都会有一个静态语法分析的过程，都会先得到变量标识符==
```javascript cmd="node"
console.log(a)
var a
```

```javascript cmd="node"
console.log(a)
let a //let是通过禁止访问未绑定值来实现的
```

### for (let i=0; i<5; i++) \{...\}
for循环体首先会产生一个“块级上下文”循环体，用来控制一整个循环体 =》 父亲
以后每一次循环都会再产生新的私有块级上下文 =》 儿子
父亲每次都会吧i传递给儿子，儿子操作自己的私有i后会返回给父亲
![图片](https://img-blog.csdnimg.cn/20210614203557940.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)

```javascript
// 追求性能极致的写法，不产生私有上下文，也就不会有入栈出栈的操作，跟var一个样了
let i=0;
for(; i<5; i++) {
    console.log(i)
}
console.log(i)
```

## this
叫函数的执行主体
函数执行主体：谁把函数执行
函数执行上下文：函数是在哪里执行的
>全局上下文中的this是window，私有上下文中没有自己的this，所用到的this都是所处上级上下文中的this
1. 事件绑定：给当前元素的某个事件行为绑定方法，当事件触发的时候，方法执行中的this是当前元素本身
```javascript
document.body.onClick = function() {
    console.log(this)   //body
}
```
2. 普通函数的执行
    1. 没有 对象.fn，this就是window(严格模式下是undefined)
    2. 有 对象.fn，this就是对象
    3. 匿名函数（自执行函数/回调函数(把函数当作参数传递到另一个函数中执行)）如果没有经过特殊处理，一般是window/undefined

# 原型
js是面向对象的编程语言
面向对象有两种实现方式：
1. 基于类的方式（Java、C++、python），静态编译好的，运行时不能修改类模板
2. 基于原型的方式，运行时可以动态修改类模板，可操作性更强
   
原型系统的“复制操作”有两种实现方式：
1. 不是真正的复制，只是在对象中持有原始对象的引用（js用的就是这种方式）
2. 真正的复制

两句话概括原型系统：
1. 对象的原型用Object.getPrototypeOf()获取，其实也就是对象的__proto__属性
2. 对于一个属性，如果在对象中找不到，那么就沿着它的原型往上找，直到找到或者原型为空

通过toString方法来获得内置类的名称：
```javascript {cmd="node"}

var o = new Object;
var n = new Number;
var s = new String;
var b = new Boolean;
var d = new Date;
var arg = function(){ return arguments }();
var r = new RegExp;
var f = new Function;
var arr = new Array;
var e = new Error;
console.log([o, n, s, b, d, arg, r, f, arr, e].map(v => Object.prototype.toString.call(v))); 
```

## 对象的__proto__和函数的prototype
```javascript
// 1.对象的原型
// 每个对象都有原型,用Object.getPrototypeOf()来获取
console.log(Object.getPrototypeOf({})); // [Object: null prototype] {}

function Student(name, grade) {
    this.name = name;
    this.grade = grade;
}

const stu = new Student('xiaoMing', 6);
console.log(Object.getPrototypeOf(stu)); // {}

// 设置对象的原型
Object.setPrototypeOf(stu, {
    a: 1
})
console.log(Object.getPrototypeOf(stu)) // { a: 1 }


// 2.函数和prototype
// 所有函数都有prototype属性  箭头函数没有
function Apple() {}
const apple = new Apple()

console.log(apple instanceof Apple) // true
console.log(apple.constructor) // [Function: Apple]   在这里 apple本身没有constructor属性，这里是通过原型链查找得来的
console.log(Apple.prototype) // {}
console.log(Apple.prototype.constructor === Apple) // true

// 对象实例的原型链
console.log(Object.getPrototypeOf(apple) === Apple.prototype) // true
console.log(Object.getPrototypeOf(Apple.prototype) === Object.prototype)  // true  这里就可以说Apple 继承 Object
console.log(Object.getPrototypeOf(Object.prototype) === null) // true

// 函数的原型链
console.log(Object.getPrototypeOf(Apple) === Function.prototype) // true
console.log(Object.getPrototypeOf(Function.prototype) === Object.prototype) // true  这里就可以说Function 继承 Object
console.log(Object.getPrototypeOf(Object.prototype) === null) // true


// 自己的instance方法
function myInstanceof(left, right) {
     let proto = Object.getPrototypeOf(left),
        prototype = right.prototype

     while (true) {
         if (proto===null) return false
         if (proto===prototype) return true

         proto = Object.getPrototypeOf(proto)
     }
}
```

## 原型重定向
```javascript
function Person() {};
Person.prototype.say = function () {};
Person.prototype.eat = function () {};
// 重定向的时候使用Object.assign来覆盖已有的方法，和添加新方法，避免直接重写
Person.prototype = Object.assign(Person.prototype, {
    say(): {},
    jump(): {},
})
```


## 函数的prototype和__proto__
![图片](https://img-blog.csdnimg.cn/20210621230116549.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)
要注意的就是Function.prototype不是一个对象，而是一个“空函数”


## 基本数据类型的自动装箱和 ==解装箱==
```javascript
let num1 = 10; //基本数据类型值，存在栈区，也是Number的实例
let num2 = new Number(10);//应用数据类型值，存在堆区
/* 自动装箱 */
num1.toFixed(2);//先把10转换成Number实例，再去调用Number.prototype的toFixed方法
num2.toFixed(2);//直接调用Number.prototype.toFixed()方法
/* 自动解装箱 
底层处理机制：
1. 首先调用num2[Symbol.toPrimitive]方法，有返回则结束
2. 再调用num2.valueOf()方法，有返回则结束
3. 如果还是没有，则调用toNumber()或者toString()方法。
*/
console.log(num2 + 10);
```

## call apply bind
```javascript
function fn () {};
const obj = {};
fn.call(obj);//先从fn.__proto__找到Function.prototype.call方法，执行的时候把执行的主体修改为obj
fn.call();//严格模式下,this->undefined 非严格模式下this->window

// bind的用处
document.body.onClick = fn;  // 点击事件触发的时候,fn执行，fn的this是window
setTimeout(fn, 1000);  // 时间到了的时候fn执行，fn的this也是window
// 我想让上面fn执行的时候this不再是window，并且还想要传递参数，可以这么写，有两种方法：
// 第一种，绑定一个匿名函数，里面执行自己想要的方法
document.body.onClick = function (ev) {
    fn.call(obj, 10, 20);
}
// 第二中，bind方法
document.body.onClick = fn.bind(obj, 10, 20);
// 在react里面，第一种方法就类似于{()=>delTotoById(id)}，第二种就类似于{delTodoById.bind(null, id)}
```

```javascript
// 自己实现call
const obj = {
    name: '123',
    age: 123,
}

function fn (x, y) {
    console.log(this);
    return x + y;
}

Function.prototype.call = function(obj, ...rest) {
    // this->fn
    obj == null ? obj = window : null; // obj如果是null/undefined，则让它指向window
    !/^(object|function)$/.test(typeof obj) ? obj = Object(obj) : null; //基本数据类型值不能设置属性，必须保证obj是引用数据类型值
    let key = Symbol('unique'),
        res;
    obj[key] = this;
    res = obj[key](...rest);
    delete obj[key];
    return res;
}

console.log(fn.call(10, 1, 2));
console.log(obj)
```

```javascript
// 自己的bind方法
const obj = {
    name: '123',
    age: 123,
}

function fn(x, y) {
    console.log(this, x + y);
}

Function.prototype.bind = function(obj, ...rest) {
    // this->fn
    return () => {
        return this.call(obj, ...rest);
    }
}

setTimeout(fn.bind(obj, 10, 20), 1000);
```

```javascript
/// .call.call.call.call
function A () {
    console.log('A function');
    console.log(this.name);
}

function B () {
    console.log('B function');
    console.log(this.name);
}

// 让A.call函数执行，执行主体是B。所以要弄清楚call是怎么执行的
// 其实就是让B添加一个属性，使得B.A.call可以执行
// 执行的参数是B
// 最终就是A.call(B)执行
A.call.call(B, B);   //B function
                     //B
```

## new 发生了什么
（1）首先创建了一个新的空对象
（2）设置原型，将对象的原型设置为函数的 prototype 对象。
（3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
（4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。
```javascript
function objectFactory() {
    let newObject = null,
      constructor = Array.prototype.shift.call(arguments),
      result = null;
  
    // 参数判断
    if (typeof constructor !== "function") {
      console.error("type error");
      return;
    }
  
    // 新建一个空对象，对象的原型为构造函数的 prototype 对象
    newObject = Object.create(constructor.prototype);
  
    // 将 this 指向新建对象，并执行函数
    result = constructor.apply(newObject, arguments);
  
    // 判断返回对象
    let flag =
      result && (typeof result === "object" || typeof result === "function");
  
    // 判断返回结果
    return flag ? result : newObject;
  }
  
  // 使用方法
  // objectFactory(构造函数, 初始化参数);
```
## 原型继承
js继承的两个必要方式：
1. 子类原型指向父类实例，这样就实现了属性和方法的共享  公有属性的继承
2. 借助构造函数，实现属性和方法的独享  私有属性的继承
```javascript cmd="node"
// 组合继承：使用构造函数和原型来实现继承
// 缺点：调用两次父类构造函数
function Person(name='mike') {
    this.name = name
}
function Student(name='mike', age=8) {
    Person.call(this, name) //在子类，把父类的构造当作普通函数执行
    this.age = age
}
//下面一行不能写Student.prototype = Person.prototype
//因为这样如果新增子类特有的方法，父类也能用，不满足继承的特性
//下面调用了一次父类构造函数，但是其实我们不需要它的实例
//寄生方法就是解决这个问题的
// 发现另外一种方法，利用循环，这个方法可以用于多继承
// for (let key in Person.prototype) {
//     Student.prototype[key] = Person.prototype[key]
// }

// ## 发现另外一种方法,最好的方法就是这样的，这样都不用修复构造函数了
// Student.prototype.__proto__ = Person.prototype;
Student.prototype = new Person()
Student.prototype.constructor = Student

let mike = new Student('mike', 18)
let ray = new Student('ray', 14)
console.log(mike)
console.log(ray)
```
```javascript cmd="node"
//寄生组合继承
function Person(name='mike') {
    this.name = name
}
function Student(name='mike', age=8) {
    Person.call(this, name)
    this.age = age
}
function create(prototype) {
    //用一个空实例来保存prototype
    function Super() {}
    Super.prototype = prototype
    return new Super()
}
// 下面这句话就等同于：Student.prototype = Object.create(Person.prototype)
Student.prototype = create(Person.prototype)
Student.prototype.constructor = Student

let mike = new Student('mike', 18)
let ray = new Student('ray', 14)
console.log(mike)
console.log(ray)
```
```javascript cmd="node"
//寄生组合继承的封装写法
function Person(name='mike') {
    this.name = name
}
function Student(name='mike', age=18) {
    Person.call(this, name)
    this.age = age
}
function create(prototype) {
    function Super() {}
    Super.prototype = prototype
    return new Super()
}
function inherit(father, son) {
    let _ = create(father.prototype)
    son.prototype = _
    son.prototype.constructor = son
}

//更简洁的写法 v2.00
// function inherit2(subClass, superClass) {
//     function f() {}
//     f.prototype = superClass.prototype
//     subClass.prototype = new f()
//     subClass.prototype.constructor = subClass
// }
inherit(Person, Student)
let mike = new Student('mike', 18)
console.log(mike)
console.log(mike instanceof Person)
```

# 异步
## 事件循环
js采用任务队列的方式来处理异步，每当遇到一个异步任务，都会把它放在事件队列中（浏览器会开启一个监听线程来协助），继续执行同步代码，等到同步代码执行完毕后。从事件队列中的微任务中取出任务拿到上下文执行栈中执行，再从宏任务中取出一个拿到上下文执行栈中执行。执行栈空闲的时候，先到微任务队列拿任务，再到宏任务队列拿任务，由此会产生出先执行所有的微任务，在执行一个宏任务的现象。
## promise基础语法
```javascript
// 基础语法
let p1 = new Promise(function (resolve, reject) {
    resolve(1); //[[PromiseState]]->fulfilled, [[PromiseResult]]->1
    // reject(0); //[[PromiseState]]->rejected, [[PromiseResult]]->0
    // console.log(a); //[[PromiseState]]->rejected, [[PromiseResult]]->出错原因
    console.log(3);
});

p1.then(result => {
    //第一个函数 [[PromiseState]]->fulfilled result -> [[PromiseResult]]
    console.log(result);
}, reason => {
    //第一个函数 [[PromiseState]]->rejected reason -> [[PromiseResult]]
    console.log(reason);
});
```

```javascript cmd='node'
let p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve(1); //修改promiseState和promiseResult，但是去通知注册方法执行是异步的
        console.log(1);  // 所以输出的结果是 1  2
    }, 1000);
});
p1.then(result => {  // 注册方法是同步的
    console.log(2);
});
```
## promise复杂语法
```javascript cmd='node'
let p1 = new Promise(resolve => {
    resolve('ok');
});

p1 = Promise.resolve('ok'); // 就是上面写法的简写版

let p2 = p1.then(result => {  // p1执行的结果会返回一个新的promise实例
    console.log(result);
    return 'p1的任一方法执行成功了,此消息就是p2的promiseResult';
},
reason => {
    console.log(reason);
});

/*
p2的promiseState和promiseResult分析
1. 如果在p1的方法中有返回一个新的promise, 则结果取决于这个新的promise
2. 如果没有第一步，则：p1的任意一个方法执行成功，则promiseState为fulfilled，promiseResult为方法返回的结果
*/ 
p2.then(result => {
    console.log(result);
})
```

```javascript cmd='node'
// 如果没有执行第二个方法的函数或者写个null, 则会抛出异常
// 顺延机制
Promise.reject('no').then(result => { // 按理说reject会执行第二个方法，但是由于没有写，所以会顺延下去
    console.log(result);
}, null).then(null, reason => {  //相当于浏览器给我们加了 reason => Promise.reject(reason)
    console.log(reason);
});

// 利用这种顺延机制，我们通常都会在最后面加一个catch 这样就能够传递到错误
// .catch(reason => {}) 相当于 .then(null, reason => {})
```

## async/await
1. await后面通常加一个promise实例，如果不是则自动转为Promise.resolve(param)
2. 遇到await，则必须等到后面的promise实例的state变化，后面才继续执行（不是立即的， 是把await下面的代码作为一个“异步的微任务”存放到事件队列中）
3. 一般用try/catch来处理await 后面reject的任务
```javascript cmd='node'
async function fn () {
    await 1;
    console.log(2);
}
fn();
console.log(3);  // 先输出3 后输出2
```

## 一道经典的题目
![图片](https://img-blog.csdnimg.cn/20210628231015899.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMzNTE4NzQ0,size_16,color_FFFFFF,t_70)

## 手写promise.all
```javascript cmd='node'
Promise.all = (arr) => {
    return new Promise((resolve, reject) => {
        let index = 0,
            results = [];

        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (!(item instanceof Promise)) {
                index++;
                results[i] = item;
                if (index === arr.length) {
                    resolve(results);
                }
            } else {
                item.then(result => {
                    index++;
                    results[i] = result;
                    if (index === arr.length) {
                        resolve(results);
                    }
                }).catch(reason => {
                    reject(reason);
                })
            }
        }
    })
}

let p1 = Promise.resolve('p1');
let p2 = Promise.resolve('p2');
let p3 = Promise.resolve('p3');
let pALl = Promise.all([19, p1, p2, p3, 10]);
pALl.then(result => {
    console.log(result);
}).catch(reason => {
    console.log(reason);
})
```

## 手写promise串行
[csdn比较好的讲解](https://blog.csdn.net/yyk5928/article/details/103624315?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)
```javascript cmd='node'
const createClock = (log, time) => new Promise(resolve => {
    setTimeout(() => {
        resolve(log);
    }, time);
});

let p1 = createClock(1, 5000); //p1 执行5秒
let p2 = createClock(2, 1000);
let p3 = createClock(3, 1000);

// 1. 串行调用就是要达到这个效果  依次输出 1 2 3
// p1.then(r=>{
//     console.log(r);
//     return p2;
// }).then(r=>{
//     console.log(r);
//     return p3;
// }).then(r=>{
//     console.log(r);
// })

// 2. 使用forEach实现
Promise.all = function (arr) {
    let p = Promise.resolve('OK'); // 先生成一个实例
    arr.forEach(item => {
        // 第一个then用来接收'OK'，其实是辅助的promise实例，主要目的是在其resolve里面返回一个新的promise实例
        // 第二个then才是真正的要执行的promise实例
        p = p.then(() => item).then(result => {
            console.log(result);
            return 'OK' // 其实不返回也可以，因为执行成功浏览器会默认返回成功的promise实例
        })
    })
    return p;
}

Promise.all([p1, p2, p3]).then(result => {
    console.log(result);  // 输出的就是 'ok'
});

// 3. 使用async/await实现
async function seq (arr) {
    for (const item of arr) {
        let res = await item;
        console.log(res); // 依次输出1 2 3
    }
}
seq([p1, p2, p3]);
```

```javascript
const p = x => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(x+1);
            resolve(x+1);
        }, 1000);
    });
}

// 1. 根据上一个请求的结果来发起下一个请求 like this
// p(0).then(result => {
//     return p(result);
// }).then(result => {
//     return p(result);
// }).then(result => {
//     console.log(result);
// })

// 2. async很容易可以实现
// async function fn (n) {
//     let x = 0;
//     for (let i=0; i<n; i++) {
//         x = await p(x);
//     }
// }
// fn(4);

// 3. async实际上是用generator和promise实现的
function* generator(x, n) {
    for (let i=0; i<n; i++) {
        x = yield p(x);
    }
}
function AsyncFunc(generator, ...params) {
    const iter = generator(...params);
    const next = x => {
        // 第一次是这样的 value=>一个resolve为1的promise实例 done=>false
        let {value, done} = iter.next(x); 
        if (done) return;
        value.then(result => {
            next(result);
        })
    }
    // 第一次执行，什么都不传
    next();
}
AsyncFunc(generator, 0, 5);
```

## promise并发串行 递归
```javascript
const cb = (n) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(n);
            console.log(n);
        }, Math.random() * 3000)
    });
}
let j = 0;
const arr = new Array(20).fill('').map(() => cb.bind(null, j++));

function dispatch(arr, max) {
    let seq = 0,
        received = 0,
        total = arr.length,
        res = new Array(total).fill(0);

    return new Promise(resolve => {
        const next = () => {
            if (arr.length <= 0) return;

            let cur = seq;
            seq++;
            let task = arr.shift();
            task().then(result => {
                res[cur] = result;
            }, reason => {
                res[cur] = reason;
            }).finally(() => {
                received++;
                if (arr.length > 0) {
                    next();
                } else if (received >= total) {
                    resolve(res);
                }
            })
        }

        while (seq < max) {
            next();
        }
    })
}

dispatch(arr, 5).then(result => {
    console.log(result);
})
```

## 手写promise
```javascript cmd='node'
// es5写法 还没有实现顺延机制，对付面试足够了, 顺延机制看视频45
function MyPromise(executor) {
    // 保证传进来的是个函数
    if (typeof executor !== 'function') {
        throw new Error(`${executor} is not a function`);
    }

    // self表示当前promise实例
    var self = this;
    self.promiseState = 'pending';
    self.promiseResult = undefined;
    self.onFulfilledCbFn = [];
    self.onRejectedBcFn = [];

    function run(state, result) {
        if (self.promiseState !== 'pending') return;
        self.promiseState = state;
        self.promiseResult = result;
        
        // executor是异步的时候处理
        setTimeout(function() {
            var arr = state === 'fulfilled' ? self.onFulfilledCbFn : self.onRejectedBcFn;
            for (var i = 0; i < arr.length; i++) {
                var cbFn = arr[i];
                typeof cbFn === 'function' && cbFn(self.promiseResult);
            }
        });
        
    }

    // 修改promiseState和promiseResult
    function resolve(result) {
        run('fulfilled', result);
    };

    function reject(reason) {
        run('rejected', reason);
    };

    // 立即执行executor, 注意报错也会reject
    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}

MyPromise.prototype = {
    constructor: MyPromise,
    then: function (onFulfilled, onRejected) {
        var self = this;
        switch (self.promiseState) {
            case 'fulfilled':
                setTimeout(function () { //使用setTimeout来实现异步
                    onFulfilled(self.promiseResult);
                });
                break;
            case 'rejected':
                setTimeout(function () {
                    onRejected(self.promiseResult);
                });
                break;
            default: // 当executor里面的是异步操作的时候要这样做
                self.onFulfilledCbFn.push(onFulfilled);
                self.onRejectedBcFn.push(onRejected);
                break;
        }
    },
    catch: function () {},
    finally: function () {}
}

var fn = (resolve, reject) => setTimeout(()=>{resolve('ok')}, 1000);
var p1 = new MyPromise(fn);
p1.then(result => {
    console.log(`成功 ${result}`);
}, reason => {
    console.log(`失败 ${reason}`);
})
```

# 事件
1. 事件是什么？
   1. 事件是浏览器赋予元素的默认行为，可以说是天生就有的，当某些行为触发的时候，相关的事件都会触发。（鼠标点击行为 触发元素点击事件）
2. 事件绑定
   1. 给元素的默认行为绑定方法，当事件触发的时候，方法执行 （点击事件触发 绑定的方法执行）
   2. DOM0: 每一个dom元素对象上都有自己类似“onXXX”的私有属性，给这些属性赋值就是dom0事件绑定, 特点是只能当前元素的某个事件行为绑定一个方法，执行效率高，只在目标/冒泡阶段触发，是按ev.path来的。
   3. DOM2: 元素.addEventListner(event, fn, [捕获/冒泡])
      1. 原理：每一个元素都往原型链上找到EventTarget原型上的add.../remove方法
      2. 绑定的一般不是匿名函数，因为移除的时候需要三个参数一致
3. 事件对象
   1. 是默认传递给绑定方法的参数
4. 默认行为
   1. 浏览器会给元素赋予默认的行为操作
      1. 比如说：点击a标签页面跳转
   2. 我们可以用ev.preventDefault()来禁用这些行为
      1. 禁用右键菜单 window.oncontextmenu = function (ev) {ev.preventDefault();}
      2. a标签取消跳转和锚点定位 href="javascript:;" 或者用ev.prevent...
5. ev.stopPropagation() 阻止事件冒泡
# 数据类型检测
1. typeof 返回的是字符串，有number/boolean/string/undefined/symbol/bigint/function/object
   1. typeof的原理：以二进制的形式实现的，对象都是000......
      1. 所以无法分清楚是 正则/日期/数组/普通对象
      2. null的二进制值是000，所以typeof null === 'object'
2. instanceof
   1. 用它来检测 正则/日期/数组/普通对象
      1. obj instanceof RegExp
      2. obj instanceof Date
      3. obj instanceof Array
      4. obj instanceof Object 这个永远成立 所以不能用
   2. 无法应用到原始数据类型检测:  10 instanceof Number 
   3. obj的原型修改之后，检测结果就不准了
3. constructor
   1. 用它来检测 正则/日期/数组/普通对象
      1. obj.constructor === RegExp
      2. obj.constructor === Date
      3. obj.constructor === Array
      4. obj.constructor === Object
   2. 可以检测基本数据类型值 10.constructor === Number 原因是浏览器会自动将10装箱
   3. obj的原型修改之后，检测结果就不准了
4. Object.prototype.toString.call
   1. Number/String/boolean/Symbol/BigInt/Object/RegExp/Date/Function/Array 的原型上都有toString，所以obj.toString()的时候都是找自己原型上的,而重写的toString都是用来转换成String的，所以必须要用Object.prototype.toString.call
   2. 返回结果是 "[object 对象[Symbol.toStringTag] || 对象.构造函数(不会被修改) || Object]"
```javascript cmd='node'
class Person {
    get[Symbol.toStringTag]() {
        return 'Person';
    }
}
let class2Type = {},
    toString = class2Type.toString;
console.log(toString.call(new Person)); //[object Person]
```

# 数据类型转换
规则：对象->字符串->数字,  布尔->数字
```javascript
// [] -> '' -> 0 
// false -> 0
console.log([] == false)  //true
```

```javascript
// ![] -> 把[]转换成布尔再取反 -> false
console.log(![] == false) //true
```

```javascript
Number('') //0
Number('10') //10
Number('10px') //NaN
Number(true) //1
Number(false) //0
Number(null) //0
Number(undefined) //NaN
Number((Symbol(10))) //报错
Number(BigInt(10)) //10
```

parseInt转换规则：以字符串的方式向后查找，直到非数字字符即停止，把前面的数字转换成数字，如果一个都没有的话就为NaN

```javascript
{}+0 //0 左边的{}认为是一个代码块，不参与运算，运算知识处理+0 => 0
({}+0) // "[object Object]0"
```
==对象到基本数据类型值的转换过程==
```javascript
let a = {          //使用浏览器对象到基本数据类型转换的一些机制
    initValue: 1,
    [Symbol.toPrimitive]() {  //第一种方法
        return this.initValue++;
    },
    // valueOf() {  //第二种方法
    //     return this.initValue++;
    // },
    // toString() { // 第三种方法
    //     return this.initValue++; 
    // },
};

if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}
```

```javascript
// 另外一种方法 数据劫持的方法 ，用这种方法===也能适用
var i=1;
Object.defineProperty(window, 'a', {
    get() {
        return i++;
    }
})

if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}
```

# 函数式编程
纯函数：
1. 给定相同的参数，输出相同的结果
2. 不会带来其他任何副作用（不能修改全局对象，不能修改函数传来的参数）

包括两个部分：函数合成和柯里化
```javascript
//函数合成
function f(x) {}
function g(x) {}
function compose(f, g) {
    return function(x) {
        return f(g(x)) //这里有一个要注意的地方，就是先执行f还是先执行g的结果都是一样的，即也可以返回g(f(x))
    }
}
```

```javascript
//柯里化，即上面的f和g如果参数个数不一样，怎么办，柯里化就是用来解决这个问题的
//柯里化就是将多个参数的函数转化成单参数的函数
function add(x, y) {
    return x+y
}

//柯里化
function addX(y) {
    return function(x) {
        return x+y
    }
}
```

# 深拷贝
```javascript
function deepCopy(newObj, oldObj) {
    for (let key in oldObj) {
        let item = oldObj[key];
        if (typeof item ==='object') {
            if (item instanceof Array) {
                newObj[key] = []
                deepCopy(newObj[key], item)
            } else if (item instanceof RegExp) {
                newObj[key] = item
            } else if (item===null) {
                newObj[key] = null
            } else {
                newObj[key] = {}
                deepCopy(newObj[key], item)
            }
        } else {
            newObj[key] = item
        }
    }
}
let a = {
    a: {
        c: /a/,
        d: undefined,
        b: null
    },
    b: function () {
        console.log(this.a)
    },
    c: [
        {
            a: 'c',
            b: /b/,
            c: undefined
        },
        'a',
        3
    ]
}

let b = {}
deepCopy(b, a)
console.log(a)
console.log('##############')
console.log(b)
```

# repeat函数
```javascript
function repeat (func, times, wait) { 
    return function(content){
     let count = 0;
     let interval = setInterval(function(){
         count += 1;
         func(content);
         if(count === times){    
             clearInterval(interval);    
         }
     }, wait);
}
}  
let f = (x) => {console.log(x)}
const repeatFunc = repeat(f, 4, 3000)
repeatFunc("hellworld");
```

# 手写ajax+promise
```javascript
let options = {
    data: {},
    async: false,
    header:{},
    timeout:2000
}

function toQueryString(data) {
    let tmp = []
    for (let key in data) {
        tmp.push(`${key}=${data[key]}`)
    }
    return tmp.join('&')
}

function ajax(method, url, options) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()

        let queryString = toQueryString(options.data)

        for (let key in options.header) {
            xhr.setRequestHeader(key, options.header[key])
        }

        xhr.timeout = options.timeout
        xhr.ontimeout = () => reject('请求超时')

        method = method.toUpperCase()
        if (method==='GET') {
            xhr.open('get', `${url}?${queryString}`, options.async)
            xhr.send()
        } else if (method==='POST') {
            xhr.open('post', 'url', options.async)
            xhr.send(queryString)
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState===4) {
                if (xhr.status>=200 && xhr.status<=300 || xhr.status===304) {
                    resolve(xhr.responseText)
                } else {
                    reject(xhr.status)
                }
            }
        }

    })
}
```

# 重写reduce
```javascript
let arr = [1, 2, 3, 4];
let reduce = function(arr, cbFn, initValue) {
    let result = initValue,
        i = 0;
    if (typeof result === 'undefined') {
        result = arr[0];
        i = 1;
    }
    for (; i<arr.length; i++) {
        result = cbFn(result, arr[i], i);
    }
    return result;
}

let sum = reduce(arr, function(pre, item, index) {
    return pre + item;
});

console.log(sum)
```

# 对象数组的unique方法
```javascript
let obj = [
    {key: 1},
    {key: 2},
    {key: 3},
    {key: 1},
    {key: 3}
]

Array.prototype.unique1 = function(key) {
    return this.filter((item, index, arr) => {
        const currentKey = item[key];
        return arr.findIndex(el => el[key]===currentKey) === index;
    });
}

Array.prototype.unique2 = function(key) {
    const s = new Set();
    return this.reduce((pre, item) => {
        s.has(item[key]) ? null : s.add(item[key]) && pre.push(item);
        return pre;
    }, []);
}

console.log(obj.unique2('key'));
```

# iterator
```javascript
let obj = {
    name: 10,
    age: 20,
    sex: 30,
    [Symbol('ddd')]: 3
};

obj[Symbol.iterator] = function () {  //如果想在遍历的时候没有这个属性，可以把它放在Object.prototype
    let self = this,
        index = 0,
        keys = [
            ...Object.getOwnPropertyNames(self),
            ...Object.getOwnPropertySymbols(self)
        ]
    return {
        next() {
            return index >= keys.length ? {
                done: true,
                value: undefined
            } : {
                done: false,
                value: keys[index++]
            };
        }
    }
}

for (const e of obj) {
    console.log(e);
}
```

generator是天生就是有这种返回结果的

# 实现jsonp
```javascript
(function (w) {
  function jsonp(option) {
    // 0. 产生不同的函数名
    var callbackName = "itlike" + Math.random().toString().substr(2);
    // 1. 函数挂载在全局
    w[callbackName] = function (data) {
      option.success(data);
      // 用完后就删除掉script标签
      document.body.removeChild(scriptEle);
    };
    option.url = option.url + "?callback=" + callbackName;
    var scriptEle = document.createElement("script");
    scriptEle.src = option.url;
    document.body.appendChild(scriptEle);
  }
  w.jsonp = jsonp;
})(window);

// 使用
jsonp({
  url: "www.baidu.com",
  success: function (data) {
    console.log(data);
  },
});
```
