Aok.UI.AccessoryFinanceQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'accessory-finance-query-form',
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
					id:'afinance1-date',
					fieldLabel : '开始时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false
				},
				{
					id : 'financeaccessoryZone',
					xtype : 'combo',
					fieldLabel : '区域',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
					valueField : 'id',
					//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
					//blankText : '工场不能为空',
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
							Ext.getCmp('financeaccessoryStore').clearValue();
							Ext.getCmp('financeaccessoryStore').getStore().load({
								 params:{
									 'factory' : Ext.getCmp('financeaccessoryZone').getValue()
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
					id:'afinance2-date',
					fieldLabel : '结束时间',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false
				}
				,
				{
					id : 'financeaccessoryStore',
					xtype : 'combo',
					fieldLabel : '门店',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
					valueField : 'id',
					//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
					//blankText : '地区不能为空',
					//hiddenName : 'u.aokUser.store.id',
					allowBlank : user.role.id==1?false:true,
					hidden : (user.role.id==1||user.role.id==4)?false:true,
					hideLabel : (user.role.id==1||user.role.id==4)?false:true,
					mode : 'local',
					store:new Sp.JsonStore({
						autoLoad:true,
						url:'../base/listStoreSelect.do',
						root: 'data',
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
//						if(user.role.id==1&&!Ext.getCmp('financeaccessoryFactory').getValue()){
//							return false;
//						}
						var g = Ext.getCmp('accessory-finance-grid');
						g.getStore().reload();
//						var f = Ext.getCmp('accessory-finance-query-form');
//						var date=Ext.getCmp('apqf-date').value;
//						g.getStore().load({
//									params : {
//										'factoryId' : Ext.getCmp('financeaccessoryFactory').getValue(),
//										limit : ORDER_PAGE_SIZE,
//										'date':date
//									}
//								});
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessoryFinanceQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryFinanceQueryForm, Sp.Form);

Aok.UI.AccessoryFinanceGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'accessory-finance-grid',
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
					header : '物品',
					dataIndex : 'name',
					sortable : true
				}, {
					header : '类型',
					dataIndex : 'type',
					sortable : true
				}, {
					header : '单位',
					dataIndex : 'unit',
					sortable : true
				}, /*{
					header : '数量',
					dataIndex : 'num',
					sortable : true
				},*/ {
					header : '已送货数量',
					dataIndex : 'send',
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
							var f = new Aok.UI.AccessoryFinanceForm();
							var win = new Sp.Window({
										id : 'accesspryFinance-form',
										title : '导出',
										items : [f]
									});
							win.show();
//							Sp.WinPostOpen('../finance/exportAccessory.do', {
//								'fqp.factory':Ext.getCmp('financeaccessoryZone').getValue(),
//								"fqp.store":Ext.getCmp('financeaccessoryStore').getValue(),
//								"fqp.startTime":Ext.getCmp('afinance1-date').value,
//								"fqp.endTime":Ext.getCmp('afinance2-date').value
//							}, 'accessory-finance-export');
//							window.open('../finance/exportAccessory.do?fqp.zone='+Ext.getCmp('financeaccessoryZone').getValue()+
//									"&fqp.store="+Ext.getCmp('financeaccessoryStore').getValue()+
//									"&fqp.startTime="+Ext.getCmp('afinance1-date').value+
//									"&fqp.endTime="+Ext.getCmp('afinance2-date').value);
//							'fqp.factory' : Ext.getCmp('financeaccessoryFactory').getValue(),
//							'fqp.zone' : Ext.getCmp('financeaccessoryZone').getValue(),
//							'fqp.startTime' : Ext.getCmp('afinance1-date').value,
//							'fqp.endTime' : Ext.getCmp('afinance2-date').value,
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
		Aok.UI.AccessoryFinanceGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.AccessoryFinanceGrid.superclass.initComponent.call(this);
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
					url : '../finance/accessory.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['name', 'type', 'num','unit','send'],
					listeners : {
//						loadexception : function(a, b, response) {
//							Sp.MessageBox(response.responseJSON.exception);
//						},
						beforeload : function() {
							this.baseParams = {
									'fqp.factory' : Ext.getCmp('financeaccessoryZone').getValue(),
									'fqp.store' : Ext.getCmp('financeaccessoryStore').getValue(),
									'fqp.startTime' : Ext.getCmp('afinance1-date').value,
									'fqp.endTime' : Ext.getCmp('afinance2-date').value,
									limit : ORDER_PAGE_SIZE
								}
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('accessory-finance-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('accessory-finance-grid');
		return g.store;
	}
});


Aok.UI.AccessoryFinanceForm = function(itemConfig) {	
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'accessoryfinance-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 300
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '文件名',
					id : 'accessoryfileName',
					name : 'accessoryfileName',
					allowBlank : true
				}],
		buttonAlign : 'center',
		buttons : [{
					text :  '导出',
					iconCls : 'icon-save',
					handler : function() {

						Sp.WinPostOpen('../finance/exportAccessory.do', {
							'fqp.factory':Ext.getCmp('financeaccessoryZone').getValue(),
							"fqp.store":Ext.getCmp('financeaccessoryStore').getValue(),
							"fqp.startTime":Ext.getCmp('afinance1-date').value,
							"fqp.endTime":Ext.getCmp('afinance2-date').value,
							'fqp.fileName':Ext.getCmp('accessoryfileName').getValue(),
						}, 'accessory-finance-export');
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
	Aok.UI.AccessoryFinanceForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.AccessoryFinanceForm, Sp.Form);