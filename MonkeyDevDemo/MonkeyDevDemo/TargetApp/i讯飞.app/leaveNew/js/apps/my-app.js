var app = new Framework7({
    init: false,
    root: '#app',
    name: 'leave',
    id: 'com.app.leave',
    theme: 'ios',
    dialog: {
        // set default title for all dialog shortcuts
        title: ' ',
        // change default "OK" button text
        buttonOk: '确定',
        buttonCancel: '取消'

    },
    routes: [
        {
            name: 'waitMaintan',
            path: '/',
            url: './index.html'
        },
        {
            path: '/askForLeave/',
            componentUrl: './pages/askForLeave/askForLeave.html',
        },
        {
            path: '/approval/',
            componentUrl: './pages/approval/approval.html',
        },
        {
            path: '/warn/',
            url: './pages/warnPage/warnPage.html',
        },
        {
            path: '/iframe/',
            componentUrl: './pages/iframe/iframe.html',
        },
        {
            path: '/maintain/',
            async: function (routeTo, routeFrom, resolve, reject) {

                var today = new Date(), dataJson = {
                    "personNumber": sessionStorage.getItem('userCode'),
                    "processStates": '0',
                    "startDate": leaveCircleBegin(),//
                    "endDate": today.format("yyyy-MM-dd")
                }, _this = this;

                postData('getLeaveListByDateNew', function (data) {
                    if (data.result) {
                        resolve({
                            componentUrl: './pages/maintain/maintain.html',
                        }, {
                                context: {
                                    listData: [data]
                                },
                            }
                        );
                    }
                }, dataJson)
            }

        }
    ]
});
var $$ = Dom7;
var mainView = app.views.create('.view-main'), isIOS;


Template7.registerHelper('monthDay', function (status, options) {//异常
    if (status) {
        return (new Date(status).getMonth() + 1) + '月' + new Date(status).getDate() + '日'
    }
});
// 判断一周
Template7.registerHelper('weekLeave', function (status, options) {//异常
    if (status) {
        var date = status.split('-');
        var leaveDay = new Date(date[0], Number(date[1] - 1), date[2])
        switch (leaveDay.getDay()) {
            case 0:
                return '周日';
                break;
            case 1:
                return '周一';
                break;
            case 2:
                return '周二';
                break;
            case 3:
                return '周三';
                break;
            case 4:
                return '周四';
                break;
            case 5:
                return '周五';
                break;
            default:
                return '周六';
        }
    }
});

//早上打卡时间判断 08:40以后打卡为异常
Template7.registerHelper('startJudge', function (status, options) {//异常
    if (status) {
        var date = status.date.split('-'), time = status.startTime,
            standartTime = new Date(date[0], date[1], date[2], 8, 40), itemTime;
        if (time == null) {
            return '<font class="text-color-red">未打卡</font>'
        } else {
            time = time.split(':')
        }
        itemTime = new Date(date[0], date[1], date[2], time[0], time[1])

        if (standartTime < itemTime) {
            return '<font class="text-color-red">' + status.startTime + '</font>'
        } else {
            return '<font>' + status.startTime + '</font>'
        }
    }
});

//晚上打卡时间判断 17:20以前打卡为异常
Template7.registerHelper('endJudge', function (status, options) {//异常
    if (status) {
        var date = status.date.split('-'), time = status.endTime,
            standartTime = new Date(date[0], date[1], date[2], 17, 20), itemTime;
        if (time == null) {
            return '<font class="text-color-red">未打卡</font>'
        } else {
            time = time.split(':')
        }
        itemTime = new Date(date[0], date[1], date[2], time[0], time[1])

        if (standartTime > itemTime) {
            return '<font class="text-color-red">' + status.endTime + '</font>'
        } else {
            return '<font>' + status.endTime + '</font>'
        }
    }
});

