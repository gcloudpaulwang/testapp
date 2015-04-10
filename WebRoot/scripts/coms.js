Ext.namespace("Express.UI");
var giftTypeStore = [['无'], ['小礼品']];
Express.UI.GiftGrid = Ext.extend(Express.Grid, {
	config : {
		id : 'gift-grid',
		frame : true,
		title : '礼品管理',
		autoHeight : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [{
					id : 'name',
					header : '名称',
					dataIndex : 'name',
					sortable : true
				}, {
					id : 'type',
					header : '类型',
					dataIndex : 'type',
					sortable : true
				}, {
					id : 'code',
					header : '代码',
					dataIndex : 'code',
					sortable : true
				}, {
					id : '',
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						//debugger;
						var h = "<input type='button' value='删除' onclick='Express.UI.giftDel("
								+ v + ")'>"
						h += "<input type='button' value='编辑' onclick=\"Express.UI.giftEdit("+v+",'"+b.data.name+"','"+b.data.type+"','"+b.data.code+"')\">";
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
							var f = new Express.UI.GiftForm();
							var win = new Express.Window({
										id : 'gift-edit-win',
										title : '新建礼品',
										items : [f]
									});
							win.show();
						}
					}]
		},
		bbar : {
			xtype : 'paging',
			pageSize : 20
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Express.UI.GiftGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Express.UI.GiftGrid.superclass.initComponent.call(this);
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
		return new Express.JsonStore({
					url : '../gift/list.do',
					// remoteSort:true,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'name', 'type','code'],
					listeners : {
						loadexception : function(a, b, response) {
							Express.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('gift-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('gift-grid');
		return g.store;
	}
});

Express.UI.giftDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该礼品记录,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../gift/del.do', {
								'p.id' : id
							}, function(res) {
								if (res.success) {
									Express.MessageBox('删除成功!');
									Ext.getCmp('gift-grid').getStore().reload();
								} else {
									Express.MessageBox(res.exception, 'error');
								}
							});
				}
			});

};
Express.UI.giftEdit = function(id,name,type,code) {
	var data={'id':id,'name':name,'type':type,'code':code};
	var config={'data':data};
	var f = new Express.UI.GiftForm(config);
	var win = new Express.Window({
				id : 'gift-edit-win',
				title : '编辑礼品',
				items : [f]
			});
	win.show();
};

Express.UI.GiftForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'gift-form',
		frame : true,
		// title : '单项礼品录入',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '礼品名',
					name : 'p.name',
					blankText:'礼品名不能为空',
					value:data?data.name:'',
					allowBlank : false
				}, {
					id : 'gift-type-combo',
					xtype : 'combo',
					fieldLabel : '类型',
					blankText:'礼品类型不能为空',
					name : 'p.type',
					value:data?data.type:'',
					//mode : 'local',
					editable : true,
					triggerAction : 'all',
					displayField : 'type',
					valueField : 'type',
					allowBlank : false,
					store:new Express.JsonStore({
						autoLoad:false,
						url:'../gift/listTypes.do',
						root:'data',
				        fields:['type']
					})
				},{
					fieldLabel : '代码',
					name : 'p.code',
					//blankText:'礼品名不能为空',
					value:data?data.code:''
					//allowBlank : false
				}],
		buttonAlign : 'left',
		buttons : [{
					text : data ? '编辑' : '创建',
					handler : function() {
						var f = Ext.getCmp('gift-form');
						var win = Ext.getCmp('gift-edit-win');
						f.submit('../gift/save.do', data?{'p.id':data.id}:null, win, function(res) {
									if (res.success) {
										Express.MessageBox('保存成功!');
										Ext.getCmp('gift-grid').getStore()
												.reload();
									} else {
										Express.MessageBox(res.exception,
												'error');
									}
								});
					}
				}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.GiftForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.GiftForm, Express.Form);

