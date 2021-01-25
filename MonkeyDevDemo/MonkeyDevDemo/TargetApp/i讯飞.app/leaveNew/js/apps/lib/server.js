/**
 * 统一的请求方法
 * */
function iflyRequest(data, callback) {
    //var url = 'http://192.168.57.12:9080/TyTransService/tytranservice/transfer/transInterface';
//    var url = 'http://60.166.12.119:9080/TyTransService/tytranservice/transfer/transInterface';
    // var url = 'http://iflyapp.iflytek.com:980/TyTransService/tytranservice/transfer/transInterface';
     var url = 'https://iflyapp.iflytek.com:9443/TyTransService/tytranservice/transfer/transInterface';

    data = JSON.stringify(data);
    //数据加密
    var dataKey = CryptoJS.enc.Utf8.parse(sessionStorage.getItem("securityKey"));
    var dataSrcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(dataSrcs, dataKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    var securityData = { "securityData": encrypted.toString() }
    securityData = JSON.stringify(securityData);
    $$.ajax({
        url: url,
        method: 'POST',
        async: true,
        data: securityData,
        //dataType: 'json',
        success: function (data) {
            var securityData = JSON.parse(data);
            securityData = securityData.securityData;
            //数据解密
            var decrypt = CryptoJS.AES.decrypt(securityData, dataKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            decrypt = CryptoJS.enc.Utf8.stringify(decrypt).toString();
            var jsonData = JSON.parse(decrypt);
            //判断token是否失效
            if (jsonData.message.toLowerCase().indexOf("token") >= 0) {
                if (isIOS) {
                    try {
                        illegalTokenAction();
                    } catch (error) {
                        window.webkit.messageHandlers.illegalTokenAction.postMessage(null);
                    }
                } else {
                    iflyapp.illegalTokenAction();
                }
            }
            //回调
            callback(jsonData);
        },
        error: function () {
            app.dialog.alert('网络请求异常，请重新尝试', '提醒');
        }
    });
}

/**
 * android端返回键注册
 */
function BackToBefore() {
    RouterBack();
}
/**
 * 返回上一界面并注册返回键
 * @constructor
 */
function RouterBack() {
    if (isPopupOpened) {
        myApp.closeModal();
        myPhotoBrowserPopup.close();
        isPopupOpened = false;
    } else {
        registerBackButton(1, function () {
            RouterBack();
        });
    }
}
/**
 * @description 返回主页面
 */
function backToMainPage() {
    if (isPopupOpened) {
        myApp.closeModal();
        myPhotoBrowserPopup.close();
        isPopupOpened = false;
    }
    else {

        require.config(requireConfig);
        if (isIOS) {
            try {
                backToMainPageAction();
            } catch (error) {
                window.webkit.messageHandlers.backToMainPageAction.postMessage(null);
            }
        } else {
            iflyapp.backToMainPage();
        }
    }
}



/**
 * @description 注册安卓返回键
 * @param type 返回类型，1为返回上一页，2为返回到首页，3为退出应用
 * @param cb 回调函数
 */
function registerBackButton(type, cb) {
    if (!isIOS) {
        window.registerBackButtonCallBack = function () {
            if (cb) {
                cb();
            }
        };

        iflyapp.setBackButtonType(type);
    }
}
