var myApp = new Framework7({
	init: false,
	modalButtonOk: '确定',
	modalButtonCancel: '取消',
	precompileTemplates: true
}), $$ = Dom7;

var mainView = myApp.addView('.view-main'), isIOS, current_ios_version;

//应用中心注册函数
Template7.registerHelper('appOpt', function (status, options) {//异常
	if (status.length != 0) {
		var arr = [];
		status.forEach(function (item) {
			arr.push(item.appId)
		})
		return arr.indexOf(this.appId) != -1 ? 'ifly-right' : 'ifly-add'
	} else {
		return 'ifly-add'
	}
});

//对象转字符串
Template7.registerHelper('stringCh', function (status, options) {
	return JSON.stringify(status)
});
myApp.init();


// 首页初始化
var indexFn = myApp.onPageInit('index', function (page) {

	var userInfo = localStorage.getItem("userInfo"), pageCount = 1;
	userInfo = JSON.parse(userInfo), on = true;

	// 未读信息条数
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000002"
	}, function (data) {
		if (data.result) {
			data.content == '0' ? $$('#spot').hide() : $$('#spot').html(data.content).show()
		}
	});

	//获取首页banner/app
	var templateBan = $$('#myBanner').html(), compiledBan = Template7.compile(templateBan);
	var templateApp = $$('#myApp').html(), compiledApp = Template7.compile(templateApp);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000001"
	}, function (data) {
		console.log(data)
		if (data.result) {
			$$('#swiperWrap').html(compiledBan(data.content.bannerList));
			initApplication(compiledApp(data.content))
			var mySwiper = myApp.swiper('.ifly-swiper-container', {
				pagination: '.swiper-pagination',
				autoplay: 3000
			});

		}
	});

	//获取资讯
	var templateHeadLine = $$('#headlines').html();
	var templateNotify = $$('#notifyTpl').html();
	var compiledHeadline = Template7.compile(templateHeadLine);
	var compiledNotify = Template7.compile(templateNotify);

	// 头条
	$$('#tab1').on('show', function () {
		pageCount = 1;
		loadNews(pageCount);
		myApp.detachInfiniteScroll($$('.infinite-scroll-index'))
		myApp.attachInfiniteScroll($$('.infinite-scroll-index'))
		$$('.infinite-scroll-preloader-index').children('.preloader').show();
		$$('.infinite-scroll-preloader-index').children('p').hide();
	})
	// 公文
	$$('#tab2').on('show', function () {
		pageCount = 1;
		loadNotify(pageCount);
		myApp.detachInfiniteScroll($$('.infinite-scroll-index'))
		myApp.attachInfiniteScroll($$('.infinite-scroll-index'))
		$$('.infinite-scroll-preloader-index').children('.preloader').show();
		$$('.infinite-scroll-preloader-index').children('p').hide();
	})
	// 通知
	$$('#tab3').on('show', function () {
		pageCount = 1;
		loadDocument(pageCount);
		myApp.detachInfiniteScroll($$('.infinite-scroll-index'))
		myApp.attachInfiniteScroll($$('.infinite-scroll-index'))
		$$('.infinite-scroll-preloader-index').children('.preloader').show();
		$$('.infinite-scroll-preloader-index').children('p').hide();
	})
	$$('#tab1').trigger('show');

	//下拉加载
	var loading = false;
	$$('.infinite-scroll-index').on('infinite', function () {
		if (loading) return;
		loading = true;
		++pageCount;
		var tabNum = $$('#headLineList').children('.ifly-news-hd').children('.active').index();
		switch (tabNum) {
			case 0:
				loadNews(pageCount, false);
				break;
			case 1:
				loadNotify(pageCount, false);
				break;
			case 2:
				loadDocument(pageCount, false);
				break;
		}
	})

	// 上拉刷新
	var ptrContent = $$('.pull-to-refresh-content-index');
	ptrContent.on('refresh', function (e) {
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"methodCode": "B100000014",
			"requestType": "1"
		}, function (data) {
			console.log(data)
			setTimeout(function () {
				if (data.content) {
					mainView.router.refreshPage();
				} else {
					toastText(data.message);
				}
				myApp.pullToRefreshDone();
			}, 1000)
		})

	})

	//打开搜索栏
	$$('#search').click(function () {
		$$('.searchbar').removeAttr('style');
		$$('.searchbar-overlay').addClass('searchbar-overlay-active');
		$$('.searchbar input[type=search]').focus()
	})
	var searchBar = $$('.searchbar');
	var templateResult = $$('#searchResult').html();
	var compiledResult = Template7.compile(templateResult), searchData = null;
	var templatePlate = $$('#licensePlate').html();
	var compiledTemplatePlate = Template7.compile(templatePlate);
	searchBar.find('.searchbar-cancel').click(closeModal);//关闭
	searchBar.find('input[type=search]').on('input', function () {
		$$(this).val() != '' ? searchBar.addClass('searchbar-not-empty') : searchBar.removeClass('searchbar-not-empty')
	}).keyup(function (event) {
		if (event.keyCode == 13) {
			searchBar.find('#searchAfter').trigger('click')
		}
	});
	$$('.searchbar-overlay').click(closeModal);
	$$('#searchAfter').click(function () {
		var text = searchBar.find('input[type=search]').val();
		if (text.trim().length == 0) {
			toastText('请输入搜索关键字');
			return
		}
		// alert(text+text.trim().length+22);
		if (text.trim().length >= 13) {
			text = text.substring(1, 12);
		}

		var carnumRegex = "([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})";
		if (text.match(carnumRegex)) {//判断是否为车牌号查询
			iflyRequest({
				"userAccount": userInfo.userAccount,
				"token": userInfo.token,
				"plateNo": text,
				"methodCode": "B100010051"
			}, function (data) {
				console.log(data)
				if (data.flag && data.code == 01) {//查询不到车辆信息
					// searchWorker(text);//搜索内部员工
					$$('#searchResultCont').html(compiledResult([]));
					$$('.ifly-modal-top').addClass('ifly-anim-upbit').show();
				}

				if (data.flag && data.code == 00) {//查询到车辆信息

					if (data.data.userType == null) {//人员类型为空
						$$('#searchResultCont').html(compiledResult([]));
						$$('.ifly-modal-top').addClass('ifly-anim-upbit').show();
						return
					}
					if (data.data.userType != "1") {//访客、供应商、贵宾查询
						$$('#searchResultCont').html(compiledTemplatePlate(data));
						$$('.ifly-modal-top').addClass('ifly-anim-upbit').show();
						$$('#searchResultCont ul.personal-msg .phone-call').click(function (event) {
							var number = $$(this).attr('data-number');
							if (isIOS) {
								if (current_ios_version >= 9.0) {
									window.webkit.messageHandlers.callSomeOneAction.postMessage(number);
								} else {
									callSomeOneAction(number);
								}
							} else {
								iflyapp.callSomeOneAction(number);
							}
						});
					} else {//内部员工查询
						searchWorker(data.data.userAccount)
					}
				}
				if (!data.flag) {
					myApp.alert(data.msg, '')
				}
			});
			return
		}

		//查询内部人员
		searchWorker(text)

	})

	//打开客服
	$$('#linkToKf').click(function () {
		if (isIOS) {
			//toCustomServer({url: data.content.url});
			window.webkit.messageHandlers.toCustomServer.postMessage({ url: '' });
		} else {
			iflyapp.gotoCustomerService("file:///android_asset/mobilePage/home/kefu.html");
		}
		// iflyRequest({
		//     "userAccount": userInfo.userAccount,
		//     "token": userInfo.token,
		//     "methodCode": "B100010048",
		// }, function (data) {
		//        if(data.result&&data.result!='false'){
		//               console.log(data.content.url)
		//               if (isIOS) {
		//                     //toCustomServer({url: data.content.url});
		//                     window.webkit.messageHandlers.toCustomServer.postMessage({url: data.content.url});
		//               } else {
		//
		//               }
		//         } else {
		//    myApp.alert(data.message,'')
		//    }
		// })
	})

	//待办提醒
	requestDealt();

	function initResult(data) {//渲染搜索结果；传入data则渲染领导信息，否则渲染搜索人员信息

		data ? $$('#searchResultCont').html(compiledResult(data)) : $$('#searchResultCont').html(compiledResult(searchData));
		// 拨电话
		$$('#searchResultCont ul.personal-msg .phone-call').click(function (event) {
			var number = $$(this).attr('data-number');
			if (isIOS) {
				if (current_ios_version >= 9.0) {
					window.webkit.messageHandlers.callSomeOneAction.postMessage(number);
				} else {
					callSomeOneAction(number);
				}
			} else {
				iflyapp.callSomeOneAction(number);
			}
		});
		//提示修改号码
		$$('#searchResultCont ul.personal-msg .warn-msg').click(function (event) {
			var _this = this;
			myApp.confirm("确定提醒Ta修改号码？", "", function () {
				var getEmail = $$(_this).parent().attr('data-email');
				var itemPhone = $$(_this).parent().children('.phone-call'), errorTel = "";
				itemPhone.each(function (index, el) {
					if (index == 0) {
						errorTel += $$(this).attr('data-number');
					} else {
						errorTel += ';' + $$(this).attr('data-number')
					}
				});
				iflyRequest({
					"applyer": userInfo.userAccount,
					"errorEmpl": getEmail.split('@', 2)[0] + '',
					"errorTel": errorTel,
					"methodCode": "B100060010"
				}, function (data) {
					if (data.success) {
						toastText(data.msg);
					}
				});
			})
		})
		// 上级领导
		$$('#searchResultCont ul.personal-msg').find('.leader').click(function () {
			var email = $$(this).parent().attr('data-email');
			searchData.forEach(function (item, index) {
				if (item.email == email) {
					var arr = [];
					item.leaderInfo.type = 'l';
					arr.push(item.leaderInfo);
					initResult(arr);
				}
			})
		})
		// 返回
		$$('#searchResultCont ul.personal-msg').children('.return').click(function () {
			initResult()
		})
	}

	// 关闭搜索弹窗
	function closeModal() {
		searchBar.hide();
		$$('.ifly-modal-top').removeClass('ifly-anim-upbit').hide();
		$$('.searchbar-overlay').removeClass('searchbar-overlay-active')
	}

	// 查询车牌号
	function searchWorker(text) {
		// alert(text+text.trim().length);
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"keyword": text,
			"methodCode": "B100060012"
		}, function (data) {
			if (data.result) {
				$$('.ifly-modal-top').addClass('ifly-anim-upbit').show();
				searchData = data.content;
				initResult();
			} else {
				alert(data.message)
			}
		});
	}

	//获取头条
	function loadNews(num, isLoad) {
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"pageSize": "10",
			"pageIndex": num,
			"requestType": "1",
			"methodCode": "B100000005"
		}, function (data) {
			console.log(data)
			loading = false;
			if (data.result) {
				if (data.content.newsList.length != 0) {
					num == 1 ? $$('#tab1').html(compiledHeadline(data.content.newsList)) : $$('#tab1').append(compiledHeadline(data.content.newsList));
					$$('.lazy').trigger('lazy')
				} else {
					myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
					$$('.infinite-scroll-preloader-index').children('.preloader').hide();
					$$('.infinite-scroll-preloader-index').children('p').show();
				}
			} else {
				myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
				toastText(data.message)
			}
		}, isLoad);
	}
	//获取通知
	function loadNotify(num, isLoad) {
		console.log()
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"pageSize": "10",
			"pageIndex": num,
			"requestType": "1",
			"methodCode": "B100010037"
		}, function (data) {
			loading = false;
			if (data.result) {
				if (data.content.length != 0) {
					data.type = 1;
					num == 1 ? $$('#tab2').html(compiledNotify(data)) : $$('#tab2').append(compiledNotify(data));//判断是否是第一次加载数据
					$$('.lazy').trigger('lazy')
				} else {
					myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
					$$('.infinite-scroll-preloader-index').children('.preloader').hide();
					$$('.infinite-scroll-preloader-index').children('p').show();
				}
			} else {
				myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
				toastText(data.message)
			}
		}, isLoad);
	}
	//获取公文
	function loadDocument(num, isLoad) {
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"pageSize": "10",
			"pageIndex": num,
			"requestType": "1",
			"methodCode": "B100010038"
		}, function (data) {
			loading = false;
			if (data.result) {
				if (data.content.length != 0) {
					data.type = 2;
					num == 1 ? $$('#tab3').html(compiledNotify(data)) : $$('#tab3').append(compiledNotify(data));//判断是否是第一次加载数据
					$$('.lazy').trigger('lazy')
				} else {
					myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
					$$('.infinite-scroll-preloader-index').children('.preloader').hide();
					$$('.infinite-scroll-preloader-index').children('p').show();
				}
			} else {
				myApp.detachInfiniteScroll($$('.infinite-scroll-index'));
				toastText(data.message)
			}
		}, isLoad);
	}

});

