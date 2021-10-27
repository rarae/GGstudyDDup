function myPromise(text) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(text);
    }, 3000 * Math.random());
  });
}

function dispatch(arr, max) {
  let res = new Array(arr.length).fill(-1);
  const total = arr.length;
  let received = 0;
  let chanel = 0;

  return new Promise((resolve, reject) => {
    function next() {
      if (arr.length > 0) {
        let p = arr.shift();
        const [index, promise] = p;
        promise.then((r) => {
          res[index] = r;
          console.log(r);
          received++;
          if (arr.length > 0) {
            next();
          }
          if (received >= total) {
            resolve(res);
          }
        });
      }
    }
    while (chanel < max) {
      chanel++;
      next();
    }
  });
}

let index = 1;
let arr = new Array(10).fill(0).map((v, index) => [index, myPromise(index++)]);
dispatch(arr, 2).then((res) => {
  console.log(res);
});