//请假日期
Template7.registerHelper('leaveDate', function (status, options) {
    if (!status) return;
    var dateArr = '', date = '', fullDate = '', weekDay = '';
    if (status.leaveTypeId == '06' || status.leaveTypeId == '07' || status.leaveTypeId == '08') {
        date = status.date;
    } else {
        dateArr = status.split(' ');
        date = dateArr[0]
    }

    fullDate = new Date(date);
    fullMonth = fullDate.getMonth() + 1;
    switch (fullDate.getDay()) {
        case 0:
            weekDay = '周日';
            break;
        case 1:
            weekDay = '周一';
            break;
        case 2:
            weekDay = '周二';
            break;
        case 3:
            weekDay = '周三';
            break;
        case 4:
            weekDay = '周四';
            break;
        case 5:
            weekDay = '周五';
            break;
        default:
            weekDay = '周六';
    }
    if (status.leaveTypeId == '06' || status.leaveTypeId == '07' || status.leaveTypeId == '08') {
        if (status.status == '正在处理') {
            return fullDate.getFullYear() + '年' + (fullMonth < 10 ? '0' + fullMonth : fullMonth) + '月' + (fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()) + '日 ' + weekDay + ' '
        } else {
            return fullDate.getFullYear() + '年' + (fullMonth < 10 ? '0' + fullMonth : fullMonth) + '月' + (fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()) + '日 ' + weekDay + ' '
        }
    }
    return fullDate.getFullYear() + '年' + (fullMonth < 10 ? '0' + fullMonth : fullMonth) + '月' + (fullDate.getDate() < 10 ? '0' + fullDate.getDate() : fullDate.getDate()) + '日 ' + weekDay + ' ' + dateArr[1]
})

//日历
Template7.registerHelper('monthDays', function (status, options) {

    var days = new Date(status.getFullYear(), status.getMonth() + 1, 0).getDate(),
        firstDay = new Date(status.getFullYear(), status.getMonth(), 1).getDay(),
        endDay = new Date(status.getFullYear(), status.getMonth(), days).getDay(), htm = '', classRed;
    classRed = options.data.index == 2 ? 'text-color-red ifly-ancol' : 'text-color-black';

    for (var i = 0; i < 7; i++) {//添加头部月份显示
        if (i == firstDay) {
            htm += '<div class="col-14 text-align-center"><b class="' + classRed + '">' + (status.getMonth() + 1) + '月</b></div>'
        } else {
            htm += '<div class="col-14 text-align-center"></div>'
        }
    }

    for (var i = 0; i < firstDay; i++) {
        htm += '<div class="col-14 text-align-center"></div>'
    }
    for (var i = 0; i < days; i++) {//渲染日期
        var classBlack;
        classBlack = ((options.data.index == 1 && i >= 25) || (options.data.index == 2 && i < 25)) ? 'text-color-black' : '';
        htm += '<div date="' + status.getFullYear() + '-' + ((status.getMonth() + 1) < 10 ? '0' + (status.getMonth() + 1) : (status.getMonth() + 1)) + '-' + ((i + 1) < 10 ? '0' + (i + 1) : (i + 1)) + '" class="col-14 text-align-center ifly-button-top ' + classBlack + '"><b>' + (i + 1) + '</b><span class="ifly-tag">&nbsp;</span><span class="ifly-tag">&nbsp;</span></div>'
    }
    for (var i = 0; i < 6 - endDay; i++) {
        htm += '<div class="col-14 text-align-center"></div>'
    }
    return htm
})

