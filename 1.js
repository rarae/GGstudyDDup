function wait(time, cb) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb();
      resolve();
    }, time);
  });
}

async function main() {
  while (true) {
    console.log("红灯");
    await wait(3000, () => {});
    console.log("黄灯");
    await wait(2000, () => {});
    console.log("绿灯");
    await wait(1000, () => {});
  }
}

main();
