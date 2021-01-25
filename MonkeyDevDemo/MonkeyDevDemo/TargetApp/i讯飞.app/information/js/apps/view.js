
//展示资讯列表
function showNewList(data) {
    var dataResult = data.content;
    var string = '';
    if (dataResult.newsList.length > 0) {
        $$('#unExpensedNoData').hide();
    } else {
        $$('#unExpensedNoData').show();
        $$('.infinite-scroll-preloader').hide();
        myApp.detachInfiniteScroll($$('.infinite-scroll'));
    }

    if (pageCount_tab1 == 1) {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));
        $$('.NewsList').empty();
    }

    for (var i = 0; i < dataResult.newsList.length; i++) {
        var newsList = dataResult.newsList[i],
            newsType = newsList.newsType;
        /**
         * desc: 通用资讯列表方法，含：
         * 一图：置顶 专题 图集 视频
         * 无图：置顶 专题 通知 点赞 阅读数 时间
         * 三图：置顶 专题
         * author junji
         * date 2017/9/26 14:59
         * @type hasSubject	判断有无专题
         * @type hasStick	判断是否置顶
         * @type upvote		判断如果是专题、通知则，不显示点赞和置顶
         */
        //判断有无专题    有专题的,表示的时候在title 上面加上一个专题的特殊符号或者文字,来区别
        var hasSubject = newsList.hasSubject ? ('<span class="ifly-tags blue-solid-tag">专题</span>' + newsList.newsTitle) : newsList.newsTitle,
            //判断是否置顶
            hasStick = newsList.hasStick ? ('<span class="ding"><a href="javascript:;">置顶</a></span>') : '',
            //判断如果是专题、通知则，不显示点赞和置顶
            upvote = newsList.hasSubject || (newsList.contentType == "1") ? '' : ('<span class="upvote" id="' + newsList.newsId + '"><i class="icon-news icon-thumb"></i>&nbsp;' + newsList.upvote + '</span>'),
            //判断专题、普通资讯跳转链接
            details = newsList.hasSubject ? ('toSpecialPage(' + '\'' + newsList.newsId + '\'' + ')') : 'toPageNormal(' + '\'' + newsList.newsId + '\'' + ')',
            //判断专题、图集资讯跳转链接
            picture_url = newsList.hasSubject ? ('toSpecialPage(' + '\'' + newsList.newsId + '\'' + ')') : 'toPictureCarousePage(' + '\'' + newsList.newsId + '\'' + ')';

        //一图模式显示html片段
        var newsType0 = (newsType == '1') ? 'item-content-img' : '';
        var newsType0IsImg = (newsType == '1') ? '<div class="item-media item-media-right"><img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[0].imgUrl + '" height="75px" class="lazy lazy-fadeIn" /></div>' : '';
        //添加的title
        //var htmlTitle = '<div class="center" id="title">咨询</div>';

        var htmlHead = '<li class="item-content ' + newsType0 + '" onclick="' + details + '">' +
            '<div class="item-inner">' +
            '<div class="item-subtitle">' + hasSubject + '</div>';
        var htmlFoot = '<div class="item-operate">' +
            hasStick +
            '<span class="pageViews"><i class="icon-news icon-browse"></i>&nbsp;' + newsList.pageViews + '</span>' +
            upvote +
            '<span class="date">' + newsList.publicDate + '</span>' +
            '</div>' +
            '</div>' +
            newsType0IsImg +
            '</li>';
        //无图、一图模式
        if (newsType == '0') {
            string += htmlHead + htmlFoot;
        }

        //一图模式
        if (newsType == '1') {
            string += '<li class="item-content ' + newsType0 + '" onclick="' + details + '">' +
                '<div class="item-inner">' +
                '<div class="item-subtitle subject-title">' + hasSubject + '</div>' +
                htmlFoot;
        }
        //多图模式
        if (newsType == '2') {
            string += htmlHead +
                '<ul class="row img-row-list">' +
                '<li class="col-33"><img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[0].imgUrl + '" class="lazy lazy-fadeIn" /></li>' +
                '<li class="col-33"><img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[1].imgUrl + '" class="lazy lazy-fadeIn" /></li>' +
                '<li class="col-33"><img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[2].imgUrl + '" class="lazy lazy-fadeIn" /></li>' +
                '</ul>' +
                htmlFoot;
        };
        //图文图集
        if (newsType == '3') {
            string += '<li class="item-content" onclick="' + picture_url + '">' +
                '<div class="item-inner">' +
                '<div class="item-subtitle">' + hasSubject + '</div>' +
                '<div class="row img-row-list img-numtips-row">' +
                '<img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[0].imgUrl + '" class="lazy lazy-fadeIn" />' +
                '<span class="tips">' + newsList.imgsCount + '</span>' +
                '</div>' +
                htmlFoot;
        };
        //一图视频
        if (newsType == '4') {
            string += htmlHead +
                '<div class="row img-row-list">' +
                '<span class="start-btn"></span><img src="images/ifly-occupy.png" data-src="' + newsList.newsImg[0].imgUrl + '" class="lazy lazy-fadeIn" />' +
                '</div>' +
                htmlFoot;
        };
    }

    $$('.NewsList').append(string);

    $$('img.lazy').trigger('lazy');
    $$('.infinite-scroll-preloader').hide();
}
//这个方法没有使用
function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}

