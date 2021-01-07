/*
 * @Author: allen.wong
 * @Date: 2018-06-05 16:46:11
 * @Last Modified by: allen.wong
 * @Last Modified time: 2020-11-13 10:00:33
 */

/**依赖：jQuery */
;
(function ($) {
  // 创建公共的方法
  $.extend({
    comFunc: function () {
      return {
        config: function (params) {
          this.params = params
          if (params.music) {
            this.addMusic()
          }
          if (params.arrow) {
            this.addArrow()
          }
          if (params.prevent) {
            var overscroll = function (els) {
              for (var i = 0; i < els.length; ++i) {
                var el = els[i]
                el.addEventListener('touchstart', function () {
                  var top = this.scrollTop,
                    totalScroll = this.scrollHeight,
                    currentScroll = top + this.offsetHeight
                  if (top === 0) {
                    this.scrollTop = 1
                  } else if (currentScroll === totalScroll) {
                    this.scrollTop = top - 1
                  }
                })
                el.addEventListener('touchmove',

                  function (evt) {
                    if (this.offsetHeight < this.scrollHeight) evt._isScroller = true
                  }, {
                    passive: false
                  })
              }
            }

            //禁止body的滚动事件
            document.body.addEventListener('touchmove',

              function (evt) {
                if (!evt._isScroller) {
                  evt.preventDefault()
                }
              }, {
                passive: false
              })

            //给class为.scroll的元素加上自定义的滚动事件
            overscroll(document.querySelectorAll('.scroll'))
          }
          if (params.screenLock) {
            window.addEventListener('orientationchange',

              function () {
                if (window.orientation == 90 || window.orientation == -90) {
                  // 横屏
                  $.comFunc().showLock(params)
                } else {
                  //竖屏
                  $.comFunc().hideLock()
                }
              },
              false)
          }
          if (params.test) {
            $.getScript('//public.pannacloud.com/js/vconsole.js', function () {
              var vConsole = new VConsole()
            })
            $.comFunc().testShow()
          }
        },
        testShow: function () {
          var tip = "<p class='pannaTip'>此页面仅供测试，产生的数据均非正式数据</p>"
          $('body').append(tip)
        },
        addMusic: function () {
          var music = null
          var openImgUrl = 'https://cdn.pannacloud.com/img/music-open.png'
          var closeImgUrl = 'https://cdn.pannacloud.com/img/music-close.png'
          if (typeof this.params.musicImgUrl == 'object') {
            openImgUrl = this.params.musicImgUrl[0]
            closeImgUrl = this.params.musicImgUrl[1]
          }
          if ($('#musicBtn').length > 0) {
            music = $('#music')[0]
          } else {
            $('body').prepend("<a href='javascript:;' class='musicBtn music_open' id='musicBtn'></a>")
            $('body').prepend("<audio src='" + this.params.music + "' id='music' autoplay loop></audio>")
            $('#musicBtn').css('background-image', 'url(' + openImgUrl + ')')
            music = $('#music')[0]
          }
          $('#musicBtn').click(function () {
            if (music.paused) {
              music.play()
              $('#musicBtn').addClass('music_open')
              $('#musicBtn').css('background-image', 'url(' + openImgUrl + ')')
            } else {
              music.pause()
              $('#musicBtn').removeClass('music_open')
              $('#musicBtn').css('background-image', 'url(' + closeImgUrl + ')')
            }
          })
        },
        addArrow: function () {
          if ($('#arrow').length > 0) {
            $('#arrow').show()
          } else {
            if (typeof this.params.arrowImgUrl == 'string') {
              $('body').append("<img src='" + this.params.arrowImgUrl + "' class='arrow animate_int fadeInUp' id='arrow'>")
            } else {
              $('body').append("<img src='https://cdn.pannacloud.com/img/arrow.png' class='arrow animate_int fadeInUp' id='arrow'>")
            }
          }
        },
        showLock: function (params) {
          this.params = params
          if ($('.pannaLock').length > 0) {
            $('.pannaLock').show()
          } else {
            if (typeof this.params.screenLockUrl == 'string') {
              $('body').append("<div class='pannaLock' style='position: absolute;background-color:#000;top:0;left: 0;width:" + " 100%;height: 100%;z-index: 999'><img" + ' src=' + this.params.screenLockUrl + " class='pannaLockBg' style='width:80%;max-height: 100%'></div>")
            } else {
              $('body').append("<div class='pannaLock' style='position: absolute;background-color:#000;top:0;left: 0;width:" + " 100%;height: 100%;z-index: 999'><img" + " src='https://cdn.pannacloud.com/img/lock.jpg'" + " class='pannaLockBg' style='width:80%;max-height: 100%'></div>")
            }
          }
        },
        hideLock: function () {
          $('.pannaLock').hide()
        }
      }
    },

    // 测试用，解决缓存问题,必须写在预加载之前！
    noCache: function () {
      // 解决图片缓存问题，img标签书写data-src和src只能二选一
      var t = "?t=" + Date.now() + "-" + parseInt(Math.random() * 10000);
      $("img").each(function (idx, item) {
        if (item.src) {
          item.src = item.src + t
        } else {
          item.dataset.src = item.dataset.src + t
          item.src = item.dataset.src
        }
      })
      // 解决css和js缓存问题
      $("link[rel]").each(function (idx, item) {
        item.href = item.href + t
      })
      $("script").each(function (idx, item) {
        // 过滤掉没有src的js标签
        if (item.src) {
          item.src = item.src + t
        }
      })
    },

    // 对html的字体按照设计稿规格进行设置
    winInit: function (dWith) {
      var wWidth = $(window).width()
      // 设计稿宽度为640时可以不传，为750时传值750
      // 则屏幕宽度为：(设计稿宽度数值 / 100)rem,其他元素以此类推
      var fontSize = wWidth / (dWith / 100 || 6.4)
      $('html').css({
        'font-size': fontSize + 'px'
      })
      // 固定body高度--Android下键盘弹出时不至于压缩
      $('body').height($(window).height())
    },

    // 临时的修复一些bug
    bugFixed: function () {
      $('input,select,textarea').blur(function () {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 100)
      })
    },

    // 判断用户终端类型
    userTerm: function () {
      var userAgentInfo = navigator.userAgent
      var agents = ['Android', 'iPhone', 'Windows Phone', 'iPad', 'iPod']
      for (var i = 0; i < agents.length; i++) {
        if (userAgentInfo.indexOf(agents[i]) > 0) {
          return agents[i]
        }
        if (i === agents.length - 1 && userAgentInfo.indexOf(agents[i]) < 0) {
          return 'PC'
        }
      }
    },
    // 验证用户输入,type --- 验证类型， str --- 验证字符串
    vertify: function (type, str) {
      var reg
      switch (type) {
        case 'name':
          reg = /^[\u4E00-\u9FA5]{2,6}$/
          break
        case 'tel':
          reg = /^1[3456789][0-9]\d{8}$/
          break
        case 'idcard':
          reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
          break
        case 'email':
          reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          break
        case 'age':
          reg = /^[1-9][0-9]{0,1}$/
      }
      return reg.test(str)
    },
    // 验证身份证
    checkIdcard: function (idcard) {
      var Errors = new Array(
        "验证通过!",
        "身份证号码位数不对!",
        "身份证号码出生日期超出范围或含有非法字符!",
        "身份证号码校验错误!",
        "身份证地区非法!"
      );
      var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };

      var idcard, Y, JYM;
      var S, M;
      var idcard_array = new Array();
      idcard_array = idcard.split("");
      //地区检验
      if (area[parseInt(idcard.substr(0, 2))] == null) {
        return {
          pass: false,
          tip: Errors[4]
        };
      }
      //身份号码位数及格式检验
      switch (idcard.length) {
        case 15:
          if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
          } else {
            ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
          }
          if (ereg.test(idcard)) {
            //正确
            return {
              pass: true,
              tip: Errors[0]
            };
          } else {


            return {
              pass: false,
              tip: Errors[2]
            };
          }
          break;
        case 18:
          //18位身份号码检测
          //出生日期的合法性检查 
          //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
          //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
          if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
          } else {
            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
          }
          if (ereg.test(idcard)) { //测试出生日期的合法性
            //计算校验位
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
              (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
              (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
              (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
              (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
              (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
              (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
              parseInt(idcard_array[7]) * 1 +
              parseInt(idcard_array[8]) * 6 +
              parseInt(idcard_array[9]) * 3;
            Y = S % 11;
            M = "F";
            JYM = "10x98765432";
            M = JYM.substr(Y, 1); //判断校验位
            if (M == idcard_array[17].toLocaleLowerCase()) {
              //正确
              return {
                pass: true,
                tip: Errors[0]
              };
            } else {

              return {
                pass: false,
                tip: Errors[3]
              };
            }
          } else {


            return {
              pass: false,
              tip: Errors[2]
            };
          }
          break;
        default:

          return {
            pass: false, tip: Errors[1]
          };
          break;
      }
    },
    showLoading: function (res, ico) {
      var icon = ico || 'icon-spinner2'
      var text = res || '正在加载'
      if ($('.spinner').length > 0) {
        $('.spinner').show()
      } else {
        $('body').prepend("<div class='spinner'><div class='spinner-wrap'><span class='spinnerSvg'>" + '<embed src="https://public.pannacloud.com/img/loading/loading5.svg" width="25" height="25" ' + 'type="image/svg+xml" ' + 'pluginspage="https://www.adobe.com/svg/viewer/install/"/>' + "</span><p class='spinner-text'>" + text + '</p></div></div>')
      }
    },
    hideLoading: function () {
      $('.spinner').remove()
    },

    alert: function (res, callback, okres) {
      if ($('.myalert').length > 0) {
        $('.myalert').remove()
      }
      var ok = '确定'
      if (typeof okres == 'string') {
        ok = okres
      }
      $('body').append("<div class='myalert'><div class='alert-mask'></div><div class='_alert'><div class='alert-title'>" + res + "</div><div class='alert-line'></div><div class='alert-ok'>" + ok + '</div></div></div>')
      $('.alert-ok').click(function () {
        $('.myalert').remove()
        if (typeof callback == 'function') {
          callback()
        }
      })
    },
    toast: function (res, status) {
      var res = res || '上传成功'
      var status = status || 'tip'
      //toast创建or显示
      var toastLength = $('.pannaToastWrap').length
      if (toastLength == 0) {
        $('body').append("<div class='pannaToastWrap'>" + "<p class='pannaToast animated toastAnimation'>" + "<span class='toastText'>" + res + '</span>' + '</p>' + '</div>')
      } else {
        $('.toastText').html(res)
        $('.pannaToastWrap').show()
      }

      //自定义模板
      var failTemplate = "<svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>" + "<circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>" + "<line class='failLineLeft' stroke-linecap='round' x1='18' y1='18' x2='32' y2='32' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>" + "<line class='failLineRight' stroke-linecap='round' x1='32' y1='18' x2='18' y2='32' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>" + '</svg>'
      var successTemplate = "<svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>\n" + "<circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>" + "<line class='sucLineLeft' stroke-linecap='round' x1='15' y1='23'x2='21' y2='31' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>" + "<line class='sucLineRight' stroke-linecap='round' x1='22' y1='31' x2='35' y2='18' style='stroke:#fff;stroke-width:0' stroke-dasharray='0 40'/>" + '</svg>'
      var tipTemplate = "<svg width='50' height='50' viewbox='0 0 50 50' class='toastSvg'>" + "<circle class='toastCircle' cx='25' cy='25' r='23' stroke-width='2' stroke='#ffffff' fill='none' transform='matrix(0,-1,1,0,0,0)' stroke-dasharray='0 30'></circle>" + "<line class='tipLineTop' stroke-linecap='round' x1='25' y1='15' x2='25' y2='16' style='stroke:#fff;stroke-width:2' stroke-dasharray='0 40'/>" + "<line class='tipLineBottom' x1='25' y1='20' x2='25' y2='35' style='stroke:#fff;stroke-width:2' stroke-dasharray='0 40'/>" + '</svg>'
      if (status == 'fail') {
        $('.pannaToast').prepend(failTemplate)
        setTimeout(function () {
          $('.toastCircle').addClass('toastCircleM')
          $('.failLineLeft').addClass('failLineM')
          $('.failLineRight').addClass('failLineM')
        }, 100)
      } else if (status == 'success') {
        $('.pannaToast').prepend(successTemplate)
        setTimeout(function () {
          $('.toastCircle').addClass('toastCircleM')
          $('.sucLineLeft').addClass('sucLineM')
          $('.sucLineRight').addClass('sucLineM')
        }, 100)
      } else {
        $('.pannaToast').prepend(tipTemplate)
        setTimeout(function () {
          $('.toastCircle').addClass('toastCircleM')
          $('.tipLineTop').addClass('tipLineM')
          $('.tipLineBottom').addClass('tipLineM2')
        }, 100)
      }
      var toast = setTimeout(function () {
        $('.pannaToastWrap').hide()
        $('.toastSvg').remove()
        clearTimeout(toast)
      }, 2000)
    },
    statistics: function (name) {
      var url = window.location.href.split('?')[0].split('#')[0]

      // 发送请求统计计数
      $.ajax({
        url: '//public.pannacloud.com/WebAnalytics/API/Analytics.aspx',
        type: 'POST',
        data: {
          url: url,
          name: name
        },
        dataType: 'json'
      })
    },
    /**
     * 
     * @param {object} param 
     * 
     * {
     * logtype: [Debug/Error/Info/Warn],
     * virtualpath: '/2020/...',
     * group: '0928_shimao',
     * openid: '',
     * querystring: '',
     * message: '',
     * dingtalk: true/false
     * }
     */
    log(param) {
      var data = param
      $.ajax({
        url: 'https://wx.pannacloud.com/public/logApi.aspx',
        data,
        success(res) {
          console.log('日志已上传：', res)
        }
      })
    }
  })
})(jQuery)