;(function ($) {
    $.extend({
        loader: function (cfg) {
            var _this = this;
            this.init = function () {
                _this.preloader = new createjs.LoadQueue(true);
                _this.preloader._crossOrigin = true;
                _this.preloader.setMaxConnections(100);
                _this.preloader.maintainScriptOrder=true;
                _this.preloader.installPlugin(createjs.Sound);
                _this.preloader.on("fileload", _this.handleFileLoaded);
                _this.preloader.on('progress', _this.handleLoading);
                _this.preloader.on('complete', _this.handleComplete);
                // console.log(cfg.staticResource);
                _this.getStaticResource();
                // console.log(cfg.staticResource);
                _this.preloader.loadManifest(cfg.staticResource);
                if (cfg.bgmCtrl) {
                    _this.bgmCtrlIcon = cfg.bgmCtrlIcon ? cfg.bgmCtrlIcon : [
                        {src: 'https://public.pannacloud.com/img/music-open.png', id: 'music-open'},
                        {src: 'https://public.pannacloud.com/img/music-close.png', id: 'music-close'}
                    ]
                    _this.preloader.loadManifest(_this.bgmCtrlIcon);
                }
            };
            this.getStaticResource = function () {
                var img = $('body').find('.preload');
                img.each(function () {
                    var item = {};
                    var self = $(this);
                    var datasrc = self.attr('data-src');
                    self.attr('data-id',datasrc);
                    if(datasrc){
                        item.src = datasrc;
                        item.id = datasrc;
                        cfg.staticResource.push(item);
                    }
                });
                var imgBg = $('body').find('.preloadBg');
                imgBg.each(function () {
                    var item = {};
                    var self = $(this);
                    var datasrc = self.attr('data-src');
                    self.attr('data-id',datasrc);
                    if(datasrc){
                        item.src = datasrc;
                        item.id = datasrc;
                        cfg.staticResource.push(item);
                    }
                });
            };
            this.handleFileLoaded = function (event) {
                cfg.handleFileLoaded && cfg.handleFileLoaded(event);
            };
            this.handleLoading = function (evt) {
                cfg.handleLoading && cfg.handleLoading(evt);
            };
            this.handleComplete = function () {
                _this.bgm = createjs.Sound.createInstance("bgm");
                _this.audioAuto();
                if (window.WeixinJSBridge) {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        _this.bgm.play({loop: 99});
                    });
                } else {
                    _this.bgm.play({loop: 99});
                }

                //遍历图片标签
                var img = $('body').find('.preload');
                img.each(function () {
                    try {
                        var self = $(this);
                        var dataid = self.attr('data-id');
                        var imageblob = _this.preloader.getResult(dataid, true);
                        var imgWidth = _this.preloader.getResult(dataid).width;
                        var src = window.URL.createObjectURL(imageblob);
                        self.attr('src', src);
                        if (!self.hasClass('noResize')) {
                            self.css({'width': imgWidth / 100 + 'rem'});
                        }
                        // 是否设置center
                        if(self.hasClass('_sCenter')){
                            self.css({'left':'50%'});
                            self.css({'margin-left':-imgWidth/100/2 +'rem'});
                        }
                    }catch(err) {
                        console.log('dataid为'+dataid+'的资源出错。')
                    }

                });

                //遍历背景图片
                var imgbg = $('body').find('.preloadBg');
                imgbg.each(function () {
                    var self = $(this);
                    var dataid = self.attr('data-id');
                    var imageblob = _this.preloader.getResult(dataid, true);
                    var src = window.URL.createObjectURL(imageblob);
                    self.css('background-image', 'url(' + src + ')');
                });

                if (cfg.bgmCtrl) {
                    _this.musicCtrl()
                }

                var lt = setTimeout(function () {
                    cfg.handleComplete && cfg.handleComplete();
                    clearTimeout(lt);
                },500)

            };


            //自动播放
            this.audioAuto = function () {
                wx.ready(function () {

                });
            };


            //添加音乐控制图标
            this.musicCtrl = function () {
                var openSrc = window.URL.createObjectURL(_this.preloader.getResult('music-open', true));
                var closeSrc = window.URL.createObjectURL(_this.preloader.getResult('music-close', true));
                if (!$("#musicBtn").length) {
                    $("body").prepend("<a href='javascript:;' class='musicBtn music_open' id='musicBtn'></a>");
                    $("#musicBtn").css('background-image', "url(" + openSrc + ")");
                }
                
                document.addEventListener('visibilitychange', function () {
                    var isHidden = document.hidden
                    if (isHidden) {
                        _this.bgm.paused = true
                        // 如果要关闭页面释放下面的注释
                        // WeixinJSBridge.call('closeWindow')
                    } else {
                        if ($("#musicBtn").hasClass("music_open")) {
                            _this.bgm.paused = false
                        }
                    }
                })
                $("#musicBtn").click(function () {
                    if (_this.bgm.paused) {
                        _this.bgm.paused = false;
                        $("#musicBtn").addClass("music_open");
                        $("#musicBtn").css('background-image', "url(" + openSrc + ")");
                    } else {
                        _this.bgm.paused = true;
                        $("#musicBtn").removeClass("music_open");
                        $("#musicBtn").css('background-image', "url(" + closeSrc + ")");
                    }
                });
            };

            this.init();
            return this
        }
    })
})(jQuery)