// 应用中心初始化
myApp.onPageInit('applications', function (page) {

	showTabBarJS(false)
	var userInfo = localStorage.getItem("userInfo");
	var container = $$(page.container);
	userInfo = JSON.parse(userInfo);

	var templateApp = $$('#apps').html(), compiledApp = Template7.compile(templateApp);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000003"
	}, function (data) {
		var cont = compiledApp(data.content);
		$$('#aplicationWap').html(cont);
		$$('#aplicationWap').find('.ifly-section').find('.col-25').on('click', applicatFn.goPages)
	});

	$$('#edit').click(function () {
		var fixedItem = $$('#myAppWap').parent(),
			ocuppyHeight = parseInt(fixedItem.height()) + parseInt(fixedItem.css('padding-top')) + parseInt(fixedItem.css('padding-bottom'));

		if ($$(this).html() == '编辑') {
			$$(this).html('保存').css('color', '#3d8eef');
			$$('.ifly-section').each(function () {
				$$(this).addClass('ifly-active')
			})

			container.find('.page-content').addClass('iflyEditState');
			fixedItem.addClass('section-fixed');
			container.find('.ifly-applications').css('top', (ocuppyHeight + 54) + 'px');
			applicatFn.bindFnInitCh(true)
		} else {
			container.find('.page-content').removeClass('iflyEditState');
			var ids = [];
			$$('#myAppWap').children().filter(function () {
				return !$$(this).hasClass('ifly-leave') && $$(this)
			}).each(function () {
				ids.push($$(this).children().attr('data-appId'))
			})
			iflyRequest({
				"userAccount": userInfo.userAccount,
				"token": userInfo.token,
				"ids": ids.join(','),
				"methodCode": "B100000004"
			}, function (data) {
				if (data.result) {
					toastText('保存成功')
				}
			});

			$$(this).html('编辑').css('color', '#333');
			$$('.ifly-section').each(function () {
				$$(this).removeClass('ifly-active')
			})
			fixedItem.removeClass('section-fixed');
			applicatFn.bindFnInitCh(false)
		}
	})

	var applicatFn = {
		bindFnInitCh: function (type) {
			var _this = this;
			if (type) {//判断是否绑定跳转事件：true 绑定
				$$('.ifly-right').off('click', _this.goPages);
				$$('.ifly-det').off('click', _this.goPages);
				$$('.ifly-add').off('click', _this.goPages);
				$$('.ifly-det').on('click', _this.removeItem);
				$$('.ifly-add').on('click', _this.addItem);
				$$('.icon-new').hide();
			} else {
				$$('.ifly-right').on('click', _this.goPages);
				$$('.ifly-det').off('click', _this.removeItem);
				$$('.ifly-add').off('click', _this.addItem);
				$$('.ifly-det').on('click', _this.goPages);
				$$('.ifly-add').on('click', _this.goPages)
				$$('.icon-new').show()
			}
		},
		removeItem: function (e) {

			var item = $$(applicatFn.getParent(e.target));
			var id = item.children('a').attr('data-appid');
			var fixedItem = $$('#myAppWap').parent(), ocuppyHeight = 0;

			applicatFn.matchItem(id, $$('#newAppWap'));
			applicatFn.matchItem(id, $$('#allAppWap'));
			if (item.hasClass('ifly-leave')) {
				toastText('默认选项，不可编辑')
			} else {
				item.remove()
			};

			// 计算fixedsection高度
			ocuppyHeight = parseInt(fixedItem.height()) + parseInt(fixedItem.css('padding-top')) + parseInt(fixedItem.css('padding-bottom'));
			container.find('.ifly-applications').css('top', (ocuppyHeight + 54) + 'px');

		},
		goPages: function (e) {
			var item = $$(applicatFn.getParent(e.target));
			if (item.children().attr('data-child') == '1') {//关键任务打开弹窗

				moveHrFn(item.children().attr('data-children'))
			} else if (item.children().attr('data-appId') == null) {//考勤跳转
				goToPage('', $$(this).children().children('p').html(), $$(this).children().attr('data-appLoad'), '')
			} else {
				goToPage($$(this).children().attr('data-url'), $$(this).children().children('p').html(), $$(this).children().attr('data-appLoad'), $$(this).children().attr('data-appStatus'), { "appId": $$(this).children().attr('data-appId') })
			}
		},
		addItem: function (e) {
			var fixedItem = $$('#myAppWap').parent(), ocuppyHeight = 0;
			if ($$('#myAppWap').children().length >= 7) {
				toastText('所选应用不得超过7个');
				return
			};
			var _this = applicatFn, obj = $$(applicatFn.getParent(e.target));
			var item = '<div class="col-25 ifly-det">' +
				'<a data-appload="' + obj.children().attr('data-appload') + '" data-url="' + obj.children().attr('data-url') + '" data-appId="' + obj.children().attr('data-appId') + '" data-children=' + obj.children().attr("data-children") + ' data-appstatus="' + obj.children().attr('data-appstatus') + '" data-child="' + obj.children().attr('data-child') + '" href="#">' +
				'<img src="' + obj.find('img').attr('src') + '" alt="">' +
				'<p>' + obj.find('p').html() + '</p>' +
				'</a>' +
				'</div>';

			obj.removeClass('ifly-add').addClass('ifly-right').off('click', _this.addItem);

			$$('#myAppWap').append($$(item));

			// 计算fixedsection高度
			ocuppyHeight = parseInt(fixedItem.height()) + parseInt(fixedItem.css('padding-top')) + parseInt(fixedItem.css('padding-bottom'));
			container.find('.ifly-applications').css('top', (ocuppyHeight + 54) + 'px');

			$$('#myAppWap').children().on('click', _this.removeItem);

			applicatFn.matchItem(obj.children().attr('data-appId'), $$('#newAppWap'), 'add');
			applicatFn.matchItem(obj.children().attr('data-appId'), $$('#allAppWap'), 'add');
		},
		getParent: function (target) {
			return target.tagName == 'A' ? $$(target).parent() : (target.tagName == 'DIV' ? $$(target) : $$(target).parent().parent());
		},
		matchItem: function (item, cont, type) {
			var _this = this;
			cont.children('.row').children().each(function () {
				if ($$(this).children().attr('data-appId') == item) {
					if (type && type == "add") {
						$$(this).removeClass('ifly-add').addClass('ifly-right').off('click', _this.addItem);
						return
					}
					!$$(this).hasClass('ifly-add') && $$(this).removeClass('ifly-right').addClass('ifly-add').on('click', _this.addItem);
				}
			})
		}
	}
});
myApp.onPageBack('applications', function (page) {

	showTabBarJS(true);
	var userInfo = localStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);
	var templateApp = $$('#myApp').html(), compiledApp = Template7.compile(templateApp);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000001"
	}, function (data) {
		if (data.result) {
			initApplication(compiledApp(data.content))
		}
	});
});

