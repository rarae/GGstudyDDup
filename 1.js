var per = function (s) {
  const res = [],
    l = s.length;

  function dfs(ed, startIndex) {
    if (ed.length === 3 && ed.reduce((pre, cur, index, arr) => pre + cur)===7) {
      res.push([...ed]);
    }
    for (let i = startIndex; i < l; i++) {
      ed.push(s[i]);
      dfs(ed, i + 1);
      ed.pop();
    }
  }
  dfs([], 0);
  console.log(res);
};

per([1, 2, 3, 4, 5, 6, 7, 8, 9]);
