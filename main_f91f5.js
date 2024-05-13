window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;

    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;

    function setLoadingDisplay() {
        // Loading splash scene
        var splash = document.getElementById('splash');
        // var progressBar = splash.querySelector('.progress-bar span');
        // onProgress = function (finish, total) {
        //     var percent = 100 * finish / total;
        //     if (progressBar) {
        //         progressBar.style.width = percent.toFixed(2) + '%';
        //     }
        // };
        splash.style.display = 'block';
        // progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            // splash.style.display = 'none';
        });
    }

    var closeSplashFunc = function () {
        var splash = document.getElementById('splash');
        splash.style.display = 'none';
    };

    window.closeSplashFunc = closeSplashFunc;
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(arguments[i]);
        return ar;
    };

    function getArg(ar) {
        var args = [];
        for (var _i = 1; _i < ar.length; _i++) {
            args[_i - 1] = ar[_i];
        }
        return args
    }
    function resetDownloader() {
        var REGEX = /^(?:\w+:\/\/|\.+\/).+/;
        var getHash = function (url) {
            var hashUrl;
            if (window.ResMD5 && window.ResMD5.getHash) {
                // eslint-disable-next-line dot-notation, quotes
                hashUrl = window.ResMD5.getHash(url);
            }
            return hashUrl;
        };

        function getHashUrl(url) {
            if (window.ResMD5 && window.ResMD5.rename) {
                // eslint-disable-next-line dot-notation, quotes
                return window.ResMD5.rename(url);
            } else {
                return url;
            }
        };

        /** 引擎原始的assetManager.downloader对象 */
        var downloader = cc.assetManager.downloader;

        /** 引擎原始的下载回调表 */
        var downloaders = downloader._downloaders;

        var downloadDomImage1 = downloaders['.jpg'];
        var _downloadDomImage = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            var state = args && args[0] && args[0].noWebp;
            if (!window._LOCALDEV && !state && cc.sys.capabilities.webp && (url.indexOf('.png') > -1 || url.indexOf('.jpg') > -1)) {
                var lastInx = url.lastIndexOf('.');
                url = url.slice(0, lastInx);
                url += '.webp';
            }
            return downloadDomImage1.apply(this, __spread([url], args))
        };

        var downloadText = downloaders['.txt'];
        var _downloadText = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            return downloadText.apply(this, __spread([url], args));
        };

        var downloadArrayBuffer = downloaders['.bin'];
        var _downloadArrayBuffer = function (url) {
            var lastInx = 0;
            var args = getArg(arguments);
            if (url.indexOf('.astc') > -1) {
                lastInx = url.lastIndexOf('.');
                url = url.slice(0, lastInx);
                var tempUrl = url;
                url = tempUrl + '.png';
                var hash = getHash(url);
                if (!hash) {
                    url = tempUrl + '.jpg';
                    hash = getHash(url);
                }
                url = tempUrl + (hash ? '_' + hash : '') + '.astc';
            } else {
                url = getHashUrl(url);
            }
            return downloadArrayBuffer.apply(this, __spread([url], args));
        };

        var downloadJson = downloaders['.json'];
        var _downloadJson = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            return downloadJson.apply(this, __spread([url], args));
        };
        var downloadBundle = downloaders.bundle;
        var _downloadBundle = function (nameOrUrl, options, onComplete) {
            nameOrUrl = getHashUrl(nameOrUrl);

            var bundleName = cc.path.basename(nameOrUrl);
            var url = nameOrUrl;
            if (!REGEX.test(url)) url = 'assets/' + bundleName;
            var version = options.version || downloader.bundleVers[bundleName];
            var count = 0;
            var config = url + '/config.' + (version ? version + '.' : '') + 'json';
            var out = null;
            var error = null;
            _downloadJson(config, options, function (err, response) {
                if (err) {
                    error = err;
                }
                out = response;
                out && (out.base = url + '/');
                count++;
                if (count === 2) {
                    onComplete(error, out);
                }
            });

            var js = url + '/index.' + (version ? version + '.' : '') + 'js'
            _downloadScript(js, options, function (err) {
                if (err) {
                    error = err;
                }
                count++;
                if (count === 2) {
                    onComplete(error, out);
                }
            });

            // return downloadBundle(url, ...args);
        };
        var downloadAudio = downloaders['.mp3'];
        var _downloadAudio = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);

            return downloadAudio.apply(this, __spread([url], args));
        };
        var downloadFont = downloaders['.font'];
        var _downloadFont = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);

            return downloadFont.apply(this, __spread([url], args));
        };
        var downloadScript = downloaders['.js'];
        var _downloadScript = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            return downloadScript.apply(this, __spread([url], args));
        };
        var downloadCCONB = downloaders['.cconb'];
        var _downloadCCONB = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            return downloadCCONB.apply(this, __spread([url], args));
        };
        var downloadCCON = downloaders['.ccon'];
        var _downloadCCON = function (url) {
            url = getHashUrl(url);
            var args = getArg(arguments);
            return downloadCCON.apply(this, __spread([url], args));
        };

        downloaders['.png'] = _downloadDomImage;
        downloaders['.jpg'] = _downloadDomImage;
        downloaders['.bmp'] = _downloadDomImage;
        downloaders['.jpeg'] = _downloadDomImage;
        downloaders['.gif'] = _downloadDomImage;
        downloaders['.ico'] = _downloadDomImage;
        downloaders['.tiff'] = _downloadDomImage;
        downloaders['.webp'] = _downloadDomImage;
        downloaders['.image'] = _downloadDomImage;

        downloaders['.pvr'] = _downloadArrayBuffer;
        downloaders['.pkm'] = _downloadArrayBuffer;
        downloaders['.astc'] = _downloadArrayBuffer;
        downloaders['.binary'] = _downloadArrayBuffer;
        downloaders['.bin'] = _downloadArrayBuffer;
        downloaders['.dbbin'] = _downloadArrayBuffer;
        downloaders['.skel'] = _downloadArrayBuffer;

        downloaders['.json'] = _downloadJson;
        downloaders['.ExportJson'] = _downloadJson;

        /** 音频 */
        downloaders['.mp3'] = _downloadAudio;
        downloaders['.ogg'] = _downloadAudio;
        downloaders['.wav'] = _downloadAudio;
        downloaders['.m4a'] = _downloadAudio;

        /** 字体 */
        downloaders['.eot'] = _downloadFont;
        downloaders['.font'] = _downloadFont;
        downloaders['.svg'] = _downloadFont;
        downloaders['.ttc'] = _downloadFont;
        downloaders['.ttf'] = _downloadFont;
        downloaders['.woff'] = _downloadFont;

        downloaders['.js'] = _downloadScript;
        downloaders['.ccon'] = _downloadCCON;
        downloaders['.cconb'] = _downloadCCONB;
        downloaders.bundle = _downloadBundle;

        downloaders['.txt'] = _downloadText;
        downloaders['.xml'] = _downloadText;
        downloaders['.vsh'] = _downloadText;
        downloaders['.fsh'] = _downloadText;
        downloaders['.atlas'] = _downloadText;
        downloaders['.tmx'] = _downloadText;
        downloaders['.tsx'] = _downloadText;
        downloaders['.plist'] = _downloadText;
        downloaders['.fnt'] = _downloadText;
        downloaders.default = _downloadText;
    }

    var initSDK = function () {
        if (window.GameCfgGlobal && window.GameCfgGlobal.IS_SDK) {
            window.SDK.init();
            window.SDK.login(onStart)
        } else {
            onStart();
        }
    }

    var onStart = function () {
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isBrowser) {
            setLoadingDisplay();
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            } else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            // cc.view.enableAutoFullScreen([
            //     cc.sys.BROWSER_TYPE_BAIDU,
            //     cc.sys.BROWSER_TYPE_BAIDU_APP,
            //     cc.sys.BROWSER_TYPE_WECHAT,
            //     cc.sys.BROWSER_TYPE_MOBILE_QQ,
            //     cc.sys.BROWSER_TYPE_MIUI,
            //     cc.sys.BROWSER_TYPE_HUAWEI,
            //     cc.sys.BROWSER_TYPE_UC,
            // ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 2;
            cc.assetManager.downloader.maxRequestsPerFrame = 2;
        }

        var launchScene = settings.launchScene;
        var bundle = cc.assetManager.bundles.find(function (b) {
            return b.getSceneInfo(launchScene)
        });

        bundle.loadScene(
            launchScene,
            null,
            onProgress,
            function (err, scene) {
                if (!err) {
                    cc.director.runSceneImmediate(scene);
                    if (cc.sys.isBrowser) {
                        // show canvas
                        var canvas = document.getElementById('GameCanvas');
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                        console.log('Success to load scene');
                    }
                }
            },
        );
    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    resetDownloader();
    cc.assetManager.init({
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server,
    });

    var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;

    function cb(err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.assetManager.loadBundle(MAIN, function (err) {
                if (!err) cc.game.run(option, initSDK);
            });
        }
    }

    cc.assetManager.loadScript(settings.jsList.map(function (x) {
        return 'src/' + x
    }), cb);

    for (var i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};