// 资讯详情初始化
myApp.onPageInit('normalDetail', function (page) {
	showTabBarJS(false)
	var userInfo = localStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);

	var templateDetail = $$('#informationDetail').html(), compiledDetail = Template7.compile(templateDetail);
	inforRequest(page.query.newsId, function (data) {

		if (data.content.detailType == '4') {
			goToPage(data.content.hrefUrl, "", "4", "", "");
		} else {
			$$('#detailCont').html(compiledDetail(data.content));
			$$('.ifly-detail-bot').children('.upvote').click(function () {
				thumbFn(this, page.url);
			})
			if (data.content.detailType == '4') {
				$$('#detailCont').children('.ifly-detail-cont').css('height', 'calc(100% - 145px)')
			}
		}

		if ($$('#videoContainer').length != 0) {
			jwplayer('videoContainer').setup({
				flashplayer: 'js/jwplayer/jwplayer.flash.swf',
				file: $$('#videoContainer').attr('src'),
				width: 500,
				height: 300,
				image: "http://live.iflytek.com/static/assets/images/mobile_bg.jpg",
				controls: true
			});
		}

	})
});
myApp.onPageBack('normalDetail', function (page) {
	if ($$('div[data-page=index]').length != 0) {
		showTabBarJS(true)
	}
});

