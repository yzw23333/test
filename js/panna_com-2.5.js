/*
 * Version: 2.0.1
 * Author: lp
 * Create: 2015-09-06
 * Update: 2017-06-14
 */


//图片预加载
;(function($){
    $.fn.lazyloder = function(cfg) {
        var window_w = $('body').width();
        var font_size = window_w/6.4;
        $('html').css('font-size',font_size+'px');
        var curNum = 0;
        var imgs = this.find('.preload');
        var preLoadNum = imgs.length;
        var allComplete = function () {
                if(cfg.complete) {
                    cfg.complete();
                }
        }
        imgs.each(function() {
            var self = $(this);
            if(self.attr('data-src')){
                var img = new Image();
                img.src = self.attr('data-src');
                img.onload = function(){
                    curNum += 1;
                    var percent = curNum/preLoadNum;
                    self.attr('src', self.attr('data-src'));
                    // 预加载的图片都自动设置高宽
                    if(!self.hasClass('noResize')){
                        self.css({'width':this.width/100+'rem'});
                    }
                    // 是否设置center
                    if(self.hasClass('_sCenter')){
                        self.css({'left':'50%'});
                        self.css({'margin-left':-this.width/100/2 +'rem'});
                    }
                    // 加载进度
                    if(cfg.progress) {
                        cfg.progress(percent);
                    }

                    var loadingP = $(".loading-percent");
                    var loadingDiv = $("#loading");
                    loadingP.text(parseInt(percent*100)+'%');
                    loadingP.animate({'opacity':1}, 100,'');
                    if(percent==1){
                        allComplete();
                    }
                };
                img.onerror = function(){
                    var index = img.src.lastIndexOf('/');
                    var imgname = img.src.substr(index+1);
                    console.log("图片加载错误："+imgname);
                }
            } else {
                console.log("未找到data-src属性");
            }
        })

        return this;
    }
})(jQuery);

