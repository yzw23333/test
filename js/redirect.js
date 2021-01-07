function IsPC()
{
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

var ifRedirect = IsPC();
if(ifRedirect){
    var url = window.location.href;
    console.log(url);
    window.location = 'http://public.pannacloud.com/redirect/index.html?reurl='+url;
}