app.on('pageInit', function (page) {
    var pageName = page.name,
        userAccount = sessionStorage.getItem('userAccount'),
        token = sessionStorage.getItem('token'),
        fnumber = sessionStorage.getItem('userCode');

    // page 考勤维护
    if (pageName == 'waitMaintan') {

        var listTemplate = $$('script#listTemplate').html();
        var compiledListTemplate = Template7.compile(listTemplate);

        var listAlreadyTemplate = $$('script#listAlreadyTemplate').html();
        var compiledListAlreadyTemplate = Template7.compile(listAlreadyTemplate);

        // 初始化数据
        loadData($$('.navbar .tabbar').children('.tab-link-active').index());

        // 下拉刷新
        var ptr = app.ptr.create('.ptr-content');
        ptr.on('ptrRefresh', function (e) {

            setTimeout(function () {// When loading done, we need to reset it
                loadData($$('.navbar .tabbar').children('.tab-link-active').index())
                app.ptr.done(); // or e.detail();
            }, 2000);
        })

        // tab切换
        $$('.navbar .tabbar').children().click(function () {

            if ($$(this).hasClass('tab-link-active')) return;
            var _this = this;
            loadData($$(this).index(), function () {
                $$('.navbar .tabbar').children('.tab-link-active').removeClass('tab-link-active');
                $$(_this).addClass('tab-link-active');
            })
        });

        // 返回首页
        $$('#backHome').click(backHome)

        /**
         * [loadData 待维护/已提交数据加载]
         * @DateTime  2018-06-12T10:40:54+0800
         * @param     {[type]}                 processStates [0：待维护；1：已提交]
         * @param     {Function}               callback      [回调]
         */
        function loadData(processStates, callback) {
            var today = new Date(), dataJson = {
                "personNumber": sessionStorage.getItem('userCode'),
                "processStates": processStates,
                "startDate": leaveCircleBegin(),//leaveCircleBegin()
                "endDate": leaveCircleEnd()
            };
            // console.log("考勤维护参数===" + JSON.stringify(dataJson));
            postData('getLeaveListByDateNew', function (data) {
                console.log(data);
                if (data.result) {
                    callback && callback();
                    dataJson.processStates == "0" ? $$('#listWap').html(compiledListTemplate(data)) : $$('#listWap').html(compiledListAlreadyTemplate(data))
                }
            }, dataJson)

        }
    }

    // page 记录页面
    if (pageName == 'record') {

        // 渲染日历
        var nowDate = new Date(), nowMonth = nowDate.getMonth(), prevDate, prevprevDate;
        if (nowMonth == 0) {
            prevprevDate = new Date(nowDate.getFullYear() - 1, 10);
            prevDate = new Date(nowDate.getFullYear() - 1, 11);
        } else if (nowMonth == 1) {
            prevprevDate = new Date(nowDate.getFullYear() - 1, 11);
            prevDate = new Date(nowDate.getFullYear(), nowMonth - 1);
        } else {
            prevprevDate = new Date(nowDate.getFullYear(), nowMonth - 2);
            prevDate = new Date(nowDate.getFullYear(), nowMonth - 1);
        }
        var recordTemplate = $$('script#recordTemplate').html();
        var compileRecordTemplate = Template7.compile(recordTemplate);
        $$('#recordList').html(compileRecordTemplate([prevprevDate, prevDate, nowDate]));
        $$('.page-content').scrollTop(parseInt($$('.ifly-ancol')[0].offsetTop - 163));

        $$('#titleRecord').html(nowDate.getFullYear() + '年');//获取年份
        // 获取考勤数据
        var dataJSON = JSON.stringify({
            "UserAccount": sessionStorage.getItem('userAccount'),
            "Token": sessionStorage.getItem('token'),
            "OpeType": "Client016",
            "UserID": sessionStorage.getItem('userCode'),
            "IMEI": "",
            "Version ": "1007"
        });

        // 刷新
        $$('#refresh').click(function () {
            recordInit(true)
        });
        //下拉刷新
        var $ptrContent = $$('.record-ptr-content');
        // Add 'refresh' listener on it
        $ptrContent.on('ptr:refresh', function (e) {
            // Emulate 2s loading
            setTimeout(function () {
                recordInit(true, true);
                // When loading done, we need to reset it
                app.ptr.done(); // or e.detail();
            }, 1000);
        });

        // 回到首页
        $$('#backHome').click(backHome)

        // 渲染考勤数据
        function recordInit(warn, load) {
            !load && app.preloader.show();
            var signUrl = 'https://iflyapp.iflytek.com:6443/AttendanceService/iflytekservices/Client/AttendanceByiFly';
            //https://iflyapp.iflytek.com:6443/AttendanceService/iflytekservices/Client/AttendanceByiFly // 选择正式环境的时候使用
            //http://60.166.12.119:7080/AttendanceService/iflytekservices/Client/AttendanceByiFly // 测试的时候需要使用的
            app.request.post(signUrl, dataJSON, function (data) {

                app.preloader.hide();
                var data = JSON.parse(data), days;

                console.log(data)
                if (data.Success == 'true') {
                    days = data.Content.AttendanceList;
                    days.forEach(function (item) {
                        //if(item.AttendanceType=='001'){
                        $$('#recordList').children().filter(function () {
                            return $$(this).attr('date') != undefined && this;
                        }).each(function () {
                            var nowDate = $$(this).attr('date'), itemDate = item.attendanceDate, today = new Date();
                            todayDate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate());
                            if ($$(this).attr('date')) {
                                // debugger
                                if (new Date(nowDate) - new Date(itemDate) == 0) {
                                    $$(this).children('.ifly-tag').remove();
                                    if (new Date(nowDate) - new Date(todayDate) == 0) {

                                        $$(this).append(judgeSate('6', item.firstAttendanceTime));
                                        $$(this).append(judgeSate('6', item.lastAttendanceTime));
                                    } else {
                                        $$(this).append(judgeSate(item.firstAttendanceStatus, item.firstAttendanceTime));
                                        $$(this).append(judgeSate(item.lastAttendanceStatus, item.lastAttendanceTime));
                                    }
                                }
                            }
                        })
                        // }
                    })

                    warn && app.toast.create({
                        text: '刷新成功',
                        position: 'center',
                        closeTimeout: 1500
                    }).open()
                } else {
                    app.dialog.alert(data.Content.Message, function () {
                        if (data.Content.Message.toLowerCase().indexOf("token") >= 0 || data.Content.Message.toLowerCase().indexOf("重新登录") >= 0) {
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
                    })
                }

            }, function () {
                app.preloader.hide();
                page.$el.find('.page-content').html('<div class="col-100 text-align-center ifly-data-empty">' +
                    '<img src="img/ifly-error.png" width="30%" alt="">' +
                    '<p>请求出错，请稍后重试</p>' +
                    '</div>');
                app.dialog.alert('', '访问失败！请检查你的网络');
                app.preloader.hide();
            })
        }
        recordInit();

        // 根据打卡时间判断状态
        function judgeSate(status, data) {
            switch (status) {
                case '1'://异常数据
                    return '<span class="ifly-tag tag-red">' + data + '</span>';
                    break;
                case '2':
                    return '<span class="ifly-tag tag-red">未打卡</span>';
                    break;
                case '4':
                    return '<span class="ifly-tag tag-blue">已维护</span>';
                    break;
                case '3'://3：维护中；
                    return '<span class="ifly-tag tag-default">处理中</span>';
                    break;
                case '6'://6：当天打卡；
                    return '<span class="ifly-tag">' + (data == 'null' ? '' : data) + '</span>';
                    break;
                default:
                    return '<span class="ifly-tag">' + (data == 'null' ? '' : '正常') + '</span>';
                    break;
            }
        }
    }

    // 打卡功能说明
    if (pageName == 'checkIn') {

        // 获取内容
        iflyRequest({
            methodCode: 'B100010052',
            userAccount: userAccount,
            token: token
        }, function (data) {
            if (data.result) {
                $$('#checkInTitle').html(data.content.title);
                $$(page.el).children('.page-content').html(data.content.content)
            } else {
                $$(page.el).children('.page-content').html('<div class="col-100 text-align-center ifly-data-empty">' +
                    '<img src="img/ifly-error.png" width="30%" alt="">' +
                    '<p>请求出错，请稍后重试</p>' +
                    '</div>')
            }
            console.log(data)
        })
    }
})

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * [checkPhone 手机号码格式]
 * @DateTime  2018-06-13T12:46:36+0800
 * @param     {[type]}                 str [description]
 * @return    {[type]}                     [description]
 */
