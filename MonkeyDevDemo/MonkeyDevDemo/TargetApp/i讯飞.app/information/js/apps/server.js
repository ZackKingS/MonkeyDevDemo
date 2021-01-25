// var userInfo = {
// 	'userAccount': 'jfai',
// 	'token': 'sZ8ui9TjKC4ERTGjH.FneKaJv4PLKSC_KUKhkFi6NZYjbKkazA5tapMjNUjfP3QtGthemMG3gj4E4kXHnqPUMMouZer0dJ.01dubDrwwA9Y=',
// 	'userName': '艾建飞',
// 	'userOrgId': '7da006b4-e731-4040-a483-deadd516a4f9',
// 	'userCode': '20120333',
// 	'securityKey': '1280977330000000'
// };
// userInfo = JSON.stringify(userInfo);
// sessionStorage.setItem("userInfo", userInfo);

function transferTokenAndUserIDCallBack(userAccount, token, userName, userId, userOrgId, userCode, securityKey) {

	var userInfo = {
		'userAccount': userAccount,
		'token': token,
		'userName': userName,
		'userOrgId': userOrgId,
		'userCode': userCode,
		'securityKey': securityKey
	};
	userInfo = JSON.stringify(userInfo);
	sessionStorage.setItem("userInfo", userInfo);
	getNewsList(showNewList);
//    window.webkit.messageHandlers.getNewsList.postMessage(showNewList);
}

function iflyRequest(data, callback,isShowLoad) {
    if(!isShowLoad && isShowLoad != false) showLoading();
//    var url = 'http://60.174.249.148:9080/TyTransService/tytranservice/transfer/transInterface';
    var url = 'https://iflyapp.iflytek.com:9443/TyTransService/tytranservice/transfer/transInterface';
	// 数据加密
	data = data;
	var paramData = data;
	data = JSON.stringify(data);

	var userInfo = sessionStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);
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
	$$.ajax({
		url: url,
		method: 'POST',
		async: true,
		data: securityData,
		//dataType: 'json',
		success: function(data) {
			var securityData = JSON.parse(data);
			securityData = securityData.securityData;
			//数据解密
			var decrypt = CryptoJS.AES.decrypt(securityData, dataKey, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			decrypt = CryptoJS.enc.Utf8.stringify(decrypt).toString();
			var jsonData = JSON.parse(decrypt);
			if(jsonData.message.toLowerCase().indexOf("token") >= 0) {
				if(isIOS) {
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
			hideLoading();
			callback(jsonData);

		},
		error: function() {
			//
			if(paramData.methodCode == "B100000001") {
				//          		 	myApp.alert(paramData.methodCode)
				getCacheAuthAndAnnList();
			}
			toast.show('访问失败！请检查你的网络');
		}
	});
}

/**
 * 获取更新信息 type  1:首页 2:资讯
 */
function getUpdateInfo(type) {
    /*
	 * 获取更新信息
	 */
    window.getUpdateInfoCallBack = function(data) {
        // console.log(JSON.stringify(data));
        if(data.content == true) {
            //返回结果为True 刷新信息
            if (type == "2") {
                //刷新资讯,获取咨询相关信息
                getNewsList(showNewList);
            }
        } else {
            //返回结果为false 提醒内容已是最新，无需刷新
            toast.show(data.message);
        }
    }
    //showLoading();
    var userInfo = sessionStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    iflyRequest({
        "userAccount": userInfo.userAccount,
        "token": userInfo.token,
        "methodCode": "B100000014",
        "requestType":type
    }, getUpdateInfoCallBack);
}

//获取资讯列表
function getNewsList(cb,isLoad) {

    window.getNewsListCallBack = function(data) {

        if (data.result == true) {
            cb(data);
        } else {
            toast.show(data.message);
        }

    };
    var userInfo = sessionStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);

    iflyRequest({
        "userAccount": userInfo.userAccount,
        "token": userInfo.token,
        "pageSize": "10",
        "pageIndex": pageCount_tab1,
        "requestType": "2",
        "methodCode": "B100000005"
    }, getNewsListCallBack,isLoad);
}
/**
 * @description 获取信息详情
 * @param 
 */
// 获取资讯
function getNewsDetail(id, cb) {
	window.getNewsDetailCallBack = function(data) {
		if(data.result == true) {
			cb(data);
		}
	};
	var userInfo = sessionStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);

	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"newsId": id,
		"methodCode": "B100000007"
	}, getNewsDetailCallBack);
}

// 获取通知
function getNotice(cb,isLoad) {
	window.getNoticeCallBack = function(data) {
		if(data.result == true) {
			console.log(data);
			cb(data.content);
		} else {
			toast.show(data.message);
		}
	};

	var userInfo = sessionStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);

	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"pageSize": "10",
		"pageIndex": pageCount_tab2,
		"methodCode": "B100010037"
	}, getNoticeCallBack,isLoad);
}

// 获取公文
function getDocument(cb,isLoad) {
    window.getDocumentCallBack = function(data) {
        if(data.result == true) {
            console.log(data);
            cb(data.content);
        }else
        {
            toast.show(data.message);
        }
    };

    var userInfo = sessionStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);

    iflyRequest({
        "userAccount": userInfo.userAccount,
        "token": userInfo.token,
        "pageSize": "10",
        "pageIndex": pageCount_tab4,
        "methodCode": "B100010038"
    }, getDocumentCallBack,isLoad);
}

// 获取专题列表
function getSubjectList(id, cb) {
	window.getSubjectListCallBack = function(data) {
		console.log(data);
		if(data.result == true) {
			cb(data);
		} else {
			toast.show(data.message);
		}

	};

	subId = id;
	var userInfo = sessionStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);

	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"subjectId": id,
		"pageSize": "10",
		"pageIndex": pageCount,
		"methodCode": "B100000006"
	}, getSubjectListCallBack);
}

// 点赞
function addZhan(id, type, code) {
	window.addZhanCallBack = function(data) {
		console.log(data);
		if (data.result) {
			if (type == 0) {
				console.log("id" + id);
				var upvote = parseInt(code.text());
				var string = '';
				upvote += 1;
				string += ' <i class="icon-news icon-thumbAl"></i> ' + upvote;
				code.html(string);

				$(".upvote").each(function(i) {
					console.log("nesid===" + $(this).attr("id"));
					console.log("id" + id);
					if($(this).attr("id") == id) {
						var string = '';
						string += '<i class="icon-news icon-thumb"></i> ' + upvote;
						$(this).html(string);
					}
				});

			} else if(type == 1) {
				$('.morePicture').each(function() {
					var upvote = parseInt($(this).text());

					upvote += 1;
					var string = '';
					string += '<i class="icon-news icon-thumbAl"></i> ' + upvote;
					$(this).html(string);
				});

				$(".upvote").each(function(i) {
					if($(this).attr("id") == id) {
						var upvote = parseInt($(this).text());

						upvote += 1;
						var string = '';
						string += '<i class="icon-news icon-thumb"></i> ' + upvote;
						$(this).html(string);
					}

				});

			}
			toast.show('点赞成功');
		} else {
			console.log($('#upvote').text());
			toast.show(data.message);
		}
	};

	var userInfo = sessionStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);

	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"newsId": id,
		"methodCode": "B100000012"
	}, addZhanCallBack);
}
