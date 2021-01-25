/**
 * 常用操作
 * @author:
 * @email:
 * @update:
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    factory();
  }
}(function($) {

  var fly = {};

  var callbackObject = function() {
    var obj = {};

    obj.done = function(callback) {
      if (callback) {
        this._done = callback;
      }
      return this;
    };

    obj.fail = function(callback) {
      if (callback) {
        this._fail = callback;
      }
      return this;
    };
    return obj;
  };

  var requestIos = function(service, action, callback, args) {
    var iFrame = document.createElement('iframe');
  
    var requestData = [service, action, callback, args];
    iFrame.setAttribute('src', 'iflytek:' + '?' + JSON.stringify(requestData));

    iFrame.setAttribute('style', 'display:none;');
    iFrame.setAttribute('height', '0');
    iFrame.setAttribute('width', '0');
    iFrame.setAttribute('frameborder', '0');
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
  };
  
  var requestAndroid = function(service, action, callback, args) {

    var requestData = [service, action, callback];
    if (callback) {
      requestData.push(callback);
    }
    return prompt('iflytek:' + JSON.stringify(requestData),
      JSON.stringify(args));
  }
  fly.os = (function() {
    var agent = navigator.userAgent,
      os = 'other';
    if (agent.match(/Android/i)) {
      os = 'android';
    } else if (agent.indexOf('iPhone') != -1 || agent.indexOf(
        'iPad') != -1) {
      os = 'ios';
    }
    return os;
  })();
  /**
   * 获取时间戳
   */
  fly.now = Date.now || function() {
    return new Date().getTime();
  };

  fly.request = function(options) {
    var obj = new callbackObject(),
      nsaction,
      service,
      action,
      callback,
      args = [''];
    options = options || {};
    nsaction = options.action.split('.');
    service = nsaction[0];
    action = nsaction[1];
    args = options.args || args;

    if (fly.os == 'android' && !options.callback) {
      var result;
      setTimeout(function() {
        result = requestAndroid(service, action,
          '', args);
        if (result) {
          if (typeof result === 'string') {
            if (result.indexOf('{') == 0 ||
              result.indexOf('[') == 0) {
              result = eval('(' + result +
                ')');
              if (result.code == 'Error') {
                obj._fail && obj._fail(result);
                return;
              }
            }
          }
          obj._done && obj._done(result.message);
        } else {
          obj._fail && obj._fail();
        }
      }, 0);
    } else {
      var timer, wait = 10000;
      var callback = options.callback || ('fly' + fly.now());

      window[callback] = function(dataName, data) {
        setTimeout(function() {
          obj._done && obj._done(dataName, data);
          window.callback = undefined;
        }, 0);
      };
      if (fly.os == 'ios') {
        requestIos(service, action, callback, args);
      } else {
        var result = requestAndroid(service, action,
          callback, args);
      }
      //TODO 加定时器 若一定时间没有执行完则报错
    }
    return obj;
  };

  return fly;
}));