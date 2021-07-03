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