// 资讯图集初始化
myApp.onPageInit('mutigDetail', function (page) {

	showTabBarJS(false);
	var templateGraph = $$('#multigraph').html(), compiledGraph = Template7.compile(templateGraph);
	inforRequest(page.query.newsId, function (data) {
		$$('#multigraphCont').html(compiledGraph(data.content));
		var mySwiper = myApp.swiper('.swiper-container', {
			onTransitionStart: function (swiper) {
				var activeIndex = swiper.activeIndex + 1,
					titles = swiper.slides.find('.swiper-slide-active img').attr('data-title');
				$$('#slideTitle').children('.text-wap').html(titles);
				$$('#currentNum').html(activeIndex);
			}
		});
		$$('.text-bot').children('.upvote').click(function () {
			thumbFn(this, page.url);
		})
	})
})
myApp.onPageBack('mutigDetail', function (page) {
	if ($$('div[data-page=index]').length != 0) {
		showTabBarJS(true)
	}
})

// 资讯专题初始化
myApp.onPageInit('specialTopic', function (page) {
	showTabBarJS(false);
	var userInfo = localStorage.getItem("userInfo"), pageCount = 1;
	userInfo = JSON.parse(userInfo);

	var templateSubject = $$('#subjectItem').html(), compileSubject = Template7.compile(templateSubject);
	var templateSubjectHead = $$('#headItem').html(), compileSubjectHead = Template7.compile(templateSubjectHead)
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000006",
		"subjectId": page.query.newsId,
		"pageSize": "10",
		"pageIndex": pageCount
	}, function (data) {
		console.log(data);
		if (data.result) {
			$$('#headWap').html(compileSubjectHead(data.content));
			$$('#subjectList').html(compileSubject(data.content.newsList));
			$$('.lazy').trigger('lazy');
			if (data.content.newsList.length < 10) {
				myApp.detachInfiniteScroll($$('.infinite-scroll-subject'));
				$$('.infinite-scroll-preloader-subject').hide()
			}
		}
	});

	// 下拉刷新
	var ptrContent = $$('.pull-to-refresh-content-subject');
	ptrContent.on('refresh', function (e) {
		setTimeout(function () {
			mainView.router.refreshPage();
			myApp.pullToRefreshDone();
		}, 1000)
	});

	// 滚动加载
	var loading = false;
	$$('.infinite-scroll-subject').on('infinite', function () {

		if (loading) return;
		loading = true;
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"methodCode": "B100000006",
			"subjectId": page.query.newsId,
			"pageSize": "10",
			"pageIndex": ++pageCount
		}, function (data) {
			loading = false;
			console.log(data);
			if (data.content.newsList.length != 0) {
				$$('#subjectList').append(compileSubject(data.content.newsList));
			} else {
				myApp.detachInfiniteScroll($$('.infinite-scroll-subject'));
				$$('.infinite-scroll-preloader-subject').html('没有更多数据了')
			}
		});
	})
});
myApp.onPageBack('specialTopic', function (page) {
	showTabBarJS(true)
});

