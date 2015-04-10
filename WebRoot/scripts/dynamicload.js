var _exists_jscss_cls = new Array();
var _dynamic_jscss_obj;
function dynamicload(src, fn) {
	if (!_dynamic_jscss_obj)
		_dynamic_jscss_obj = new DynamicJsCssClass();
	if (!_exists_jscss_cls || _exists_jscss_cls.length < 1)
		_exists_jscss_cls = _dynamic_jscss_obj.Save();
	// var dl = new DynamicJsCssClass();
	var dl = _dynamic_jscss_obj;
	if (typeof fn == 'function')
		dl.LoadedCallback = fn;
	else if (typeof fn == 'object') {
		if (typeof fn.loaded == 'function')
			dl.LoadedCallback = fn.loaded;
		if (typeof fn.error == 'function')
			dl.FailedCallback = fn.error;
	}
	dl.Load(src);
}
function dynamicremove(type) {
	if (!_dynamic_jscss_obj)
		_dynamic_jscss_obj = new DynamicJsCssClass();
	_dynamic_jscss_obj.RemoveNew(type ? type : 'all');
}
function DynamicJsCssClass() {
	var _self = this;
	var _exists_jscss_ls = new Array();

	// 功能：加载指定的文件
	// 参数：src——需要被加载的文件
	// 返回：（无）
	this.Load = function(src) {
		if (_self.IsLoaded(src)) {
			_self.OnLoaded(src);
			return;
		} else {
			var objDynamic, type = _self.GetSrcType(src);
			if (type == "js" || type == "vbs") {
				objDynamic = document.createElement("script");
				objDynamic.src = src;
				if (type == "js") {
					objDynamic.type = "text/javascript";
					objDynamic.language = "javascript";
				} else {
					objDynamic.type = "text/vbscript";
					objDynamic.language = "vbscript";
				}
			} else if (type == "css") {
				objDynamic = document.createElement("link");
				objDynamic.rel = "stylesheet";
				objDynamic.type = "text/css";
				objDynamic.href = src;
			} else {
				_self.OnFailed(src);
				return;
			}

			document.getElementsByTagName("head")[0].appendChild(objDynamic);
			objDynamic.onload = objDynamic.onreadystatechange = function() {
				if (this.readyState && this.readyState == "loading")
					return;
				else
					_self.OnLoaded(src);
			};

			objDynamic.onerror = function() {
				document.getElementsByTagName("head")[0]
						.removeChild(objDynamic);
				_self.OnFailed(src);
			};
		}
	};

	// 功能：保存当前已加载列表
	// 返回：列表数组
	this.Save = function(type) {
		if (!type)
			type = 'all';
		_exists_jscss_ls = new Array();
		var rets = new Array();
		var allscripts = document.getElementsByTagName('script');
		for (var i = 0; i < allscripts.length; i++) {
			var src = allscripts[i] ? allscripts[i].getAttribute('src') : null;
			if (src) {
				_exists_jscss_ls.push(src);
				if (type == 'js' || type == 'vbs' || type == 'all')
					rets.push(src);
			}
		}
		var allstyles = document.getElementsByTagName('link');
		for (var i = 0; i < allstyles.length; i++) {
			var src = allstyles[i] ? allstyles[i].getAttribute('href') : null;
			if (src) {
				_exists_jscss_ls.push(src);
				if (type == 'css' || type == 'all')
					rets.push(src);
			}
		}
		return rets;
	};

	// 功能：移除指定的文件
	// 参数：src——需要被移除的文件
	// 返回：（无）
	this.RemoveNew = function(type) {
		if (!type || type == undefined)
			type = 'all';
		if (!_exists_jscss_ls || _exists_jscss_ls.length < 1)
			return;
		var allexstr = '|' + _exists_jscss_ls.join('|') + '|';
		if (type == 'js' || type == 'vbs' || type == 'all') {
			var alls = document.getElementsByTagName('script')
			for (var i = alls.length; i >= 0; i--) {
				var src = alls[i] ? alls[i].getAttribute('src') : null;
				if (src && allexstr.indexOf('|' + src + '|') == -1)
					alls[i].parentNode.removeChild(alls[i])
			}
		}
		if (type == 'css' || type == 'all') {
			var alls = document.getElementsByTagName('link')
			for (var i = alls.length; i >= 0; i--) {
				var src = alls[i] ? alls[i].getAttribute('href') : null;
				if (src && allexstr.indexOf('|' + src + '|') == -1)
					alls[i].parentNode.removeChild(alls[i])
			}
		}
	};

	// 功能：移除所有加载的文件
	// 返回：（无）
	this.RemoveAll = function(type) {
		if (!type || type == undefined)
			type = 'all';
		if (type == 'js' || type == 'vbs' || type == 'all') {
			var alls = document.getElementsByTagName('script')
			for (var i = alls.length; i >= 0; i--) {
				if (alls[i] && alls[i].getAttribute('src'))
					alls[i].parentNode.removeChild(alls[i])
			}
		}
		if (type == 'css' || type == 'all') {
			var alls = document.getElementsByTagName('link')
			for (var i = alls.length; i >= 0; i--) {
				if (alls[i] && alls[i].getAttribute('href'))
					alls[i].parentNode.removeChild(alls[i])
			}
		}
	};

	// 功能：移除指定的文件
	// 参数：src——需要被移除的文件
	// 返回：（无）
	this.Remove = function(src) {
		var type = _self.GetSrcType(src);
		var targetelement = 'none', targetattr = 'none';
		if (type == 'js' || type == 'vbs') {
			targetelement = 'script';
			targetattr = 'src';
		} else if (type == 'css') {
			targetelement = 'link';
			targetattr = 'href';
		}
		var allsuspects = document.getElementsByTagName(targetelement)
		for (var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i]
					&& allsuspects[i].getAttribute(targetattr) != null
					&& allsuspects[i].getAttribute(targetattr).indexOf(src) != -1)
				allsuspects[i].parentNode.removeChild(allsuspects[i])
		}
	};

	// 功能：替换指定的文件
	// 参数：oldsrc——需要被替换的文件
	// newsrc——新文件
	// 返回：（无）
	this.Replace = function(oldsrc, newsrc) {
		var type = _self.GetSrcType(oldsrc);
		var targetelement = 'none', targetattr = 'none', allsuspects;
		targetelement = (type == "js") ? "script" : (type == "css")
				? "link"
				: "none";
		targetattr = (type == "js") ? "src" : (type == "css") ? "href" : "none";
		allsuspects = document.getElementsByTagName(targetelement);
		for (var i = allsuspects.length; i >= 0; i--) {
			if (allsuspects[i]
					&& allsuspects[i].getAttribute(targetattr) != null
					&& allsuspects[i].getAttribute(targetattr).indexOf(oldsrc) != -1) {
				var el = _self.Create(newsrc);
				allsuspects[i].parentNode.replaceChild(el, allsuspects[i]);
			}
		}
	};

	this.Create = function(src) {
		var ref, type = _self.GetSrcType(src);
		if (type == "js") {
			ref = document.createElement('script')
			ref.setAttribute("type", "text/javascript")
			ref.setAttribute("src", src)
		} else if (type == "css") {
			ref = document.createElement("link")
			ref.setAttribute("rel", "stylesheet")
			ref.setAttribute("type", "text/css")
			ref.setAttribute("href", src)
		}
		return ref
	}

	// 功能：判断是否已经加载了某文件
	// 参数：src——需要被检查的文件
	// 返回：返回是否已经加载了该文件
	this.IsLoaded = function(src) {
		var isLoaded = false, type = _self.GetSrcType(src);
		if (type == "js" || type == "vbs") {
			var scripts = document.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src && scripts[i].src.indexOf(src) != -1) {
					if (scripts[i].readyState == "loaded"
							|| scripts[i].readyState == "complete") {
						isLoaded = true;
						break;
					}
				}
			}
		} else if (type == "css") {
			var _links = document.getElementsByTagName("link");
			for (var i = 0; i < _links.length; i++) {
				if (_links[i].href && _links[i].href.indexOf(src) != -1) {
					if (_links[i].readyState == "loaded"
							|| _links[i].readyState == "complete"
							|| _links[i].readyState == "interactive") {
						isLoaded = true;
						break;
					}
				}
			}
		}
		return isLoaded;
	};

	// 功能：得到文件的类型（即扩展名）
	// 参数：src——文件名
	// 返回：返回文件的类型
	this.GetSrcType = function(src) {
		var type = "", lastIndex = src.lastIndexOf(".");
		if (lastIndex != -1) {
			type = src.substr(lastIndex + 1);
		}
		return type;
	};

	// 功能：当文件加载完成时发生的事件
	// 参数：src——加载完成的文件
	// 返回：（无）
	this.OnLoaded = function(src) {
		_self.LoadedCallback(src);
	};

	// 功能：文件加载完成时执行的回调函数
	// 参数：src——加载完的文件
	// 返回：（无）
	this.LoadedCallback = function(src) {
	};

	// 功能：当文件加载过程中发生错误时发生的事件
	// 参数：src——正在加载的文件
	// 返回：（无）
	this.OnFailed = function(src) {
		_self.FailedCallback(src);
	};

	// 功能：当文件加载失败时执行的回调函数
	// 参数：src——加载失败的文件
	// 返回：（无）
	this.FailedCallback = function(src) {
	};
}

