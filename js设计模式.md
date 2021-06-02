[toc]
## js设计模式
### 工厂模式
重复构造对象实例时使用
```javascript cmd='node'
function Person(name) {
    this.name = name
}
Person.prototype.getName = function() {
    console.log(this.name)
}

function Car(model) {
    this.model = model
}
Car.prototype.getModel = function() {
    console.log(this.model)
}

function create(type, param) {
    // 做以下判断就能兼容两种写法 new create 或者直接 create
    if (this instanceof create) {
        return new this[type](param)
    } else {
        return new create(type, param)
    }
}
create.prototype = {
    person: Person,
    car: Car
}

let mike = new create('person', 'mike')
mike.getName()
let benz = create('car', 'benz')
benz.getModel()
```

### 建造者模式
在工厂模式的基础上，创建复杂对象或复合对象
有时候create函数很复杂，再一次封装里面的过程

### 单例模式
```javascript cmd='node'
let createSingle = (function() {
    let _unique = null //使用闭包私有变量来安全存储这个单例

    return function() {
        if (_unique === null) {
            _unique = {a: 1}
        }
        return _unique
    }
})()
console.log(createSingle()===createSingle())
```

### 装饰器模式
拓展实例，使用一个外部的函数来对实例进行一些额外的操作，好处就是不必修改原来的构造函数

### 组合模式
将多个部分通过组合形成一个整体