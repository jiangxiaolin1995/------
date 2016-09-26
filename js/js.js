
//$(id)=document.getElementById(id)
function $ (id) {
    return document.getElementById(id);
}


function popup() {   //检查cookie,隐藏通知栏，并设置cookie,
    var oPopup = $('j-display');
    var oBtn = oPopup.getElementsByTagName('p')[1];
    if ( getCookie('Off')) {
        oPopup.style.display = 'none';
    }
    else{
    oBtn.onclick = function () {
        oPopup.style.display = 'none';
        setCookie('Off', true, 36500 );
        };
    }
}
popup();

function setCookie (key, value, t) {  //设置cookie
    var oDate = new Date();
    oDate.setDate( oDate.getDate() + t);
    document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}

function getCookie (key) {  //获取cookie
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if(arr2[0] === key ){
            return decodeURI(arr2[1]);
        }
    }
}

function removeCookie (key) {  //  删除cookie
	setCookie(key,'',-1);	
}



function serialize (data) {  // 设置参数
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
 
function get(url,options,callback){  //get方法
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert("request failed : " + xhr.status);
            }
        }
    };
    xhr.open("get",url + "?" + serialize(options),true);
    xhr.send(null);
}

function getElementsByClassName(element, names) {   //获取class元素
		if (element.getElementsByClassName) {
			return element.getElementsByClassName(names);
		} else {
			var elements = element.getElementsByTagName('*');
			var result = [];
			var element,
				classNameStr,
				flag;
			names = names.split(' ');
			for (var i = 0; element = elements[i]; i++) {
				classNameStr = ' ' + element.className + ' ';
				flag = true;
				for (var j = 0, name; name = names[j]; j++) {
					if (classNameStr.indexOf(' ' + name + '') == -1) {
						flag = false;
						break;
					}
				}
				if (flag) {
					result.push(element);
				}
			}
			return result;
		}
	}
	
function login(){    //登录
 var oLogin = $('j-login');
 var oAttention = $('j-input');
 var oPopuplog = getElementsByClassName(oLogin,'m-popuplog');
 var oClose = getElementsByClassName(oLogin,'close');
 var oInput = oLogin.getElementsByTagName('input');
 var oLabel = oLogin.getElementsByTagName('label');
 var oButton = getElementsByClassName(oLogin,'submit');
 var oCancel = getElementsByClassName(oLogin,'cancel');

 	function focus(i){ //输入文字，提示文字隐藏
		oInput[i+1].onfocus = function(){oLabel[i].style.display = 'none';};
		oInput[i+1].onblur = function(){
			if(this.value ===''){
				oLabel[i].style.display = 'block';
			}
		};
	}
	focus(0);
	focus(1);
	
	oClose[0].onclick = function(){ oPopuplog[0].style.display = 'none'; };  //关闭登录框
	if( !getCookie ('loginSuc') ){   //判断登录的 cookie 是否已设置
		oAttention.onclick = function(){ 
			oPopuplog[0].style.display = 'block';
		};
	}else{
		oAttention.value = '以关注';
		oAttention.disabled = false;
		oAttention.className = 'active f-fl';
		oCancel[0].style.display = 'block';
	}
		
	
	oButton[0].onclick = function(){   //点击登录
		var userName1 = hex_md5(oInput[1].value);
		var password1 = hex_md5(oInput[2].value);
		get('http://study.163.com/webDev/login.htm',{userName:userName1,password:password1},function(a){ 
			if( a === '1' ){
				oPopuplog[0].style.display = 'none';
				setCookie ('loginSuc', '1', 36500);
				get('http://study.163.com/webDev/attention.htm','', function(b){
					if( b === '1' ){
						setCookie ('followSuc', '1', 36500);
						oAttention.value = '以关注';
						oAttention.disabled = true;
						oAttention.className = 'active f-fl';
						oCancel[0].style.display = 'block';
					}
					
				})
				
			}else{
				alert( '帐号密码错误，请重新输入')
			}
		 });
	};
	oCancel[0].onclick = function(){  //取消关注
		setCookie('followSuc','',-1);
		setCookie('loginSuc','',-1);
		oAttention.value = '关注';
		oAttention.disabled = false;
		oAttention.className = 'attention f-fl f-csp';
		this.style.display = 'none';
	};
	
}
login();


function slide(){    //轮播
    var oBanner = $('j-slide');
    var oLink = oBanner.getElementsByTagName('a')[0];
    var oImg = oBanner.getElementsByTagName('img')[0];
    var oUl = oBanner.getElementsByTagName('ul')[0];
	var aLi = oBanner.getElementsByTagName('li');
    var data = [
        { link: 'http://open.163.com/' , src : 'img/banner1.jpg' },
        { link: 'http://study.163.com/' , src : 'img/banner2.jpg' },
        { link: 'http://www.icourse163.org/' , src : 'img/banner3.jpg' }
    ];
	
	
    for (var i = 0; i < data.length; i++) { //初始化
        var oLi = document.createElement('li');
        var aNum = document.createTextNode(i+1);
		var num = 0;
//      oUl.appendChild(oLi);  貌似li已经存在 再重复添加了一遍
        oLi.appendChild(aNum);
        oLink.href = data[0].link;
        oImg.src = data[0].src;
		aLi[0].className = 'active';
		//初始化结束
		aLi[i].index = i;
		aLi[i].onclick =function(){   //控制点函数
			num = this.index;
			slideshow(this.index);
		};
	}
	var oWindow = document.body.clientWidth;
	oUl.style.left = ( oWindow -  20 * aLi.length)/2 + 'px';
	window.onresize = function(){ 
		oWindow = parseFloat(document.body.clientWidth);
		oUl.style.left = ( oWindow -  20 * aLi.length)/2 + 'px';
	};
	
	function slideshow(index){   //轮播函数
		oImg.style.opacity = 0;
		oImg.style.transition = '';	
		for (var i = 0; i < aLi.length; i++) {
				aLi[i].className = '';
			}
		oLink.href = data[index].link;
		oImg.src = data[index].src;
		aLi[index].className = 'active';
		setTimeout( function  () {//30毫秒后运行
			oImg.style.transition = '0.5s';
			oImg.style.opacity = 1;
		},30);
	}
	function autoplay(){   //每5S变化一次
        timer = setInterval(
            function(){
                num = (num+1)%aLi.length;
                slideshow(num);
            },5000);
    }
	oBanner.onmouseover = function(){  //鼠标移入暂停
        clearInterval(timer);
    };
    oBanner.onmouseout = function(){  //鼠标移除恢复
        autoplay();
    };
    autoplay();
}
slide();