function checkPhone(str) {
    if (!(/^1[34578]\d{9}$/.test(str))) {
        app.dialog.alert("手机号码有误，请重新填写");
        return false;
    }
    return true
}

/**
 * [leaveCircleBegin 考勤周期开始时间、结束时间周期]
 * @DateTime  2018-06-13T10:33:05+0800
 * @return    {[type]}                 [description]
 */
function leaveCircleBegin() {
    var today = new Date();
    if (today.getMonth() == 0) {
        return new Date(today.getFullYear() - 1, 10).format("yyyy-MM-dd");
    } else if (today.getMonth() == 1) {
        return new Date(today.getFullYear() - 1, 11).format("yyyy-MM-dd");
    } else {
        return new Date(today.getFullYear(), today.getMonth() - 2).format("yyyy-MM-dd");
    }

}

function leaveCircleEnd() {
    var today = new Date();
    if (today.getMonth() == 10) {
        return new Date(today.getFullYear() + 1, 0).format("yyyy-MM-dd")
    } else if (today.getMonth() == 11) {
        return new Date(today.getFullYear() + 1, 1).format("yyyy-MM-dd")
    } {
        return new Date(today.getFullYear(), today.getMonth() + 2).format("yyyy-MM-dd")
    }
}

/**
 * [postData description]
 * @DateTime  2018-06-12T10:46:59+0800
 * @param     {[type]}                 url      [description]
 * @param     {Function}               callback [description]
 * @param     {[type]}                 data     [description]
 * @return    {[type]}                          [description]
 */
