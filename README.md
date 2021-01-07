# swiperTemplate

## 简介

>swiperTemplate是一个基于swiper.js的滑动展示模板，可快速制作滑动展示项目。

## 引用
>`jquery.js` 一个 JavaScript 库。

>`swiper.js` 滑动特效插件。

>`preloadjs.js` `soundjs.js` 预加载插件。

>`pn_com.js` 般若互动通用js，提供各种常用方法。

>`pn_loader.js` 基于`jquery.js`、`preloadjs.js`、`soundjs.js`整理的方法，可统一加载所需资源并提供相应配置项和回调函数。

>`jweixin-1.2.0.js` 微信官方提供js。

>`share.1.0.1.js` 封装好的分享js，可配置分享相关。

## html结构

1.loading页面，支持横竖屏提示、loading图标替换、进度显示

```html
<div class="loading loading-panna" id="loading">
    <div class="rotateTipArea">
    <!--loading,可选black,white-->
    <embed src="http://public.pannacloud.com/img/white.svg" width="50" height="50"
    type="image/svg+xml"
    pluginspage="http://www.adobe.com/svg/viewer/install/" class="rotateSvg"/>
    <p class="rotateTipText"> 请锁屏后横屏浏览</p>
    </div>
    <div class="loadingArea">
        <!--loading,可选loading1～loading8-->
        <embed src="//public.pannacloud.com/img/loading/loading8.svg" width="70" height="70"
               type="image/svg+xml"
               pluginspage="http://www.adobe.com/svg/viewer/install/" class="loadingSvg"/>
        <p class="loading-percent">10%</p>
    </div>
</div>
```

2.swiper-container
```html
<div class="swiper-container">
    <div class="swiper-wrapper">
        <!-- 如预加载的图片应用为背景图，添加preloadBg类，data-id对应资源数组中的id -->
        <div class="swiper-slide page page1 preloadBg" data-id="bg1">
            <!-- 如预加载的图片应用为图片标签，添加preload类，data-id对应资源数组中的id -->
            <img data-id="zuan" class="preload _sCenter zuan1 animated agz hidden">
            <img data-id="zuan" class="preload noResize animate_int zuan2 animated agz hidden">
        </div>
        <div class="swiper-slide page page2 preloadBg" data-id="bg2">
            <img data-id="pig" class="preload pig animated agz hidden">
        </div>
        <div class="swiper-slide page page3 preloadBg" data-id="bg3">

        </div>
        <div class="swiper-slide page page4 preloadBg" data-id="bg4">

        </div>
        <div class="swiper-slide page page5 preloadBg" data-id="bg5">

        </div>
        <div class="swiper-slide page page6 preloadBg" data-id="bg6">

        </div>
    </div>
</div>
```


## pn_loader.js

1.配置资源数组

```javascript
//配置资源数组，支持图片、音频。支持cdn地址
var sourceData = [
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg1.jpg', id: 'bg1'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg2.jpg', id: 'bg2'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg3.jpg', id: 'bg3'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg4.jpg', id: 'bg4'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg5.jpg', id: 'bg5'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/img/bg6.jpg', id: 'bg6'},
    {src: 'img/zuan.png', id: 'zuan'},
    {src: 'img/share.jpg', id: 'pig'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/mp3/oh.mp3', id: 'bgm'},
    {src: 'https://q2cdn.pannacloud.com/test/xft/2018/audioLoader/mp3/music.mp3', id: 'music'}
];
```

2.调用

```javascript
//直接$.loader()调用
$.loader({
    //所需资源数组,必填
    staticResource:sourceData,
    //是否添加控制音乐图标，非必填
    bgmCtrl:true,
    //音乐图标配置
    bgmCtrlIcon:[
        {src: 'img/music_on.png', id: 'music-open'},
        {src: 'img/music_off.png', id: 'music-close'}
    ],
    //进度回调
    handleLoading:function (evt) {
        var cProgress = Math.floor(evt.loaded*100);
        $('.loading-percent').html(cProgress+'%');
    },
    //单项资源加载回调
    handleFileLoaded:function (event) {
      if(event.item.id=='pig'){
          console.log('猪加载好了');
      }
    },
    //资源加载完成回调
    handleComplete:function () {
        //音频管理可在此处进行操作
        //var music = createjs.Sound.createInstance('music');
        //music.play();
        $('.loading').remove();
        $('.page1').children().show();
    }
});
```

## swiper.js

1.调用

```javascript
var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    resistanceRatio : 0,
    onSlideChangeEnd: function () {
        var i = mySwiper.activeIndex;
        $(".swiper-slide").each(function () {
            if ($(this).hasClass("swiper-slide-active")) {// 当前页显示，其余页隐藏
                $(this).children().show();
                $(this).siblings().children().hide();
            }
        });
        if (i == $('.swiper-slide').length-1) {  // 最后一页不提示滑动
            $(".arrow").hide();
        } else{
            $(".arrow").show();
        }
    }
});
```

2.文档

> `swiper中文网` [点击查看](http://www.swiper.com.cn/)

## aspx文件生成

1.将aspx文件的`头部信息`复制到`template.aspx`文件中

2.项目文件下运行`npm run make`或`yarn make`生成对应的`index.aspx`并部署到服务器

> 注意：1.请检查来源文件的编码格式是否纯`UTF-8`编码格式，如果是`UTF-8 with BOM`则可能出现乱码；2.`template.aspx`文件的头部信息后面要增加一个空行；3.aspx文件中传递值尽量用字符串形式，避免本地运行html文件时的报错。

## 多端自动刷新的开发工具Browser-Sync

1.在开发包终端`yarn dev`或`npm run dev`启动

2.浏览器自动打开调试页面，自带服务器，无需另外架设服务器

3.代码修改保存后自动刷新，不需要频繁手动刷新

> [参考文档](http://www.browsersync.cn)