function getStyle (obj,attr) {  //获取样式
        if( obj.currentStyle ){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj)[attr];
        }
    }



function tab(){   //课程列表
	var oTab = $('j-tab');
	var aTabhd = getElementsByClassName(oTab,'g-tabhd');
	var aTabbtn = getElementsByClassName(oTab,'btn');
	var aContent = getElementsByClassName(oTab,'g-content');
	var aDesign = getElementsByClassName(oTab,'design');
	var aLanguage = getElementsByClassName(oTab,'language');
	
	
	//获取服务器数据
	function setData(num,element){
		
	get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:1,psize:20,type:num},function(data){   //设置课程
		var data = JSON.parse(data)
		for( var i=0; i<data.list.length; i++){
			var oTeam = document.createElement('div');
			oTeam.className = 'm-team'
			element.appendChild(oTeam);
			var oImg = document.createElement('img');
			var oP = document.createElement('p');
			var oDiv = document.createElement('div');
			var oSpan = document.createElement('span');
			var oStrong = document.createElement('strong');
			var oA = document.createElement('a');
			oImg.src = data.list[i].middlePhotoUrl;
			oP.className = 'coursename f-toe';
			oP.innerHTML = data.list[i].name;
			oDiv.className = 'provider';
			oDiv.innerHTML = data.list[i].provider;
			oSpan.innerHTML = data.list[i].learnerCount;
			if(!data.list[i].categoryName){
				  data.list[i].categoryName = '无';
			}
			// 不清楚 createElement 和 innerHTML 哪个性能较好，所以在生成弹窗时使用了innerHTML
			oA.innerHTML = '<img src="' + data.list[i].middlePhotoUrl +'" /><h3>' + data.list[i].name + '</h3><span>' + data.list[i].learnerCount + '人在学</span><p class="categoryname">发布者：' + data.list[i].provider + '</br>分类：' + data.list[i].categoryName + '</p><p class="description">' +  data.list[i].description + '</p>';
			if( data.list[i].price == 0){
				oStrong.innerHTML = '免费';
			}else{
			oStrong.innerHTML = '￥' + data.list[i].price;
			}
			oTeam.appendChild(oImg);
			oTeam.appendChild(oP);
			oTeam.appendChild(oDiv);
			oTeam.appendChild(oSpan);
			oTeam.appendChild(oStrong);
			oTeam.appendChild(oA);
			
		}
	});
	}
	setData(10,aDesign[0]);
	setData(20,aLanguage[0]);
	
	aTabbtn[0].onclick = function(){
		aDesign[0].style.display = 'block';
		this.className = 'btn active';
		aLanguage[0].style.display = 'none';
		aTabbtn[1].className = 'btn';
		
	};
	aTabbtn[1].onclick = function(){
		aDesign[0].style.display = 'none';
		aTabbtn[0].className = 'btn';
		aLanguage[0].style.display = 'block';
		this.className = 'btn active';
	};
}
tab();


function playvideo(){  //弹出视频层
	 var oList = $('j-list');
	 var oTrigger = getElementsByClassName(oList, 'trigger');
	 var oPopupvideo = getElementsByClassName(oList, 'popupvideo');
	 var oClose = getElementsByClassName(oList, 'close');
	 var myVideo = oList.getElementsByTagName('video')[0];
	 oTrigger[0].onclick = function(){
		 oPopupvideo[0].style.display = 'block';
	 };
	 oClose[0].onclick = function(){
		 oPopupvideo[0].style.display = 'none';
		 myVideo.pause();
	 };
	 
 }
playvideo();

function setList(){  //设置热门列表数据
	var oList = $('j-list');	
	var oListwrap = getElementsByClassName(oList, 'm-wrap2');
	get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
		var arr = JSON.parse(data);
		for( var i=0; i<20; i++){
			var oA = document.createElement('a');
			oA.innerHTML = '<div><img src="' + arr[i].smallPhotoUrl + '" /></div><p>' + arr[i].name + '</p><span>' + arr[i].learnerCount + '</span>';
			oListwrap[0].appendChild(oA);	
		}
	});
}
setList();

function change(){  //热门列表滚动
	var oList = $('j-list');	
	var oListwrap = getElementsByClassName(oList, 'm-wrap2');
	var oListbox = getElementsByClassName(oList, 'm-list');
	var timer;
		function autoplay(){
		timer = setInterval(function(){
			if( oListwrap[0].style.top == '-700px'){
				oListwrap[0].style.top = 0;
			}
			else{
				oListwrap[0].style.top = parseFloat(getStyle(oListwrap[0],'top')) - 70 + 'px';
				}
		},5000);
		}
		autoplay();
	oListbox[0].onmouseover = function(){
		clearInterval( timer );
		};
	oListbox[0].onmouseout = function(){
		autoplay();
		};
}
change();
	


