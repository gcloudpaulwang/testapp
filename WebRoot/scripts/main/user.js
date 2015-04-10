Aok.UI.UserGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'user-grid',
		frame : true,
		title : '用户管理',
		autoHeight : false,
		height:500,
		autoScoll:true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [{
					header : '登录名',
					dataIndex : 'loginName',
					sortable : true
				},{
					header : '公司',
					dataIndex : 'aokUser.companyCnName',
					sortable : true
				}, {
					header : '真实名',
					dataIndex : 'aokUser.realName',
					sortable : true
				}, {
					header : '角色',
					dataIndex : 'role.name',
					sortable : true
				}, {
					header : '邮箱',
					dataIndex : 'email',
					sortable : true
				}, {
					header : '电话',
					dataIndex : 'aokUser.mobile',
					sortable : true
				}, {
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						var h = "<input type='button' value='删除' onclick='Aok.UI.userDel("
								+ v + ")'>";
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
							var f = new Aok.UI.UserForm();
							var win = new Sp.Window({
										id : 'user-edit-win',
										title : '新建用户',
										items : [f]
									});
							win.show();
						}
					}, {
						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s=Ext.getCmp('user-grid').getSelectionModel();
							if(s.hasSelection()){
								var rd=s.getSelected();
								//var tmp=clone(rd.data);
								var f = new Aok.UI.UserForm(rd.data);
								var win = new Sp.Window({
										id : 'user-edit-win',
										title : '编辑用户',
										items : [f]
									});
								win.show();
							}else{
								Sp.MessageBox('请先选择一行记录','error');
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
		Aok.UI.UserGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.UserGrid.superclass.initComponent.call(this);
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
					url : '../user/list.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'loginName', 'email','role.id', 'role.name',
							'aokUser.realName', 'aokUser.mobile','aokUser.gender',
							'aokUser.store','aokUser.factory'],
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('user-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('user-grid');
		return g.store;
	}
});

Aok.UI.userDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该用户,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../user/del.do', {
								'u.id' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('user-grid').getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});

};


Aok.UI.UserForm = function(itemConfig) {
	var data = itemConfig ? itemConfig: null;
	var gengerStore = [['男', true], ['女', false]];
	var companyStore = [['德立', 'DL'], ['飞安', 'FA']];
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'user-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '登录名',
					name : 'u.loginName',
					blankText : '登录名不能为空',
					value : data ? data.loginName : '',
					allowBlank : false,
					disabled:data ?true:false
				}, {
					fieldLabel : '密码',
					name : 'u.pwd',
					blankText : '密码不能为空',
					minLength : 6,
					minLengthText:'密码必须6个字符以上',
					allowBlank :data?true: false,
					inputType : 'password'
				}, {
					id : 'roleId',
					xtype : 'combo',
					fieldLabel : '角色',
					blankText:'角色不能为空',
					value:data?data["role.name"]:'',
					hiddenValue:data?data["role.id"]:'',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hiddenName:'u.role.id ',
					allowBlank : false,
					store:new Sp.JsonStore({
						autoLoad:false,
						url:'../user/listRoles.do',
						root:'data',
				        fields:['id','name']
					}),
					listeners : {
						'select' : function(){							
							if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){
								Ext.getCmp('factroy').getEl().up('.x-form-item').setDisplayed(true);
								Ext.getCmp('store').getEl().up('.x-form-item').setDisplayed(false);
							}
							else if(Ext.getCmp('roleId').value==3||Ext.getCmp('roleId').hiddenValue==3){
								Ext.getCmp('store').getEl().up('.x-form-item').setDisplayed(true);
								Ext.getCmp('factroy').getEl().up('.x-form-item').setDisplayed(false);
							}
							else{
								Ext.getCmp('store').getEl().up('.x-form-item').setDisplayed(false);
								Ext.getCmp('factroy').getEl().up('.x-form-item').setDisplayed(false);
							}
						}
					}
				},{
					id : 'factroy',
					xtype : 'combo',
					fieldLabel : '工厂',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					hiddenValue:data&&data["aokUser.factory"] ? data["aokUser.factory"].id : '',
					valueField : 'id',
					value: data&&data["aokUser.factory"] ? data["aokUser.factory"].name : '',
					blankText : '工厂不能为空',
					hiddenName : 'u.aokUser.factory.id',
					allowBlank : false,
					store:new Sp.JsonStore({
						autoLoad:false,
						url:'../base/listFactory.do',
						root:'data',
				        fields:['id','name']
					}),
					listeners : {
						afterrender : function() {
							if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){
								Ext.getCmp('factroy').getEl().up('.x-form-item').setDisplayed(true);
							}
							else{
								Ext.getCmp('factroy').getEl().up('.x-form-item').setDisplayed(false);
							}
						}
					}
				},{
					id : 'store',
					xtype : 'combo',
					fieldLabel : '门店',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
					valueField : 'id',
					value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
					blankText : '门店不能为空',
					hiddenName : 'u.aokUser.store.id',
					allowBlank : false,
					store:new Sp.JsonStore({
						autoLoad:false,
						url:'../base/listStore.do',
						root:'data',
				        fields:['id','name']
					}),
					listeners : {
						afterrender : function() {
							if(Ext.getCmp('roleId').value==3||Ext.getCmp('roleId').hiddenValue==3){
								Ext.getCmp('store').getEl().up('.x-form-item').setDisplayed(true);
							}
							else{
								Ext.getCmp('store').getEl().up('.x-form-item').setDisplayed(false);
							}
						}
					}
				},{
					fieldLabel : '真实性名',
					name : 'u.aokUser.realName',
					blankText : '真实姓名不能为空',
					value : data ? data["aokUser.realName"] : '',
					allowBlank : false
				}, {
					xtype : 'combo',
					fieldLabel : '姓别',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					displayField : 'text',
					hiddenValue:data ? data["aokUser.gender"] : '',
					valueField : 'value',
					value: data ? (data["aokUser.gender"]?'男':'女') : '',
					blankText : '姓别不能为空',
					hiddenName : 'u.aokUser.gender',
					allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['text', 'value'],
								data : gengerStore
					})
				}, {
					fieldLabel : '邮箱',
					name : 'u.email',
					blankText : '邮箱不能为空',
					value : data ? data.email : '',
					allowBlank : true
				}, {
					fieldLabel : '电话',
					name : 'u.aokUser.mobile',
					blankText : '电话不能为空',
					value : data ? data["aokUser.mobile"] : '',
					allowBlank : true
				}],
		buttonAlign : 'center',
		buttons : [{
					text : data ? '编辑' : '创建',
					iconCls : 'icon-save',
					handler : function() {
						var f = Ext.getCmp('user-form');
						var win = Ext.getCmp('user-edit-win');
						if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){						
							Ext.getCmp('store').allowBlank=true;
							Ext.getCmp('factroy').allowBlank=false;
						}	
						else if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){
							Ext.getCmp('factroy').allowBlank=true;
							Ext.getCmp('store').allowBlank=falses;
						}
						else{
							Ext.getCmp('factroy').allowBlank=true;
							Ext.getCmp('store').allowBlank=true;
						}
						f.submit(data?'../user/edit.do':'../user/add.do', data ? {
									'u.id' : data.id
								} : null, win, function(res) {
									if (res.success) {
										Sp.MessageBox('保存成功!');
										Ext.getCmp('user-grid').getStore()
												.reload();
									} else {
										Sp.MessageBox(res.exception,
												'error');
									}
								});
					}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.UserForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.UserForm, Sp.Form);
