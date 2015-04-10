


 //滚动
var isNoticed = 0;
var imgLoaded=function(){
var W=595;
var obj=this;
var $imgpage=$("#J_navPoint");
var $imgbox=$("#J_navBox");
var maxW=null;
var speed=40;
var ti = false;
this.init = function(){
$imgpage.find("li").mouseover(function(e){
e.preventDefault();
if($(this).hasClass("on")) return false;
var i=$imgpage.find("li").index($(this));
$(this).attr("class","on").siblings(".on").removeClass();
obj.move(- i*W,i);
})
}
this.move = function(po,i){
$imgbox.stop().animate({
"left":po + "px"
},{
easing:"swing",
queue:false
},300);
$("#J_navTitle").stop().animate({
opacity:0.2,
height:0
},150,function(){
$("#J_navTitle").animate({
opacity:0.8,
height:30
},150);
})
setTimeout(function(){
var words = $imgbox.find("img").eq(i).attr("alt");
$("#J_navTitle").text(words);
},150)
}
this.init();
}
new imgLoaded();


$(function(){
var t =null;
var gameInfo =[
"以云计算技术构建基于城域网的云教育公共服务平台",
"基于SAAS模式的中小学教育管理平台",
"国内首家基于教育资源共享的分布式存储平台",
"教育领域绿色、安全的即时交流、互动、办公通讯平台",
"国内首款云计算操作系统",
"大规模分布、异构数据资源的透明安全管理",
"东莞教研网",
""
];
$("ul[class=gamelist] a").hover(function(){
if(t){
clearTimeout(t);
}
var $this = $(this);
t = setTimeout(function(){
var i = $("ul[class=gamelist] a").index($this); 
var s = {
left:$this.offset().left-5,
top :$this.offset().top-80
}
if(gameInfo[i] == "") {
t = setTimeout(function(){
$("#J_gameTips").hide();
},150);
return false;
}
if($("#J_gameTips").css("display") != "block"){
$("#J_gameTips").css({
left:s.left+"px",
top: (s.top-15)+"px",
display:"block"
})
}
$("#J_gameTips").find(".tips_main").html(gameInfo[i]).end().animate({
top : s.top + "px",
left : s.left + "px"
},110)
},60);
},function(){
if(t){
clearTimeout(t);
};
t = setTimeout(function(){
$("#J_gameTips").hide();
},150);
})
$("#J_gameTips").hover(function(){
if(t){
clearTimeout(t);
}
},function(){
if(t){
clearTimeout(t);
}
t = setTimeout(function(){
$("#J_gameTips").hide();
},150);
})
})

var Cookies_control={
    setCookie:function(name,value,days){
        //Days保存事件
        var exp  = new Date();   
		//new Date("December 31, 9998");
        exp.setTime(exp.getTime() + days);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    getCookie:function(name){
        var cookie_name = name + "=";
        var cookie_length = document.cookie.length;
        var cookie_begin = 0;
        while (cookie_begin < cookie_length)
        {
            var value_begin = cookie_begin + cookie_name.length;
            if (document.cookie.substring(cookie_begin, value_begin) == cookie_name)
            {
                var value_end = document.cookie.indexOf ( ";", value_begin);
                if (value_end == -1)
                {
                    value_end = cookie_length;
                }
                return unescape(document.cookie.substring(value_begin, value_end));
            }
            cookie_begin = document.cookie.indexOf ( " ", cookie_begin) + 1;
            if (cookie_begin == 0)
            {
                break;
            }
        }
        return null;
    },
    delCookie:function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1000);
        var cval=this.getCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
	}

var id = "49BAC005-7D5B-4231-QW123-16939BEACD67";