// 通知
myApp.onPageInit('messages', function (page) {
	showTabBarJS(false)
	var userInfo = localStorage.getItem("userInfo"), pageNoticeCount = 1;
	var templateMsg = $$('#msgList').html(), compileMsg = Template7.compile(templateMsg);
	userInfo = JSON.parse(userInfo);
	requestData(pageNoticeCount, function (data) {
		$$('#msgWap').html(compileMsg(data));
		if (data.length < 10) {
			myApp.detachInfiniteScroll($$('.infinite-scroll-msg'));
			$$('.infinite-scroll-preloader').hide()
		}
		$$('#msgWap').children().filter(function () {
			if (!$$(this).hasClass('readed')) return this
		}).click(function () {
			$$(this).addClass('readed')
		})
	});

	// 上拉刷新
	var ptrContent = $$('.pull-to-refresh-content-msg');
	ptrContent.on('refresh', function (e) {
		pageNoticeCount = 1;
		setTimeout(function () {
			mainView.router.refreshPage()
		}, 1000)
	})

	// 下拉加载
	var loading = false;
	$$('.infinite-scroll-msg').on('infinite', function () {
		if (loading) return;
		loading = true;
		requestData(++pageNoticeCount, function (data) {
			loading = false;
			if (data.length == 0) {
				myApp.detachInfiniteScroll($$('.infinite-scroll-msg'));
				$$('.infinite-scroll-preloader-msg').html('已加载到底部！');
				return
			}
			$$('#msgWap').append(compileMsg(data));
			$$('#msgWap').children().filter(function () {
				if (!$$(this).hasClass('readed')) return this
			}).click(function () {
				$$(this).addClass('readed')
			})
		});
	})

	function requestData(pageCount, callback) {
		iflyRequest({
			"userAccount": userInfo.userAccount,
			"token": userInfo.token,
			"pageSize": "10",
			"pageIndex": pageCount,
			"methodCode": "B100000009"
		}, function (data) {
			callback && callback(data.content)
		});
	}
});
myApp.onPageBack('messages', function (page) {
	showTabBarJS(true)
	var userInfo = localStorage.getItem("userInfo"), pageCount = 1;
	userInfo = JSON.parse(userInfo);
	// 未读信息条数
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"methodCode": "B100000002"
	}, function (data) {
		console.log(data)
		if (data.result) {
			data.content == '0' ? $$('#spot').hide() : $$('#spot').html(data.content).show()
		}
	});
});

