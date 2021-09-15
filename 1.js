var positions1 = [1, 3, 5];
var positions2 = [1, 5];
var first = positions1[0],
  last = positions1[positions1.length - 1];
res = Infinity;
for (var i = 0; i < positions2.length; i++) {
  var e = positions2[i];
  var left = e - first;
  var right = last - e;
  res = Math.min(res, Math.max(left, right));
}
console.log(res);
