[toc]

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
1. 子类原型指向父类实例，这样就实现了属性和方法的共享
2. 借助构造函数，实现属性和方法的独享
```javascript cmd="node"
// 组合继承：使用构造函数和原型来实现继承
// 缺点：调用两次父类构造函数
function Person(name='mike') {
    this.name = name
}
function Student(name='mike', age=8) {
    Person.call(this, name)
    this.age = age
}
//下面一行不能写Student.prototype = Person.prototype
//因为这样如果新增子类特有的方法，父类也能用，不满足继承的特性
//下面调用了一次父类构造函数，但是其实我们不需要它的实例
//寄生方法就是解决这个问题的
//发现另外一种方法，利用循环，这个方法可以用于多继承
// for (let key in Person.prototype) {
//     Student.prototype[key] = Person.prototype[key]
// }
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

# js执行
## var变量声明提升
js是解释性语言，js引擎在执行js代码时有两个步骤
1. 解释，即扫描所有的代码，然后把==var声明提升到顶端（let const是不会提升的）==，先提升函数，后提升变量（注意变量定义是不提升的，但是函数的函数体是会提升的）
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
## 顶层对象
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

## var--全局作用域，let--块级作用域
var会穿透for，if等， 等同于“全局变量”
```javascript cmd="node" 
console.log(a)
for (let i=1; i<=3; i++) {
    var a = 1   
}
```
let是块级作用域，不能穿透for，如果声明在块内，那么只在块内有效
```javascript cmd="node"
console.log(a)
for (let i=1; i<=3; i++) {
    let a = 1
}
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

## 执行上下文
### this
调用函数时使用的引用，决定了函数执行时的对象

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