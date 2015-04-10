// global components
Ext.namespace('Sp');
// global window
Ext.override(Ext.PagingToolbar, {
			pageSize : 20,
			displayInfo : true,
			displayMsg : '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg : "没有记录"
		});

Ext.FrontPagingToolbar = Ext.extend(Ext.PagingToolbar, {
			updateInfo : function() {
				if (this.displayItem) {
					var count = this.records;
					var msg = count == 0 ? this.emptyMsg : String.format(
							this.displayMsg, this.cursor + 1, this.cursor
									+ count, this.store.getTotalCount());
					this.displayItem.setText(msg);
				}
			},
			doLoad : function(start) {
				var o = {}, pn = this.getParams();
				o[pn.start] = start;
				o[pn.limit] = this.pageSize;
				if (this.fireEvent('beforechange', this, o) !== false) {
					this.onLoad(this.store, null, {
								params : o
							});
					var pos = -1, count = 0;
					this.store.filterBy(function(el) {
								pos++;
								if (pos < start
										|| pos > start + o[pn.limit] - 1) {
									return false;
								} else {
									++count;
									return true;
								}
							});
					this.records = count;
				}
			},
			getPageData : function() {
				var pn = this.getParams();
				var storeId = this.store.storeId, start = this.cursor;
				var total = this.store.getTotalCount(), size = this.pageSize;
				var pos = -1, count = 0;
				this.store.filterBy(function(el) {
							pos++;
							if (pos < start || pos > start + size - 1) {
								return false;
							} else {
								++count;
								return true;
							}
						});
				this.records = count;
				return {
					total : total,
					activePage : Math.ceil((this.cursor + this.pageSize)
							/ this.pageSize),
					pages : total < this.pageSize ? 1 : Math.ceil(total
							/ this.pageSize)
				};
			}
		});
Ext.reg('frontPaging', Ext.FrontPagingToolbar);

Ext.override(Ext.form.Action.Submit, {
			processResponse : function(response) {
				this.response = response;
				var data = response.responseText;
				if (data.indexOf('<pre>') != -1) {
					response.responseText = data.substring(5, data.length - 6);
					this.response = Ext.util.JSON.decode(response.responseText);
				}
				if (!response.responseText) {
					return true;
				}
				this.result = this.handleResponse(response);
				return this.result;
			}
		});

Sp.Window = Ext.extend(Ext.Window, {
			closable : true,
			width : 500,
			buttonAlign : 'center',
			border : true,
			frame : true,
			closeAction : 'close',
			autoDestroy : true,
			autoHeight : true,
			autoShow : true,
			modal : true
		});

// global tabpanel
Sp.TabPanel = Ext.extend(Ext.TabPanel, {

});

// global jsonStore
Sp.JsonStore = Ext.extend(Ext.data.JsonStore, {
			autoLoad : true,
			autoDestroy : true,
			method : 'post',
			listeners : {
				loadexception : function(a, b, response) {
					var res = Ext.util.JSON.decode(response.responseText);
					Sp.MessageBox(res.exception, 'error');
				}
			}
		});