var index_main = '  <div class="home-bg">'
		+ ' 		<div class="text">'
		+ '     	<p>    《教育云》的核心设计理念是“以云计算技术构建开放的教育公共服务平台、交流平台和资源共享平台，为社会公众提供公共教育服务信息，推动数字化学习进入各级各类学校、各行各业、街道、乡村和家庭（引自《广东省中长期教育改革和发展规划纲要（2010-2020）》），以此促进“教育全社会参与”和“均衡发展”。</p>'
		+ '<p>《中国教育云平台》由《互动教学备课平台》《教育即时通讯》《教育云存储》三个子系统组成。各子系统实现单点登录,互为补充和支撑。实现基于城域教育网的校园数字化、即时通讯和资源共建共享。</p>'
		+ '         </div>'
		+ '        <div class="layout">'
		+ '     	<div class="fuction01">                 '
		+ '             <div class="warp">'
		+ '           	<h4>互动教学备课平台</h4>'
		+ '               <p>基于SAAS(软件即服务)模式的学校内部管理平台。第一版本实现了学生成绩管理、学生成长管理、学生档案管理、教师信息管理、教师教学评估等基本功能。</p>'
		+ '             <p>结合G-CLOUD云终端数字触摸系统。可以实现学校文化的数字展示，查询学生考试数据、学生成长表现、校园文化、办学特色等。真正实现学校从软件到硬件的现代化。</p>'
		+ '    	 	</div>'
		+ '      </div>'
		+ '	<div class="fuction02">	'
		+ '   	<div class="warp">'
		+ '           <h4>即时通讯平台</h4>    '
		+ '            <p>教育即时通讯平台，真正实现了城域教育的无纸化办公，为教育工作者和学子提供了一个真正绿色的交流通讯环境。</p>'
		+ '           <p>系统采用实名注册和登录、学校内部集中管理模式。目前实现了移动短信、校内通讯和校际通讯、文件在线传输、文件离线传输，并和其他子模块无缝集成。</p>'
		+ '   	</div>'
		+ '      </div>'
		+ '      <div class="fuction03">'
		+ '  	<div class="warp">'
		+ '          <h4>云存储平台</h4>    '
		+ '           <p>国内首个专业的海量教育存储平台，每位教师提供5GB互联网存储空间，每所学校提供200GB以上存储，实现学校内部的资源（课件、视频、论文、教案）共享、校际之间的资源共享'
		+ '为社会公众提供公共教育服务信息，推动数字化学习进入各级各类学校、各行各业、街道、乡村和家庭，力争率先建成教育信息服务共同体，为建设学习型社会提供支撑。</p>'
		+ '			</div>' + '    </div>' + '</div>' + ' </div>';

var index_sub = '<div class="side-bg">'
		+ '							<div class="top"></div> '
		+ '							<div class="sidebar">'
		+ '								<ul class="twobar" id="suborder">'
		+ '								</ul>'
		+ '							</div>'
		+ '							<div class="btm"></div>'
		+ '						</div>'
		+ '			<div id="maindiv" style="float: left; width: 770px; display: inline; height: 100%">'
		+ '						<IFRAME id="mainframe" src="" frameborder="0" marginwidth="0"'
		+ '							marginheight="0" width="100%" height="500" scrolling=no'
		+ '						ALLOWTRANSPARENCY="true" onload="SetCwinHeight(this)">'
		+ '						</IFRAME>' + '					</div>'