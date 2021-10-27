let str = [5, 4, 2, 3, 1];
var trap = function (arr) {
  function mergeSort(arr, l, r) {
    if (l < r) {
      let mid = getIndex(arr, l, r);
      quickSort(arr, l, mid - 1);
      quickSort(arr, mid + 1, r);
    }
  }

  function merge(arr, l, r, mid) {
    let tmp = [];
    let lStart = l,
      rStart = mid + 1;
    while (lStart <= mid && rStart <= r) {
      if (arr[lStart] <= arr[rStart]) {
        tmp.push(arr[lStart]);
        lStart++;
      } else {
        tmp.push(arr[rStart]);
        rStart++;
      }
    }
    while (lStart <= mid) {
      tmp.push(arr[lStart]);
      lStart++;
    }
    while (rStart <= r) {
      tmp.push(arr[rStart]);
      rStart++;
    }
    let index = 0;
    for (let i = l; i <= r; i++) {
      arr[i] = tmp[index++];
    }
  }

  mergeSort(arr, 0, arr.length - 1);
  return arr;
};

console.log(trap(str));
