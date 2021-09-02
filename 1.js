var longestPalindromeSubseq = function (s) {
  const l = s.length,
    dp = new Array(l);
  for (let i = 0; i < l; i++) {
    dp[i] = new Array(l).fill(0);
    dp[i][i] = 1;
  }

  for (let i = l - 1; i >= 0; i--) {
    for (let j = i + 1; j < l; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][l - 1];
};
console.log(longestPalindromeSubseq("bbbab"));