var showContralTimer;
function showContral() {
    var video = document.getElementById("my_video");
    video.controls = true;
}
/** 展示列表里面的详情内容*/
function showNewsDetail(data) {

    data = data.content;
    console.log(data);
    // 无图\一图\多图模式
    if (data.detailType == "0" || data.detailType == "1" || data.detailType == "2") {
        mainView.router.load({
            pageName: 'ifly_Information_normal'
        });

        //无图 小图  多图
        $$('.headlines_title').empty();
        $$('.publicTime').empty();
        $$('.bot-browse').empty();
        $$('.main-content').empty();
        if (data.detailType == "2") {

            //视频播放
            $$('.ifly-vedio-wap').show();
            $$('#my_video').show();
            var video = document.getElementById("my_video");

            document.getElementById("viderSrc").src = data.vedioUrl;
            document.getElementById("my_video").load();
            if (!isIOS) {
                showContralTimer = window.setInterval(showContral, 500);
            }

        } else {
            $$('#my_video').hide();
            $$('.ifly-vedio-wap').hide();
            if (!isIOS) {
                window.clearInterval(showContralTimer);
            }
        }

        $$('.headlines_title').html(data.newsTitle);
        $$('.publicTime').html(data.publicTime);

        $$('.main-content').html(data.newsContents);

        var string = '';
        $$('.bot-browse').empty();

        if ($$('#tab3').hasClass('active')) {
            string += '<span> <i class="icon-news icon-browse"></i> ' + data.pageViews + '</span>';

            var newsIsImg = function () {
                $('.main-content img').each(function () {
                    $(this).attr("src", "images/icons/ifly-img-noticle-noimg.jpg");

                })
            };
            newsIsImg();
        } else {
            string += ' <span> <i class="icon-news icon-browse"></i> ' + data.pageViews + '</span><span  onclick="thumbs_up(' + '\'' + data.newsId + '\'' + ',0,$$(this))" > <i class="icon-news ' + (data.hasUpvote == 'true' ? 'icon-thumbAl' : 'icon-thumb') + '"></i> ' + data.upvote + '</span>';
        }

        $$('.bot-browse').html(string);

        //图文图集模式
    } else if (data.detailType == "3") {
        mainView.router.load({
            url: 'pages/ifly_Information_pictureCarousel/ifly_Information_pictureCarousel.html'
        });
        setTimeout(function () {
            //图文图集
            $('.slidePicture').empty();
            var string = '';
            for (var i = 0; i < data.imgsList.length; i++) {
                var j = i + 1;
                newsId = data.newsId,
                    hasUpvote = data.hasUpvote,
                    upvote = data.upvote;
                imgsCount = data.imgsCount;
                string += '<dl class="swiper-slide">' +
                    '<dt class="img_Carousel"><img src="' + data.imgsList[i].imgUrl + '" title="' + data.imgsList[i].imgContent + '" /></dt>' +
                    //'<dd class="img-describe">' +
                    //    '<div class="describe-text"><span class="totalNum">' + j + '/' + data.imgsCount + '</span>' + data.imgsList[i].imgContent + '</div>' +
                    //'<p class="text-right morePicture" onclick="thumbs_up(' + '\'' + data.newsId + '\'' + ',1,$$(this))" > <i class="iflyui-icon ' + (data.hasUpvote == 'true' ? "iflyui-icon-thumbAl" : "iflyui-icon-thumbwh") + ' "></i> ' + data.upvote + '</p>' +
                    //'</dd>' +
                    '</dl>';
            }
            $('.slidePicture').html(string);

            $('#slidePictureBox').append('<dl class="Ystring"></dl>');

            var morePicture = '<p class="text-right morePicture" onclick="thumbs_up(' + '\'' + newsId + '\'' + ',1,$$(this))" > <i class="iflyui-icon ' + (hasUpvote == 'true' ? "iflyui-icon-thumbAl" : "iflyui-icon-thumbwh") + ' "></i> ' + upvote + '</p>',
                describeText = '<dd class="img-describe"><div class="describe-text"><span class="totalNum"><span class="activeIndex">';

            var Ystring = describeText + '1</span>/' + imgsCount + '</span><span class="titles"></span></div>' +
                morePicture +
                '</dd>';
            $('.Ystring').html(Ystring);

            var mySwiper = myApp.swiper('.swiper-container', {
                onTransitionStart: function (swiper) {
                    var activeIndex = swiper.activeIndex + 1,
                        titles = swiper.slides.find('.swiper-slide-active img').attr('title');
                    Ystring = describeText + activeIndex + '</span>/' + imgsCount + '</span><span class="titles">' + titles + '</span></div>' +
                        morePicture +
                        '</dd>';
                    $('.Ystring').html(Ystring)
                }
            });

            var Stitles = $('.slidePicture').find('.swiper-slide-active img').attr('title');
            $('.titles').html(Stitles)

        }, 100);
        // setTimeout(function()
        // {	//图文图集
        //     $('.slidePicture').empty();
        //     var string='';
        //     console.log(data.imgsList.length);
        //     for (var i=0;i<data.imgsList.length;i++) {
        //         var j=i+1;
        //         string+='<div class="swiper-slide"><div class="img_Carousel"><img src="'+data.imgsList[i].imgUrl +'" class="lazy" /></div>'+
        //             '<div class="img-describe"><div class="describe-text"><span class="totalNum">' + j + '/' + data.imgsCount + '</span>'+data.imgsList[i].imgContent+'</div>'+
        //             '<p class="text-right morePicture" onclick="thumbs_up(' + '\'' + data.newsId + '\'' + ',1,$$(this))" ><i class="icon-news '+(data.hasUpvote=='true'?'icon-thumbAl':'icon-thumb-white')+'"></i>'+data.upvote +'</p>'+
        //             '</div></div>';
        //     }
        //     $('.slidePicture').html(string);
        //     var mySwiper = myApp.swiper('.swiper-container', {
        //     });
        //
        //
        // },100);

    } else if (data.detailType == "4" && data.hrefUrl != null) {
        var dic = {};
        dic = {
            url: data.hrefUrl,
            appLoadType: "4"
        };
        if (isIOS) {
            try {
                goToUrlPage(dic);
            } catch (error) {
                window.webkit.messageHandlers.goToUrlPage.postMessage(dic);
            }
        } else {
            iflyapp.goToUrlPage(JSON.stringify(dic));
        }
    }


    if (isIOS) {
        try {
            hideTabBarAction();
        } catch (error) {
            window.webkit.messageHandlers.hideTabBarAction.postMessage(null);
        }
    } else {
        iflyapp.hideTabBarAction();
    }
}
//展示专题列表
function showSubjectList(data) {
    mainView.router.load({
        url: 'pages/ifly_Information_special/ifly_Information_special.html'
    });
    setTimeout(function () {
        var dataResult = data.content;
        if (dataResult.newsList.length > 0) {
            $$('#NoData').hide();
        } else {
            $$('#NoData').show();
            $$('.infinite-scroll-preloader').hide();
            myApp.detachInfiniteScroll($$('.infinite-scroll'));

        }

        if (pageCount == 1) {

            myApp.attachInfiniteScroll($$('.infinite-scroll'));
            $('.specialList').empty();
        }

        //	$('.NewsList').empty();
        $('.special_title').empty();
        $('.sub-title').empty();
        abstractString = '';
        abstractString += '<span class="ifly-tags blue-solid-tag">摘要</span>' + dataResult.subjectDigest;
        $('.special_title').html(dataResult.subjectTitle);
        $('.sub-title').html(abstractString);
        var string = '';

        for (var i = 0; i < dataResult.newsList.length; i++) {
            if (dataResult.newsList[i].newsType == '0') {
                string += '<li onclick="headlines_DetailSpecial(' + '\'' + dataResult.newsList[i].newsId + '\'' + ');" class="item-content">' +
                    '<div class="item-inner"><div class="item-subtitle" class="title_1">' + dataResult.newsList[i].newsTitle + '</div>' +
                    '<div class="item-operate">';

                if (dataResult.newsList[i].hasStick == true) {
                    string += '<a href="javascript:;">置顶</a>';
                }
                string += '<span> <i class="icon-news icon-browse"></i> ' + dataResult.newsList[i].pageViews + '</span>' +
                    '<span  class="upvote" id="' + dataResult.newsList[i].newsId + '"> <i class="icon-news icon-thumb"></i> ' + dataResult.newsList[i].upvote + ' </span>' +
                    '<span class="date">' + dataResult.newsList[i].publicDate + '</span></div></div></div></li>';

            }

            if (dataResult.newsList[i].newsType == '1') {
                string += '<li onclick="headlines_DetailSpecial(' + '\'' + dataResult.newsList[i].newsId + '\'' + ');" class="item-content item-content-img">' +
                    '<div class="item-inner"><div class="item-subtitle subject-title">' + dataResult.newsList[i].newsTitle + '</div>' +
                    '<div class="item-operate">';

                if (dataResult.newsList[i].hasStick == true) {
                    string += '<a href="javascript:;">置顶</a>';
                }
                string += '<span> <i class="icon-news icon-browse"></i> ' + dataResult.newsList[i].pageViews + '</span>' +
                    '<span  class="upvote" id="' + dataResult.newsList[i].newsId + '"> <i class="icon-news icon-thumb"></i> ' + dataResult.newsList[i].upvote +
                    '<span class="date">' + dataResult.newsList[i].publicDate + '</span></div></div>' +
                    '<div class="item-media item-media-right"><img data-src="' + dataResult.newsList[i].newsImg[0].imgUrl + '"  class="lazy lazy-fadeIn"height="75px" /></div></li>';
            }


            if (dataResult.newsList[i].newsType == '4') {
                string += '	<li onclick="headlines_DetailSpecial(' + '\'' + dataResult.newsList[i].newsId + '\'' + ');"><div class="item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-subtitle" class="title_1">' + dataResult.newsList[i].newsTitle + '</div>' +
                    '<div class="row img-row-list"><span class="start-btn"></span><img data-src="' + dataResult.newsList[i].newsImg[0].imgUrl + '" class="lazy lazy-fadeIn" /></div><div class="item-operate">';


                if (dataResult.newsList[i].hasStick == true) {
                    string += '<a href="javascript:;">置顶</a>';
                }


                string += '<span> <i class="icon-news icon-browse"></i> ' + dataResult.newsList[i].pageViews + '</span>' +
                    '<span  class="upvote" id="' + dataResult.newsList[i].newsId + '"> <i class="icon-news icon-thumb"></i> ' + dataResult.newsList[i].upvote + '</span>' +
                    '<span class="date">' + dataResult.newsList[i].publicDate + '</span></div></div></div></li>';
            }

            if (dataResult.newsList[i].newsType == '2') {

                string += '<li onclick="headlines_DetailSpecial(' + '\'' + dataResult.newsList[i].newsId + '\'' + ');"><div class="item-content">' +
                    '<div class="item-inner">' +
                    '<div class="item-subtitle" class="title_1">' + dataResult.newsList[i].newsTitle + '</div>' +
                    '<div class="row img-row-list"><div class="col-33"><img data-src="' + dataResult.newsList[i].newsImg[0].imgUrl + '"class="lazy lazy-fadeIn" />' +
                    '</div><div class="col-33"><img data-src="' + dataResult.newsList[i].newsImg[1].imgUrl + '"class="lazy lazy-fadeIn" /></div>' +
                    '<div class="col-33"><img data-src="' + dataResult.newsList[i].newsImg[2].imgUrl + '"  class="lazy lazy-fadeIn"/></div></div><div class="item-operate">';

                if (dataResult.newsList[i].hasStick == true) {
                    string += '<a href="javascript:;">置顶</a>';
                }
                string += '<span> <i class="icon-news icon-browse"></i> ' + dataResult.newsList[i].pageViews + '</span>' +
                    '<span  class="upvote" id="' + dataResult.newsList[i].newsId + '"> <i class="icon-news icon-thumb"></i> ' + dataResult.newsList[i].upvote + '</span><span class="date">' + dataResult.newsList[i].publicDate + '</span>' +
                    '</div></div></div></li>';
            }

            if (dataResult.newsList[i].newsType == '3') {

                string += '<li onclick="toPictureCarousePage(' + '\'' + dataResult.newsList[i].newsId + '\'' + ');"><div class="item-content"><div class="item-inner">' +
                    '<div class="item-subtitle" class="title_1" style="white-space: normal">' + dataResult.newsList[i].newsTitle + '</div>' +
                    '<div class="row img-row-list img-numtips-row"><img data-src="' + dataResult.newsList[i].newsImg[0].imgUrl + '" class="lazy lazy-fadeIn" />' +
                    '<span class="tips">' + dataResult.newsList[i].imgsCount + '</span></div><div class="item-operate">';


                if (dataResult.newsList[i].hasStick == true) {
                    string += '<a href="javascript:;">置顶</a>';
                }


                string += '<span> <i class="icon-news icon-browse"></i> ' + dataResult.newsList[i].pageViews + '</span><span  class="upvote" id="' + dataResult.newsList[i].newsId + '"> <i class="icon-news icon-thumb"></i> ' + dataResult.newsList[i].upvote + '</span>' +
                    '<span class="date">' + dataResult.newsList[i].publicDate + '</span></div></div></div></li>';


            }

        }

        $('.specialList').append(string);


        $$('img.lazy').trigger('lazy');

        if (isIOS) {
            try {
                hideTabBarAction();
            } catch (error) {
                window.webkit.messageHandlers.hideTabBarAction.postMessage(null);
            }
        } else {
            iflyapp.hideTabBarAction();
        }
    }, 200);

}
//展示通知列表
function showNotice(data) {

    var string = "";
    if (data.length > 0) {
        $$('#unNoData').hide();
    } else {
        $$('#unNoData').show();
        $$('.infinite-scroll-preloader').hide();
        myApp.detachInfiniteScroll($$('.infinite-scroll'));

    }

    if (pageCount_tab2 == 1) {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));
        $$('#notice_List').empty();
    }
    //pages/noticeDetail.html
    for (var i = 0; i < data.length; i++) {
        string += '<li onclick="toIframePage(' + '\'' + data[i].appOpenUrl + '\'' + ',1)"><a href="#" class="item-content item-link"><div class="item-inner">' +
            '<div class="item-subtitle" class="title_1">' + data[i].noticeTitle + '</div><div class="item-operate">';

        string += '<span> <i class="icon-news icon-browse"></i></span>' +
            '<span class="date">' + data[i].modifyDate + '</span></div></div></a></li>';
    }
    $('#notice_List').append(string);
    $$('.infinite-scroll-preloader').hide();



}

