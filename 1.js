const createClock = (log, time) => new Promise(resolve => {
    setTimeout(() => {
        resolve(log);
    }, time);
});

let p1 = createClock(1, 5000);
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