$(function(){
	  $("#J_setHomeBtn").click(function(e){
	        e.preventDefault();
	        try{
	            document.body.style.behavior = 'url(#default#homepage)';
	            document.body.setHomePage('http://113.105.131.153/');
	        }catch(e){
	            alert("此浏览器暂不支持设为首页");
	        }
	        return false;
	    });
		
		
		
		 var imgstr = $("#imgstr");   
		 imgstr.attr("src","../checkCode.svl?random=" + Math.random());
			
	})
	
	  function getlogin(username,password,validatecode){
		  var params = {username:username,password:password,validatecode:validatecode};  
		  $.ajax({
				 url:'../public/edu.ajax!login.do', 
				 data:params,
				 type:'post',
				 dataType:'json', 
				 success:function(data){ 
				 if(data.error!="undefined"&&data.error!=null) {
					show_error("错误信息："+data.error);
					$(".after-login").css("display","none");
					$(".before-login").css("display","block");
					}
				 if(data.ui!='undefined'&&data.ui!=null){
//					$('#realname').html("您好："+data.ui.realname); 
//					if(data.ui.avatarurl!=''&&data.ui.avatarurl!=null){
//						$('#avatarurl').attr("src","/SchoolManageSystem"+data.ui.avatarurl);
//					}else{
//						$('#avatarurl').attr("src","/SchoolManageSystem/images/login/photo-head.jpg");
//					}
//					$(".after-login").css("display","block");
//					$(".before-login").css("display","none");	
//					$("#edums").attr("href","http://school.fs.cloud114.com/edums/loginInteg.action?tickets="+data.ui.md5str);
					 window.location.href = "../profile/profile!show.do";
					}
				 }
			  });
	  }


	function show_error(str){
	    $("#span1").html(str).show().css("opacity",1).stop().fadeOut(5000,function(){
	        $("#span1").hide();
	    });
	}
 
	function clearCookie(e) 
    {    
		e = e?e:(window.event?window.event:null);
       if(event.clientX>document.body.clientWidth&&event.clientY<0||event.altKey)    
           {    
        	    Cookies_control.setCookie("iflogin","0",2*60*60*1000);
	   	        Cookies_control.setCookie(id,'',1000);
	   	        Cookies_control.delCookie(id);
           }    
    } 
	(function($){
	    var $uid=$("#username"),$pwd=$("#password"),$validatecode=$("#validatecode");
	    var i =1 ;
	    $("#btn-login").click(function(){
	        if($.trim($uid.val()) == ""||$.trim($uid.val()) == "undefined"||$.trim($uid.val()) == null) {
	            show_error("请填写帐号");
	            $uid.focus();
	            return false;
	        }
	        if($.trim($pwd.val()) == ""||$.trim($pwd.val()) == "undefined"||$.trim($pwd.val()) ==null){
	            show_error("请填写密码");
	            $pwd.focus();
	            return false;
	        }
	        if($.trim($pwd.val()).length < 1 || $.trim($pwd.val()).length > 10){
	            show_error("请填写1到10位的密码");
	            $pwd.focus();
	            return false;
	        }
	        if($.trim($validatecode.val()).length < 1 || $.trim($validatecode.val()).length > 10){
	            show_error("请填写验证码");
	            $validatecode.focus();
	            return false;
	        }
			getlogin($.trim($uid.val()),$.trim($pwd.val()),$.trim($validatecode.val()));
	    });
	    $(document).keypress(function(e){
	        if(e.keyCode == 13 && $("#login .before_login").css("display") != "none") 
			$("#btn-login").trigger("click");
	    });
	    $(".logout").click(function(e){
	        $(this).removeAttr("href").css("cursor","pointer");
			$("#iflogin").attr("0");
	        $.ajax({ url: "logout.do?random="+Math.random(),  success: function(){
	        	    	window.location.reload(true);
	        	}});
	    })
	    $("#jyy").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=1&random="+Math.random(),  success: function(){
	        	}});
	    })
	   $("#szxy").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=2&random="+Math.random(),  success: function(){
	        	}});
	    })
	   $("#ycc").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=3&random="+Math.random(),  success: function(){
	        	}});
	    })
		$("#jstx").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=4&random="+Math.random(),  success: function(){
	        	}});
	    })
	    $("#yczxt").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=5&random="+Math.random(),  success: function(){
	        	}});
	    })
		$("#ysjk").click(function(e){
	        $.ajax({ url: "updateLoginLog.do?type=6&random="+Math.random(),  success: function(){
	        	}});
	    })
	})(jQuery)