/* panna global widget*/
(function() {
    var pWidget = {
        params:{},
        config : function(params){
            this.params = params;
            if(params.music){
                this.addMusic();
            };
            if(params.arrow){
                this.addArrow();
            };
            if(params.prevent) {
                $(document).on('touchmove', function(e) {
                    e.preventDefault();
                });
            };
            if(params.screenLock){
                window.addEventListener("orientationchange", function() {
                    if(window.orientation==90 || window.orientation==-90){
                        // 横屏
                        pWidget.showLock();
                    }else {
                        //竖屏
                        pWidget.hideLock();
                    }
                }, false);
            }
            if(params.test){
                this.testShow();
            }
        },
        testShow:function () {
            var tip = "<p class='pannaTip'>此页面仅供测试，产生的数据均非正式数据</p>";
            $('body').append(tip);
        },
        addMusic: function(){
            var music = null;
            var openImgUrl = 'http://cdn.pannacloud.com/img/music-open.png';
            var closeImgUrl = 'http://cdn.pannacloud.com/img/music-close.png';
            if(typeof this.params.musicImgUrl == 'object'){
                openImgUrl = this.params.musicImgUrl[0];
                closeImgUrl = this.params.musicImgUrl[1];
            }
            if($("#musicBtn").length>0){
                music = $("#music")[0];
            }else{
                $("body").prepend("<a href='javascript:;' class='musicBtn music_open' id='musicBtn'></a>");
                $("body").prepend("<audio src='"+ this.params.music +"' id='music' autoplay loop></audio>");
                $("#musicBtn").css('background-image', "url(" + openImgUrl +")");
                music = $("#music")[0];
            }
            $("#musicBtn").click(function () {
                if (music.paused) {
                    music.play();
                    $("#musicBtn").addClass("music_open");
                    $("#musicBtn").css('background-image', "url(" + openImgUrl +")");
                } else {
                    music.pause();
                    $("#musicBtn").removeClass("music_open");
                    $("#musicBtn").css('background-image', "url(" + closeImgUrl +")");
                }
            });
        },
        addArrow: function(){
            if($("#arrow").length>0){
                $("#arrow").show();
            }else{
                if(typeof this.params.arrowImgUrl == "string"){
                    $("body").append("<img src='" + this.params.arrowImgUrl + "' class='arrow animate_int fadeInUp' id='arrow'>");
                }else{
                    $("body").append("<img src='http://cdn.pannacloud.com/img/arrow.png' class='arrow animate_int fadeInUp' id='arrow'>");
                }
            }
        },
        showLoading: function(res,ico){
            var icon = ico||'icon-spinner2';
            var text = res||'正在加载';
            if($(".spinner").length>0){
                $(".spinner").show();
            }else{
                $("body").prepend("<div class='spinner'><div class='spinner-wrap'><span class='spinnerSvg'>" +
                    "<embed src=\"http://public.pannacloud.com/img/loading/loading5.svg\" width=\"25\" height=\"25\"\n" +
                    "                   type=\"image/svg+xml\"\n" +
                    "                   pluginspage=\"http://www.adobe.com/svg/viewer/install/\"/>" +
                    "</span><p class='spinner-text'>"+ text +"</p></div></div>");
            }
        },
        hideLoading: function(){
            $(".spinner").remove();
        },
        showLock: function(){
            if($(".pannaLock").length>0){
                $(".pannaLock").show();
            }else{
                if(typeof this.params.screenLockUrl == "string"){
                    $("body").append("<div class='pannaLock' style='position: absolute;top:0;left: 0;width:" +
                        " 100%;height: 100%;z-index: 999'><img" +
                        " src="+ this.params.screenLockUrl +
                        " class='pannaLockBg' style='width:100%;height: 100%'></div>");
                }else{
                    $("body").append("<div class='pannaLock' style='position: absolute;top:0;left: 0;width:" +
                        " 100%;height: 100%;z-index: 999'><img" +
                        " src='http://cdn.pannacloud.com/img/lock.jpg'" +
                        " class='pannaLockBg' style='width:100%;height: 100%'></div>");
                }
            }
        },
        hideLock: function(){
            $(".pannaLock").hide();
        },
        alert: function(res, callback, okres){
            if($('.myalert').length>0){
                $('.myalert').remove();
            }
            var ok = "确定";
            if(typeof okres == "string"){
                ok = okres;
            }
            $("body").append("<div class='myalert'><div class='alert-mask'></div><div class='_alert'><div class='alert-title'>" + res + "</div><div class='alert-line'></div><div class='alert-ok'>" + ok + "</div></div></div>")
            $(".alert-ok").click(function(){
                $(".myalert").remove();
                if(typeof callback == "function"){
                    callback();
                }
            });
        },
        toast: function(res, status){
            var res = res||'上传成功';
            var status = status||'tip';
            //toast创建or显示
            var toastLength = $('.pannaToastWrap').length;
            if(toastLength == 0){
                $("body").append("<div class='pannaToastWrap'>" +
                    "               <p class='pannaToast animated toastAnimation'>" +
                    "                   <span class='toastText'>"+ res +"</span>" +
                    "               </p>" +
                    "              </div>");
            }else {
                $('.toastText').html(res);
                $('.pannaToastWrap').show();
            }

            //自定义模板
            var failTemplate = " <svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>\n" +
                "                    <circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>" +
                "                    <line class='failLineLeft' stroke-linecap='round' x1='18' y1='18' x2='32' y2='32' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>\n" +
                "                    <line class='failLineRight' stroke-linecap='round' x1='32' y1='18' x2='18' y2='32' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>\n" +
                "                </svg>";
            var successTemplate = "<svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>\n" +
                "                    <circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>\n" +
                "                    <line class='sucLineLeft' stroke-linecap='round' x1='15' y1='23'x2='21' y2='31' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>\n" +
                "                    <line class='sucLineRight' stroke-linecap='round' x1='22' y1='31' x2='35' y2='18' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>\n" +
                "                </svg>";
            var tipTemplate = "<svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>\n" +
                "                    <circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>\n" +
                "                    <line class='tipLineTop' stroke-linecap='round' x1='25' y1='15' x2='25' y2='16' style='stroke:#fff;stroke-width:2' stroke-dasharray='0 40'/>\n" +
                "                    <line class='tipLineBottom' x1='25' y1='20' x2='25' y2='35' style='stroke:#fff;stroke-width:2' stroke-dasharray='0 40'/>\n" +
                "                </svg>";;
            if(status=='fail'){
                $('.pannaToast').prepend(failTemplate);
                setTimeout(function () {
                    $('.toastCircle').addClass('toastCircleM');
                    $('.failLineLeft').addClass('failLineM');
                    $('.failLineRight').addClass('failLineM');
                },100);
            }else if(status=='success'){
                $('.pannaToast').prepend(successTemplate);
                setTimeout(function () {
                    $('.toastCircle').addClass('toastCircleM');
                    $('.sucLineLeft').addClass('sucLineM');
                    $('.sucLineRight').addClass('sucLineM');
                },100);
            }else {
                $('.pannaToast').prepend(tipTemplate);
                setTimeout(function () {
                    $('.toastCircle').addClass('toastCircleM');
                    $('.tipLineTop').addClass('tipLineM');
                    $('.tipLineBottom').addClass('tipLineM2');
                },100);
            }
            var toast = setTimeout(function () {
                $('.pannaToastWrap').hide();
                $('.toastSvg').remove();
                clearTimeout(toast);
            },2000)
        },
        vertify:{
            isName : function(str){
                var reg = /^[\u4E00-\u9FA5]{2,6}$/;
                return reg.test(str);
            },
            isTel : function(str){
                var reg = /^1[34578][0-9]\d{8}$/;
                return reg.test(str);
            },
            isIdCard : function(str){
                var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
                return reg.test(str);
            },
            isEmail: function(str) {
                var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                return reg.test(str);
            }
        },
        keyboardInput:function () {
            var hw = $(window).height();
            $('body').height(hw);
        },
        isAndroid:function () {
            var u = navigator.userAgent;
            var f = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            return f;
        }
    };
    window.pWidget = pWidget;
})();




