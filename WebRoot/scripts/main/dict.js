var dictType = [['CAKE_PATTERN', '蛋糕裱花'],['UNIT', '单位'],['ZONE', '地区'],['PRODUCT_TYPE','产品']];
Aok.UI.DictMng = function(itemConfig) {
	var config = {
		autoHeight : true,
		anchor : '100%',
		title : '基础数据管理',
		viewConfig : {
		//forceFit:true
		},
		autoScroll : true,
		items : [new Aok.UI.DictGrid]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.DictMng.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.DictMng, Ext.Panel);

Aok.UI.DictQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 50, // label settings here cascade unless overridden
		//id : 'order-query-form',
		frame : true,
		//title : '查询条件',
		bodyStyle : 'padding:5px 5px 0',
		items : [{
					id : 'typesl',
					xtype : 'combo',
					fieldLabel : '类型',
					width : 230,
					//id : 'dict-type',
					hiddenName : 'order.type',
					name : 'order.type',
					mode : 'local',
					editable : true,
					triggerAction : 'all',
					displayField : 'text',
					valueField : 'value',
					// allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : dictType
							})

				}],
	buttonAlign : 'left',
	buttons : [{
				text : '查询',
				handler : function() {
					var g = Ext.getCmp('dict-grid');
					g.getStore().reload();
				
				}
			}]
	}, config = Ext.apply(config, {});
	Aok.UI.DictQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.DictQueryForm, Sp.Form);

Aok.UI.DictGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'dict-grid',
		frame : true,
		//title : '基础数据管理',
		autoHeight : false,
		height : 450,
		autoScoll : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [{
					header : '编号',
					dataIndex : 'key',
					sortable : true
				}, {
					header : '类型',
					dataIndex : 'typeCn',
					sortable : true
				}, {
					header : '数值',
					dataIndex : 'value',
					sortable : true
				}, {
					header : '操作',
					dataIndex : 'key',
					renderer : function(v, a, b) {
						var h = "<input type='button' value='删除' onclick='Aok.UI.dictDel(\""
								+ v + "\")'>";
						return h;
					}
				}],
		tbar : {
			style : 'padding:2px 10px;',
			defaults : {
				xtype : 'button'
			},
			items : [{
						xtype : 'button',
						text : '新建',
						iconCls : 'icon-add',
						handler : function() {
							var f = new Aok.UI.DictForm();
							var win = new Sp.Window({
										id : 'dict-edit-win',
										title : '新建数据',
										items : [f]
									});
							win.show();
						}
					}, {
						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('dict-grid').getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								//var tmp=clone(rd.data);
								var f = new Aok.UI.DictForm(rd.data);
								var win = new Sp.Window({
											id : 'dict-edit-win',
											title : '编辑数据',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}]
		},
		bbar : {
			xtype : 'paging',
			pageSize : 12
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Aok.UI.DictGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.DictGrid.superclass.initComponent.call(this);
	},
	init : function() {
		this.store = this.createStore();
		this.bbar.store = this.getStore();
		this.initListeners();
	},
	initListeners : function() {// 获取相应部件,进行事件绑定
		this.on('afterrender', this.loadData);
	},
	createStore : function() {
		var g = this;
		return new Sp.JsonStore({
					url : '../base/listDict.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['key', 'type', 'value','typeCn'],
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
							this.baseParams = {
									'type' : Ext.getCmp('typesl').getValue(),
									limit : ORDER_PAGE_SIZE
								}
						},
						load : function(s) {
														
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('dict-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('dict-grid');
		return g.store;
	}
});

Aok.UI.dictDel = function(key) {
	Ext.Msg.confirm('提示', '确定该基础数据,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../base/deleteDict.do', {
								'd.key' : key
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('dict-grid').getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});

};

Aok.UI.DictForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'dict-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{	fieldLabel : '编号',
					name : 'd.key',
					blankText : '编号不能为空',
					value : data ? data.key : '',
					allowBlank : false,
					disabled : data ? true : false
				},{
					xtype : 'combo',
					mode : 'local',
					fieldLabel : '类型',
					hiddenName : 'd.type',
					blankText : '类型不能为空',
					value : data ? data.type : '',
					allowBlank : false,
					disabled : data ? true : false,
					displayField : 'text',
					hiddenValue:data ? data.type : '',
					valueField : 'value',
					store : new Ext.data.ArrayStore({
						fields : [ 'value','text'],
						data : dictType
					})
				}, {
					fieldLabel : '数值',
					name : 'd.value',
					blankText : '数值不能为空',
					value : data ? data.value : '',
					allowBlank : false
				}],
		buttonAlign : 'center',
		buttons : [{
			text : data ? '编辑' : '创建',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('dict-form');
				var win = Ext.getCmp('dict-edit-win');

				f.submit(data ? '../base/editDict.do' : '../base/addDict.do', data ? {
							'd.key' : data.key,
							'd.type' : data.type
						} : null, win, function(res) {
							if (res.success) {
								Sp.MessageBox('保存成功!');
								Ext.getCmp('dict-grid').getStore().reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.DictForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.DictForm, Sp.Form);