// 通知详情
myApp.onPageInit('msgDetail', function (page) {
	var id = page.query.id,
		templateMesDetail = $$('#msgDetail').html(),
		compileMesDetail = Template7.compile(templateMesDetail);

	var userInfo = localStorage.getItem("userInfo"), pageCount = 1;
	userInfo = JSON.parse(userInfo);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"id": id,
		"methodCode": "B100000010"
	}, function (data) {
		if (data.result) {
			$$('#msgDetailWap').html(compileMesDetail(data.content));
			$$('#msgDetailWap').find('a').filter(function (t) {
				if ($$(this).attr('href') && $$(this).attr('href') != '#' && $$(this).attr('href') != 'javascript:;') {
					var url = $$(this).attr('title');
					$$(this).click(function () {
						mainView.router.loadPage('pages/pageUrl/pageUrl.html?url=' + url)
					})
				}
			})
		}
	});
});

myApp.onPageInit('iframe', function (page) {
	$$('iframe').attr('src', page.query.url)
});

//通知公文详情
myApp.onPageInit('ndDetail', function () {
	if (!isIOS) {
		$$('#iframe').attr('src', window.basicMes.url);
		$$('#title').html(window.basicMes.title)
	}
})

// 首页应用中心渲染
function initApplication(dom) {
	$$('#appWrap').html(dom);
	$$('#appWrap').children().children().filter(function () {
		return !$$(this).hasClass('last-one') && $$(this)
	}).each(function (index, el) {
		if ($$(this).children().attr('data-child') == '1') {
			$$(this).click(function (event) {
				moveHrFn($$(this).children().attr('data-children'))
			});
		} else if ($$(this).children().attr('data-url') == null) {
			$$(this).click(function (event) {
				goToPage('', $$(this).children().children('p').html(), $$(this).children().attr('data-appLoad'), '')
			});
		} else {
			$$(this).click(function (event) {
				goToPage($$(this).children().attr('data-url'), $$(this).children().children('p').html(), $$(this).children().attr('data-appLoad'), $$(this).children().attr('data-appStatus'), { "appId": $$(this).children().attr('data-appId') })
			});
		}
	});
}

// 移动Hrmodal
function moveHrFn(data) {//移动Hr
	var templateModal = $$('#moveHr').html();
	var compiledModal = Template7.compile(templateModal);

	myApp.modal({
		title: '<h2 class="ifly-title clearfix"><span class="text">移动HR</span><a href="#" onclick="myApp.closeModal()"><i class="icon icon-close"></i></a></h2>',
		text: compiledModal(JSON.parse(data)),
	})
	$$('.modal').addClass('ifly-modal02');

	$$('.modal.ifly-modal02 .ifly-section').find('.col-33').click(function () {
		goToPage($$(this).children().attr('data-url'), '', 1, '', { 'appId': $$(this).children().attr('data-appId') })
	})
}

// 跳转页面
function goToPage(url, appName, appLoadType, appStatusColor, objPsd) {
	console.log(url + '>>>>' + appName + '>>>>' + appLoadType + '>>>>' + appStatusColor);
	// showLoading()

	if (true) {
		var dic = {};
		if (appLoadType == 0) {
			//考勤
			dic = {
				appName: appName,
				appLoadType: appLoadType
			};
		}
		if (appLoadType == 1) {
			//普通应用
			dic = {
				url: url,
				appName: appName,
				appLoadType: appLoadType,
				appStatusColor: appStatusColor
			};

		}
		if (appLoadType == 2) {
			//post应用
			var userInfo = localStorage.getItem("userInfo");
			userInfo = JSON.parse(userInfo);
			var param = 'userAccount=' + userInfo.userAccount + '&token=' + userInfo.token + '';
			dic = {
				url: url,
				appName: appName,
				appLoadType: appLoadType,
				param: param,
				appStatusColor: appStatusColor
			};
		}

		if (appLoadType == 3) {
			//get应用
			var userInfo = localStorage.getItem("userInfo");
			userInfo = JSON.parse(userInfo);
			var param = 'userAccount=' + userInfo.userAccount + '&token=' + userInfo.token + '';
			dic = {
				url: url,
				appName: appName,
				appLoadType: appLoadType,
				param: param,
				appStatusColor: appStatusColor
			};
		}
		if (appLoadType == 4) {
			var dic = {};
			dic = {
				url: url,
				appLoadType: appLoadType
			};
		}
		if (appLoadType == 5) {
			//http://live.iflytek.com/iflytek/app/login
			console.log("====原始url====" + url);
			murl = url.split('#')[0];
			console.log("====url前部====" + murl);
			param = url.split('#')[1];
			console.log("====url参数====" + param);
			var userInfo = localStorage.getItem("userInfo");
			userInfo = JSON.parse(userInfo);
			param = param + '&userAccount=' + userInfo.userAccount + '&token=' + userInfo.token + '&userName=' + userInfo.userName + '';
			var dic = {};
			dic = {
				url: murl,
				appName: appName,
				appLoadType: appLoadType,
				param: param,
				appStatusColor: appStatusColor
			};
		}
		if (appLoadType == 6) {
			//post应用
			console.log("====原始url====" + url);
			murl = url.split('#')[0];
			console.log("====url前部====" + murl);
			param = url.split('#')[1];
			console.log("====url参数====" + param);
			dic = {
				url: murl,
				appName: appName,
				appLoadType: appLoadType,
				param: param,
				appStatusColor: appStatusColor
			};
		}

		if (objPsd && typeof (objPsd) == "object") {
			for (var key in objPsd) {
				if (objPsd.hasOwnProperty(key) === true) {   //此处hasOwnProperty是判断自有属性，使用 for in 循环遍历对象的属性时，原型链上的所有属性都将被访问会避免原型对象扩展带来的干扰
					dic[key] = objPsd[key];
				}
			}
		}
		//dic= Object.assign(dic,objPsd);
		console.log(dic)

		if (isIOS) {
			if (current_ios_version >= 9.0) {
				window.webkit.messageHandlers.goToUrlPage.postMessage(dic);
			} else {
				goToUrlPage(dic);
			}
		} else {
			iflyapp.goToUrlPage(JSON.stringify(dic));
		}
	}
}

