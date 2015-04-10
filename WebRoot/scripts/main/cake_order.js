Aok.UI.CakeOrderMng = function(itemConfig) {
	var config = {
		autoHeight : true,
		anchor : '100%',
		title : '蛋糕订单管理',
		viewConfig : {
		// forceFit:true
		},
		autoScroll : true,
		items : [new Aok.UI.CakeOrderGrid]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.CakeOrderMng.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeOrderMng, Ext.Panel);

Aok.UI.CakeOrderQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'cake-order-query-form',
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
						hidden : user.role.id != 1&&user.role.id != 4,
						items : [{
									id : 'coqf-zone',
									xtype : 'combo',
									fieldLabel : '地区',
									triggerAction : 'all',
									displayField : 'value',
									valueField : 'value',
									hiddenField:'value',
									hiddenName : 'oqp.placeStore',
									hideLabel : user.role.id != 1&&user.role.id != 4,
									hidden : user.role.id != 1&&user.role.id != 4,
									desabled : user.role.id != 1&&user.role.id != 4,
									store : new Sp.JsonStore({
												autoLoad : false,
												url : '../base/listDict.do?type=ZONE',
												root : 'data',
												fields : ['value']
											})
								}]
					}, {
						columnWidth : .32,
						layout : "form",
						defaults : {
							width : 230
						},
						items : [{
									name : 'order.deliveryMan',
									id : 'coqf-cake',
									xtype : 'combo',
									fieldLabel : '蛋糕',
									editable : false,
									triggerAction : 'all',
									displayField : 'name',
									valueField : 'id',
									store : new Sp.JsonStore({
												autoLoad : false,
												url : '../product/list.do?limit=1000',
												baseParams : {
													'p.type' : '蛋糕'
												},
												root : 'data',
												fields : ['id', 'name']
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
					id : 'coqf-ps',
					xtype : 'combo',
					fieldLabel : '下单门店',
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					editable : false,
					hideLabel : user.role.id == 3,
					hidden : user.role.id == 3,
					desabled : user.role.id == 3,
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
					id : 'coqf-ts',
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
									id : 'coqf-oid',
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
									id : 'coqf-date',
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
							id : 'coqf-time',
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

		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var g = Ext.getCmp('cake-order-grid');
						g.getStore().reload();
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.CakeOrderQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.CakeOrderQueryForm, Sp.Form);

Aok.UI.CakeOrderGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'cake-order-grid',
		frame : true,
		// title : '基础数据管理',
		autoHeight : true,
		// height : 500,
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
						}), 
				new Ext.grid.RowNumberer(), {
					header : '编号',
					dataIndex : 'id',
					sortable : true
				},{
					dataIndex : 'printed',
					sortable : true,
					width: 40,
					renderer:function(value){
						if(value==null||value==false)
							return "未打印";
						else
							return "<span style='color:red'>已打印</span>"
					}
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
					header : '客户姓名',
					dataIndex : 'customerName',
					sortable : true
				}, {
					header : '客户电话',
					dataIndex : 'customerTel',
					sortable : true
				}, {
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, grid) {
						var h;
						if (grid.data.editable || user.role.id != 3)
							h = "<input type=\"button\" value=\"删除\" onclick=\"Aok.UI.CakeOrderDel('"
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
							var f = new Aok.UI.CakeOrderDetailForm();
							var win = new Sp.Window({
										id : 'cake-order-detail-win',
										width : 700,
										title : '新建蛋糕订单',
										items : [f]
									});
							win.show();
						}
					}, {
						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('cake-order-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								// var tmp=clone(rd.data);
								var f = new Aok.UI.CakeOrderDetailForm({
											data : rd.data
										});
								var changeGrid = new Aok.UI.CakeOrderChangeGrid(
										{
											oid : rd.data.id,
											editable : rd.data.editable
										});
								var win = new Sp.Window({
											id : 'cake-order-detail-win',
											width : 700,
											title : '编辑蛋糕订单',
											items : [f, changeGrid]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}, {
						xtype : 'button',
						text : '选择打印',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('cake-order-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var tempForm = document.createElement("form");
								tempForm.id = "tempForm1";
								tempForm.method = "post";
								tempForm.action = "../cake/order/print.jspx";
								tempForm.target = "hello";
								for (var i = 0; i < s.getSelections().length; i++) {
									var hideInput = document
											.createElement("input");
									hideInput.type = "hidden";
									hideInput.name = "ids[" + i + "]"
									hideInput.value = s.getSelections()[i].data.id;
									tempForm.appendChild(hideInput);
								}
								$(tempForm).submit(function() {
											window.open('about:blank', "hello");
										});
								document.body.appendChild(tempForm);
								tempForm.submit();
								document.body.removeChild(tempForm);
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}, {
						xtype : 'button',
						text : '打印查询结果',
						iconCls : 'icon-edit',
						handler : function() {
							var zone = Ext.getCmp('coqf-zone').getValue();
							var cakeId = Ext.getCmp('coqf-cake').getValue();
							var placeStoreId = Ext.getCmp('coqf-ps').getValue();
							var takeStoreId = Ext.getCmp('coqf-ts').getValue();
							var oid = Ext.getCmp('coqf-oid').getValue();
							var date = Ext.getCmp('coqf-date').value;
							var time = Ext.getCmp('coqf-time').getValue();
							Sp.WinPostOpen('../cake/order/print.jspx', {
										'oqp.zone' : zone,
										'oqp.cakeId' : cakeId,
										'oqp.placeStoreId' : placeStoreId,
										'oqp.takeStoreId' : takeStoreId,
										'oqp.oid' : oid,
										'oqp.takeDate' : date,
										'oqp.takeTime' : time
									}, 'cake-order-search-print');
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
		Aok.UI.CakeOrderGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.CakeOrderGrid.superclass.initComponent.call(this);
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
							'placeStore', 'takeStore', 'placeStoreTel', 'cake',
							'cake.name', 'placeDate', 'takeDate', 'takeTime',
							'greeting', 'customerName', 'customerTel',
							'operator', 'hasPaid', 'deposit', 'plain', 'group',
							'bfCode', 'request','orglNo', 'editable','printed'],
					listeners : {
						beforeload : function() {
							var zone = Ext.getCmp('coqf-zone').getValue();
							var cakeId = Ext.getCmp('coqf-cake').getValue();
							var placeStoreId = Ext.getCmp('coqf-ps').getValue();
							var takeStoreId = Ext.getCmp('coqf-ts').getValue();
							var oid = Ext.getCmp('coqf-oid').getValue();
							var date = Ext.getCmp('coqf-date').value;
							var time = Ext.getCmp('coqf-time').getValue();
							this.baseParams = {
								limit : ORDER_PAGE_SIZE,
								'oqp.zone' : zone,
								'oqp.cakeId' : cakeId,
								'oqp.placeStoreId' : placeStoreId,
								'oqp.takeStoreId' : takeStoreId,
								'oqp.oid' : oid,
								'oqp.takeDate' : date,
								'oqp.takeTime' : time
							};
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('cake-order-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('cake-order-grid');
		return g.store;
	}
});

Aok.UI.CakeOrderDetailForm = function(itemConfig) {
	var shipment = itemConfig ? itemConfig.shipment : false;
	var btnText = itemConfig ? itemConfig.btnText : null;
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75,
		id : 'cake-order-detail-form',
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
				id : 'codf-from-ps',
				items : [{
					xtype : 'hidden',
					id : 'codf-hd-psId',
					value : data && data.palceStore
							? data.placeStore.id
							: (user.aokUser.store
									? user.aokUser.store.id
									: null),
					disabled : shipment || user.role.id != 3,
					name : 'order.placeStore.id'

				}, {
					fieldLabel : '下单门店',
					xtype : 'textfield',
					id : 'codf-txt-psn',
					editable : false,
					value : data ? data.placeStoreName : (user.aokUser.store
							? user.aokUser.store.name
							: undefined),
					disabled : shipment || user.role.id != 3||data,
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
				id : 'codf-cb-ps',
				items : [{
							xtype : 'hidden',
							id : 'codf-hd-psn',
							value : data ? data.placeStoreName : null,
							disabled : shipment || user.role.id == 3,
							name : 'order.placeStoreName'
						}, {
							id:'codf-cbb-psid',
							hiddenValue : data && data.placeStore
									? data.placeStore.id
									: null,
							value : data ? data.placeStoreName : undefined,
							disabled : shipment || user.role.id == 3 ||data,
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
				items : [{
					xtype : 'hidden',
					id : 'codf-hd-tsn',
					value : data ? data.takeStoreName : (user.role.id == 3
							? user.aokUser.store.name
							: null),
					name : 'order.takeStoreName'
				}, {
					id:'codf-cbb-tsid',
					value : data ? data.takeStoreName : (user.role.id == 3
							? user.aokUser.store.name
							: undefined),
					hiddenValue : data && data.takeStore
							? data.takeStore.id
							: (user.role.id == 3 ? user.aokUser.store.id : undefined),
					disabled : shipment ||data,
					name : 'order.takeStore.id',
					xtype : 'combo',
					fieldLabel : '取货门店',
					blankText : '取货门店不能为空',
					editable : false,
					triggerAction : 'all',
					displayField : 'name',
					valueField : 'id',
					hiddenName : 'order.takeStore.id',
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
					id:'codf-date-pd',
					fieldLabel : '落单时间',
					xtype : 'datetimefield',
					format : 'Y-m-d H:i:s',
					editable : false,
					value : data && data.placeDate ? data.placeDate.replace(
							'T', ' ') : Ext.util.Format.date(new Date(),
							"Y-m-d H:i:s"),
					disabled : shipment ||data,
					allowBlank : false,
					blankText : '不能为空',
					name : 'order.placeDate'

				}]

			}, {
				columnWidth : .35,
				layout : "form",
				items : [{
					id:'codf-date-td',
					fieldLabel : '取货时间',
					width : 120,
					format : 'Y-m-d',
					xtype : 'datefield',
					value : data && data.takeDate ? data.takeDate.replace(
							'T00\:00\:00', '') : getNextDate(1),
					disabled : shipment ||data,
					name : 'order.takeDate',
					allowBlank : false,
					blankText : '不能为空'
				}]

			}, {
				columnWidth : .15,
				items : [{
							id:'codf-cb-tt',
							xtype : 'combo',
							labelWidth : 0,
							width : 60,
							hideLable : true,
							value : data && data.takeTime
									? data.takeTime
									: '12:00',
							disabled : shipment ||data,
							hiddenName : 'order.takeTime',
							mode : 'local',
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
							value : data && data.cake ? data.cake.name : undefined,
							hiddenValue : data && data.cake
									? data.cake.id
									: undefined,
							disabled : shipment ||data,
							id : 'odf-cake',
							xtype : 'combo',
							fieldLabel : '蛋糕',
							blankText : '蛋糕不能为空',
							editable : false,
							triggerAction : 'all',
							displayField : 'name',
							valueField : 'id',
							hiddenName : 'order.cake.id',
							allowBlank : false,
							store : new Sp.JsonStore({
										autoLoad : false,
										url : '../product/list.do?limit=1000',
										baseParams : {
											'p.type' : '蛋糕'
										},
										root : 'data',
										fields : ['id', 'name'],
										listeners : {
											beforeload : function() {
												// return
												// $.inArray('/order1/detailForm',
												// permissions) > -1
												// ? true
												// : false;
											}
										}
									})

						}]

			}, {
				columnWidth : .25,
				layout : "form",
				items : [{
							fieldLabel : '原单号',
							id:'codf-txt-orglNo',
							width : 80,
							xtype : 'textfield',
							value : data ? data.orglNo : undefined,
							disabled : shipment ||data,
							name : 'order.orglNo',
							blankText : '原单号不能为空',
							maxLength:20,
							maxLengthText:'原单号长度不能超过20位',
							allowBlank : false
						}]
			}, {
				columnWidth : .25,
				layout : "form",
				items : [{
							value : data ? data.bfCode : '原味',
							width : 80,
							disabled : shipment ||data,
							name : 'order.bfCode',
							id : 'codf-bf',
							xtype : 'combo',
							fieldLabel : '裱花编号',
							editable : true,
							triggerAction : 'all',
							displayField : 'key',
							valueField : 'key',
							hiddenName : 'order.bfCode',
							allowBlank : false,
							store : new Sp.JsonStore({
										autoLoad : false,
										url : '../base/listDict.do?type=CAKE_PATTERN&limit=1000',
										root : 'data',
										fields : ['key'],
										listeners : {
											load : function(s) {
												var Patten = Ext.data.Record
														.create([{
																	name : 'key'
																}]);
												var record_g = new Patten({
															key : '团购'
														});
												var record_p = new Patten({
															key : '原味'
														});
												s.insert(0, record_g);
												s.insert(0, record_p);
											}
										}
									})

						}]

			}]

		},{
					layout : "column",

					items : [{

								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											id:'cobf-txt-greeting',
											fieldLabel : '贺词',
											value : data ? data.greeting : '生日快乐！',
											disabled : shipment ||data,
											xtype : 'textarea',
											name : 'order.greeting'
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											id:'cobf-txt-request',
											fieldLabel : '特别要求',
											xtype : 'textarea',
											value : data ? data.request : null,
											disabled : shipment ||data,
											name : 'order.request'
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
											id:'cobf-txt-customerName',
											fieldLabel : '客户姓名',
											xtype : 'textfield',
											value : data
													? data.customerName
													: undefined,
											disabled : shipment ||data,
											name : 'order.customerName',
											allowBlank : false
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											id:'cobf-txt-customerTel',
											fieldLabel : '客户电话',
											xtype : 'textfield',
											value : data
													? data.customerTel
													: undefined,
											disabled : shipment ||data,
											name : 'order.customerTel',
											allowBlank : false,
											blankText : '不能为空'
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
							id:'cobf-txt-placeStoreTel',
							fieldLabel : '门店电话',
							xtype : 'textfield',
							value : data
									? data.placeStoreTel
									: user.aokUser.store
											? user.aokUser.store.tel
											: '',
							disabled : shipment ||data,
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
							id:'cobf-txt-operator',
							fieldLabel : '经办人',
							xtype : 'textfield',
							value : data
									? data.operator
									: user.aokUser.realName,
							disabled : shipment ||data,
							name : 'order.operator',
							blankText : '不能为空'
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
									id:'cobf-cb-hasPaid',
									fieldLabel : '是否已付款',
									xtype : 'checkbox',
									name : 'order.hasPaid',
									inputValue : 'true',
									disabled : shipment ||data,
									checked : data && data.hasPaid
											? true
											: false
								}]

					}, {
						columnWidth : .5,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
									id:'cobf-txt-deposit',
									fieldLabel : '付款金额',
									xtype : 'numberfield',
									value : data ? data.deposit : null,
									disabled : shipment ||data,
									name : 'order.deposit'
								}]

					}]

				}, {
					layout : "column",
					hidden : !shipment,
					items : [{

						columnWidth : .5,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
							fieldLabel : '送货时间',
							xtype : 'datefield',
							format : 'Y-m-d H:i:s',
							editable : false,
							value : data && data.sendDate ? data.sendDate
									.replace('T', ' ') : Ext.util.Format.date(
									new Date(), "Y-m-d H:i:s"),
							disabled : !shipment,
							name : 'order.sendDate',
							allowBlank : false
						}]

					}, {
						columnWidth : .5,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
							fieldLabel : '送货人',
							xtype : 'textfield',
							value : data
									? data.operator
									: user.aokUser.realName,
							disabled : !shipment,
							name : 'order.sendMan',
							allowBlank : false,
							blankText : '不能为空'
						}]

					}]

				}, {
					layout : "column",
					hidden : !shipment,
					items : [{

								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '送货备注',
											value : data
													? data.sendRemark
													: null,
											disabled : !shipment,
											xtype : 'textarea',
											name : 'order.sendRemark'
										}]

							}]

				}],
		buttonAlign : 'center',
		buttons : [{
			id : 'codf-btn',
			text : btnText ? btnText : (data ? '编辑' : '创建'),
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
			handler : function() {
				if(Ext.getCmp('codf-btn').text=='编辑'){
					Ext.getCmp('codf-btn').setText('保存');
					setEnable();
					return;
				}
				Ext.getCmp('codf-btn').setText('保存');
				var f = Ext.getCmp('cake-order-detail-form');
				var win = Ext.getCmp('cake-order-detail-win');
				var url = '../cake/order/save.do';
				if (btnText) {
					if (btnText == '标记已送')
						url = '../cake/shipment/send.do';
					if (btnText == '取消已送') {
						url = '../cake/shipment/unsend.do';
					}
				}
				var orderid=null;
				if(data) 
					orderid=data.id;
				else if(f.data) 
					orderid=f.data.id;
				f.submit(url,orderid ? {
							'order.id' : orderid
						} : null, data ? win : null, function(res) {
							if (res.success) {
								//debugger;
								if (res.send) {
									Ext.getCmp('cake-order-shipment-grid')
											.getStore().reload();
									Sp.MessageBox('送货成功!');
									return;
								}
								if (res.unsend) {
									Ext.getCmp('cake-order-shipment-grid')
											.getStore().reload();
									Sp.MessageBox('取消送货成功!');
									return;
								}
								if (!res.data) {
									Ext.getCmp('cake-order-grid').getStore()
											.reload();
									Ext.getCmp('codf-c-btn').show();
									Sp.MessageBox('保存成功!');
								} else {
									Ext.getCmp('codf-btn').setText('保存');
									Ext.getCmp('cake-order-detail-form').data = res.data;
									win.add(new Aok.UI.CakeOrderChangeGrid({
												oid : res.data.id
											}));
									Ext.getCmp('codf-c-btn').show();
									win.doLayout();
									win.title = '编辑蛋糕订单';
									Ext.getCmp('cake-order-grid').getStore()
											.reload();
								}
								Ext.getCmp('cake-order-grid').getStore()
										.reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		},{
			id : 'codf-c-btn',
			text : '继续新增',
			iconCls : 'icon-save',
			hidden:data?false:true,
			handler:function(){
				var win = Ext.getCmp
				('cake-order-detail-win');
				win.close();
				var f = new Aok.UI.CakeOrderDetailForm();
				win = new Sp.Window({
							id : 'cake-order-detail-win',
							width : 700,
							title : '新建蛋糕订单',
							items : [f]
						});
				win.show();
			}
		}]
	}
	var setEnable=function(){
		if(user.role.id == 3){
			Ext.getCmp('codf-txt-psn').setDisabled(false);
		}else{
			Ext.getCmp('codf-cbb-psid').setDisabled(false);
		}
		Ext.getCmp('codf-cbb-tsid').setDisabled(false);
		Ext.getCmp('codf-date-pd').setDisabled(false);
		Ext.getCmp('codf-date-td').setDisabled(false);
		Ext.getCmp('codf-cb-tt').setDisabled(false);
		Ext.getCmp('odf-cake').setDisabled(false);
		Ext.getCmp('codf-txt-orglNo').setDisabled(false);
		Ext.getCmp('codf-bf').setDisabled(false);
		Ext.getCmp('codf-txt-orglNo').setDisabled(false);
		Ext.getCmp('cobf-txt-greeting').setDisabled(false);
		Ext.getCmp('cobf-txt-request').setDisabled(false);
		Ext.getCmp('cobf-txt-customerName').setDisabled(false);
		Ext.getCmp('cobf-txt-customerTel').setDisabled(false);
		Ext.getCmp('cobf-txt-placeStoreTel').setDisabled(false);
		Ext.getCmp('cobf-txt-operator').setDisabled(false);
		Ext.getCmp('cobf-cb-hasPaid').setDisabled(false);
		Ext.getCmp('cobf-txt-deposit').setDisabled(false);
	}
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.CakeOrderDetailForm.superclass.constructor.call(this, config);
};
Ext.extend(Aok.UI.CakeOrderDetailForm, Sp.Form);

Aok.UI.CakeOrderChangeGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'cake-order-change-grid',
		frame : true,
		title : '变更内容',
		autoHeight : true,
		// height : 500,
		autoScoll : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [new Ext.grid.RowNumberer(), {
					header : '变更内容',
					dataIndex : 'content',
					sortable : true
				}, {
					header : '变更时间',
					dataIndex : 'changeDate',
					sortable : true
				}, {
					header : '操作人',
					dataIndex : 'operator',
					sortable : true
				}, {
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, grid) {
						var h;
						var g=Ext.getCmp('cake-order-change-grid');
						if (g.editable || user.role.id != 3)
							h = "<input type='button' value='删除' onclick='Aok.UI.CakeOrderChangeDel("
									+ v + ")'>";
						else
							h = "不可编辑";
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
						listeners : {
							beforerender : function() {
								var g = Ext.getCmp('cake-order-change-grid');
								if (g.editable == false) {
									if (user.role.id == 3)
										return false;
								}
								return true;
							}
						},
						handler : function() {
							var g = Ext.getCmp('cake-order-change-grid');
							var f = new Aok.UI.CakeOrderChangeForm({
										oid : g.oid
									});
							var win = new Sp.Window({
										id : 'cake-order-change-win',
										width : 400,
										title : '新建变更',
										items : [f]
									});
							win.show();
						}
					}, {
						xtype : 'button',
						text : '修改',
						iconCls : 'icon-edit',
						listeners : {
							beforerender : function() {
								var g = Ext.getCmp('cake-order-change-grid');
								if (g.editable == false) {
									if (user.role.id == 3)
										return false;
								}
								return true;
							}
						},
						handler : function() {
							var s = Ext.getCmp('cake-order-change-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								var f = new Aok.UI.CakeOrderChangeForm({
											data : rd.data
										});
								var win = new Sp.Window({
											id : 'cake-order-change-win',
											width : 400,
											title : '修改变更',
											items : [f]
										});
								win.show();
							} else {
								Sp.MessageBox('请先选择一行记录', 'error');
							}
						}
					}]
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Aok.UI.CakeOrderChangeGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.CakeOrderChangeGrid.superclass.initComponent.call(this);
	},
	init : function() {
		this.store = this.createStore();
		this.initListeners();
	},
	initListeners : function() {// 获取相应部件,进行事件绑定
		this.on('afterrender', this.loadData);
	},
	createStore : function() {
		var g = this;
		return new Sp.JsonStore({
					url : '../cake/order/list_changes.do',
					baseParams : {
						'id' : this.oid
					},
					autoLoad : true,
					root : 'data',
					fields : ['id', 'content', 'operator', 'changeDate', 'oid'],
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
							if (g.oid == null)
								return false;
						},
						load : function(s) {
							Ext.getCmp('cake-order-detail-win').doLayout();
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('cake-order-change-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('cake-order-change-grid');
		return g.store;
	}
});

Aok.UI.CakeOrderChangeForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 75,
		id : 'cake-order-change-form',
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
							fieldLabel : '变更人',
							xtype : 'textfield',
							value : data
									? data.operator
									: user.aokUser.realName,
							name : 'change.operator',
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
					fieldLabel : '取货时间',
					xtype : 'datetimefield',
					value : data && data.changeDate ? data.changeDate.replace(
							'T', ' ') : Ext.util.Format.date(new Date(),
							"Y-m-d H:i:s"),
					name : 'change.changeDate',
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
									fieldLabel : '内容',
									xtype : 'textarea',
									value : data ? data.content : undefined,
									name : 'change.content',
									allowBlank : false
								}]

					}]

		}],
		buttonAlign : 'center',
		buttons : [{
			id : 'oaf-btn',
			text : data ? '修改' : '添加',
			iconCls : 'icon-save',
			handler : function(a, b, c) {
				var f = Ext.getCmp('cake-order-change-form');
				var win = Ext.getCmp('cake-order-change-win');
				f.submit('../cake/order/save_change.do', data ? {
							'change.id' : data.id,
							'change.oid' : data.oid
						} : {
							'change.oid' : f.oid
						}, win, function(res) {
							if (res.success) {
								Sp.MessageBox('保存成功!');
								Ext.getCmp('cake-order-change-grid').getStore()
										.reload();
								Ext.getCmp('cake-order-detail-win').doLayout();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	}
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.CakeOrderChangeForm.superclass.constructor.call(this, config);
};
Ext.extend(Aok.UI.CakeOrderChangeForm, Sp.Form);

Aok.UI.CakeOrderDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该订单,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../cake/order/del.do', {
								'id' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('cake-order-grid').getStore()
											.reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});
};
Aok.UI.CakeOrderChangeDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该变更,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../cake/order/del_change.do', {
								'cId' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('cake-order-change-grid')
											.getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});
};