//展示公文列表
function showDocument(data) {

    var string = "";
    if (data.length > 0) {
        $$('#unNoDocumentData').hide();

    } else {
        $$('#unNoDocumentData').show();
        $$('.infinite-scroll-preloader').hide();
        myApp.detachInfiniteScroll($$('.infinite-scroll'));

    }

    if (pageCount_tab4 == 1) {
        myApp.attachInfiniteScroll($$('.infinite-scroll'));

        $$('#document_List').empty();
    }

    for (var i = 0; i < data.length; i++) {
        string += '<li onclick="toIframePage(' + '\'' + data[i].appOpenUrl + '\'' + ',2 )"><a href="#" class="item-content item-link"><div class="item-inner">' +
            '<div class="item-subtitle" class="title_1">' + data[i].noticeTitle + '</div><div class="item-operate">';

        string += '<span> <i class="icon-news icon-browse"></i></span>' +
            '<span class="date">' + data[i].modifyDate + '</span></div></div></a></li>';
    }

    $('#document_List').append(string);
    $$('.infinite-scroll-preloader').hide();
}


function thumbs_up(id, type, obj) {
    addZhan(id, type, obj);
}



//安卓清空video src

function clearVideo() {

    var video = document.getElementById("my_video");
    video.pause();
    $$('#my_video').hide();
    $$('.ifly-vedio-wap').hide();
    window.clearInterval(showContralTimer);
    mainView.router.back();
    if (isIOS && subId == '') {
        try {
            showTabBarAction();
        } catch (error) {
            window.webkit.messageHandlers.showTabBarAction.postMessage(null);
        }
    }
    else if (!isIOS && subId == '') {
        iflyapp.showTabBarAction();
    }

}

function backShowTabbar() {
    if (isIOS) {
        try {
            showTabBarAction();
        } catch (error) {
            window.webkit.messageHandlers.showTabBarAction.postMessage(null);
        }
    } else {
        iflyapp.showTabBarAction();
    }
}
