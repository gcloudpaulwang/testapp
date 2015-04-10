Aok.UI.CakeShipmentTab = function() {
	var config = {
		items : [{
			title : '蛋糕查询',
			items : [new Aok.UI.CakeShipmentQueryForm(),
					new Aok.UI.CakeOrderShipmentGrid()]
		}, {
			title : '蛋糕发货',
			items : [new Aok.UI.CakeStoreShipmentQueryForm(),
					new Aok.UI.CakeStoreShipmentGrid()]
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.CakeShipmentTab.superclass.constructor.call(this, config);

}
Ext.extend(Aok.UI.CakeShipmentTab, Sp.Tab);
Aok.UI.CakeShipmentQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'cake-shipment-query-form',
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
									id : 'csqf-date',
									fieldLabel : '取货日期',
									xtype : 'datefield',
									format : 'Y-m-d',
									editable : false,
									value : Ext.util.Format.date(new Date(),
											"Y-m-d")
								}]
					}, {
						columnWidth : .32,
						layout : "form",
						defaults : {
							width : 230
						},
						items : [{
							id : 'csqf-time',
							xtype : 'combo',
							fieldLabel : '时间',
							mode : 'local',
							editable : false,
							triggerAction : 'all',
							displayField : 'text',
							valueField : 'value',
							allowBlank : true,
							store : new Ext.data.ArrayStore({
										fields : ['value', 'text'],
										data : [['', '所有'], ['12:00', '12:00'],
												['18:00', '18:00']]
									})
						}]
					}]
		}, {
			layout : "column",
			items : [{
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [{
					id : 'csqf-store',
					xtype : 'combo',
					fieldLabel : '送货门店',
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					editable : false,
					store : new Sp.JsonStore({
								autoLoad : false,
								url : '../base/listStore.do',
								root : 'data',
								fields : ['id', 'name'],
								listeners : {
									beforeload : function() {
										if (user.role.id == 2) {
											this.baseParams = {
												'fid' : user.aokUser.factory.id
											};
										}
									}
								}
							})

				}]
			}, {
				columnWidth : .32,
				layout : "form",
				defaults : {
					width : 230
				},
				items : [{
					id : 'csqf-hasSend',
					xtype : 'combo',
					fieldLabel : '是否已送货',
					triggerAction : 'all',
					mode : 'local',
					displayField : 'text',
					valueField : 'value',
					editable : false,
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : [['', '所有'], ['false', '未送货'],
										['true', '已送货']]
							}),
					value : 'false',
					selectOnFocus : true
				}]
			}]
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var g = Ext.getCmp('cake-order-shipment-grid');
						var date = Ext.getCmp('csqf-date').value;
						var time = Ext.getCmp('csqf-time').value;
						var storeId = Ext.getCmp('csqf-store').getValue();
						var hasSend = Ext.getCmp('csqf-hasSend').getValue();
						g.getStore().load({
									params : {
										start : 0,
										limit : ORDER_PAGE_SIZE,
										'oqp.takeDate' : date,
										'oqp.takeTime' : time,
										'oqp.takeStoreId' : storeId,
										'oqp.hasSend' : hasSend
									}
								});
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.CakeShipmentQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeShipmentQueryForm, Sp.Form);

Aok.UI.CakeStoreShipmentQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'cake-store-shipment-query-form',
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
									id : 'cssqf-date',
									fieldLabel : '取货日期',
									xtype : 'datefield',
									format : 'Y-m-d',
									editable : false,
									value : Ext.util.Format.date(new Date(),
											"Y-m-d")
								}]
					}]
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var f = Ext.getCmp('cake-store-shipment-query-form');
						if (f.getForm().isValid()) {
							var g = Ext.getCmp('cake-store-shipment-grid');
							g.getStore().reload();
						}
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.CakeStoreShipmentQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeStoreShipmentQueryForm, Sp.Form);

