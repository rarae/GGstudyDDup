let S_P = 1872,
  S_N = 2167,
  S_TP = 383;

let M_P = 1076,
  M_N = 1381,
  M_TP = 522;

let p = (S_TP + M_TP) / (S_P + M_P);
let r = (S_TP + M_TP) / (S_N + M_N);
let f1 = (2 * p * r) / (p + r);

console.log(p, r, f1);