Sp.SyllabusStore = Ext.extend(Ext.data.JsonStore, {
			autoLoad : true,
			autoDestroy : true,
			method : 'post',
			listeners : {
				loadexception : function(a, b, response) {
					var res = Ext.util.JSON.decode(response.responseText);
					Sp.MessageBox(res.exception, 'error');
					var gcom = Ext.getCmp("gradeTable_grade");
					if (!gcom.getStore().getCount()) {
						gcom.getStore().load();

					}
				},
				load : function(s, rds) {
					var ycom = Ext.getCmp('gradeTable_year');
					var tcom = Ext.getCmp('gradeTable_term');
					var gcom = Ext.getCmp("gradeTable_grade");
					var wcom = Ext.getCmp("gradeTable_week");
					if (s.reader.jsonData.year)
						ycom.setValue(s.reader.jsonData.year);
					if (s.reader.jsonData.term)
						tcom.setValue(s.reader.jsonData.term);
					if (!gcom.getStore().getCount()) {
						gcom.getStore().load();

					}
					if (s.reader.jsonData.day)
						wcom.setValue(s.reader.jsonData.day);
					var uid = s.reader.jsonData.userId;
					// if(uid) uid=parseInt(uid,10);
					s.removeAll();
					var len = rds.length, rows = rds[len - 1].data.courseseq, g = Ext
							.getCmp(s.gridId);
					var classes = len / rows;
					var colModel = g.getColumnModel();

					var colMArray = [];
					colMArray[0] = {
						header : '节次',
						dataIndex : 'row0',
						width : 30
					};
					for (var i = 0; i < classes; i++) {
						var j = i + 1;
						colMArray[j] = {
							header : rds[i].data.classname,
							dataIndex : 'row' + j,
							width : 50,
							renderer : function(v) {
								if (v == null)
									return;
								if (v == null)
									return;
								var units = v.split(":");
								if (units.length > 1 && units[1] == units[2]) {
									return '<font title="'
											+ (units[3] != 'null'
													? units[3]
													: '')
											+ '" style="color:#339900">'
											+ units[0] + '</font>';
								} else {
									return '<font title="'
											+ (units[3] != 'null'
													? units[3]
													: '') + '">' + units[0]
											+ '</font>';
								}
							}
						};
					}
					var column = new Ext.grid.ColumnModel(colMArray);
					g.reconfigure(s, column);
					for (var i = 0, z = 1; i < len; i = i + classes, z++) {
						var index = z;
						var row = {
							'row0' : index
						};
						for (var j = 0; j < classes; j++) {
							var r = 'row' + (j + 1);
							if (uid) {
								row[r] = rds[i + j].data.subjectname + ":"
										+ uid + ":" + rds[i + j].data.teacherId
										+ ":" + rds[i + j].data.teacherName;
							} else {
								row[r] = rds[i + j].data.subjectname;
							}
						}
						var rd = new Ext.data.Record(row);
						s.add(rd);
					}
				}
			}
		});
// global messageBox
Sp.MessageBox = function(msg, icon) {// icon为图片名,有success,error,question,warning,info
	var img = 'ext-mb-' + (icon || 'success');
	return Ext.MessageBox.show({
				title : '提示',
				msg : msg,
				buttons : Ext.MessageBox.OK,
				icon : img,
				width : 250
			});
};

// global panel
Sp.Panel = Ext.extend(Ext.Panel, {
			bodyStyle : 'background:#E1F1FF'
		});
Ext.reg('mypanel',Sp.Panel);
// global form
Sp.Form = Ext.extend(Ext.form.FormPanel, {
	frame : true,
	// bodyStyle: 'padding:5px,0px,0px,10px;background:#E1F1FF',
	labelAlign : 'right',
	labelWidth : 85,
	// defaultType:'textfield',
	defaults : {
		msgTarget : 'side'
	},
	onRender : function() {
		Sp.Form.superclass.onRender.apply(this, arguments);
		this.getForm().waitMsgTarget = this.getEl();
	},
	submit : function(url, params, win, successFn) {
		var f = this;
		if (f.form.isValid()) {
			f.getForm().submit({
				url : url,
				method : 'post',
				params : params,
				waitTitle : '提示',
				waitMsg : '正在保存，请稍候...',
				success : function(form, action) {
					var res = action.result;
					if (win)
						win.close();
					if (typeof successFn == 'function') {
						successFn(res);
					} else {
						Sp.MessageBox('保存成功');
					}
				},
				failure : function(form, action) {
					var res = action.result;
					if (res.logined != null && !res.logined) {
						Ext.Msg.confirm('警告', '登录超时,点击确认将跳转到登录页面.',
								function(bn) {
									if (bn == 'yes') {
										window.location.href = "../public/loginInput.jspx";
									}
								});
						return;
					}
					if (res.forbidden != null && res.forbidden) {
						Sp.MessageBox('没有权限进行操作', 'error');
						return;
					}
					if (res.exception != null) {
						Sp.MessageBox(res.exception, 'error');
						return;
					}
					Sp.MessageBox(action.result.exception || '请求失败', 'error');
					// if(win)win.close();
				}

			});
		}
	}
});
Ext.reg('myform', Sp.Form);