if (window.jsb) {
    var isRuntime = typeof loadRuntime === 'function';
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/engine/index.js');
    } else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}

(function (win) {
    // Sdk全局变量
    win.GameSDKGlobal = {
        // 登录参数
        login_param: {}
    };

    win.SDK = {

        init: function () {
            if (window && window['TZSDK']) {
                // console.log('========sdk 初始化========= window[TZSDK].init ====');
                window['TZSDK'].init();
                // 数据上报 sdk初始化
                // EventClient.I.emit(AppEvent.DataReport, EDataReportId.SDKInit);
            } else {
                console.error(' sdk 初始化调用失败');
            }
        },

        // 登录
        login: function (callFun) {
            if (window && window['TZSDK']) {
                // console.log('========sdk 登录========= window[TZSDK].login ====');
                window['TZSDK'].login((param) => {
                    // 登陆成功回调函数（异步）

                    // console.log('========sdk 登录=成功======== window[TZSDK].login ====');
                    win.GameSDKGlobal.login_param = param
                    if (callFun) {
                        callFun();
                    }
                });
            } else {
                console.error(' sdk 登录调用失败');
            }
        },

        /** 支付 */
        pay: function (payData, callFun) {
            console.log('支付参数');
            console.log(payData);
            window['TZSDK'].pay(payData, (data) => {
                if (callFun) {
                    callFun(data)
                }
            });
        },

        /** 打开健康游戏公告 */
        openHealthTip: function () {
            console.log(' sdk 显示适龄提示');
            if (window && window['TZSDK']) {
                window['TZSDK'].openHealthTip();
            } else {
                console.error(' sdk 打开健康游戏公告调用失败');
            }
        },

        /** 退出游戏 */
        exitLogin: function () {
            if (window && window['TZSDK'] && window['TZSDK'].exitLogin) {
                window['TZSDK'].exitLogin();
            } else {
                window.location.reload();
            }
        },


        /** 打开用户中心界面 */
        openUserCenter: function () {
            if (window && window['TZSDK'] && window['TZSDK'].openUserCenter) {
                window['TZSDK'].openUserCenter();
            }
        },

        /** 打开联系客服界面 */
        openCustomer: function () {
            if (window && window['TZSDK'] && window['TZSDK'].openCustomer) {
                window['TZSDK'].openCustomer();
            }
        },
        /** 切换账号 */
        switchAccount: function () {
                if (window && window['TZSDK'] && window['TZSDK'].openCustomer) {
                    window['TZSDK'].switchAccount();
                }
        },
        /** 上报角色升级数据 */
        roleUpgrade: function (info) {
                if (window && window['TZSDK'] && window['TZSDK'].roleUpgrade) {
                    window['TZSDK'].roleUpgrade(info);
                }
            },
            /** 上报角色数据 */
            reportRoleInfo: function (info) {
                if (window && window['TZSDK'] && window['TZSDK'].reportRoleInfo) {
                    window['TZSDK'].reportRoleInfo(info);
                }
        }

    }


}(window));