//资讯页面跳转
function inforGoTo(hasSubject, newsType, newsId) {

	if (hasSubject == 'true') {//专题
		mainView.router.loadPage('pages/specialTopic.html?newsId=' + newsId)
		return;
	}

	if (newsType == '3') {//picker
		mainView.router.loadPage('pages/information/multigraph.html?newsId=' + newsId)
		return;
	}

	inforRequest(newsId, function (data) {
		console.log(data.content.detailType);
		if (data.content.detailType == '4') {
			goToPage(data.content.hrefUrl, "", "4", "", "");
		} else {
			mainView.router.loadPage('pages/information/normal.html?newsId=' + newsId);
		}
	})
}

// 资讯统一请求方法
function inforRequest(newsId, callback) {
	var userInfo = localStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"newsId": newsId,
		"methodCode": "B100000007"
	}, function (data) {
		data.result && callback(data)
	});
}

// 点赞
function thumbFn(id, url) {

	var userInfo = localStorage.getItem("userInfo"), _this = id;
	userInfo = JSON.parse(userInfo);
	iflyRequest({
		"userAccount": userInfo.userAccount,
		"token": userInfo.token,
		"newsId": $$(_this).attr('data-id'),
		"methodCode": "B100000012"
	}, function (data) {
		if (data.result) {
			var num = parseInt($$(_this).children('font').html()) + 1, wap;
			$$(_this).children('.icon').removeClass('icon-thumbmark').removeClass('icon-thumbWhite').addClass('icon-thumb');
			$$(_this).children('font').html(num);
			$$(_this).addClass('ifly-orange');
			wap = $$('#headLineList').length == 0 ? $$('#subjectList') : $$('#headLineList');
			wap.children().each(function () {
				if ($$(this).children('a').attr('href') == url) {
					$$(this).find('.item-subtitle').children('.upvote').children('font').html(num)
				}
			})
		}
		toastText(data.message);
	});
}

// 统一提示
function toastText(cont, fn) {//warn
	var options = {
		duration: 1500 // Hide toast after 1 seconds
	};
	myApp.toast(cont, '', options).show();
	fn && setTimeout(fn, 1500)
}

// 统一请求方法
function iflyRequest(data, callback, isLoad) {
	if (!(typeof (isLoad) == 'boolean' && !isLoad)) myApp.showIndicator();
    var url = 'http://117.71.53.47:9080/TyTransService/tytranservice/transfer/transInterface';
//    var url = 'https://iflyapp.iflytek.com:9443/TyTransService/tytranservice/transfer/transInterface'; // 正式版

	// 数据加密
	data = data;
	var paramData = data;
	data = JSON.stringify(data);

	var userInfo = localStorage.getItem("userInfo");
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
		timeout: 10000, //超时时间设置，单位毫秒
		//dataType: 'json',
		success: function (data) {

			myApp.hideIndicator();

			var securityData = JSON.parse(data);
			securityData     = securityData.securityData;
			//数据解密
			var decrypt = CryptoJS.AES.decrypt(securityData, dataKey, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			decrypt = CryptoJS.enc.Utf8.stringify(decrypt).toString();
			var jsonData = JSON.parse(decrypt);

			if ((jsonData.message != undefined && jsonData.message.toLowerCase().indexOf("token") >= 0) || (jsonData.msg != undefined && jsonData.msg.toLowerCase().indexOf("token") >= 0)) {
				if (isIOS) {
					if (current_ios_version >= 9.0) {
						window.webkit.messageHandlers.illegalTokenAction.postMessage(null);
					} else {
						illegalTokenAction();
					}
				} else {
					iflyapp.illegalTokenAction();
				}
			}
			// 回调
			callback(jsonData);
			// hideLoading();

		},
		error: function (xhr, status) {
			myApp.hideIndicator();
			if ($$('.modal').length == 0) {
				myApp.alert('网络请求异常，请重新尝试', '');
			}
		}
	});
}

