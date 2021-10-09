function f(nums) {
  const target = 1;
  const index = [];
  // 求出所有target所在的位置
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      index.push(i + 1);
    }
  }
  // 其实就是找出在固定窗口内，非target元素的最少数量
  const count = index.length;
  let res = Infinity;
  for (let i = 0; i < index.length; i++) {
    const left = index[i],
      right = left + count - 1;
    let tmpRes = 0;
    for (let j = left; j <= right; j++) {
      if (index.indexOf(j) === -1) {
        tmpRes++;
      }
    }
    res = Math.min(res, tmpRes);
  }
  return res;
}

console.log(f([1, 1, 0, 0, 1]));
