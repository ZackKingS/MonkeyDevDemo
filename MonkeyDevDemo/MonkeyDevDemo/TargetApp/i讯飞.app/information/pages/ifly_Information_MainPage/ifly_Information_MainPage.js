$$(document).on('pageInit', '.page[data-page="ifly_Information"]', function (e) {

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

    //测试数据接口
    getNewsList(showNewList);

    $$('#tab1').on('show', function () {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));
        if ($$('.NewsList li').length == 0) {
            pageCount_tab1 = 1;

            // 	  var myExpenseAccountPage = $$('.tab');
            // 	myApp.initPullToRefresh();
            getNewsList(showNewList);
        }


    });
    $$('#tab3').on('show', function () {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));
        if ($$('#notice_List li').length == 0) {
            pageCount_tab2 = 1;

            getNotice(showNotice);
        }

    });

    $$('#tab4').on('show', function () {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));
        if ($$('#document_List li').length == 0) {
            pageCount_tab4 = 1;

            getDocument(showDocument);
        }

    });

    var myExpenseAccountPage = $$('.tab');

    myExpenseAccountPage.on('pullmove', function (e) {
        // pull down
        //		var translateY=ifly_MainPage.css('transform').replace(/[(A-Za-z)]/g,'').split(',')[1];
        //		if(translateY>50){
        //			ifly_MainPage.css('transform','translate3d(0px,50px,0px)')
        //		}

        if (e.detail.touchesDiff > 50) {
            if ($$('#tab1').hasClass('active')) {
                $$('#tab1').css('transform', 'translate3d(0px,50px,0px)')
            } else if ($$('#tab3').hasClass('active')) {
                $$('#tab3').css('transform', 'translate3d(0px,50px,0px)')
            }

        }
    });
    myExpenseAccountPage.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            // 在这里添加刷新

            // getBillList(showUndoRepairList);
            myApp.pullToRefreshDone();
            myApp.attachInfiniteScroll($$('.infinite-scroll'));
            if ($$('#tab1').hasClass('active')) {
                pageCount_tab1 = 1;
                //判读刷新内容
                getUpdateInfo("2")
                // getNewsList(showNewList);
            } else if ($$('#tab3').hasClass('active')) {
                pageCount_tab2 = 1;
                getNotice(showNotice);
            } else if ($$('#tab4').hasClass('active')) {
                pageCount_tab4 = 1;
                getDocument(showDocument);
            }
        }, 800);
        $$('.infinite-scroll-preloader').hide();
    });

    myExpenseAccountPage.on('infinite', function () {
        if (loading) return;

        loading = true;

        $$('.infinite-scroll-preloader').show();

        setTimeout(function () {

            loading = false;

            if ($$('#tab1').hasClass('active')) {
                pageCount_tab1++;
                getNewsList(showNewList,false);
            } else if ($$('#tab3').hasClass('active')) {
                pageCount_tab2++;
                getNotice(showNotice,false);
            } else if ($$('#tab4').hasClass('active')) {
                pageCount_tab4++;
                getDocument(showDocument,false);
            }

        }, 800);
    });


});


//普通页面跳转
function toPageNormal(id) {
    //获取资讯详情

    getNewsDetail(id, showNewsDetail);
    registerBackButton(1, function () {
        mainView.router.back();
        $$('#my_video').hide();
        registerBackButton(3);
    });

}

//普通页面跳转
function toIframePage(url, type) {
    if (isIOS) {
        //post应用
        var userInfo = sessionStorage.getItem("userInfo");
        userInfo = JSON.parse(userInfo);
        var openUrl = url + '&userAccount=' + userInfo.userAccount + '&token=' + userInfo.token;
        var param = 'userAccount=' + userInfo.userAccount + '&token=' + userInfo.token + '';
        dic = {
            url: openUrl,
            appName: $$('.navbar .buttons-row').children('.active').html(),
            appLoadType: '4'
        };

        try {
            goToUrlPage(dic);
        } catch (error) {
            window.webkit.messageHandlers.goToUrlPage.postMessage(dic);
        }
    } else {

        var userInfo = sessionStorage.getItem("userInfo");
        userInfo = JSON.parse(userInfo);
        var openUrl = url + '&userAccount=' + userInfo.userAccount + '&token=' + userInfo.token;
        window.basicMes = {
            url: openUrl,
            title: $$('.navbar .buttons-row').children('.active').html()
        };
        var openPage;
        if (type == 1) {
            openPage = 'pages/noticeDetail.html';
        } else {
            openPage = 'pages/afficheDetail.html';
        }
        mainView.router.load({
            url: openPage
        })


        registerBackButton(1, function () {
            mainView.router.back();
            registerBackButton(3);
        });
        iflyapp.hideTabBarAction();

    }
}

//讯飞头条详情----专题（安卓）
function headlines_DetailSpecial(id) {
    getNewsDetail(id, showNewsDetail);
    if (!isIOS) {
        BackToBefore();
    }

}

//专题页面跳转
function toSpecialPage(id) {

    pageCount = 1;
    getSubjectList(id, showSubjectList);
    registerBackButton(1, function () {
        mainView.router.back();
        registerBackButton(3);
    });
}

//图集页面跳转
function toPictureCarousePage(id) {


    getNewsDetail(id, showNewsDetail);
    registerBackButton(1, function () {
        mainView.router.back();
        registerBackButton(3);
    });
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

function BackToBefore() {
    if (mainView.activePage.name == "ifly_Information") {
        iflyapp.showTabBarAction();
        registerBackButton(3);
    } else {
        registerBackButton(1, function () {
            mainView.router.back();
            BackToBefore();
        });
    }
}


//获取参数
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