// 显示底部导航 type:true 隐藏；false:显示
function showTabBarJS(type) {
	if (isIOS) {
		// type?myApp.alert('显示'):myApp.alert('隐藏');
		if (current_ios_version >= 9.0) {
			if (type) {
				window.webkit.messageHandlers.showTabBarAction.postMessage(null);
			} else {
				window.webkit.messageHandlers.hideTabBarAction.postMessage(null);
			}
		} else {
			type ? showTabBarAction() : hideTabBarAction();
		}
	} else {
		// type?myApp.alert('显示'):myApp.alert('隐藏');
		type ? iflyapp.showTabBarAction() : iflyapp.hideTabBarAction();
	}
	//type?myApp.alert('显示'):myApp.alert('隐藏')
}

//判断设备
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

//去首尾空格
String.prototype.trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

//初始化回调
function transferTokenAndUserIDCallBack(userAccount, token, userName, userId, userOrgId, userCode, securityKey) {
	console.log("transferTokenAndUserIDCallBack==" + "userAccount=" + userAccount + ";token=" + token + ";userName=" + userName + ";userId=" + userId + ";userOrgId=" + userOrgId + ";userCode=" + userCode + ";securityKey=" + securityKey);
	var userInfo = {
		"userAccount": userAccount,
		"token": token,
		"userName": userName,
		"userId": userId,
		"userOrgId": userOrgId,
		"userCode": userCode,
		"securityKey": securityKey
	}
	localStorage.setItem("userInfo", JSON.stringify(userInfo));

	indexFn.trigger();
}

// 初始化
function init() {
	isIOS = getParameter("isIOS") === 'true';
	current_ios_version = parseFloat(getParameter("current_ios_version"));
	if (isIOS) {
		if (current_ios_version >= 9.0) {
			window.webkit.messageHandlers.getTokenAndUserAccount.postMessage(null);
		} else {
			getTokenAndUserAccount();
		}
	} else {
		iflyapp.getTokenAndUserAccount();
	}
}

// 待办局部刷新
function requestDealt() {

	var userInfo = localStorage.getItem("userInfo");
	userInfo = JSON.parse(userInfo);
	var template = $$('#existTemp').html();
	var compiledTemplate = Template7.compile(template);
	iflyRequest({
		'userAccount': userInfo.userAccount,
		'token': userInfo.token,
		"methodCode": "B100010028"
	}, function (data) {
		if (data.result) {
			$$('#flyExist').html(compiledTemplate(data.content));
			$$('#flyExist').children('ul').children('li').click(function () {
				goToPage($$(this).attr('data-url'), "", "1", "", { 'pwdStatus': data.content.pwdStatus });
			})
		}
	})

}

//进入消息列表
function inMessage() {
	mainView.router.loadPage('pages/msg.html')
}

//通知公文页面跳转
function toIframePage(url, type) {
	var userInfo = JSON.parse(localStorage.getItem("userInfo"));
	var openUrl = url + '&userAccount=' + userInfo.userAccount + '&token=' + userInfo.token;
	if (isIOS) {
		//post应用
		var param = 'userAccount=' + userInfo.userAccount + '&token=' + userInfo.token + '';
		dic = {
			url: openUrl,
			appName: $$('#headLineList .tab-link.active').html(),
			appLoadType: '4'
		};

		try {
			goToUrlPage(dic);
		} catch (error) {
			window.webkit.messageHandlers.goToUrlPage.postMessage(dic);
		}
	} else {
		window.basicMes = {
			url: openUrl,
			title: $$('#headLineList .tab-link.active').html()
		};

		mainView.router.load({
			url: 'pages/ndDetail.html'
		})
		type == 1 ? $$('#pageTitle').html('通知') : $$('#pageTitle').html('公文');

		// registerBackButton(1, function () {
		//     mainView.router.back();
		//     registerBackButton(3);
		// });
		// iflyapp.hideTabBarAction();

	}
}


init();
// transferTokenAndUserIDCallBack('ybpan','JW385IEll19sjqBjTqDQ86EAhEwoYTRGBOvk3UKfK9zp5ZhyX7zAN0FgoDGxXJujpKL16ZBKUvPTyyJF30O_JhGQhjsi_vBrsfEH2LWTRGo=','潘永波','','7da006b4-e731-4040-a483-deadd516a4f9','BEST20150318','1280977330000000')
// transferTokenAndUserIDCallBack('jfai','sZ8ui9TjKC4ERTGjH.FneKaJv4PLKSC_KUKhkFi6NZYjbKkazA5tapMjNUjfP3QtGthemMG3gj4E4kXHnqPUMMouZer0dJ.01dubDrwwA9Y=','艾建飞','','89f6c8f3-8e13-4365-83c5-786087bdc87e','20120333','1280977330000000')
// transferTokenAndUserIDCallBack('feiliu6','7c3fDJPEg7IXX06VY65KQjsnLIbgVRGxCJsCjdxnmkTkqPYKaQ1n5TR4GwrKRtSYpalaPFZQTHUC4RbUeJS6Lkx_aFuVXUxMrAue6SUSoJQ=','余斌','9Bg1orEcRY+8EGVnhw2d1YDvfe0=','89f6c8f3-8e13-4365-83c5-786087bdc87e','20160165','1280977330000000')