// global grid
Sp.Grid = Ext.extend(Ext.grid.GridPanel, {
			// frame : true,
			loadMask : true,
			autoHeight : true,
			loadMask : {
				msg : '加载数据中,请稍候...'
			},
			viewConfig : {
				forceFit : true,
				autoScroll : true
			},
			createSelModel : function(c) {
				c.header = '';
				return new Ext.grid.CheckboxSelectionModel(c);
			}
		});
Ext.reg('myGrid', Sp.Grid);

Sp.Tab = Ext.extend(Ext.TabPanel, {
			autoHeight : true,
			activeTab : 0,
			frame : true,
			// deferredRender:true,
			defaults : {
				autoHeight : true
			}
		});
Ext.reg('myTab', Sp.Tab);

Ajaxx = function(url, params, fnOrMsg1, fnOrMsg2, failFn, async, timeout) {
	Ext.Ajax.request({
		url : url,
		method : 'post',
		async : typeof async == 'undefined' ? true : async,
		timeout : typeof async == 'undefined' ? (typeof timeout == 'undefined'
				? 120000
				: timeout) : 0,
		params : params,
		success : function(arg) {
			var jnRes = Ext.util.JSON.decode(arg.responseText);
			if (jnRes.success) {
				if (!fnOrMsg1)
					return;
				if (typeof fnOrMsg1 == 'function') {
					fnOrMsg1(jnRes);
				} else {
					Sp.MessageBox(fnOrMsg1);
				}
			} else {
				if (jnRes.logined != null && !jnRes.logined) {
					Ext.Msg.confirm('警告', '登录超时,点击确认将跳转到登录页面.', function(bn) {
								if (bn == 'yes') {
									window.location.href = "../public/loginInput.jspx";
								}
							});
					return;
				}
				if (jnRes.forbidden != null && jnRes.forbidden) {
					Sp.MessageBox('没有权限进行操作', 'error');
					return;
				}
				if (!fnOrMsg2) {
					Sp.MessageBox(jnRes.exception, 'error');
				} else {
					if (typeof fnOrMsg2 == 'function') {
						fnOrMsg2(jnRes);
					} else {
						Sp.MessageBox(fnOrMsg2, 'error');
					}
				}
			}
		},
		failure : failFn || (function(arg) {
			var jnRes = Ext.util.JSON.decode(arg.responseText);
			Ext.Msg.alert('提示', '通信异常:' + arg.status + ' ' + arg.statusText);
		})
	});
};

Sp.WinPostOpen = function(url, params, id) {
	var tempForm = document.createElement("form");
	tempForm.id = id;
	tempForm.method = "post";
	tempForm.action = url;
	tempForm.target = id;
	for (var item in params) {
		var hideInput = document.createElement("input");
		hideInput.type = "hidden";
		hideInput.name = item;
		hideInput.value = params[item];;
		tempForm.appendChild(hideInput);
	}
	$(tempForm).submit(function() {
				window.open('about:blank', id);
			});
	document.body.appendChild(tempForm);
	tempForm.submit();
	document.body.removeChild(tempForm);
}

function Map() {
	this.container = new Object();
}

Map.prototype.put = function(key, value) {
	this.container[key] = value;
}

Map.prototype.get = function(key) {
	return this.container[key];
}

Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		keyset[count] = key;
		count++;
	}
	return keyset;
}

Map.prototype.size = function() {
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		count++;
	}
	return count;
}

Map.prototype.remove = function(key) {
	delete this.container[key];
}

Map.prototype.toString = function() {
	var str = "";
	for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
		str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
	}
	return str;
}
