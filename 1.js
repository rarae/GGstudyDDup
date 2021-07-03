// 发布订阅
// 仿照vue的事件总线来实现 on注册方法 emit发布方法

let msgCenter = (function () {
  let _msgCenter = {};
  return {
    $on: function (type, fn) {
      if (_msgCenter[type]) {
        if (_msgCenter[type].some((item) => item === fn)) return;
        _msgCenter[type].push(fn);
        return;
      }
      _msgCenter[type] = [fn];
    },
    $emit: function (type, ...args) {
      let arr = _msgCenter[type] || [];
      arr.forEach((item) => {
        item(...args);
      });
    },
  };
})();

export default msgCenter;
