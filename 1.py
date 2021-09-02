import os
import io
import sys
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf8')
os.chdir('e:\\web\\GGstudyDDup\\')

f1 = open('1.txt', 'r', encoding='utf-8').readlines()
f2 = open('2.txt', 'r', encoding='utf-8').readlines()

for more in f2:
  if more not in f1:
    print(more)

