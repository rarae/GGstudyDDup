M_P, M_N, M_TP = 1076, 1381, 625
S_P, S_N, S_TP = 1089, 1699, 233

p = (M_TP+S_TP)/(M_P+S_P)
r = (M_TP+S_TP)/(M_N+S_N)
f1 = (2.0 * p * r) / (p + r)
print(p, r, f1)