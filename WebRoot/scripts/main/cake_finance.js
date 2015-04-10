Aok.UI.CakeFinanceQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'cake-finance-query-form',
		title : '查询条件',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		items : [{
			layout : "column",
			items : [{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [{
					id:'cfinance1-date',
					fieldLabel : '开始时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false
				},
				{
					id : 'financecakeZone',
					xtype : 'combo',
					fieldLabel : '区域',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
					valueField : 'id',
					//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
					blankText : '地区不能为空',
					//hiddenName : 'u.aokUser.store.id',
					allowBlank : user.role.id==1?false:true,
					hidden : (user.role.id==1||user.role.id==4)?false:true,
					hideLabel : (user.role.id==1||user.role.id==4)?false:true,
					store:new Sp.JsonStore({
						autoLoad:false,
						url:'../base/listFactorySelect.do',
						root:'data',
				        fields:['id','name']
					}),
					listeners : {
						'select' : function(){	
							Ext.getCmp('financecakeStore').clearValue();
							Ext.getCmp('financecakeStore').getStore().load({
								params:{
									 'factory' : Ext.getCmp('financecakeZone').getValue()
								 }	
							});
						}
					}
				}
				]
			},
			{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [{
					id:'cfinance2-date',
					fieldLabel : '结束时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false
				}
				,
				{
					id : 'financecakeStore',
					xtype : 'combo',
					fieldLabel : '门店',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
					valueField : 'id',
					//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
					//blankText : '门店不能为空',
					//hiddenName : 'u.aokUser.store.id',
					allowBlank : user.role.id==1?false:true,
					hidden : (user.role.id==1||user.role.id==4)?false:true,
					hideLabel : (user.role.id==1||user.role.id==4)?false:true,
					mode : 'local',
					store:new Sp.JsonStore({
						autoLoad:true,
						url:'../base/listStoreSelect.do',
						root:'data',
				        fields:['id','name']
					})
				}
				]
			}
			
			]
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var g = Ext.getCmp('cake-finance-grid');
						
						g.getStore().reload();
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.CakeFinanceQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeFinanceQueryForm, Sp.Form);

Aok.UI.CakeFinanceGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'cake-finance-grid',
		frame : true,
		// title : '蛋糕生产计划',
		autoHeight : true,
		// height : 500,
		autoScoll : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [new Ext.grid.RowNumberer(), {
					header : '蛋糕',
					dataIndex : 'cakeName',
					sortable : true
				}, {
					header : '款式',
					dataIndex : 'bfCode',
					sortable : true
				},{
					header : '数量',
					dataIndex : 'cakeNum',
					sortable : true
				}],
		tbar : {
			style : 'padding:2px 10px;',
			defaults : {
				xtype : 'button'
			},
			items : [{
						xtype : 'button',
						text : '导出',
						iconCls : 'icon-add',
						handler : function() {
							var f = new Aok.UI.CakeFinanceForm();
							var win = new Sp.Window({
										id : 'cakeFinance-form',
										title : '导出',
										items : [f]
									});
							win.show();
							
							
//							Sp.WinPostOpen('../finance/exportFinance.do', {
//								'fqp.factory':Ext.getCmp('financecakeZone').getValue(),
//								'fqp.store': Ext.getCmp('financecakeStore').getValue(),
//								'fqp.startTime':Ext.getCmp('cfinance1-date').value,
//								'fqp.endTime':Ext.getCmp('cfinance2-date').value
//							}, 'cake-finance-export');
//							window.open('../finance/exportFinance.do?fqp.zone='+Ext.getCmp('financecakeZone').getValue()+
//									"&fqp.store="+ Ext.getCmp('financecakeStore').getValue()+
//									"&fqp.startTime="+Ext.getCmp('cfinance1-date').value+
//									"&fqp.endTime="+Ext.getCmp('cfinance2-date').value);
								
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
		Aok.UI.CakeFinanceGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.CakeFinanceGrid.superclass.initComponent.call(this);
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
					url : '../finance/finance.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['bfCode', 'cakeName', 'cakeNum'],
					listeners : {
						
						beforeload : function() {
							this.baseParams = {
								'fqp.factory' : Ext.getCmp('financecakeZone').getValue(),
								'fqp.store' : Ext.getCmp('financecakeStore').getValue(),
								'fqp.startTime' : Ext.getCmp('cfinance1-date').value,
								'fqp.endTime' : Ext.getCmp('cfinance2-date').value,
								limit : ORDER_PAGE_SIZE
							}
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('cake-finance-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('cake-finance-grid');
		return g.store;
	}
});

Aok.UI.CakeFinanceForm = function(itemConfig) {	
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'cakefinance-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 300
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '文件名',
					id : 'cakefileName',
					name : 'cakefileName',
					allowBlank : true
				}],
		buttonAlign : 'center',
		buttons : [{
					text :  '导出',
					iconCls : 'icon-save',
					handler : function() {
						Sp.WinPostOpen('../finance/exportFinance.do', {
							'fqp.factory':Ext.getCmp('financecakeZone').getValue(),
							'fqp.store': Ext.getCmp('financecakeStore').getValue(),
							'fqp.startTime':Ext.getCmp('cfinance1-date').value,
							'fqp.endTime':Ext.getCmp('cfinance2-date').value,
							'fqp.fileName':Ext.getCmp('cakefileName').getValue(),
						}, 'cake-finance-export');
//						var f = Ext.getCmp('user-form');
//						var win = Ext.getCmp('user-edit-win');
//						if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){						
//							Ext.getCmp('store').allowBlank=true;
//							Ext.getCmp('factroy').allowBlank=false;
//						}	
//						else if(Ext.getCmp('roleId').value==2||Ext.getCmp('roleId').hiddenValue==2){
//							Ext.getCmp('factroy').allowBlank=true;
//							Ext.getCmp('store').allowBlank=falses;
//						}
//						else{
//							Ext.getCmp('factroy').allowBlank=true;
//							Ext.getCmp('store').allowBlank=true;
//						}
//						f.submit(data?'../user/edit.do':'../user/add.do', data ? {
//									'u.id' : data.id
//								} : null, win, function(res) {
//									if (res.success) {
//										Sp.MessageBox('保存成功!');
//										Ext.getCmp('user-grid').getStore()
//												.reload();
//									} else {
//										Sp.MessageBox(res.exception,
//												'error');
//									}
//								});
					}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.CakeFinanceForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.CakeFinanceForm, Sp.Form);