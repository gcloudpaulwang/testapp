Aok.UI.CakeProductionQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'cake-production-query-form',
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
					id:'cpqf-startdate',
					fieldLabel : '开始日期',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false,
					value : new Date()
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
					id:'cpqf-enddate',
					fieldLabel : '结束日期',
					xtype : 'datefield',
					format : 'Y-m-d',
					editable : false,
					value : new Date()
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
								id : 'cakeFactory',
								xtype : 'combo',
								fieldLabel : '工场',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
								valueField : 'id',
								//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
								blankText : '工场不能为空',
								//hiddenName : 'u.aokUser.store.id',
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
										Ext.getCmp('cakeStore').clearValue();
										Ext.getCmp('cakeStore').getStore().load({
											params:{
												'factory' : Ext.getCmp('cakeFactory').getValue()
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
								id : 'cakeStore',
								xtype : 'combo',
								fieldLabel : '门店',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								//hiddenValue:data&&data["aokUser.store"] ? data["aokUser.store"].id : '',
								valueField : 'id',
								//value: data&&data["aokUser.store"] ? data["aokUser.store"].name : '',
								blankText : '门店不能为空',
								//hiddenName : 'u.aokUser.store.id',
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
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						if(user.role.id==1&&!Ext.getCmp('cakeFactory').getValue()){
							Sp.MessageBox("请选择要查看工场");
							return false;
						}
						var g = Ext.getCmp('cake-production-grid');
						g.getStore().reload();

					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.CakeProductionQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeProductionQueryForm, Sp.Form);

Aok.UI.CakeProductionGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'cake-production-grid',
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
					header : '尺寸',
					dataIndex : 'cakeSize',
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
							window.open('../cake/order/exportStatistics.do?pqp.factory='+Ext.getCmp('cakeFactory').getValue()+
									'&pqp.store=' + Ext.getCmp('cakeStore').getValue()+
									'&pqp.starttime=' + Ext.getCmp('cpqf-startdate').value+
									'&pqp.endtime=' + Ext.getCmp('cpqf-enddate').value)
//							'pqp.factory' : Ext.getCmp('cakeFactory').getValue(),
//							'pqp.time' : Ext.getCmp('cpqf-date').value,								
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
		Aok.UI.CakeProductionGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.CakeProductionGrid.superclass.initComponent.call(this);
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
					url : '../cake/order/statistics.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['bfCode', 'cakeName', 'cakeNum','cakeSize'],
					listeners : {
						beforeload : function() {
							this.baseParams = {
								'pqp.factory' : Ext.getCmp('cakeFactory').getValue(),
								'pqp.store' : Ext.getCmp('cakeStore').getValue(),
								'pqp.starttime' : Ext.getCmp('cpqf-startdate').value,
								'pqp.endtime' : Ext.getCmp('cpqf-enddate').value,
								limit : ORDER_PAGE_SIZE
							}
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('cake-production-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('cake-production-grid');
		return g.store;
	}
});