Aok.UI.CakeOrderShipmentGrid = Ext.extend(Sp.Grid, {
			config : {
				id : 'cake-order-shipment-grid',
				frame : true,
				autoHeight : true,
				autoScoll : true,
				defaults : {
					width : 100,
					sortable : true
				},
				sm : new Ext.grid.CheckboxSelectionModel({
							singleSelect : false
						}),
				columns : [new Ext.grid.CheckboxSelectionModel({
									singleSelect : false
								}), new Ext.grid.RowNumberer(), {
							header : '编号',
							dataIndex : 'id',
							sortable : true
						},{
							header : '原单号',
							dataIndex : 'orglNo',
							sortable : true
						}, {
							header : '下单分店',
							dataIndex : 'placeStoreName',
							sortable : true
						}, {
							header : '取货门店',
							dataIndex : 'takeStoreName',
							sortable : true
						}, {
							header : '蛋糕',
							dataIndex : 'cake.name',
							sortable : true
						}, {
							header : '裱花',
							dataIndex : 'bfCode',
							sortable : true
						}, {
							header : '送货时间',
							//xtype : 'datecolumn',
							dataIndex : 'ssendDate',
							//format : 'Y-m-d H:i',
							sortable : true
						}, {
							header : '是否已送货',
							xtype : 'booleancolumn',
							dataIndex : 'hasSend',
							trueText : '是',
							falseText : '否',
							sortable : true
						}],
				tbar : {
					style : 'padding:2px 10px;',
					defaults : {
						xtype : 'button'
					},
					items : [{
						xtype : 'button',
						text : '送货',
						iconCls : 'icon-add',
						handler : function() {
							var s = Ext.getCmp('cake-order-shipment-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								var f = new Aok.UI.CakeOrderDetailForm({
											data : rd.data,
											shipment : true,
											btnText : rd.data.hasSend
													? '取消已送'
													: '标记已送'
										});
								var win = new Sp.Window({
											id : 'cake-order-detail-win',
											width : 700,
											title : '蛋糕订单送货',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}, {
						xtype : 'button',
						text : '批量送货',
						iconCls : 'icon-add',
						handler : function() {
							var s = Ext.getCmp('cake-order-shipment-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var st = "?";
								for (var i = 0; i < s.getSelections().length; i++) {
									st += "ids=" + s.getSelections()[i].data.id
											+ '&';

								}
								var f = new Aok.UI.CakeBatchSendForm({
											data : st
										});
								var win = new Sp.Window({
											id : 'cake-batch-send-win',
											title : '批量送货',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择记录');
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
				Aok.UI.CakeOrderShipmentGrid.superclass.constructor.call(this,
						config);
			},
			// 初始化方法
			initComponent : function() {
				this.init();
				Aok.UI.CakeOrderShipmentGrid.superclass.initComponent
						.call(this);
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
							url : '../cake/order/list.do',
							// remoteSort:true,
							autoLoad : false,
							root : 'data',
							totalProperty : 'totalCount',
							fields : ['id', 'placeStoreName', 'takeStoreName',
									'placeStore', 'takeStore', 'placeStoreTel',
									'cake', 'cake.name', 'placeDate',
									'takeDate', 'greeting', 'customerName',
									'customerTel', 'operator', 'hasPaid',
									'deposit', 'plain', 'group', 'bfCode',
									'request', 'hasSend', 'sendMan',
									'sendDate','ssendDate','orglNo', 'sendRemark'],
							listeners : {
								loadexception : function(a, b, response) {
									Sp
											.MessageBox(response.responseJSON.exception);
								},
								beforeload : function() {
								},
								load : function(s) {
								}
							}
						});
			},
			loadData : function() {
				var g = Ext.getCmp('cake-order-shipment-grid');
			},
			getStore : function() {
				var g = Ext.getCmp('cake-order-shipment-grid');
				return g.store;
			}
		});

Aok.UI.CakeStoreShipmentGrid = Ext.extend(Sp.Grid, {
			config : {
				id : 'cake-store-shipment-grid',
				frame : true,
				// title : '蛋糕生产计划',
				autoHeight : true,
				// height : 500,
				autoScoll : true,
				defaults : {
					width : 100,
					sortable : true
				},
				columns : [new Ext.grid.CheckboxSelectionModel({
									singleSelect : false
								}), new Ext.grid.RowNumberer(), {
							header : '日期',
							//xtype : 'datecolumn',
							dataIndex : 'stakeDate',
							//format : 'Y-m-d',
							sortable : true
						}, {
							header : '门店',
							dataIndex : 'storeName',
							sortable : true
						}, {
							header : '总量',
							dataIndex : 'total',
							sortable : true
						}, {
							header : '已送',
							dataIndex : 'send',
							sortable : true
						}, {
							header : '未送',
							dataIndex : 'unsend',
							sortable : true
						}],
				tbar : {
					style : 'padding:2px 10px;',
					defaults : {
						xtype : 'button'
					},
					items : [{
						xtype : 'button',
						text : '导出送货单',
						iconCls : 'icon-add',
						handler : function() {
							var s = Ext.getCmp('cake-store-shipment-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								// var tmp=clone(rd.data);
								var f = new Aok.UI.shipmentForm(rd.data);
								var win = new Sp.Window({
											id : 'export-shipment-win',
											title : '导出送货单',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}/*, {
						xtype : 'button',
						text : '批量送货',
						iconCls : 'icon-add',
						handler : function() {

						}
					}*/]
				},
				bbar : {
					xtype : 'paging',
					pageSize : 12
				}
			},
			constructor : function(itemConfig) {
				config = Ext.apply(this.config, itemConfig || {});
				Aok.UI.CakeStoreShipmentGrid.superclass.constructor.call(this,
						config);
			},
			// 初始化方法
			initComponent : function() {
				this.init();
				Aok.UI.CakeStoreShipmentGrid.superclass.initComponent
						.call(this);
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
							url : '../cake/shipment/stores_info.do',
							// remoteSort:true,
							autoLoad : true,
							root : 'data',
							totalProperty : 'totalCount',
							fields : ['takeDate','stakeDate', 'storeId', 'storeName',
									'total', 'send', 'unsend'],
							listeners : {
								beforeload : function() {
									var date = Ext.getCmp("cssqf-date").value;
									this.baseParams = {
										date : date ? date : Ext.util.Format
												.date(new Date(), "Y-m-d")
									};
								},
								load : function(s) {
								}
							}
						});
			},
			loadData : function() {
				var g = Ext.getCmp('cake-store-shipment-grid');
			},
			getStore : function() {
				var g = Ext.getCmp('cake-store-shipment-grid');
				return g.store;
			}
		});

Aok.UI.CakeBatchSendForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75,
		id : 'cake-batch-send-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		items : [{
			layout : "column",

			items : [{
				columnWidth : .9,
				layout : "form",
				defaults : {
					width : 200
				},
				items : [{
							fieldLabel : '送货时间',
							xtype : 'datefield',
							format : 'Y-m-d H:i:s',
							editable : false,
							value : Ext.util.Format.date(new Date(),
									"Y-m-d H:i:s"),
							name : 'order.sendDate',
							allowBlank : false
						}]

			}]

		}, {
			layout : "column",

			items : [{
						columnWidth : .9,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
									fieldLabel : '送货人',
									xtype : 'textfield',
									value : user.aokUser.realName,
									name : 'order.sendMan',
									allowBlank : false,
									blankText : '不能为空'
								}]

					}]

		}, {
			layout : "column",

			items : [{

						columnWidth : .9,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
									fieldLabel : '送货备注',
									xtype : 'textarea',
									name : 'accessory.remark',
									allowBlank : true
								}]

					}]

		}],
		buttonAlign : 'center',
		buttons : [{
			text : '批量发货标记',
			iconCls : 'icon-save',
			handler : function(a, b, c) {
				var f = Ext.getCmp('cake-batch-send-form');
				var win = Ext.getCmp('cake-batch-send-win');
				f.submit('../cake/shipment/batch_send.do' + data, null, win,
						function(res) {
							if (res.success) {
								Sp.MessageBox('发货标记成功!');
								Ext.getCmp('cake-order-shipment-grid')
										.getStore().reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	}
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.CakeBatchSendForm.superclass.constructor.call(this, config);
};

Ext.extend(Aok.UI.CakeBatchSendForm, Sp.Form);

Aok.UI.shipmentForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var shipmentTime = [['12:00', '12:00'], ['18:00', '18:00']];

	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'shipmentForm-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '门店',
					name : 'u.store',
					value : data ? data.storeName : '',
					disabled : true
				}, {
					id : 'espstoreId',
					value : data ? data.storeId : '',
					hidden : true,
					hideLabel : true
				}, {
					id : 'espdriver',
					fieldLabel : '送货司机',
					blankText : '送货司机不能为空',
					allowBlank : false
				}, {
					id : 'esptime',
					xtype : 'combo',
					fieldLabel : '送货时间',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					displayField : 'text',
					valueField : 'value',
					blankText : '送货时间不能为空',
					allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['text', 'value'],
								data : shipmentTime
							})
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '导出',
			iconCls : 'icon-save',
			handler : function() {
				if (!Ext.getCmp('espdriver').getValue()
						&& !Ext.getCmp('esptime').getValue()) {
					Sp.MessageBox("请选择送货时间和送货司机");
					return false;
				}
				Sp.WinPostOpen('../cake/shipment/exportShipment.do', {
							'esp.storeId' : Ext.getCmp('espstoreId').getValue(),
							'esp.driver' : Ext.getCmp('espdriver').getValue(),
							'esp.time' : Ext.getCmp('esptime').getValue(),
							'esp.takeDate' : Ext.getCmp('cssqf-date').value
						}, 'cake-shipment-export');
				// window.open('../cake/shipment/exportShipment.do?esp.storeId='+Ext.getCmp('espstoreId').getValue()+
				// "&esp.driver="+Ext.getCmp('espdriver').getValue()+
				// "&esp.time="+Ext.getCmp('esptime').getValue());
			}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.shipmentForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.shipmentForm, Sp.Form);
