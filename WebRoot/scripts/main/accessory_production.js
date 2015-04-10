Aok.UI.AccessoryProductionQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'accessory-production-query-form',
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
					id:'apqf-startdate',
					fieldLabel : '开始日期',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false,
					value : new Date()
				}]
			},
			{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [{
					id:'apqf-enddate',
					fieldLabel : '结束日期',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false,
					value : new Date()
				}]
			}
			]
		},
		{
			layout : "column",
			items : [{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [			
							{
								id : 'accessoryFactory',
								xtype : 'combo',
								fieldLabel : '工场',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',								
								valueField : 'id',
								blankText : '工场不能为空',								
								allowBlank : user.role.id==1?false:true,
								hidden : user.role.id==1?false:true,
								hideLabel : user.role.id==1?false:true,
								store:new Sp.JsonStore({
									autoLoad:false,
									url:'../base/listFactorySelect.do',
									root:'data',
							        fields:['id','name']
								}),
								listeners : {
									'select' : function(){	
										Ext.getCmp('accessoryStore').clearValue();
										Ext.getCmp('accessoryStore').getStore().load({
											params:{
												'factory' : Ext.getCmp('accessoryFactory').getValue()
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
				items : [			
							{
								id : 'accessoryStore',
								xtype : 'combo',
								fieldLabel : '门店',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',								
								valueField : 'id',
								blankText : '门店不能为空',								
//								allowBlank : user.role.id==1?false:true,
//								hidden : user.role.id==1?false:true,
//								hideLabel : user.role.id==1?false:true,
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
		},
		{
			layout : "column",
			items : [{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [			
							{
								id : 'accessoryType',
								xtype : 'combo',
								fieldLabel : '类型',
								editable : false,
								triggerAction : 'all',
								displayField : 'value',								
								valueField : 'value',
								value : '点心',
			//					allowBlank : user.role.id==1?false:true,
			//					hidden : user.role.id==1?false:true,
			//					hideLabel : user.role.id==1?false:true,
								mode : 'local',
								store:new Sp.JsonStore({
									autoLoad:true,
									url:'../base/listProdectType.do',
									root:'data',
							        fields:['value']
								})
							}
						]
						}
		         ]
		}
		],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						if(user.role.id==1&&!Ext.getCmp('accessoryFactory').getValue()){
							Sp.MessageBox("请选择要查看工场");
							return false;
						}
						var g = Ext.getCmp('accessory-production-grid');
						g.getStore().reload();
//						var f = Ext.getCmp('accessory-production-query-form');
//						var date=Ext.getCmp('apqf-date').value;
//						g.getStore().load({
//									params : {
//										'factoryId' : Ext.getCmp('accessoryFactory').getValue(),
//										limit : ORDER_PAGE_SIZE,
//										'date':date
//									}
//								});
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessoryProductionQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryProductionQueryForm, Sp.Form);

Aok.UI.AccessoryProductionGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'accessory-production-grid',
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
				}, {
					header : '数量',
					dataIndex : 'num',
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
							Sp.WinPostOpen('../accessory/order/exportStatistics.do', {
								'pqp.factory':Ext.getCmp('accessoryFactory').getValue(),
								"pqp.store":Ext.getCmp('accessoryStore').getValue(),
								"pqp.starttime":Ext.getCmp('apqf-startdate').value,
								"pqp.endtime":Ext.getCmp('apqf-enddate').value,
								'pqp.type':Ext.getCmp('accessoryType').getValue(),
							}, 'accessory-production-export');
							/*
							window.open('../accessory/order/exportStatistics.do?pqp.factory='+Ext.getCmp('accessoryFactory').getValue()+
									'&pqp.store=' + Ext.getCmp('accessoryStore').getValue()+
									'&pqp.starttime=' + Ext.getCmp('apqf-startdate').value+
									'&pqp.endtime=' + Ext.getCmp('apqf-enddate').value+
									'&pqp.type=' + Ext.getCmp('accessoryType').getValue());
									*/
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
		Aok.UI.AccessoryProductionGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.AccessoryProductionGrid.superclass.initComponent.call(this);
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
					url : '../accessory/order/statistics.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['name', 'type', 'num','unit'],
					listeners : {
						beforeload : function() {
							this.baseParams = {
									'pqp.factory' : Ext.getCmp('accessoryFactory').getValue(),
									'pqp.store' : Ext.getCmp('accessoryStore').getValue(),
									'pqp.starttime' : Ext.getCmp('apqf-startdate').value,
									'pqp.endtime' : Ext.getCmp('apqf-enddate').value,
									'pqp.type' : Ext.getCmp('accessoryType').getValue(),
									limit : ORDER_PAGE_SIZE
							}
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('accessory-production-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('accessory-production-grid');
		return g.store;
	}
});