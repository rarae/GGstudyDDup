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
将多个部分通过组合形成一个整体 比如组合寄生的继承方式

### 观察者模式
又叫发布订阅模式，或者消息模式
```javascript cmd='node'
let msgCenter = (function() {
    let _msg = {}
    return {
        //注册一个事件
        register: function(type, fn) {
            if (_msg[type]) {
                _msg[type].push(fn)
            } else {
                _msg[type] = [fn]
            }
        },
        //发布一个事件
        fire: function(type, args) {
            if (_msg[type]) {
                let event = {
                    type: type,
                    args: args || {}
                }
                for (let i=0; i<_msg[type].length; i++) {
                    _msg[type][i](event)
                }
            } else {
                console.log(`没有${type}的消息订阅`)
            }
        },
        //取消一个事件
        cancel: function(type, fn) {
            if (_msg[type]) {
                for (let i=0; i<_msg[type].length; i++) {
                    if (_msg[type][i] === fn) {
                        _msg[type].splice(i, 1)
                    }
                }
            } else {
                console.log(`没有${type}的消息订阅`)
            }
        }
    }
})()

function Person() {
    this.alreadyRegister = {}
}
Person.prototype = {
    register: function(type, fn) {
        if (this.alreadyRegister[type]) {
            console.log('不可重复订阅')
        } else {
            msgCenter.register(type, fn)
            this.alreadyRegister[type] = fn
        }
    },
    cancel: function(type) {
        if (!this.alreadyRegister[type]) {
            console.log('不存在该事件')
        } else {
            msgCenter.cancel(type, this.alreadyRegister[type])
            delete this.alreadyRegister[type]
        }
    }
}

let person1 = new Person()
person1.register('newsInfo', function(e){
    console.log(e.type, e.args.info)
})

msgCenter.fire('newsInfo', {info: '某国领导人访华'})
```

### 策略模式
有多种状态或策略需要进行选择的时候，将所有的选择、策略封装在一起，只给外部暴露出必要的接口
```javascript cmd='node'
let formStrategy = (function () {
    const _strategy = {
        notEmpty: function (value) {
            return value.length === 0 ? '请填写内容' : ''
        },
        isNumber: function (value) {
            const reg = /^[0-9]+(\.[0-9]+)?$/
            return reg.test(value) ? '' : '请填写数字'
        },
        isPhoneNumber: function (value) {
            //010-12345678  0202-1234567
            const reg = /^\d{3}-\d{8}|\d{4}-\d{7}$/
            return reg.test(value) ? '' : '请输入正确的正确号码'
        }
    }

    return {
        validate: function (type, value) {
            value = value.replace(/^\s+|\s+$/, '')
            return _strategy[type] ? _strategy[type](value) : '没有这个检测方法'
        },
        addStrategy: function (type, fn) {
            if (_strategy[type]) {
                return '这个方法已经存在'
            } else {
                _strategy[type] = fn
            }
        }
    }

})()

console.log(formStrategy.validate('notEmpty', ''))
```

### 链模式
实现链式调用，在自身方法中返回自身
```javascript cmd='node'
const o = {
    a: function(){
        console.log('aaa')
        return this
    },
    b: function(){
        console.log('bbb')
        return this
    }
}

o.a().b().a().b()
```