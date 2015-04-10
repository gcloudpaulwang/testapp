Aok.UI.AccessoryOrderMng = function(itemConfig) {
	var config = {
		autoHeight : true,
		anchor : '100%',
		title : '配件订单管理',
		viewConfig : {
		// forceFit:true
		},
		autoScroll : true,
		items : [new Aok.UI.AccessoryOrderGrid]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.AccessoryOrderMng.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryOrderMng, Ext.Panel);

Aok.UI.AccessoryOrderQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'accessory-order-query-form',
		frame : true,
		title : '查询条件',
		bodyStyle : 'padding:5px 5px 0',
		items : [{
			layout : "column",
			hidden : user.role.id == 3,
			items : [{
						columnWidth : .32,
						layout : "form",
						defaults : {
							width : 230
						},
						items : [{
									id : 'aoqf-zone',
									xtype : 'combo',
									fieldLabel : '地区',
									triggerAction : 'all',
									displayField : 'value',
									valueField : 'value',
									hiddenField:'value',
									hideLabel : user.role.id == 3,
									hidden : user.role.id == 3,
									desabled : user.role.id == 3,
									store : new Sp.JsonStore({
												autoLoad : false,
												url : '../base/listDict.do?type=ZONE',
												root : 'data',
												fields : ['key', 'value']
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
				hidden : user.role.id == 3,
				items : [{
					id : 'aoqf-ps',
					xtype : 'combo',
					fieldLabel : '下单门店',
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hideLabel : user.role.id == 3,
					hidden : user.role.id == 3,
					desabled : user.role.id == 3,
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
										} else if (user.role.id == 3) {
											this.baseParams = {
												'fid' : user.aokUser.store.factory.id
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
					id : 'aoqf-ts',
					xtype : 'combo',
					fieldLabel : '取货门店',
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
										} else if (user.role.id == 3) {
											this.baseParams = {
												'fid' : user.aokUser.store.factory.id
											};
										}
									}
								}
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
									fieldLabel : '订单编号',
									id : 'aoqf-oid',
									xtype : 'textfield',
									width : 230
								}]

					}, {
						columnWidth : .22,
						layout : "form",
						defaults : {
							width : 120
						},
						items : [{
									id : 'aoqf-date',
									fieldLabel : '取货时间',
									xtype : 'datefield',
									format : 'Y-m-d',
									editable : false,
									value : Ext.util.Format.date(new Date(),
											"Y-m-d")
								}]
					}, {
						columnWidth : .12,
						items : [{
							id : 'aoqf-time',
							labelWidth : 0,
							width : 60,
							hideLable : true,
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

		},{
			layout : "column",
			hidden : user.role.id == 3,
			items : [{
						columnWidth : .32,
						layout : "form",
						defaults : {
							width : 230
						},
						items : [{
									id : 'aoqf-modified',
									xtype : 'checkbox',
									fieldLabel : '只显示调整'
									
								}]
					}]
		
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var g = Ext.getCmp('accessory-order-grid');
						g.getStore().reload();
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.AccessoryOrderQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryOrderQueryForm, Sp.Form);

Aok.UI.AccessoryOrderGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'accessory-order-grid',
		frame : true,
		// title : '基础数据管理',
		autoHeight : true,
		// height : 400,
		autoScoll : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [new Ext.grid.CheckboxSelectionModel({
							singleSelect : false
						}), {
					header : '编号',
					dataIndex : 'id',
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
					header : '变更次数',
					dataIndex : 'changeTime',
					sortable : true
				}, {
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, grid) {
						var h;
						if (grid.data.editable || user.role.id != 3)
							h = "<input type=\"button\" value=\"删除\" onclick=\"Aok.UI.AccessoryOrderDel('"
									+ v + "')\">";
						else
							h = '不可编辑';
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
							var f = new Aok.UI.AccessoryOrderDetailForm();
							// var accessory_grid = new
							// Aok.UI.OrderAccessoryGrid();
							var tmp=Ext.getCmp('accessory-order-detail-win');
							var win = new Sp.Window({
										id : 'accessory-order-detail-win',
										width : 700,
										title : '新建配件订单 ',
										items : [f]
									});
							win.show();
							//win.setHeight(f.getHeight()+40);
						}
					}, {
						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('accessory-order-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								// var tmp=clone(rd.data);
								var f = new Aok.UI.AccessoryOrderDetailForm({
											'data' : rd.data
										});
								var accessory_change_grid = new Aok.UI.AccessoryChangeGrid(
										{
											'oid' : rd.data.id,
											editable : rd.data.editable
										});
								var win = new Sp.Window({
											id : 'accessory-order-detail-win',
											width : 700,
											title : '编辑配件订单',
											items : [f, accessory_change_grid]
										});
								win.doLayout();
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
		Aok.UI.AccessoryOrderGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.AccessoryOrderGrid.superclass.initComponent.call(this);
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
					url : '../accessory/order/list.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'placeStoreName', 'takeStoreName',
							'placeDate', 'takeStore', 'placeStore', 'takeDate',
							'operator', 'placeStoreTel', 'editable',
							'changeTime'],
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
							var zone = Ext.getCmp('aoqf-zone').getValue();
							var placeStoreId = Ext.getCmp('aoqf-ps').getValue();
							var takeStoreId = Ext.getCmp('aoqf-ts').getValue();
							var oid = Ext.getCmp('aoqf-oid').getValue();
							var date = Ext.getCmp('aoqf-date').value;
							var time = Ext.getCmp('aoqf-time').getValue();
							var mod=Ext.getCmp('aoqf-modified').checked;
							this.baseParams = {
								limit : ORDER_PAGE_SIZE,
								'oqp.zone' : zone,
								'oqp.placeStoreId' : placeStoreId,
								'oqp.takeStoreId' : takeStoreId,
								'oqp.oid' : oid,
								'oqp.takeDate' : date,
								'oqp.takeTime' : time,
								'oqp.modified':mod
							}
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('accessory-order-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('accessory-order-grid');
		return g.store;
	}
});

Aok.UI.AccessoryOrderDetailForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75,
		id : 'accessory-order-detail-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		items : [{
			layout : "column",

			items : [{
				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				hidden : user.role.id != 3,
				id : 'aodf-from-ps',
				items : [{
					xtype : 'hidden',
					id : 'aodf-hd-psId',
					value : data && data.palceStore
							? data.placeStore.id
							: (user.aokUser.store ? user.aokUser.store.id : ''),
					disabled : user.role.id != 3,
					name : 'order.placeStore.id'
				}, {
					fieldLabel : '下单门店',
					xtype : 'textfield',
					id : 'aodf-txt-psn',
					value : data && data.placeStore
							? data.placeStore.name
							: (user.aokUser.store
									? user.aokUser.store.name
									: null),
					disabled : user.role.id != 3 || data,
					hideLabel : user.role.id != 3,
					hidden : user.role.id != 3,
					name : 'order.placeStoreName'
				}]
			}, {
				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				hidden : user.role.id == 3,
				id : 'aodf-cb-ps',
				items : [{
					xtype : 'hidden',
					id : 'codf-hd-psn',
					value : data && data.placeStore
							? data.placeStore.name
							: undefined,
					disabled : user.role.id == 3,
					name : 'order.placeStoreName'
				}, {
					id : 'aodf-cb-psid',
					hiddenValue : data && data.placeStore
							? data.placeStore.id
							: '',
					value : data && data.placeStore
							? data.placeStore.name
							: undefined,
					disabled : user.role.id == 3 || data,
					hideLabel : user.role.id == 3,
					hidden : user.role.id == 3,
					name : 'order.palceStore.id',
					xtype : 'combo',
					fieldLabel : '下单门店',
					blankText : '下单门店不能为空',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hiddenName : 'order.placeStore.id',
					listeners : {
						"select" : function(a, b) {
							Ext.getCmp('codf-hd-psn')
									.setValue(this.lastSelectionText);
						}
					},
					allowBlank : false,
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
										} else if (user.role.id == 3) {
											this.baseParams = {
												'fid' : user.aokUser.store.factory.id
											};
										}
									}
								}
							})

				}]

			}, {
				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				// hidden : user.role.id == 3,
				items : [{
					xtype : 'hidden',
					id : 'codf-hd-tsn',
					value : data && data.takeStore
							? data.takeStore.name
							: (user.role.id == 3
									? user.aokUser.store.name
									: null),
					name : 'order.takeStoreName'
				}, {
					id : 'aodf-cb-tsid',
					hiddenValue : data && data.takeStore
							? data.takeStore.id
							: (user.role.id == 3 ? user.aokUser.store.id : null),
					value : data && data.takeStore
							? data.takeStore.name
							: (user.role.id == 3
									? user.aokUser.store.name
									: undefined),
					name : 'order.takeStore.id',
					xtype : 'combo',
					fieldLabel : '取货门店',
					blankText : '取货门店不能为空',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hiddenName : 'order.takeStore.id',
					disabled : data,
					// hideLabel : user.role.id == 3,
					// hidden : user.role.id == 3,
					listeners : {
						"select" : function() {
							Ext.getCmp('codf-hd-tsn')
									.setValue(this.lastSelectionText);
						}
					},
					allowBlank : false,
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
										} else if (user.role.id == 3) {
											this.baseParams = {
												'fid' : user.aokUser.store.factory.id
											};
										}
									}
								}
							})

				}]

			}]

		}, {
			layout : "column",

			items : [{

				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				items : [{
					id : 'aodf-data-pd',
					fieldLabel : '落单时间',
					xtype : 'datetimefield',
					format : 'Y-m-d H:i:s',
					editable : false,
					disabled : data,
					value : data && data.placeDate ? data.placeDate.replace(
							'T', ' ') : Ext.util.Format.date(new Date(),
							"Y-m-d H:i:s"),
					allowBlank : false,
					blankText : '不能为空',
					name : 'order.placeDate'

				}]

			}, {
				columnWidth : .35,
				layout : "form",
				items : [{
					id : 'aodf-data-td',
					fieldLabel : '取货时间',
					width : 120,
					disabled : data,
					format : 'Y-m-d',
					xtype : 'datefield',
					value : data && data.takeDate ? data.takeDate.replace(
							'T00\:00\:00', '') : getNextDate(1),
					name : 'order.takeDate',
					allowBlank : false,
					blankText : '不能为空'
				}]

			}, {
				columnWidth : .15,
				items : [{
							id : 'aodf-txt-tt',
							xtype : 'combo',
							labelWidth : 0,
							width : 60,
							hideLable : true,
							value : data && data.takeTime
									? data.takeTime
									: '12:00',
							hiddenName : 'order.takeTime',
							mode : 'local',
							disabled : data,
							editable : false,
							triggerAction : 'all',
							displayField : 'text',
							valueField : 'text',
							allowBlank : false,
							blankText : '不能为空',
							store : new Ext.data.ArrayStore({
										fields : ['text'],
										data : [['12:00'], ['18:00']]
									})
						}]

			}]

		}, {
			layout : "column",

			items : [{

				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				items : [{
					id : 'aodf-txt-placeStoreTel',
					fieldLabel : '门店电话',
					xtype : 'textfield',
					disabled : data,
					value : data ? data.placeStoreTel : user.aokUser.store
							? user.aokUser.store.tel
							: undefined,
					name : 'order.placeStoreTel',
					allowBlank : true
				}]

			}, {
				columnWidth : .5,
				layout : "form",
				defaults : {
					width : 200
				},
				items : [{
							id : 'aodf-txt-operator',
							fieldLabel : '经办人',
							xtype : 'textfield',
							disabled : data,
							value : data
									? data.operator
									: user.aokUser.realName,
							name : 'order.operator',
							// allowBlank : false,
							blankText : '不能为空'
						}]

			}]

		}],
		listeners : {
			render:function(){
				//Ext.getCmp('accessory-order-detail-win').doLayout();
			}
		},
		buttonAlign : 'center',
		buttons : [{
			id : 'aodf-btn',
			text : data ? '编辑' : '创建',
			iconCls : 'icon-save',
			listeners : {
				beforerender : function() {
					if (data && data.editable == false) {
						if (user.role.id == 3)
							return false;
					}
					return true;
				}
			},
			handler : function(a, b, c) {
				if (Ext.getCmp('aodf-btn').text == '编辑') {
					Ext.getCmp('aodf-btn').setText('保存');
					setEnable();
					return;
				}
				var f = Ext.getCmp('accessory-order-detail-form');
				var win = Ext.getCmp('accessory-order-detail-win');
				f.submit('../accessory/order/save.do', data ? {
							'order.id' : data.id
						} : null, data ? win : null, function(res) {
							if (res.success) {
								if (!res.data) {
									Sp.MessageBox('保存成功!');
								} else {
									Ext.getCmp('aodf-btn').hide();
									Ext.getCmp('accessory-order-detail-form').data = res.data;
									/*
									 * win.add(new Aok.UI.AccessoryChangeGrid({
									 * oid : res.data.id, editable :
									 * res.data.editable }));
									 */
									var oid=res.data.id;
									Ext.MessageBox.wait("正在读取数据,请稍侯...");
									Ajaxx(
											'../accessory/order/list_accessories.do',
											{
												'oid' : oid
											}, function(res) {
												Ext.MessageBox.hide();
												if (res.success) {
													var f = new Aok.UI.OrderAccessoryTabForm(
															{
																oid : oid,
																editable : true,
																productTypes : res.productTypes,
																accessories : res.data,
																products : res.products,
																addmode:true,
																height:400
															});
													win.add(f);
													win.title = '编辑配件订单';
													win.doLayout();
												} else {
													Sp.MessageBox(
															res.exception,
															'error');
												}
											});
									// Ext.getCmp("am-btn").show();
									// Ext.getCmp("am-btn").oid=res.data.id;
									// Ext.getCmp("am-btn").editable=true;
								}
								Ext.getCmp('accessory-order-grid').getStore()
										.reload();
								win.doLayout();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}, {
			id : 'am-btn',
			text : '配件管理',
			iconCls : 'icon-save',
			hidden : data ? false : true,
			oid : data ? data.id : null,
			editable : user.role.id != 3
					? true
					: (data ? data.editable : false),
			handler : function(a, b, c) {
				// var g = Ext.getCmp('accessory-change-grid');
				var oid = this.oid;
				var editable = this.editable;
				Ext.MessageBox.wait("正在读取数据,请稍侯...");
				Ajaxx('../accessory/order/list_accessories.do', {
							'oid' : oid
						}, function(res) {
							Ext.MessageBox.hide();
							if (res.success) {
								var f = new Aok.UI.OrderAccessoryTabForm({
											oid : oid,
											editable : editable,
											productTypes : res.productTypes,
											accessories : res.data,
											products : res.products
										});
								var win = new Sp.Window({
											width : 900,
											// height:500,
											id : 'accessory-manager-win',
											title : '配件管理',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});

			}
		}]
	};
	var setEnable = function() {
		if (user.role.id == 3) {
			Ext.getCmp('aodf-txt-psn').setDisabled(false);
		} else {
			Ext.getCmp('aodf-cb-psid').setDisabled(false);
		}
		Ext.getCmp('aodf-cb-tsid').setDisabled(false);
		Ext.getCmp('aodf-data-pd').setDisabled(false);
		Ext.getCmp('aodf-data-td').setDisabled(false);
		Ext.getCmp('aodf-txt-tt').setDisabled(false);
		Ext.getCmp('aodf-txt-placeStoreTel').setDisabled(false);
		Ext.getCmp('aodf-txt-operator').setDisabled(false);
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.AccessoryOrderDetailForm.superclass.constructor.call(this, config);
};
Ext.extend(Aok.UI.AccessoryOrderDetailForm, Sp.Form);

Aok.UI.OrderAccessoryGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'order-accessory-grid',
		frame : true,
		title : '配件列表',
		autoHeight : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [{
					header : '类型',
					dataIndex : 'product.type',
					sortable : true
				}, {
					header : '名称',
					dataIndex : 'product.name',
					sortable : true
				}, {
					header : '数量',
					dataIndex : 'qty',
					sortable : true
				}, {
					header : '单位',
					dataIndex : 'product.unit',
					sortable : true
				}, {
					header : '备注',
					dataIndex : 'remark',
					sortable : true
				}, {
					id : '',
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, grid) {
						var h;
						var g = Ext.getCmp('order-accessory-grid');
						if (g.editable || user.role.id != 3)
							h = "<input type='button' value='删除' onclick='Aok.UI.OrderAccessoryDel("
									+ v + ")'>";
						else
							h = '不可编辑';
						return h;
					}
				}],
		tbar : {
			style : 'padding:2px 10px;',
			defaults : {
				xtype : 'button'
			},
			listeners : {
				beforerender : function() {
					return true;
				}
			},
			items : [{
						xtype : 'button',
						text : '新增',
						iconCls : 'icon-add',
						listeners : {
							beforerender : function() {
								var g = Ext.getCmp('order-accessory-grid');
								if (g.editable == false) {
									if (user.role.id == 3)
										return false;
								}
								return true;
							}
						},
						handler : function() {
							var data = Ext
									.getCmp('accessory-order-detail-form').data;
							if (data == null || data.id == ''
									|| data.id == null) {
								Sp.MessageBox('请先录入配件单信息，再新增配件', 'error');
								return;
							}
							var g = Ext.getCmp('order-accessory-grid');
							var f = new Aok.UI.OrderAccessoryForm({
										oid : g.oid
									});
							var win = new Sp.Window({
										width : 400,
										id : 'order-accessory-win',
										title : '配件管理',
										items : [f]
									});
							win.show();
						}
					}, {

						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						listeners : {
							beforerender : function() {
								var g = Ext.getCmp('order-accessory-grid');
								if (g.editable == false) {
									if (user.role.id == 3)
										return false;
								}
								return true;
							}
						},
						handler : function() {
							var s = Ext.getCmp('order-accessory-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var record = s.getSelected();
								// var
								// record=Ext.getCmp('order-status-grid').getStore().getAt(0);
								var f = new Aok.UI.OrderAccessoryForm({
											data : record.data
										});
								var win = new Sp.Window({
											width : 400,
											id : 'order-accessory-win',
											title : '配件管理',
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
			pageSize : 10
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Aok.UI.OrderAccessoryGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.OrderAccessoryGrid.superclass.initComponent.call(this);
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
					url : '../accessory/order/list_accessories.do',
					baseParams : {
						'oid' : this.oid
					},
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'oid', 'qty', 'remark', 'product.id',
							'product.name', 'product.unit', 'product.type',
							'product.zjCode'],
					autoLoad : true,
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
							if (g.oid == null)
								return false;
						},
						load : function(s) {
							Ext.getCmp('accessory-order-detail-win').doLayout();
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('order-accessory-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('order-accessory-grid');
		return g.store;
	}
});

Aok.UI.OrderAccessoryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75,
		id : 'order-accessory-form',
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
					value : data ? data['product.type'] : '',
					id : 'oaf-pt',
					xtype : 'combo',
					fieldLabel : '商品类型',
					blankText : '商品类型不能为空',
					editable : false,
					triggerAction : 'all',
					displayField : 'value',
					valueField : 'value',
					allowBlank : false,
					store : new Sp.JsonStore({
								autoLoad : false,
								url : '../base/listDict.do?type=PRODUCT_TYPE',
								root : 'data',
								fields : ['key', 'value'],
								listeners : {
									load : function(s) {
										for (var i = 0; i < s.getCount(); i++) {
											if (s.getAt(i).get('key') == 'CAKE') {
												s.removeAt(i);
											}
										}
									}
								}
							}),
					listeners : {
						select : function(cmp, a, b) {
							var cmp_p = Ext.getCmp('oaf-p');
							cmp_p.setValue('');
							cmp_p.getStore().reload();
						}
					}
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
					hiddenValue : data ? data['product.id'] : '',
					value : data ? data['product.name'] : '',
					xtype : 'combo',
					id : 'oaf-p',
					fieldLabel : '商品',
					blankText : '商品不能为空',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hiddenName : 'accessory.product.id',
					allowBlank : false,
					store : new Sp.JsonStore({
								autoLoad : false,
								url : '../product/list.do',
								root : 'data',
								fields : ['id', 'name'],
								listeners : {
									beforeload : function() {
										var pt = Ext.getCmp('oaf-pt')
												.getValue();
										if (pt == undefined || pt == '') {
											Sp.MessageBox('请先选择商品类型', 'error')
											return false;
										}
										this.baseParams = {
											'p.type' : pt
										}
									}
								}
							})
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
									fieldLabel : '数量',
									xtype : 'numberfield',
									value : data ? data.qty : '',
									name : 'accessory.qty',
									allowBlank : false,
									decimalPrecision : 2
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
									fieldLabel : '备注',
									xtype : 'textarea',
									value : data ? data.remark : '',
									name : 'accessory.remark',
									allowBlank : true
								}]

					}]

		}],
		buttonAlign : 'center',
		buttons : [{
			id : 'oaf-btn',
			text : data ? '修改' : '添加',
			iconCls : 'icon-save',
			handler : function(a, b, c) {
				var f = Ext.getCmp('order-accessory-form');
				var win = Ext.getCmp('order-accessory-win');
				f.submit('../accessory/order/save_accessory.do', data ? {
							'accessory.id' : data.id,
							'accessory.od.id' : data.oid
						} : {
							'accessory.od.id' : f.oid
						}, win, function(res) {
							if (res.success) {
								Sp.MessageBox('保存成功!');
								Ext.getCmp('order-accessory-grid').getStore()
										.reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	}
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.OrderAccessoryForm.superclass.constructor.call(this, config);
};
Ext.extend(Aok.UI.OrderAccessoryForm, Sp.Form);

Aok.UI.AccessoryOrderDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该订单,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../accessory/order/del.do', {
								'oid' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('accessory-order-grid')
											.getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});
};
Aok.UI.OrderAccessoryDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该配件,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../accessory/order/del.do', {
								'aid' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('order-accessory-grid')
											.getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});
};