function postData(url, callback, data) {

    app.preloader.show();
    //var dealOAAttendanceURL='http://10.1.203.163:6080/AttendanceService/iflytekservices/dealOAAttendance/';
//    var dealOAAttendanceURL = 'http://60.166.12.119:7080/AttendanceService/iflytekservices/dealOAAttendance/';
    // var dealOAAttendanceURL='http://iflyapp.iflytek.com:680/AttendanceService/iflytekservices/dealOAAttendance/';
     var dealOAAttendanceURL='https://iflyapp.iflytek.com:6443/AttendanceService/iflytekservices/dealOAAttendance/';
    // var dealOAAttendanceURL = 'http://10.1.225.21:6080/AttendanceService/iflytekservices/dealOAAttendance/'
    var url = dealOAAttendanceURL + url;

    var json = {
        "userAccount": sessionStorage.getItem('userAccount'),
        "token": sessionStorage.getItem('token'),
        "fnumber": sessionStorage.getItem('userCode'),
        "fphone": ""
    }

    if (data) {
        for (key in data) {
            json[key] = data[key];
        }
    }
    console.log("url=" + url + "参数是" + JSON.stringify(json))
    app.request.post(url, JSON.stringify(json), function (data) {

        app.preloader.hide();

        var data = JSON.parse(data);
        if (!data.result || data.result == 'false') {
            app.dialog.alert(data.message, function () {
                if (data.message.toLowerCase().indexOf("token") >= 0) {
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
            })
            return
        }

        callback(data);
    }, function () {

        app.dialog.alert('', '访问失败！请检查你的网络');
        app.preloader.hide();
    })
}

/**
 * [iflyRequest description]
 * @DateTime  2018-06-04T11:32:04+0800
 * @param     {[type]}                 data     [请求参数]
 * @param     {Function}               callback [回调]
 * @return    {[type]}                          [description]
 */
function iflyRequest(data, callback) {

    app.preloader.show();

    // 数据加密
    data = JSON.stringify(data);

    var userInfo = {
        securityKey: sessionStorage.getItem('securityKey')
    };

    // userInfo = JSON.parse(userInfo);
    var dataKey = CryptoJS.enc.Utf8.parse(userInfo.securityKey);
    var dataSrcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(dataSrcs, dataKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    var securityData = {
        "securityData": encrypted.toString()
    };
    securityData = JSON.stringify(securityData);


    //var transFerUrl = 'http://192.168.57.12:9080/TyTransService/tytranservice/transfer/transInterface';
//    var transFerUrl = 'http://60.166.12.119:9080/TyTransService/tytranservice/transfer/transInterface', postUrl;
    // var transFerUrl = 'http://iflyapp.iflytek.com:980/TyTransService/tytranservice/transfer/transInterface';
     var transFerUrl = 'https://iflyapp.iflytek.com:9443/TyTransService/tytranservice/transfer/transInterface';

    app.request.post(transFerUrl, securityData, function (result) {

        var securityData = JSON.parse(result);
        securityData = securityData.securityData;
        //数据解密
        var decrypt = CryptoJS.AES.decrypt(securityData, dataKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        decrypt = CryptoJS.enc.Utf8.stringify(decrypt).toString();
        var jsonData = JSON.parse(decrypt);
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
        app.preloader.hide();
        console.log(jsonData);
        callback(jsonData);

        app.preloader.hide();
    }, function () {
        app.dialog.alert('访问失败！请检查你的网络'); app.preloader.hide();
    });
}

/**
 * [getParameter description]
 * @DateTime  2018-06-04T11:32:04+0800
 * @param     {[type]}                 param     [请求参数]
 */
function getParameter(param) {
    var query = window.location.search; //获取URL地址中？后的所有字符
    var iLen = param.length; //获取你的参数名称长度
    var iStart = query.indexOf(param); //获取你该参数名称的其实索引
    if (iStart == -1) //-1为没有该参数
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart); //获取第二个参数的其实索引
    if (iEnd == -1) //只有一个参数
        return query.substring(iStart); //获取单个参数的参数值
    return query.substring(iStart, iEnd); //获取第二个参数的值
}

/**
 * [backHome 回到首页]
 * @DateTime  2018-06-04T11:32:04+0800
 */
function backHome() {
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

/**
 * [backHome 底部导航]
 * @DateTime  2018-06-04T11:32:04+0800
 */
function showTabBarJS(type) {
    if (isIOS) {
        try {
            type ? showTabbar() : hideTabbar();
        } catch (error) {
            if (type) {
                window.webkit.messageHandlers.showTabBarAction.postMessage(null);
            } else {
                window.webkit.messageHandlers.hideTabBarAction.postMessage(null);
            }
        }
    } else {
        type ? iflyapp.showTabbar() : iflyapp.hideTabbar();
    }
}

// PS工号转换为实际工号
function getEmplCode(num) {
    if (num.indexOf('BD') != -1) {
        return num.replace(/BD/, 'BEST')
    }
    if (num.indexOf('JD') != -1) {
        return num.replace(/JD/, 'WHJD')
    }
    if (num.indexOf('BB') != -1) {
        return num.replace(/BB/, 'BBXF')
    }
    if (num.indexOf('BZ') != -1) {
        return num.replace(/BZ/, 'BZXF')
    }
    if (num.indexOf('FY') != -1) {
        return num.replace(/FY/, 'FYSM')
    }
    if (num.indexOf('HB') != -1) {
        return num.replace(/HB/, 'HBXF')
    }
    if (num.indexOf('HN') != -1) {
        return num.replace(/HN/, 'HNXF')
    }
    if (num.indexOf('JL') != -1) {
        return num.replace(/JL/, 'JLXF')
    }
    if (num.indexOf('SZ') != -1) {
        return num.replace(/SZ/, 'SZXF')
    }
    if (num.indexOf('XY') != -1) {
        return num.replace(/XY/, 'XYXF')
    }
    if (num.indexOf('JC') != -1) {
        return num.replace(/JC/, 'XFJC')
    }
    return num;
}

/**
 * [transferTokenAndUserIDCallBack 原生返回数据]
 * @DateTime  2018-06-12T10:43:49+0800
 * @param     {[type]}                 userAccount [description]
 * @param     {[type]}                 token       [description]
 * @param     {[type]}                 userName    [description]
 * @param     {[type]}                 userId      [description]
 * @param     {[type]}                 userOrgId   [description]
 * @param     {[type]}                 userCode    [description]
 * @param     {[type]}                 securityKey [description]
 * @return    {[type]}                             [description]
 */
function transferTokenAndUserIDCallBack(userAccount, token, userName, userId, userOrgId, userCode, securityKey) {
    console.log("transferTokenAndUserIDCallBack==" + "userAccount=" + userAccount + ";token=" + token + ";userName=" + userName + ";userId=" + userId + ";userOrgId=" + userOrgId + ";userCode=" + userCode + ";securityKey=" + securityKey);
    sessionStorage.setItem("userAccount", userAccount);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userOrgId", userOrgId);
    sessionStorage.setItem("userCode", userCode);
    sessionStorage.setItem("securityKey", securityKey);

    app.init()
}

// transferTokenAndUserIDCallBack('qizhu2','sIA8L10N7PlG2UWRVNEXI7q1LZXMmygk_LIXLj2uAt9MIA0uG7Hj.rRLGD1csHmbwyZRYpWW6tpSEk9iV.U72knk5gdBAmU.LUhMCxB2hQw=','朱琪','RIbfSS0G0iHgUy1kEKzfYIDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','2016112860','1280977330000000');
// transferTokenAndUserIDCallBack('feiliu6','7c3fDJPEg7IXX06VY65KQjsnLIbgVRGxCJsCjdxnmkQPxpncnz9uixu4zwm3QFdPvkbh_6tUCxyKnu.RRCUxPW3thg1y9tvlOkzBi2kqaDI=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','20160165','1280977330000000')
// transferTokenAndUserIDCallBack('jfai','sZ8ui9TjKC4ERTGjH.FneBZ3fmepvs0PhFpnGJ2gidSHe0cYOBZSCWraThLYlJO.OnhOF26Q3Jj1yIx4SJoiD.3OMz34hn.XSwEtvX4L1FY=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','20120333','1280977330000000')
// transferTokenAndUserIDCallBack('xjgao','EjC_qwQg5LEVU2bRjV0Lg8n7.7pKIQn0x0LlSeYLuorScCMtPa69WOipGH9VvLF9NGbsEh8nv5Cq..tZv1hWoj1oVK2guseLf5rIG5FWNGs=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','20100309','1280977330000000')
// transferTokenAndUserIDCallBack('ybpan','JW385IEll19sjqBjTqDQ80YtX9ggj2t3fQYWrfCq1rmbtMjTJKyXNIylT9nF.W7mcfs.C_ov4g1mwxCoDRYhmohK.7xhMjAvLejnLHCpahQ=','潘永波','768b0b5f-315f-4b09-a9a8-ffbe025867c9','','2017003161','1280977330000000')
// transferTokenAndUserIDCallBack('knzheng','0cSnlFHzwEeEABEBAFaiB.y11pFwCFFLlTKZ3iCaCoHsNvNcg33EgWu41V0CDe15Z5l0XbKXz8lJ0nPQl3nPfGLu4yRCf95SYHlvO1KtAy4=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','ETS160053','1280977330000000')
// transferTokenAndUserIDCallBack('jieliu6','CUclDwupRJkwGebVLmhtanA2beRMfr9sOc6eYNdFVsMT7HOIgCah_c94CvSOpEuX9In8hCkpkgYDajoPXGZ8xVGAaEaZY6WDkFbX9J5g.j0=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','20150063','1280977330000000')

// transferTokenAndUserIDCallBack('jingzhou2','dnAhJLzXno51EwqDte14l7vqwPgEnP6rwIzQu7wZtvdfqfyV.x4LB17WPG7Yg2zmomCnK6fpwWaaG3P2chVAZ88VNHKvC5rJf9k_8MmUBMw=','周晶','','7da006b4-e731-4040-a483-deadd516a4f9','20120333','1280977330000000')
// transferTokenAndUserIDCallBack('hywu2','my3YwjwAjjSi37AUtHgYc52PmnLWehdjHdGWTrk8hi3mydX6ajBUjePRa1lAwddK1N7zCEzD.x4tHleWJtlx_HfFWDz1aaoPJhXJC_SRJG4=','周晶','','7da006b4-e731-4040-a483-deadd516a4f9','20160068','1280977330000000')


/**
 * [transferTokenAndUserIDCallBack 原生返回数据]
 * @DateTime  2018-07-09
 * */
function init() {
    isIOS = getParameter("isIOS") === 'true';
    if (isIOS) {
        try {
            getTokenAndUserAccount();
        } catch (error) {
            window.webkit.messageHandlers.getTokenAndUserAccount.postMessage(null);
        }
    } else {
        iflyapp.getTokenAndUserAccount();
    }
}
init();
