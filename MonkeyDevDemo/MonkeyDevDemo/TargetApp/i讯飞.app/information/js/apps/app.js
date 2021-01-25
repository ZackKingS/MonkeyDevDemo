/**
 * Created by fan on 2017/4/13.
 */
var myApp = new Framework7({
    swipeBackPage:false
});
var $$ = Dom7;
var pageCount=1;
var pageCount_tab1=1;
var pageCount_tab2=1;
var pageCount_tab4=1;
var loading=false;
var isIOS='';
var isFirstEnterVideo=true;
var subId='';
var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});

var toast = myApp.toast('请输入姓名', '', {});
mainView.router.load({
    url: 'pages/ifly_Information_MainPage/ifly_Information_MainPage.html',
    animatePages: false
});
function showLoading() {
    loading = true;
	myApp.showIndicator();
	setTimeout(function() {
		myApp.hideIndicator();
	}, 1000);
}
function hideLoading() {
    loading = false;
	myApp.hideIndicator();
}      

//2018/4/12
myApp.onPageInit('noticeDetail',function(){
    if (!isIOS){
        $$('#iframe').attr('src',window.basicMes.url);
        $$('#title').html(window.basicMes.title)
    }

})

//2018/04/24
myApp.onPageInit('afficheDetail',function () {
    if (!isIOS){
    $$('#iframe').attr('src',window.basicMes.url);
    $$('#title').html(window.basicMes.title)
    }
})

/*function deletesIDS() {
    var newArray = newIDS.split(',');
    var oldArray = oldIDS.split(',');
    for(var i=0; i<newArray.length;i++){
        for (var j=0; j<oldArray.length; j++){
            if(newArray[i] == oldArray[j]){
                newArray.splice(i,1);
            }
        }
    }
    newIDS =  newArray.join(",");
}*/
