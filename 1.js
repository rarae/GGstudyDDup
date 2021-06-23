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