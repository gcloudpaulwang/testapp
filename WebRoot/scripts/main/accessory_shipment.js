Aok.UI.AccessoryShipmentTab = function() {
	var config = {
		items : [{
			title : '配件查询',
			items : [new Aok.UI.AccessoryShipmentQueryForm(),
					new Aok.UI.AccessoryShipmentGrid()]
		}, {
			title : '配件发货',
			items : [new Aok.UI.AccessoryStoreShipmentQueryForm(),
					new Aok.UI.AccessoryStoreShipmentGrid()]
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.AccessoryShipmentTab.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryShipmentTab, Sp.Tab);
Aok.UI.AccessoryShipmentQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'accessory-shipment-query-form',
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
									id : 'asqf-date',
									fieldLabel : '取货日期',
									xtype : 'datefield',
									format : 'Y-m-d',
									editable : false,
									value : Ext.util.Format.date(new Date(),
											"Y-m-d")
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
							id : 'asqf-store',
							xtype : 'combo',
							fieldLabel : '送货门店',
							triggerAction : 'all',
							displayField : 'name',
							valueField : 'id',
							allowBlank : false,
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
			}/*, {
			columnWidth : .32,
			layout : "form",
			defaults : {
			width : 230
			},
			items : [{
			// id : 'asqf-hasSend',
			xtype : 'combo',
			fieldLabel : '是否已送完',
			triggerAction : 'all',
			mode : 'local',
			displayField : 'text',
			valueField : 'value',
			editable : false,
			store : new Ext.data.ArrayStore({
						fields : ['value', 'text'],
						data : [['', '所有'], ['false', '未送完'],
								['true', '已送完']]
					}),
			value : 'false',
			selectOnFocus : true
			}]
			}*/]
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var f = Ext.getCmp('accessory-shipment-query-form');
						if (f.getForm().isValid()) {
							var g = Ext.getCmp('accessory-shipment-grid');
							g.getStore().reload();
						}
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessoryShipmentQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryShipmentQueryForm, Sp.Form);

Aok.UI.AccessoryStoreShipmentQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'accessory-store-shipment-query-form',
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
									id : 'assqf-date',
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
						var f = Ext
								.getCmp('accessory-store-shipment-query-form');
						if (f.getForm().isValid()) {
							var g = Ext.getCmp('accessory-store-shipment-grid');
							g.getStore().reload();
						}
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessoryStoreShipmentQueryForm.superclass.constructor.call(this,
			config);
}
Ext.extend(Aok.UI.AccessoryStoreShipmentQueryForm, Sp.Form);

Aok.UI.AccessoryStoreShipmentGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'accessory-store-shipment-grid',
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
							singleSelect : true
						}), new Ext.grid.RowNumberer(), {
					header : '日期',
					//xtype : 'datecolumn',
					dataIndex : 'ssendDate',
					//format : 'Y-m-d',
					sortable : true
				}, {
					header : '门店',
					dataIndex : 'store.name',
					sortable : true
				}, {
					header : '是否已送完',
					xtype : 'booleancolumn',
					dataIndex : 'finished',
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
				text : '导出',
				iconCls : 'icon-add',
				handler : function() {
					var s = Ext.getCmp('accessory-store-shipment-grid')
							.getSelectionModel();
					if (s.hasSelection()) {
						var rd = s.getSelected();
						//var tmp=clone(rd.data);
						var f = new Aok.UI.ashipmentForm(rd.data);
						var win = new Sp.Window({
									id : 'export-ashipment-win',
									title : '导出送货单',
									items : [f]
								});
						win.show();
					} else {
						Sp.MessageBox('请先选择一行记录', 'error');
					}
				}
			}, {
				xtype : 'button',
				text : '送货',
				iconCls : 'icon-add',
				handler : function() {
					var s = Ext.getCmp('accessory-store-shipment-grid')
							.getSelectionModel();
					if (s.hasSelection()) {
						var rd = s.getSelected();
						Ajaxx('../accessory/shipment/accessory_list.do', {
									date : rd.data.sendDate.replace('T', ' '),
									storeId : rd.data['store.id']
								}, function(res) {
									if (res.success) {
										if (res.data.length == 0) {
											Sp.MessageBox('此门店没有需要送货配件',
													'error');
											return;
										}
										var items = [];
										for (var i = 0; i < res.data.length; i++) {
											items.push(Aok.UI
													.AccessorySendFormColumn({
																data : res.data[i],
																index : i
															}));
										}
										var f = new Aok.UI.AccessorySendForm({
													items : items,
													data : res.data[0]
												});
										var win = new Sp.Window({
													id : 'accessory-send-win',
													width : 900,
													title : '配件送货',
													items : [f]
												});
										win.show();
									}
								});

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
		Aok.UI.AccessoryStoreShipmentGrid.superclass.constructor.call(this,
				config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.AccessoryStoreShipmentGrid.superclass.initComponent.call(this);
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
					url : '../accessory/shipment/stores_info.do',
					autoLoad : true,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['store.id', 'store.name', 'qty', 'send',
							'finished', 'sendDate','ssendDate'],
					listeners : {
						beforeload : function() {
							var date = Ext.getCmp("assqf-date").value;
							this.baseParams = {
								date : date ? date : Ext.util.Format.date(
										new Date(), "Y-m-d")
							};
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('accessory-store-shipment-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('accessory-store-shipment-grid');
		return g.store;
	}
});

Aok.UI.AccessoryShipmentGrid = Ext.extend(Sp.Grid, {
			config : {
				id : 'accessory-shipment-grid',
				frame : true,
				autoHeight : true,
				// height : 500,
				autoScoll : true,
				defaults : {
					width : 100,
					sortable : true
				},
				columns : [new Ext.grid.CheckboxSelectionModel({
									singleSelect : true
								}), new Ext.grid.RowNumberer(), {
							header : '日期',
							//xtype : 'datecolumn',
							dataIndex : 'ssendDate',
							//format : 'Y-m-d',
							sortable : true
						}, {
							header : '门店',
							dataIndex : 'store.name',
							sortable : true
						}, {
							header : '配件',
							dataIndex : 'product.name',
							sortable : true
						}, {
							header : '总共需送',
							dataIndex : 'total',
							sortable : true
						}, {
							header : '总共已送',
							dataIndex : 'totalSend',
							sortable : true
						}, {
							header : '12:00 需送',
							dataIndex : 'first',
							sortable : true
						}, {
							header : '12:00 已送',
							dataIndex : 'firstSend',
							sortable : true
						}, {
							header : '18:00 需送',
							dataIndex : 'secondV',
							sortable : true
						}, {
							header : '18:00 已送',
							dataIndex : 'secondSend',
							sortable : true
						}, {
							header : '是否已送完',
							xtype : 'booleancolumn',
							dataIndex : 'finished',
							trueText : '是',
							falseText : '否',
							sortable : true
						}]//,
				/*tbar : {
					style : 'padding:2px 10px;',
					defaults : {
						xtype : 'button'
					},
					items : [{
								xtype : 'button',
								text : '导出',
								iconCls : 'icon-add',
								handler : function() {

								}
							}]
				}*/
			},
			constructor : function(itemConfig) {
				config = Ext.apply(this.config, itemConfig || {});
				Aok.UI.AccessoryShipmentGrid.superclass.constructor.call(this,
						config);
			},
			// 初始化方法
			initComponent : function() {
				this.init();
				Aok.UI.AccessoryShipmentGrid.superclass.initComponent
						.call(this);
			},
			init : function() {
				this.store = this.createStore();
				// this.bbar.store = this.getStore();
				this.initListeners();
			},
			initListeners : function() {// 获取相应部件,进行事件绑定
				this.on('afterrender', this.loadData);
			},
			createStore : function() {
				var g = this;
				return new Sp.JsonStore({
							url : '../accessory/shipment/accessory_list.do',
							autoLoad : true,
							root : 'data',
							// totalProperty : 'totalCount',
							fields : ['store.id', 'store.name', 'product.name',
									'pid', 'first', 'second','secondV', 'firstSend',
									'secondSend', 'total', 'totalSend',
									'sendDate','ssendDate', 'finished'],
							listeners : {
								beforeload : function() {
									var storeId = Ext.getCmp('asqf-store')
											.getValue();
									var date = Ext.getCmp('asqf-date').value;
									if (!storeId)
										return false;
									this.baseParams = {
										date : date ? date : Ext.util.Format
												.date(new Date(), "Y-m-d"),
										storeId : storeId
									};
								},
								load : function(s) {
								}
							}
						});
			},
			loadData : function() {
				var g = Ext.getCmp('accessory-shipment-grid');
			},
			getStore : function() {
				var g = Ext.getCmp('accessory-shipment-grid');
				return g.store;
			}
		});
Aok.UI.AccessorySendForm = function(itemConfig) {
	var items = itemConfig ? itemConfig.items : null;
	var data = itemConfig ? itemConfig.data : null;
	// debugger;
	var items_1 = [new Ext.form.FieldSet({
				layout : "column",
				defaults : {
					labelWidth : 110
				},
				items : [{
					columnWidth : .4,
					layout : "form",
					defaults : {
						width : 200
					},
					items : [{
						fieldLabel : '第一次送货时间',
						xtype : 'datefield',
						format : 'Y-m-d H:i:s',
						editable : false,
						value : data && data.firstMarkDate ? data.firstMarkDate
								.replace('T', ' ') : Ext.util.Format.date(
								new Date(), "Y-m-d H:i:s"),
						name : 'shipments[0].firstMarkDate',
						allowBlank : false
					}]
				}, {
					columnWidth : .4,
					layout : "form",
					defaults : {
						width : 200
					},
					items : [{
						fieldLabel : '第二次送货时间',
						xtype : 'datefield',
						format : 'Y-m-d H:i:s',
						editable : false,
						value : data && data.secondMarkDate
								? data.firstMarkDate.replace('T', ' ')
								: Ext.util.Format.date(new Date(),
										"Y-m-d H:i:s"),
						name : 'shipments[0].secondMarkDate',
						allowBlank : false
					}]
				}, {
					columnWidth : .4,
					layout : "form",
					defaults : {
						width : 200
					},
					items : [{
						fieldLabel : '第一次送货人',
						xtype : 'textfield',
						value : data
								? data.firstOperator
								: user.aokUser.realName,
						name : 'shipments[0].firstOperator',
						allowBlank : true
					}]
				}, {
					columnWidth : .4,
					layout : "form",
					defaults : {
						width : 200
					},
					items : [{
						fieldLabel : '第二次送货人',
						xtype : 'textfield',
						value : data
								? data.secondOperator
								: user.aokUser.realName,
						name : 'shipments[0].secondOperator',
						allowBlank : true
					}]
				}]
			})];

	var title_items = [{
				layout : "column",
				defaults : {
					width : 50,
					style : {
						'text-align' : 'center'
					},
					labelWidth : 0,
					hideLable : true
				},
				items : [{
							columnWidth : .15,
							items : [new Ext.form.DisplayField({
										value : '配件'
									})]
						}, {
							columnWidth : .1,
							items : [new Ext.form.DisplayField({
										value : '12:00需送'
									})]
						}, {
							columnWidth : .1,
							items : [new Ext.form.DisplayField({
										value : '12:00已送'
									})]
						}, {
							columnWidth : .1,
							items : [new Ext.form.DisplayField({
										value : '18:00需送'
									})]
						}, {
							columnWidth : .1,
							items : [new Ext.form.DisplayField({
										value : '18:00已送',
										hideLable : true
									})]
						}, {
							columnWidth : .4,
							align : 'center',
							items : [new Ext.form.DisplayField({
										value : '备注'
									})]
						}]
			}, {
				layout : "column",
				items : [{
							columnWidth : .99,
							items : [{
										xtype : 'displayfield',
										value : '<hr height:1/>'
									}]
						}]
			}];
	var items_2 = [new Ext.form.FieldSet({
				items : $.merge(title_items, items)
			})];
	var config = {
		labelAlign : 'center',
		labelWidth : 70,
		id : 'accessory-send-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		items : [items_1, items_2],
		buttonAlign : 'center',
		height : 480,
		autoScroll : true,
		buttons : [{
			text : '送货',
			handler : function() {
				var f = Ext.getCmp('accessory-send-form');
				f.submit('../accessory/shipment/send.do', null, null, function(
								res) {
							if (res.success) {
								Sp.MessageBox('发货标记成功!');
								Ext.getCmp('accessory-order-shipment-grid')
										.getStore().reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessorySendForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessorySendForm, Sp.Form);

Aok.UI.AccessorySendFormColumn = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var index = itemConfig ? itemConfig.index : null;
	var config = {
		layout : "column",
		defaults : {
			width : 50,
			style : {
				'text-align' : 'center'
			},
			labelWidth : 0,
			hideLable : true
		},
		items : [{
					columnWidth : .15,
					items : [new Ext.form.DisplayField({
										value : data.product.name
									}), {
								xtype : 'hidden',
								value : data.product.id,
								name : 'shipments[' + index + '].product.id'
							}, {
								xtype : 'hidden',
								value : data.sendDate.replace('T', ' '),
								name : 'shipments[' + index + '].sendDate'
							}, {
								xtype : 'hidden',
								value : data.store.id,
								name : 'shipments[' + index + '].store.id'
							}]
				}, {
					columnWidth : .1,
					items : [new Ext.form.DisplayField({
								value : data.first
							})]
				}, {
					columnWidth : .1,
					items : [{
								xtype : 'numberfield',
								value : (!data.firstSend||data.firstSend==0)?'':data.firstSend,
								name : 'shipments[' + index + '].firstSend',
								width : 60,
								//allowBlank : false,
								decimalPrecision : 2
							}]
				}, {
					columnWidth : .1,
					items : [new Ext.form.DisplayField({
								value : data.secondV
							})]
				}, {
					columnWidth : .1,
					items : [{
								xtype : 'numberfield',
								value : (!data.secondSend||data.secondSend==0)?'':data.secondSend,
								name : 'shipments[' + index + '].secondSend',
								//allowBlank : false,
								width : 60,
								decimalPrecision : 2
							}]
				}, {
					columnWidth : .4,
					items : [{
								xtype : 'textfield',
								value : data.remark,
								name : 'shipments[' + index + '].remark',
								width : 300,
								allowBlank : true
							}]
				}]
	};
	return config;
}

Aok.UI.ashipmentForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var shipmentTime = [['12:00', '12:00'], ['18:00', '18:00']];

	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'ashipmentForm-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '门店',
					name : 'u.store',
					value : data ? data["store.name"] : '',
					disabled : true
				}, {
					id : 'aespstoreId',
					value : data ? data["store.id"] : '',
					hidden : true,
					hideLabel : true
				}, {
					id : 'aespdriver',
					fieldLabel : '送货司机',
					blankText : '送货司机不能为空',
					allowBlank : false
				}, {
					id : 'aesptime',
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
				if (!Ext.getCmp('aespdriver').getValue()
						&& !Ext.getCmp('aesptime').getValue()) {
					Sp.MessageBox("请选择送货时间和送货司机");
					return false;
				}
				Sp.WinPostOpen('../accessory/shipment/exportShipment.do', {
							'esp.storeId' : Ext.getCmp('aespstoreId')
									.getValue(),
							'esp.driver' : Ext.getCmp('aespdriver').getValue(),
							'esp.time' : Ext.getCmp('aesptime').getValue(),
							'esp.takeDate' : Ext.getCmp('assqf-date').value
						}, 'accessory-shipment-export');
				//						window.open('../cake/shipment/exportShipment.do?esp.storeId='+Ext.getCmp('espstoreId').getValue()+
				//								"&esp.driver="+Ext.getCmp('espdriver').getValue()+
				//								"&esp.time="+Ext.getCmp('esptime').getValue());
			}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.shipmentForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.ashipmentForm, Sp.Form);
