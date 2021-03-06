// api_uri = "https://ssl.zhironghao.com/api/";
// root_uri = "http://test.zhironghao.com/#";
// h5_uri = "http://172.17.3.158:8000/html5/scb";
// h5_uri = "http://test.zhironghao.com/html5/scb";

api_uri = "http://api.supeiyunjing.com/";
root_uri = "http://app.supeiyunjing.com/#";
h5_uri = "http://app.supeiyunjing.com/html5/scb";

templates_root = "templates/";
deskey = "abc123.*abc123.*abc123.*abc123.*";
var app = angular.module('app', [
    'ng', 'ngRoute', 'ngAnimate', 'loginCtrl', 'registerCtrl', 'articleCtrl', 'userCtrl'
], ['$httpProvider', function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}]);
app.run(['$location', '$rootScope', '$http', '$routeParams',
      function ($location, $rootScope, $http, $routeParams) {

        $rootScope.qiniu_bucket_domain = "o793l6o3p.bkt.clouddn.com";

        var no_check_route = ["/article/list", "/login", "/register/step1", "/register/step2", "/register/reset1", "/register/reset2"];

        // 浏览器鉴别
        var ua = navigator.userAgent.toLowerCase();
        $rootScope.wx_client = ua.indexOf('micromessenger') != -1;
          // $rootScope.wx_client = false;
        // var isAndroid = ua.indexOf('android') != -1;
        $rootScope.isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        // 微信初始化
        if($rootScope.wx_client){
            $http({
                url: api_uri + "wx/share",
                method: "GET",
                 params: {
                     "url":$location.absUrl()
                 }
            }).success(function(d){
                if (d.returnCode == 0) {
                    wx.config({
                        debug: false,
                        appId: d.result.appid,
                        timestamp: d.result.timestamp,
                        nonceStr: d.result.noncestr,
                        signature: d.result.signature,
                        jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","hideMenuItems","showMenuItems","hideAllNonBaseMenuItem","showAllNonBaseMenuItem","translateVoice"],

                    });

                    wx.ready(function(){

                    });
                    wx.error(function(res){
                        // console.log(res);
                    });
                }

            }).error(function(data){
                // TODO 请求用户信息异常
            });
        }

          $rootScope.getUrl = function (url,id) {
            if(id){
                $rootScope.title = $rootScope.shareBankname+$rootScope.shareProductName;
                $rootScope.desc = $rootScope.desc_detail;
            }else if(url.indexOf("showActivity") > -1){
                $rootScope.title ='直融号8月活动';
                $rootScope.desc = '千亿资金等你来拿';
            }else{
                $rootScope.title ='直融号';
                $rootScope.desc = '打造企业最低融资成本';
            }
            var strs = []; //定义一数组
            strs=url.split("?"); //字符分割
            console.log(strs);
            if ($rootScope.login_user) {
                $rootScope.userId = $rootScope.login_user.userId;
            }
            if ($routeParams.shareId) {
                $rootScope.shareId = $routeParams.shareId;
            }
            var m_params = {
                url: strs[0],
                userId: $rootScope.userId,
                from: 0,
                shareId: $rootScope.shareId,
            };
            // console.log(m_params);
            $.ajax({
                type: 'POST',
                url: api_uri + "wxShare/share",
                data: m_params,
                traditional: true,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.returnCode == 0) {
                        $rootScope.shareReturn = data.result;
                        $rootScope.shareReturn.sn = data.result.sn;
                        $rootScope.shareReturn.token = data.result.token;
                        wx.onMenuShareAppMessage({
                            title: $rootScope.title,
                            desc: $rootScope.desc,
                            link: api_uri + "wxShare/show?sn=" + $rootScope.shareReturn.sn + "&token=" + $rootScope.shareReturn.token,
                            imgUrl: "http://app.supeiyunjing.com/img/share.png",
                            success: function () {
                                var params = {
                                    "sn": $rootScope.shareReturn.sn,
                                    "token": $rootScope.shareReturn.token,
                                    "to": "AppMessage"
                                };
                                $http({
                                    url: api_uri + "wxShare/isShare",
                                    method: "GET",
                                    params: params
                                }).success(function (d) {
                                    // console.log(d);
                                });
                            }
                        });

                        wx.onMenuShareTimeline({
                            title: $rootScope.title,
                            desc: $rootScope.desc,
                            link: api_uri + "wxShare/show?sn=" + $rootScope.shareReturn.sn + "&token=" + $rootScope.shareReturn.token,
                            imgUrl: "http://app.supeiyunjing.com/img/share.png",
                            success: function () {
                                var params = {
                                    "sn": $rootScope.shareReturn.sn,
                                    "token": $rootScope.shareReturn.token,
                                    "to": "Timeline"
                                };
                                $http({
                                    url: api_uri + "wxShare/isShare",
                                    method: "GET",
                                    params: params
                                }).success(function (d) {
                                    // console.log(d);
                                });
                            }
                        });

                        wx.onMenuShareQQ({
                            title: $rootScope.title,
                            desc: $rootScope.desc,
                            link: api_uri + "wxShare/show?sn=" + $rootScope.shareReturn.sn + "&token=" + $rootScope.shareReturn.token,
                            imgUrl: "http://app.supeiyunjing.com/img/share.png",
                            success: function () {
                                var params = {
                                    "sn": $rootScope.shareReturn.sn,
                                    "token": $rootScope.shareReturn.token,
                                    "to": "QQ"
                                };
                                $http({
                                    url: api_uri + "wxShare/isShare",
                                    method: "GET",
                                    params: params
                                }).success(function (d) {
                                    // console.log(d);
                                });
                            }
                        });

                        wx.onMenuShareWeibo({
                            title: $rootScope.title,
                            desc: $rootScope.desc,
                            link: api_uri + "wxShare/show?sn=" + $rootScope.shareReturn.sn + "&token=" + $rootScope.shareReturn.token,
                            imgUrl: "http://app.supeiyunjing.com/img/share.png",
                            success: function () {
                                var params = {
                                    "sn": $rootScope.shareReturn.sn,
                                    "token": $rootScope.shareReturn.token,
                                    "to": "Weibo"
                                };
                                $http({
                                    url: api_uri + "wxShare/isShare",
                                    method: "GET",
                                    params: params
                                }).success(function (d) {
                                    // console.log(d);
                                });
                            }
                        });
                    }
                    else {
                        // console.log("分享失败");
                    }
                },
                dataType: 'json',
            });
        };

        $rootScope.shareSuccess = function (sn, token, to) {
            var params = {
                "sn": sn,
                "token": token,
                "to": to
            };
            $http({
                url: api_uri + "wxShare/isShare",
                method: "GET",
                params: params
            }).success(function (d) {
                // console.log(d);
            });
            // console.log("sn:" + sn + ", token = " + token + " ,to:" + to);
        };

        // 页面跳转后
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            var present_route = $location.$$path; //获取当前路由
            var openid = $routeParams.openid;
            //console.log(openid);
            if (openid) {
                $rootScope.putObject("openid", openid);
                var m_params = {
                    "userId": $rootScope.login_user.userId,
                    "token": $rootScope.login_user.token,
                    "openid": openid
                };
                $http({
                    url: api_uri + "user/wxBind",
                    method: "GET",
                    params: m_params
                }).success(function (d) {
                    // console.log(d);
                });
            };
            $rootScope.removeSessionObject("showID");

            if (present_route == "/article/list" || present_route.indexOf("/article/show/") > -1
                || present_route == "/article/showActivity") {//列表

                var shareName = $location.search()['share'];
                if (shareName) {
                    var shareId = $location.search()['shareId'];
                    var share = {
                        "shareName": shareName,
                        "shareId": shareId,
                    };
                    $rootScope.putSessionObject("share", share);
                }
            } else {//其他 无需分享页面
                function onBridgeReady(){
                    wx.hideOptionMenu();
                }
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }else{
                    onBridgeReady();
                }
            }
        });

        // 页面跳转前

        $rootScope.$on('$routeChangeStart', function (event, current, previous) {
            var present_route = $location.$$path; //获取当前路由
            $rootScope.check_user();
            if (!$rootScope.login_user) {
                if (no_check_route.indexOf(present_route) > -1) {
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("/article/show") > -1) {//详情
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/step2") > -1) {//详情
                } else if (no_check_route.indexOf(present_route) <= -1 && present_route.indexOf("register/reset2") > -1) {//详情
                } else {
                    $rootScope.removeObject("login_user");
                    $rootScope.putSessionObject("present_route", present_route);
                    $location.path("/login");
                }
            } else {
                if (present_route == "/login") {
                }
            }
        });

        /*********************************** 全局方法区 e***************************************/
            // 对象存储
        $rootScope.putObject = function (key, value) {
            localStorage.setItem(key, angular.toJson(value));
        };
        $rootScope.getObject = function (key) {
            return angular.fromJson(localStorage.getItem(key));
        };
        $rootScope.removeObject = function (key) {
            localStorage.removeItem(key);
        };

        $rootScope.putSessionObject = function (key, value) {
            sessionStorage.setItem(key, angular.toJson(value));
        };
        $rootScope.getSessionObject = function (key) {
            return angular.fromJson(sessionStorage.getItem(key));
        };
        $rootScope.removeSessionObject = function (key) {
            angular.fromJson(sessionStorage.removeItem(key));
        };
        $rootScope.change = function ($event) {
            $event.stopPropagation();
        };
        $rootScope.isNullOrEmpty = function(strVal) {
            if ($.trim(strVal) == '' || strVal == null || strVal == undefined) {
                return true;
            } else {
                return false;
            }
        };
        //加密 3des
        $rootScope.encryptByDES = function (message) {
            var keyHex = CryptoJS.enc.Utf8.parse(deskey);
            var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        };
        //解密
        $rootScope.decryptByDES = function (ciphertext) {
            var keyHex = CryptoJS.enc.Utf8.parse(deskey);
            var decrypted = CryptoJS.DES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        };

        $rootScope.transFn = function(obj) {
		       var str = [];
			   for(var p in obj){
			       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			   }
			   return str.join("&").toString();
		 };

        $rootScope.touchStart = function(){
            $(".singleButtonFixed").addClass("singleButton2");
            $(".singleButton1").addClass("singleButton2");
        };
        $rootScope.touchEnd = function(){
            $(".singleButtonFixed").removeClass("singleButton2");
            $(".singleButton1").removeClass("singleButton2");
        };
        $rootScope.check_user = function () {
            $rootScope.login_user = $rootScope.getObject("login_user");
            if (!$rootScope.login_user) {
                $rootScope.removeObject("login_user");
                $rootScope.present_route = $location.$$path;
                return false;
            }else{
                $http({
                    url: api_uri + "auth/validateAuth",
                    method: "POST",
                    params: $rootScope.login_user
                }).success(function (d) {
                    if (d.returnCode == 0) {
                        return true;
                    } else {
                        $rootScope.removeObject("login_user");
                        $rootScope.present_route = $location.$$path;
                        if (no_check_route.indexOf($rootScope.present_route) <= -1
                            && $rootScope.present_route.indexOf("article/show")<= -1
                            && $rootScope.present_route.indexOf("register/step2") <= -1
                            && $rootScope.present_route.indexOf("register/reset2") <= -1) {
                            $rootScope.putSessionObject("present_route", $rootScope.present_route);
                        } else if ($rootScope.present_route = "/login") {
                            $rootScope.putSessionObject("present_route", $rootScope.present_route);
                        }

                        return false;
                    }

                }).error(function (d) {

                    return false;
                });
            }

        };


        if (!window.localStorage) {
            alert('This browser does NOT support localStorage');
        }

        if (!window.sessionStorage) {
            alert('This browser does NOT support sessionStorage');
        }
    }]);
