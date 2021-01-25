本web项目为了适应iOS新版本的相关特性，特在此将之前采用的方法更换成最新的WKWebView架构方法。修改方法如下：



之前：

```objective-c
if (isIOS) {

getTokenAndUserAccount();

    }

```



现在无参数的写法如下：

```objective-c
if (isIOS) {
   try {
      XXXXXXXXXX();
   } catch (error) {
       window.webkit.messageHandlers.XXXXXXXXXX.postMessage(null); // null
   }
 } else {
   iflyapp.XXXXXXXXXX();
}
```

（）这里面，没有参数的，必须传null，有参数的，传参数，写法如下：

```objective-c
if (isIOS) {
	try {
		XXXXXXXXXX(dic);
	} catch (error) {
		window.webkit.messageHandlers.XXXXXXXXXX.postMessage(dic);
	}
} else {
	iflyapp.XXXXXXXXXX(JSON.stringify(dic));
}
```

修改人：苏余昕龙（yxlsu）