define(function() {
    var requDataInterf = {
        //ios8以下系统
        /**
         *   @function      : iOSExec
         *   @abstract      : 向本地代码发送消息
         *   @discussion
         *   @param         : service－类名
         *   @param         : action－方法名
         *   @param         : args－参数
         */
        iosRequest: function(service, action, callBack, args) {
            var iFrame;
            iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", "iflytek:" + service + "?" + action + "&" + callBack + "&" + args);
            iFrame.setAttribute("style", "display:none;");
            iFrame.setAttribute("height", "0px");
            iFrame.setAttribute("width", "0px");
            iFrame.setAttribute("frameborder", "0");
            document.body.appendChild(iFrame);
            iFrame.parentNode.removeChild(iFrame);
            iFrame = null;
        },
        //调用引擎的java接口
        androidRequest: function(service, action, callBack,errorBack, args) {
            var result = prompt("iflytek:" + requDataInterf._stringify([service, action, callBack,errorBack]), requDataInterf._stringify(args));
            return result;
        },
        //将[xxx,yyy,...]组装成json数组
        _stringify: function(args) {
            if (typeof JSON === "undefined") {
                var s = "[";
                var i, type, start, name, nameType, a;
                for (i = 0; i < args.length; i++) {
                    if (args[i] !== null) {
                        if (i > 0) {
                            s = s + ",";
                        }
                        type = typeof args[i];
                        if ((type === "number") || (type === "boolean")) {
                            s = s + args[i];
                        } else if (args[i] instanceof Array) {
                            s = s + "[" + args[i] + "]";
                        } else if (args[i] instanceof Object) {
                            start = true;
                            s = s + '{';
                            for (name in args[i]) {
                                if (args[i][name] !== null) {
                                    if (!start) {
                                        s = s + ',';
                                    }
                                    s = s + '"' + name + '":';
                                    nameType = typeof args[i][name];
                                    if ((nameType === "number") || (nameType === "boolean")) {
                                        s = s + args[i][name];
                                    } else if ((typeof args[i][name]) === 'function') {
                                        // don't copy the functions
                                        s = s + '""';
                                    } else if (args[i][name] instanceof Object) {
                                        s = s + PhoneGap.stringify(args[i][name]);
                                    } else {
                                        s = s + '"' + args[i][name] + '"';
                                    }
                                    start = false;
                                }
                            }
                            s = s + '}';
                        } else {
                            a = args[i].replace(/\\/g, '\\\\');
                            a = a.replace(/"/g, '\\"');
                            s = s + '"' + a + '"';
                        }
                    }
                }
                s = s + "]";
                return s;
            } else {
                return JSON.stringify(args);
            }
        },
        getResultMessage: function(jsonStr) {
            var jsonObj = eval("(" + jsonStr + ")");
            return jsonObj.message;
        },
        requestData: function(service, action, callBack,errorBack,args) {
            if (navigator.userAgent.match(/Android/i)) {
                requDataInterf.androidRequest(service, action, callBack,errorBack, args);
            } else if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
                requDataInterf.iosRequest(service, action, callBack, args);
            }
        }
    };
    return requDataInterf;
});