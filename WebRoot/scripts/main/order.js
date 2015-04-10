// 查询表单
var ORDER_PAGE_SIZE = 16;// 分页
var orderTypeStore = [['一次单'], ['二次单']];
var orderTypeStoreCon = [['一次单'], ['二次单'], ['全部']];
//var orderStatusStore = [['未分派'], ['待处理'], ['成功'], ['失败'], ['改约']];
var orderStatusStore = [['未分派'], ['待处理'], ['成功'], ['失败']];
var orderProductStatusStore = [['待处理'], ['成功'], ['部分缺货']];
var zoneStore = [['莞城'], ['东城'], ['南城'], ['万江'], ['虎门'], ['长安'], ['塘厦'],
		['常平'], ['厚街'], ['凤岗'], ['清溪'], ['寮步'], ['石碣'], ['石龙'], ['樟木头'],
		['中堂'], ['麻涌'], ['大朗'], ['大岭山'], ['道滘'], ['茶山'], ['高步'], ['横沥'],
		['石排'], ['东坑'], ['黄江'], ['桥头'], ['企石'], ['谢岗'], ['沙田'], ['洪梅'], ['望牛墩']];
var selectedDm="";
var barcodeCall = function(barcode) {

	var win = Ext.getCmp('order-edit-win');
	if (win != null) {
		/*Ext.Msg.confirm('提示', '需要先关闭当前窗口才能打开最新窗口,确定关闭?', function(bn) {
			if (bn == 'yes') {} else
				return;
		});*/
		
				win.close();
				//Ext.getCmp('oqf-seqNo').setValue(barcode);
				Ajaxx('../order1/list.do', {
							'order.seqNo' : barcode,
							'order.deliveryNo' : barcode,
							'order.type':Ext.getCmp('oqof-type').getValue()?Ext.getCmp('oqof-type').getValue():'一次单',
							'limit' : ORDER_PAGE_SIZE
						}, function(res) {
							if (res.success) {
								if (Ext.getCmp('oqof-popup').getValue()) {
									if (res.data.length == 0) {
										Express.MessageBox('找不到编号为' + barcode
												+ '的送单');
										return;
									}
									var rd = res.data[0];
									var d = new Express.UI.OrderDetailForm({
												data : res.data[0]
											});

									var pdtList = {
										'totalCount' : 0,
										'products' : []
									};
									var sg = new Express.UI.OrderStatusGrid({
												statusList : {
													'totalCount' : 0,
													'statuses' : []
												}
											});
									var f = new Express.UI.OrderProductGrid({
												productList : pdtList
											});
									var f1 = new Express.UI.OrderFeedbackGrid({
												feedbackList : {
													'totalCount' : 0,
													'feedbacks' : []
												}
											});
									// Express.MessageBox(Ext.getCmp('order-product-grid').productList.get('totalCount'));
									Ajaxx('../order1/getById.do', {
												'oid' : rd.id
											}, function(res) {
												if (res.success) {
													for (i = 0; i < res.data.statuses.length; i++) {
														var sid = res.data.statuses[i].id;
														var happenDate = res.data.statuses[i].happenDate;
														var operator = res.data.statuses[i].operator;
														var status = res.data.statuses[i].status;
														var remark = res.data.statuses[i].remark;
														var s = new Status({
															'happenDate' : happenDate,
															'operator' : operator,
															'remark' : remark,
															'status' : status
														});
														Ext
																.getCmp('order-status-grid')
																.getStore()
																.add(s);
													}
													for (i = 0; i < res.data.products.length; i++) {
														var qty = res.data.products[i].quantity;
														var sentQty = res.data.products[i].sentQuantity;
														var status = res.data.products[i].status;
														var remark = res.data.products[i].remark;
														var p = new Product(
																{
																	'id' : res.data.products[i].id,
																	'productName' : res.data.products[i].productName,
																	'quantity' : qty,
																	'sentQuantity' : sentQty,
																	'status' : status,
																	'remark' : remark
																},
																res.data.products[i].id);
														Ext
																.getCmp('order-product-grid')
																.getStore()
																.add(p);
													}
													for (i = 0; i < res.data.feedbacks.length; i++) {
														var receiver = res.data.feedbacks[i].receiver;
														var feedback = res.data.feedbacks[i].feedback;
														var happenTime = res.data.feedbacks[i].happenTime;
														var id = res.data.feedbacks[i].id;
														var fb = new Feedback({
															'id' : id,
															'receiver' : receiver,
															'feedback' : feedback,
															'happenTime' : happenTime
														}, id);
														Ext
																.getCmp('order-feedback-grid')
																.getStore()
																.add(fb);
													}
												} else {
													Express.MessageBox(
															res.exception,
															'error');
												}
												var win = new Express.Window({
															id : 'order-edit-win',
															title : '送单'
																	+ rd.seqNo
																	+ '详情',
															width : 700,
															height : 500,
															autoScroll : true,
															items : [d, sg, f,
																	f1]
														});
												win.show();
											});
								} else {

								}
								// Ext.getCmp('gift-grid').getStore().reload();
							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});
			
	} else {
		//Ext.getCmp('oqf-seqNo').setValue(barcode);
		Ajaxx('../order1/list.do', {
					'order.seqNo' : barcode,
					'order.deliveryNo' : barcode,
					'order.type':Ext.getCmp('oqof-type').getValue()?Ext.getCmp('oqof-type').getValue():'一次单',
					'limit' : ORDER_PAGE_SIZE
				}, function(res) {
					if (res.success) {
						if (Ext.getCmp('oqof-popup').getValue()) {
							if (res.data.length == 0) {
								Express.MessageBox('找不到编号为' + barcode + '的送单');
								return;
							}
							var rd = res.data[0];
							var d = new Express.UI.OrderDetailForm({
										data : res.data[0]
									});

							var pdtList = {
								'totalCount' : 0,
								'products' : []
							};
							var sg = new Express.UI.OrderStatusGrid({
										statusList : {
											'totalCount' : 0,
											'statuses' : []
										}
									});
							var f = new Express.UI.OrderProductGrid({
										productList : pdtList
									});
							var f1 = new Express.UI.OrderFeedbackGrid({
										feedbackList : {
											'totalCount' : 0,
											'feedbacks' : []
										}
									});
							// Express.MessageBox(Ext.getCmp('order-product-grid').productList.get('totalCount'));
							Ajaxx('../order1/getById.do', {
										'oid' : rd.id
									}, function(res) {
										if (res.success) {
											for (i = 0; i < res.data.statuses.length; i++) {
												var sid = res.data.statuses[i].id;
												var happenDate = res.data.statuses[i].happenDate;
												var operator = res.data.statuses[i].operator;
												var status = res.data.statuses[i].status;
												var remark = res.data.statuses[i].remark;
												var s = new Status({
															'happenDate' : happenDate,
															'operator' : operator,
															'remark' : remark,
															'status' : status
														});
												Ext.getCmp('order-status-grid')
														.getStore().add(s);
											}
											for (i = 0; i < res.data.products.length; i++) {
												var qty = res.data.products[i].quantity;
												var sentQty = res.data.products[i].sentQuantity;
												var status = res.data.products[i].status;
												var remark = res.data.products[i].remark;
												var p = new Product({
													'id' : res.data.products[i].id,
													'productName' : res.data.products[i].productName,
													'quantity' : qty,
													'sentQuantity' : sentQty,
													'status' : status,
													'remark' : remark
												}, res.data.products[i].id);
												Ext
														.getCmp('order-product-grid')
														.getStore().add(p);
											}
											for (i = 0; i < res.data.feedbacks.length; i++) {
												var receiver = res.data.feedbacks[i].receiver;
												var feedback = res.data.feedbacks[i].feedback;
												var happenTime = res.data.feedbacks[i].happenTime;
												var id = res.data.feedbacks[i].id;
												var fb = new Feedback({
															'id' : id,
															'receiver' : receiver,
															'feedback' : feedback,
															'happenTime' : happenTime
														}, id);
												Ext
														.getCmp('order-feedback-grid')
														.getStore().add(fb);
											}
										} else {
											Express.MessageBox(res.exception,
													'error');
										}
										var win = new Express.Window({
													id : 'order-edit-win',
													title : '送单' + rd.seqNo
															+ '详情',
													width : 700,
													height : 500,
													autoScroll : true,
													items : [d, sg, f, f1]
												});
										win.show();
									});
						} else {

						}
						// Ext.getCmp('gift-grid').getStore().reload();
					} else {
						Express.MessageBox(res.exception, 'error');
					}
				});
	}

}
var Status = Ext.data.Record.create([{
			name : 'operator',
			type : 'string'
		}, {
			name : 'happenDate',
			type : 'string'
		}, {
			name : 'remark',
			type : 'string'
		}, {
			name : 'status',
			type : 'string'
		}]);
var Product = Ext.data.Record.create([{
			name : 'id',
			type : 'string'
		}, {
			name : 'productName',
			type : 'string'
		}, {
			name : 'quantity',
			type : 'string'
		}, {
			name : 'sentQuantity',
			type : 'string'
		}, {
			name : 'status',
			type : 'string'
		}, {
			name : 'remark',
			type : 'string'
		}]);
var Feedback = Ext.data.Record.create([{
			name : 'id',
			type : 'string'
		}, {
			name : 'receiver',
			type : 'string'
		}, {
			name : 'feedback',
			type : 'string'
		}, {
			name : 'happenTime',
			type : 'string'
		}]);
// begin-删除订单礼品项
Express.UI.orderDel = function(url, id, gridId) {
	Ext.Msg.confirm('提示', '确定将删除该项记录,请确认', function(bn) {

				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx(url, {
								'id' : id
							}, function(res) {
								if (res.success) {
									Express.MessageBox('删除成功!');
									var store = Ext.getCmp(gridId).getStore();
									store.remove(store.getById(id));
								} else {
									Express.MessageBox(res.exception, 'error');
								}
							});
				}
			});

};
// end

Express.UI.OrderQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'order-query-form',
		frame : true,
		title : '查询条件',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
		// width : 230
		// autoWidth : true
		},
		// defaultType : 'textfield',

		items : [{
			
			layout : "column",

			items : [{
						columnWidth : .15,
						layout : "form",
						defaults : {
						// width : 200
						},
						items : [{
							id : 'oqf-barcode',
							fieldLabel : '开启扫描枪',
							hideLabel : $.inArray('/order1/importData',
									permissions) > -1 ? false : true,
							hidden : $.inArray('/order1/importData',
									permissions) > -1 ? false : true,
							xtype : 'checkbox',
							handler : function() {
								if (Ext.getCmp('oqf-barcode').getValue()) {
									var image = document.createElement("span");
									image.innerHTML = '<APPLET CODE="BarcodeApplet.class" CODEBASE = "." ARCHIVE = "express-barcode.jar,jna.jar, platform.jar" WIDTH="1" HEIGHT="1" id="TheApplet"></APPLET>';
									Ext.getCmp('header').getEl().dom.lastChild.lastChild
											.appendChild(image);
								} else {
									var element = document
											.getElementById("TheApplet");
									element.parentNode.removeChild(element);
								}
							}
						}]
					}, {
						columnWidth : .15,
						layout : "form",
						defaults : {
						// width : 200
						},
						items : [{
							id : 'oqf-popup',
							fieldLabel : '自动弹出窗口',
							hideLabel : $.inArray('/order1/importData',
									permissions) > -1 ? false : true,
							hidden : $.inArray('/order1/importData',
									permissions) > -1 ? false : true,
							xtype : 'checkbox',
							checked : true,
							handler : function() {
								// barcodeCall('01PA0101477');
							}
						}]
					}]			
		},
			{
			layout : "column",

			items : [{
						columnWidth : .32,
						layout : "form",
						items : [{
									xtype : 'combo',
									fieldLabel : '类型',
									width : 230,
									id : 'oqf-type',
									hiddenName : 'order.type',
									name : 'order.type',
									mode : 'local',
									editable : true,
									triggerAction : 'all',
									displayField : 'text',
									valueField : 'text',
									// allowBlank : false,
									store : new Ext.data.ArrayStore({
												fields : ['text'],
												data : orderTypeStoreCon
											}),
									listeners : {
											beforerender : function() {
												this.value=orderTypeStoreCon[0];
												return true;
											}
										}
								}]

					}, {
						columnWidth : .3,
						layout : "form",
						items : [{
							width : 210,
							name : 'order.deliveryMan',
							id : 'oqf-deliveryMan',
							xtype : 'combo',
							fieldLabel : '送单员',
							editable : false,
							triggerAction : 'all',
							displayField : 'realName',
							valueField : 'realName',
							hiddenName : 'order.deliveryMan',
							store : new Express.JsonStore({
										autoLoad : true,
										url : '../user/list.do?roleId=2&limit=1000',// 送单员组
										root : 'data',
										fields : ['realName', 'loginName'],
										listeners : {
											beforeload : function() {
												return $.inArray(
														'/order1/detailForm',
														permissions) > -1
														? true
														: false;
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
						items : [{
									fieldLabel : '领单日期(起)',
									name : 'order.gotDate_start',
									xtype : 'datefield',
									format : 'Y-m-d',
									editable : false,
									width : 230,
									id : 'oqf-gotDate-start'
								}]

					}, {
						columnWidth : .3,
						layout : "form",
						items : [{
									fieldLabel : '领单日期(止)',
									labelAlign : 'center',
									name : 'order.gotDate_end',
									xtype : 'datefield',
									format : 'Y-m-d',
									width : 210,
									editable : false,
									id : 'oqf-gotDate-end'
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
									fieldLabel : '送单申请编号',
									name : 'order.seqNo',
									xtype : 'textfield',
									width : 230,
									id : 'oqf-seqNo'
								}]

					},{
						
						columnWidth : .32,
						layout : "form",
						defaults : {
							width : 210
						},
						items : [{
									fieldLabel : '配送任务编号',
									name : 'order.deliveryNo',
									xtype : 'textfield',
									width : 230,
									id : 'oqf-deliveryNo'
								}]

					
					}]

		}, {
			layout : "column",

			items : [{
						columnWidth : .32,
						layout : "form",
						items : [{
									fieldLabel : '被保险人',
									width : 230,
									xtype : 'textfield',
									name : 'order.assurer',
									id : 'oqf-assurer'
								}]

					}, {
						columnWidth : .3,
						layout : "form",
						items : [{
									fieldLabel : '车牌号',
									width : 210,
									xtype : 'textfield',
									name : 'order.plateNumber',
									id : 'oqf-plateNumber'
								}]

					}]
		}, {
			fieldLabel : '配送地址',
			width : 500,
			xtype : 'textfield',
			name : 'order.address',
			id : 'oqf-address'
		}],
		buttonAlign : 'left',
		buttons : [{
					text : '查询',
					handler : function() {
						var f = Ext.getCmp('order-query-form');
						var g = Ext.getCmp('order-list-grid');
						var type = Ext.getCmp('oqf-type').getValue();
						var seqNo = Ext.getCmp('oqf-seqNo').getValue();
						var deliveryNo = Ext.getCmp('oqf-deliveryNo').getValue();
						var dm = Ext.getCmp('oqf-deliveryMan').getValue();
						var assurer = Ext.getCmp('oqf-assurer').getValue();
						var plateNumber = Ext.getCmp('oqf-plateNumber')
								.getValue();
						var address = Ext.getCmp('oqf-address').getValue();
						var gotDateStart = Ext.getCmp('oqf-gotDate-start').value;
						var gotDateEnd = Ext.getCmp('oqf-gotDate-end').value;
						g.getStore().load({
									params : {
										start : 0,
										limit : ORDER_PAGE_SIZE,
										'order.type' : type,
										'order.seqNo' : seqNo,
										'order.deliveryMan' : dm,
										'order.assurer' : assurer,
										'order.plateNumber' : plateNumber,
										'order.address' : address,
										'order.gotDate_start' : gotDateStart,
										'order.gotDate_end' : gotDateEnd,
										'order.deliveryNo':deliveryNo
									}
								});
					}
				}, {
					text : '重置',
					handler : function() {
						Ext.getCmp('oqf-type').setValue('');
						Ext.getCmp('oqf-seqNo').setValue('');
						Ext.getCmp('oqf-deliveryMan').setValue('');
						Ext.getCmp('oqf-assurer').setValue('');
						Ext.getCmp('oqf-address').setValue('');
						Ext.getCmp('oqf-gotDate-start').setValue('');
						Ext.getCmp('oqf-gotDate-end').setValue('');
						Ext.getCmp('oqf-deliveryNo').setValue('');
					}
				}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderQueryForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.OrderQueryForm, Express.Form);

Express.UI.OrderListPanel =function(itemConfig){
	var config={
        autoHeight : true,
        anchor: '100%',
		viewConfig: {
		     //forceFit:true
		},
        autoScroll:true//,
        //items:[new Express.UI.OrderListGrid()]
        };
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderListPanel.superclass.constructor.call(this, config);
}
Ext.extend(Express.UI.OrderListPanel,Ext.Panel);

// 送单列表
Express.UI.OrderListGrid = Ext.extend(Express.Grid, {
	config : {
		id : 'order-list-grid',
		frame : true,
		title : '送单列表',
		autoHeight : true,
		layout:'fit',
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
					id : 'type',
					header : '送单类型',
					dataIndex : 'type',
					sortable : true
				}, {
					id : 'deliveryNo',
					header : '配送任务编号',
					dataIndex : 'deliveryNo',
					sortable : true
				}, {
					id : 'seqNo',
					header : '送单申请编号',
					dataIndex : 'seqNo',
					sortable : true
				}, {
					id : 'status',
					header : '当前状态',
					dataIndex : 'status',
					sortable : true
				},/*
					 * { id : 'zone', header : '区域', dataIndex : 'zone',
					 * sortable : true },
					 */{
					id : 'deliveryMan',
					header : '送单员',
					dataIndex : 'deliveryMan',
					sortable : true
				}, /*
					 * { id : 'receiver', header : '座席', dataIndex : 'receiver',
					 * sortable : true },
					 */
				{
					id : 'linker',
					header : '联系人',
					dataIndex : 'linker',
					sortable : true
				}, {
					id : 'assurer',
					header : '被保险人',
					dataIndex : 'assurer',
					sortable : true
				}, {
					id : 'totalPrice',
					header : '保费金额',
					dataIndex : 'totalPrice',
					sortable : true
				}, {
					id : 'plateNumber',
					header : '车牌号',
					dataIndex : 'plateNumber',
					sortable : true
				},/*
					 * { id : 'payWay', header : '收费方式', dataIndex : 'payWay',
					 * sortable : true },
					 */{
					id : 'address',
					header : '配送地址',
					dataIndex : 'address',
					sortable : true
				}, {
					id : 'receiver',
					header : '坐席',
					dataIndex : 'receiver',
					sortable : true
				}, {
					id : 'leader',
					header : '团队长',
					dataIndex : 'leader',
					sortable : true
				}, {
					id : 'remark',
					header : '备注',
					dataIndex : 'remark',
					sortable : true
				}, {
					id : '',
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						// debugger;
						var url = '../order1/delete.do';
						var gridId = 'order-list-grid';
						var h = "<input type='button' value='删除' onclick=\"Express.UI.orderDel('"
								+ url + "'," + v + ",'" + gridId + "')\">";
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
				text : '编辑',
				iconCls : 'icon-edit',
				handler : function() {

					// var g = Ext.getCmp('order-list-grid');
					// alert(g.getStore().getAt(0).get('products')[0].productName);
					var s = Ext.getCmp('order-list-grid').getSelectionModel();
					if (s.hasSelection()) {
						var rd = s.getSelected();
						// rd.set("totalCount",rd.get('products').length);
						// Express.MessageBox(rd.get('tot
						var d = new Express.UI.OrderDetailForm({
									data : rd.json
								});

						var pdtList = {
							'totalCount' : 0,
							'products' : []
						};
						var sg = new Express.UI.OrderStatusGrid({
									statusList : {
										'totalCount' : 0,
										'statuses' : []
									}
								});
						var f = new Express.UI.OrderProductGrid({
									productList : pdtList
								});
						var f1 = new Express.UI.OrderFeedbackGrid({
									feedbackList : {
										'totalCount' : 0,
										'feedbacks' : []
									}
								});
						// Express.MessageBox(Ext.getCmp('order-product-grid').productList.get('totalCount'));
						Ajaxx('../order1/getById.do', {
									'oid' : rd.get('id')
								}, function(res) {
									if (res.success) {
										for (i = 0; i < res.data.statuses.length; i++) {
											var sid = res.data.statuses[i].id;
											var happenDate = res.data.statuses[i].happenDate;
											var operator = res.data.statuses[i].operator;
											var status = res.data.statuses[i].status;
											var remark = res.data.statuses[i].remark;
											var s = new Status({
														'happenDate' : happenDate,
														'operator' : operator,
														'remark' : remark,
														'status' : status
													});
											Ext.getCmp('order-status-grid')
													.getStore().add(s);
										}
										for (i = 0; i < res.data.products.length; i++) {
											var qty = res.data.products[i].quantity;
											var sentQty = res.data.products[i].sentQuantity;
											var status = res.data.products[i].status;
											var remark = res.data.products[i].remark;
											var p = new Product({
												'id' : res.data.products[i].id,
												'productName' : res.data.products[i].productName,
												'quantity' : qty,
												'sentQuantity' : sentQty,
												'status' : status,
												'remark' : remark
											}, res.data.products[i].id);
											Ext.getCmp('order-product-grid')
													.getStore().add(p);
										}
										for (i = 0; i < res.data.feedbacks.length; i++) {
											var receiver = res.data.feedbacks[i].receiver;
											var feedback = res.data.feedbacks[i].feedback;
											var happenTime = res.data.feedbacks[i].happenTime;
											var id = res.data.feedbacks[i].id;
											var fb = new Feedback({
														'id' : id,
														'receiver' : receiver,
														'feedback' : feedback,
														'happenTime' : happenTime
													}, id);
											Ext.getCmp('order-feedback-grid')
													.getStore().add(fb);
										}
									} else {
										Express.MessageBox(res.exception,
												'error');
									}
								});
						
						var win = new Express.Window({
									id : 'order-edit-win',
									title : '送单' + rd.get('seqNo') + '详情',
									width : 700,
									height : 500,
									autoScroll : true,
									items : [d, sg, f, f1]
								});
						win.show();
					} else {
						Express.MessageBox('请先选择一行记录');
					}

				}
			}, {
				xtype : 'button',
				text : '导入数据',
				iconCls : 'icon-add',
				handler : function() {
					var f = new Express.UI.OrderUploadForm();
					var win = new Express.Window({
								id : 'order-import-win',
								title : '导入数据',
								items : [f]
							});
					win.show();
				},
				listeners : {
					beforerender : function() {
						return $.inArray('/order1/importData', permissions) > -1
								? true
								: false;
					}
				}
			}, {

				xtype : 'button',
				text : '手动录入',
				// disabled:$.inArray('/order1/importData',permissions)>-1?false:true,
				iconCls : 'icon-add',
				handler : function() {

					// var g = Ext.getCmp('order-list-grid');
					// alert(g.getStore().getAt(0).get('products')[0].productName);
					var s = Ext.getCmp('order-list-grid').getSelectionModel();

					var rd = s.getSelected();
					// rd.set("totalCount",rd.get('products').length);
					// Express.MessageBox(rd.get('tot
					var d = new Express.UI.OrderDetailForm();

					var pdtList = {
						'totalCount' : 0,
						'products' : []
					};
					var f = new Express.UI.OrderProductGrid({
								productList : pdtList
							});
					// Express.MessageBox(Ext.getCmp('order-product-grid').productList.get('totalCount'));

					var win = new Express.Window({
								id : 'order-edit-win',
								title : '手动录入送单',
								width : 700,
								height : 500,
								autoScroll : true,
								items : [d, f]
							});
					win.show();

				},
				listeners : {
					beforerender : function() {
						return $.inArray('/order1/importData', permissions) > -1
								? true
								: false;
					}
				}

			}, {
				xtype : 'button',
				text : '导出Excel',
				iconCls : 'icon-export',
				handler : function() {
					var f = Ext.getCmp('order-query-form');
					var g = Ext.getCmp('order-list-grid');
					var type = Ext.getCmp('oqf-type').getValue();
					var seqNo = Ext.getCmp('oqf-seqNo').getValue();
					var dm = Ext.getCmp('oqf-deliveryMan').getValue();
					var assurer = Ext.getCmp('oqf-assurer').getValue();
					var address = Ext.getCmp('oqf-address').getValue();
					var plateNumber = Ext.getCmp('oqf-plateNumber').getValue();
					var deliveryNo= Ext.getCmp('oqf-deliveryNo').getValue();
					var gotDateStart = Ext.getCmp('oqf-gotDate-start').value;
					if (gotDateStart == undefined)
						gotDateStart = "";
					var gotDateEnd = Ext.getCmp('oqf-gotDate-end').value;
					if (gotDateEnd == undefined)
						gotDateEnd = "";
					var p = "&order.seqNo=" + seqNo + "&order.gotDate_start="
							+ gotDateStart + "&order.gotDate_end" + gotDateEnd;
					var tempForm = document.createElement("form");
					tempForm.id = "tempForm1";
					tempForm.method = "post";
					tempForm.action = "../order1/export.do?" + p;
					tempForm.target = "hello";
					var hideInput = document.createElement("input");
					hideInput.type = "hidden";
					hideInput.name = "order.type"
					hideInput.value = type;
					tempForm.appendChild(hideInput);
					var hideInput2 = document.createElement("input");
					hideInput2.type = "hidden";
					hideInput2.name = "order.deliveryMan"
					hideInput2.value = dm;
					tempForm.appendChild(hideInput2);
					var hideInput3 = document.createElement("input");
					hideInput3.type = "hidden";
					hideInput3.name = "order.assurer"
					hideInput3.value = assurer;
					tempForm.appendChild(hideInput3);
					var hideInput4 = document.createElement("input");
					hideInput4.type = "hidden";
					hideInput4.name = "order.address"
					hideInput4.value = address;
					tempForm.appendChild(hideInput4);
					var hideInput5 = document.createElement("input");
					hideInput5.type = "hidden";
					hideInput5.name = "order.plateNumber"
					hideInput5.value = plateNumber;
					tempForm.appendChild(hideInput5);
					var hideInput6 = document.createElement("input");
					hideInput6.type = "hidden";
					hideInput6.name = "order.deliveryNo"
					hideInput6.value = deliveryNo;
					tempForm.appendChild(hideInput6);					
					$(tempForm).submit(function() {
								window.open('about:blank', "hello");
							});
					document.body.appendChild(tempForm);
					tempForm.submit();
					document.body.removeChild(tempForm);
				}
			}, {
				xtype : 'button',
				text : '批量删除',
				iconCls : 'icon-del',
				handler : function() {
					var s = Ext.getCmp('order-list-grid').getSelectionModel();
					if (s.hasSelection()) {
						var st = "?";
						for (var i = 0; i < s.getSelections().length; i++) {
							st += "ids=" + s.getSelections()[i].data.id + '&';

						}
						Ext.Msg.confirm('提示', '确定将选中项记录删除？', function(bn) {
							if (bn == 'yes') {
								Ext.MessageBox.wait("正在删除,请稍侯...");
								var url = "../order1/deletes.do";
								Ajaxx(url + st, {

								}		, function(res) {
											if (res.success) {
												var store = Ext
														.getCmp("order-list-grid")
														.getStore();
												if (res.data != null) {
													var msg = "";
													for (var j = 0; j < res.data.length; j++) {
														var item = res.data[j];
														msg += "序号为"
																+ item.key
																+ "的送单删除"
																+ (item.result == 0
																		? "成功"
																		: "失败")
																+ "<br />";
														if (item.result == 0)
															store
																	.remove(store
																			.getById(item.id));
													}
													Express.MessageBox(msg);
												} else
													Express
															.MessageBox('批量删除失败!');
											} else {
												Express.MessageBox(
														res.exception, 'error');
											}
										});
							}
						});
					} else {
						Express.MessageBox('请先选择一行记录');
					}
				},
				listeners : {
					beforerender : function() {
						return $.inArray('/order1/importData', permissions) > -1
								? true
								: false;
					}
				}
			}, {

				xtype : 'button',
				text : '批量修改状态',
				iconCls : 'icon-edit',
				handler : function() {
					var s = Ext.getCmp('order-list-grid').getSelectionModel();
					if (s.hasSelection()) {
						var st = "?";
						for (var i = 0; i < s.getSelections().length; i++) {
							st += "oids=" + s.getSelections()[i].data.id + '&';

						}
						var f = new Express.UI.OrderStatusesChangeForm({
									data : st
								});
						var win = new Express.Window({
									id : 'osc-multiedit-win',
									title : '批量状态管理',
									items : [f]
								});
						win.show();
					} else {
						Express.MessageBox('请先选择一行记录');
					}
				},
				listeners : {
					beforerender : function() {
						return $.inArray('/order1/importData', permissions) > -1
								? true
								: false;
					}
				}

			}, {
				xtype : 'button',
				text : '导入状态',
				iconCls : 'icon-edit',
				handler : function() {
					var f = new Express.UI.OrderImportStatusForm({});
					var win = new Express.Window({
								id : 'osc-importStatus-win',
								title : '导入修改状态',
								items : [f]
							});
					win.show();
				},
				listeners : {
					beforerender : function() {
						return $.inArray('/order1/importStatus', permissions) > -1
								? true
								: false;
					}
				}
			}]
		},
		bbar : {
			xtype : 'paging',
			pageSize : ORDER_PAGE_SIZE,
			doRefresh : function() {
				return false;
			}
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Express.UI.OrderListGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Express.UI.OrderListGrid.superclass.initComponent.call(this);
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
		var type = Ext.getCmp('oqf-type').getValue();
		var seqNo = Ext.getCmp('oqf-seqNo').getValue();
		var dm = Ext.getCmp('oqf-deliveryMan').getValue();
		var assurer = Ext.getCmp('oqf-assurer').getValue();
		var address = Ext.getCmp('oqf-address').getValue();
		return new Express.JsonStore({
					url : '../order1/list.do',
					// remoteSort:true,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'deliveryNo', 'seqNo', 'deliveryMan',
							'receiver', 'assurer', 'totalPrice', 'payWay',
							'address', 'remark', 'orderDate', 'linker', 'type',
							'plateNumber', 'status', 'zone', 'gotDate',
							'businessNo', 'compulsoryNo', 'deliveryOrgan',
							'successDate','receiver','leader'],
					listeners : {
						loadexception : function(a, b, response) {
							Express.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
							this.baseParams = {
								'order.type' : Ext.getCmp('oqf-type')
										.getValue()?Ext.getCmp('oqf-type').getValue():'一次单',
								'order.seqNo' : Ext.getCmp('oqf-seqNo')
										.getValue(),
								'order.deliveryMan' : Ext
										.getCmp('oqf-deliveryMan').getValue(),
								'order.assurer' : Ext.getCmp('oqf-assurer')
										.getValue(),
								'order.address' : Ext.getCmp('oqf-address')
										.getValue(),
								'limit' : ORDER_PAGE_SIZE
							};

						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('order-list-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('order-list-grid');
		return g.store;
	}
});

Express.UI.OrderImportStatusForm = function(itemConfig) {
	var config = {
		id : 'OrderImportStatusForm',
		fileUpload : true,
		enctype : 'multipart/form-data',
		defaults : {
			xtype : 'textfield',
			msgTarget : 'side',
			allowBlank : false
		},
		items : [{
					fieldLabel : '选择Excel文件',
					inputType : 'file',
					name : 'upload'
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '开始导入',
			handler : function() {
				var f = Ext.getCmp('OrderImportStatusForm');
				var win = Ext.getCmp('osc-importStatus-win');
				if (f.getForm().isValid()) {
					Ext.MessageBox.wait("正在导入,请稍侯...");
					f.submit('../order1/importStatus.do', {}, null, function(
							res) {
						Ext.MessageBox.hide();
						win.close();
						if (res.success) {
							if (res.noFound != undefined) {
								Express.MessageBox('状态导入成功!<br>' + res.noFound);
							} else {
								Express.MessageBox('状态导入成功!');
							}

							Ext.getCmp('order-list-grid').getStore().reload();
						} else {
							Express.MessageBox('导入失败', 'error');
						}
					});
				}
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderImportStatusForm.superclass.constructor.call(this, config);
};
Ext.extend(Express.UI.OrderImportStatusForm, Express.Form);

Express.UI.OrderUploadForm = function(itemConfig) {
	var refreshGrid=itemConfig ? itemConfig.refreshGrid : null;
	var config = {
		id : 'OrderUploadForm',
		fileUpload : true,
		enctype : 'multipart/form-data',
		defaults : {
			xtype : 'textfield',
			msgTarget : 'side',
			allowBlank : false
		},
		items : [{
					xtype : 'combo',
					fieldLabel : '类型',
					blankText : '送单类型不能为空',
					id : 'ouf-type',
					name : 'orderType',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					displayField : 'text',
					valueField : 'text',
					allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['text'],
								data : orderTypeStore
							}),
					value : '一次单'
				}, {
					fieldLabel : '选择Excel文件',
					inputType : 'file',
					name : 'upload'
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '上传',
			handler : function() {
				var startImport = function(res) {
					// var base='将要导入'+res.sheets.join(',')+'的表数据,请确认';
					var msg = res.data.length == 0
							? '检查无误，确定继续导入'
							: '检查结果如下:<br />' + res.data.join('<br />')
									+ '<br />需要补充列内容请选择相应送单进行修改,确定继续导入?';
					Ext.Msg.confirm('提示', msg, function(bn) {
						if (bn == 'yes') {
							var f = Ext.getCmp('OrderUploadForm'), win = Ext
									.getCmp('order-import-win');
							Ext.MessageBox.wait("正在导入,请稍侯...");
							Ajaxx('../order1/importData.do', {
										'uploadFileName' : res.uploadFileName,
										'orderType' : Ext.getCmp('ouf-type')
												.getValue()
									}, function(res) {
										Ext.MessageBox.hide();
										win.close();
										if (res.success) {
											Express.MessageBox('导入成功!');
											if(refreshGrid!=null)
												Ext.getCmp(refreshGrid).getStore().reload();
											else
												Ext.getCmp('order-list-grid')
													.getStore().reload();
										} else {
											Express.MessageBox('导入失败', 'error');
										}
									});
						}
					});
				};
				var f = Ext.getCmp('OrderUploadForm');
				var win = Ext.getCmp('order-import-win');
				var params = {
				// 'schedule.sid':f.sid
				};
				f.submit('../order1/preImportData.do', params, null,
						startImport);
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderUploadForm.superclass.constructor.call(this, config);
};
Ext.extend(Express.UI.OrderUploadForm, Express.Form);

// 送单详情
Express.UI.OrderDetailForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var refreshGrid=itemConfig ? itemConfig.refreshGrid : null;
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'order-detail-form',
		frame : true,
		// title : '单项礼品录入',
		bodyStyle : 'padding:5px 5px 0',
		// layout: {type: 'table',columns: 2},
		// layout : "column",
		listeners : {
			beforerender : function() {
				return $.inArray('/order1/detailForm', permissions) > -1
						? true
						: false;
			}
		},
		items : [{
					layout : "column",

					items : [{

								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '配送任务编号',
											xtype : 'textfield',
											value : data ? data.deliveryNo : '',
											name : 'order.deliveryNo',
											allowBlank : false
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '送单申请编号',
											xtype : 'textfield',
											value : data ? data.seqNo : '',
											name : 'order.seqNo',
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
											fieldLabel : '当前状态',
											xtype : 'textfield',
											value : data ? data.status : '',
											disabled : true,
											id : 'odf-status'
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
									xtype : 'combo',
									fieldLabel : '类型',
									width : 230,
									blankText : '送单类型不能为空',
									value : data ? data.type : '',
									hiddenName : 'order.type',
									name : 'order.type',
									mode : 'local',
									editable : true,
									triggerAction : 'all',
									displayField : 'text',
									valueField : 'text',
									allowBlank : false,
									store : new Ext.data.ArrayStore({
												fields : ['text'],
												data : orderTypeStore
											})
										// value:'一次单'
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
											fieldLabel : '总保费',
											xtype : 'textfield',
											value : data ? data.totalPrice : '',
											name : 'order.totalPrice',
											allowBlank : false
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '收费方式',
											xtype : 'textfield',
											value : data ? data.payWay : '',
											name : 'order.payWay',
											allowBlank : true
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
							fieldLabel : '录入日期',
							xtype : 'textfield',
							value : data && data.orderDate ? data.orderDate
									.split('T')[0] : '',
							name : 'order.orderDate',
							disabled : true
						}]

					}, {
						columnWidth : .5,
						layout : "form",
						defaults : {
							width : 200
						},
						items : [{
							format : 'Y-m-d H:i:s',
							fieldLabel : '回单时间',
							xtype : 'datefield',
							value : data && data.successDate ? data.successDate
									.replace('T', ' ') : Ext.util.Format.date(
									new Date(), "Y-m-d H:i:s"),
							name : 'order.successDate'//,
							//disabled : true
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
							value : data&&data.deliveryMan!=null&&data.deliveryMan!='' ? data.deliveryMan : selectedDm,
							name : 'order.deliveryMan',
							id : 'odf-dm',
							xtype : 'combo',
							fieldLabel : '送单员',
							// blankText:'角色不能为空',
							editable : true,
							triggerAction : 'all',
							displayField : 'realName',
							valueField : 'realName',
							hiddenName : 'order.deliveryMan',
							listeners:{
								"select":function(){
									selectedDm=this.value;   //获取id为combo的值
								}
							},
							//allowBlank : data&&refreshGrid!='order-import-list-grid'?false:true,
							allowBlank:true,
							store : new Express.JsonStore({
										autoLoad : true,
										url : '../user/list.do?roleId=2&limit=1000',// 送单员组
										root : 'data',
										fields : ['realName', 'loginName'],
										listeners : {
											beforeload : function() {
												return $.inArray(
														'/order1/detailForm',
														permissions) > -1
														? true
														: false;
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

							fieldLabel : '领单日期',
							xtype : 'datefield',
							format : 'Y-m-d H:i:s',
							editable : false,
							value : data && data.gotDate ? data.gotDate
									.replace('T', ' ') : Ext.util.Format.date(
									new Date(), "Y-m-d H:i:s"),
							allowBlank : false,
							blankText : '不能为空',
							name : 'order.gotDate'

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
											fieldLabel : '联系人',
											xtype : 'textfield',
											value : data ? data.linker : '',
											name : 'order.linker',
											allowBlank : false
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '被保险人',
											xtype : 'textfield',
											value : data ? data.assurer : '',
											name : 'order.assurer',
											allowBlank : false
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
											fieldLabel : '商业险投保单号',
											xtype : 'textfield',
											value : data ? data.businessNo : '',
											name : 'order.businessNo',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '交强险投保单号',
											xtype : 'textfield',
											value : data
													? data.compulsoryNo
													: '',
											name : 'order.compulsoryNo'
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
											fieldLabel : '车牌号码',
											xtype : 'textfield',
											value : data
													? data.plateNumber
													: '',
											name : 'order.plateNumber',
											allowBlank : false
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '配送机构',
											xtype : 'textfield',
											value : data
													? data.deliveryOrgan
													: '',
											name : 'order.deliveryOrgan'
										}]
							}]

				},/*
					 * { layout : "column",
					 * 
					 * items : [{ columnWidth:.5, layout : "form", defaults : {
					 * width : 200 }, items:[{ fieldLabel : '保费全额', xtype :
					 * 'textfield', value : data ? data.totalPrice:'',
					 * name:'order.totalPrice' }]
					 *  }, { columnWidth:.5, layout : "form", defaults : { width :
					 * 200 }, items:[{ fieldLabel : '区域', value : data ?
					 * data.zone : '', name:'order.zone', allowBlank : false,
					 * blankText:'不能为空', xtype : 'combo', blankText:'区域不能为空',
					 * mode : 'local', editable : true, triggerAction : 'all',
					 * hiddenName:'order.zone', displayField : 'text',
					 * valueField : 'text', allowBlank : false, store:new
					 * Ext.data.ArrayStore({ fields:['text'], data:zoneStore }) }] }] },
					 */{
					// columnWidth:.5,
					layout : "form",
					defaults : {
						width : 500
					},
					items : [{
								fieldLabel : '地址',
								xtype : 'textfield',
								value : data ? data.address : '',
								name : 'order.address',
								allowBlank : false
							}]

				}, {
					// columnWidth:.5,
					layout : "form",
					defaults : {
						width : 500
					},
					items : [{
								fieldLabel : '备注',
								xtype : 'textarea',
								value : data ? data.remark : '',
								name : 'order.remark'
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
											fieldLabel : '坐席',
											xtype : 'textfield',
											value : data ? data.receiver : '',
											name : 'order.receiver',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '团队长',
											xtype : 'textfield',
											value : data
													? data.leader
													: '',
											name : 'order.leader'
										}]
							}]

				
				},{
					
					

					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '是否申请一帐通卡',
											xtype : 'textfield',
											value : data ? data.isYikatong : '',
											name : 'order.isYikatong',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '是否预约垫付申请',
											xtype : 'textfield',
											value : data
													? data.isYuyue
													: '',
											name : 'order.isYuyue'
										}]
							}]

				
				
				},{
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '缴费止期',
											xtype : 'textfield',
											value : data ? data.deadLine : '',
											name : 'order.deadLine',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '预约时间',
											xtype : 'textfield',
											value : data
													? data.yuYue
													: '',
											name : 'order.yuYue'
										}]
							}]
			
				},{
					
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '提交时间',
											xtype : 'textfield',
											value : data ? data.submitDate : '',
											name : 'order.submitDate',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : 'Office种类',
											xtype : 'textfield',
											value : data
													? data.officeType
													: '',
											name : 'order.officeType'
										}]
							}]
			
				
				},{
					
					
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '是否加急',
											xtype : 'textfield',
											value : data ? data.isHurry : '',
											name : 'order.isHurry',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '是否验车',
											xtype : 'textfield',
											value : data
													? data.isCheck
													: '',
											name : 'order.isCheck'
										}]
							}]
			
				
				
				},{
					
					
					
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '退单类型',
											xtype : 'textfield',
											value : data ? data.backType : '',
											name : 'order.backType',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '退单原因',
											xtype : 'textfield',
											value : data
													? data.backReason
													: '',
											name : 'order.backReason'
										}]
							}]
			
				
				
				
				},{
					
					
					
					
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '导出时间',
											xtype : 'textfield',
											value : data ? data.exportTime : '',
											name : 'order.exportTime',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '快递公司',
											xtype : 'textfield',
											value : data
													? data.expressCompany
													: '',
											name : 'order.expressCompany'
										}]
							}]
			
				
				
				
				
				},{
					
					
					
					
					
					layout : "column",
					hidden:refreshGrid=='order-import-list-grid'?false:true,
					items : [{
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '一卡通配送情况',
											xtype : 'textfield',
											value : data ? data.deliveryStatus : '',
											name : 'order.deliveryStatus',
											allowBlank : true
										}]

							}, {
								columnWidth : .5,
								layout : "form",
								defaults : {
									width : 200
								},
								items : [{
											fieldLabel : '垫付申请反馈结果',
											xtype : 'textfield',
											value : data
													? data.feedbackResult
													: '',
											name : 'order.feedbackResult'
										}]
							}]
			
				
				
				
				
				
				},{
				
					// columnWidth:.5,
					layout : "form",
					defaults : {
						width : 500
					},
					items : [{
								fieldLabel : data&&data.status==orderStatusStoreOpterate[1][0]?'回单备注':'',
								xtype : 'textarea',
								value : '',
								name : 'status.remark',
								id:'odf-statusRemark',
								hidden:data&&data.status==orderStatusStoreOpterate[1][0]?false:true//待处理
							}]

				
				}],
		buttonAlign : 'center',
		buttons : [{
			id : 'odf-btn',
			text : data ? '编辑' : '创建',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('order-detail-form');
				var win = Ext.getCmp('order-edit-win');
				var pdt = '[{"id":43,"oid":null,"productName":"GJX","quantity":5,"remark":"已全部送达","sentQuantity":5,"sid":null,"status":"成功"}]';
				f.submit(data ? '../order1/edit.do' : '../order1/edit.do', data
								? {
									'order.id' : data.id
									// 'order.products':pdt
								}
								: null, data ? win : null, function(res) {
							if (res.success) {
								if (!res.data) {
									Express.MessageBox('保存成功!');
									if(refreshGrid!=null)
										Ext.getCmp(refreshGrid).getStore().reload();
									else
										Ext.getCmp('order-list-operate-grid').getStore().reload();
								} else {
									data = res.data;
									Ext.getCmp('odf-btn').setText('编辑');
									Ext.getCmp('order-detail-form').data = res.data
									if(refreshGrid!=null)
										Ext.getCmp(refreshGrid).getStore().reload();
									else
										Ext.getCmp('order-list-operate-grid').getStore().reload();
								}
							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});
			},
			listeners : {
				beforerender : function() {
					//return $.inArray('/order1/edit', permissions) > -1&&((data&&data.status==orderStatusStoreOpterate[0][0])||!data)//未分配
					return $.inArray('/order1/edit', permissions) > -1 && (data&&data.editable==true)
							? true
							: false;
				}
			}
		}, {
			id : 'odf-btnRecord',
			text : '回单登记',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('order-detail-form');
				var win = Ext.getCmp('order-edit-win');
				if (data.status == orderStatusStore[0][0])// 未分派
				{
					Express.MessageBox('送单还没有分派给送单处理，不能直接执行回单登记!');
					return;
				}
				f.submit('../order1/changeStatus.do', {
					'status.oid' : data.id,
					'status.status' : orderStatusStore[2][0]
						// '成功'
					}, win, function(res) {
					if (res.success) {
						Express.MessageBox('保存成功!');
						if(refreshGrid!=null)
							Ext.getCmp(refreshGrid).getStore().reload();
						else
							Ext.getCmp('order-list-operate-grid').getStore().reload();
					} else {
						Express.MessageBox(res.exception, 'error');
					}
				});
			},
			
			listeners : {
				beforerender : function() {
					return data&&data.status==orderStatusStoreOpterate[1][0]&& data.editable==true//待处理
							? true
							: false;
				}
			}
		},{
			
			id : 'odf-btnFailed',
			text : '送单失败',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('order-detail-form');
				var win = Ext.getCmp('order-edit-win');
				if (data.status == orderStatusStore[0][0])// 未分派
				{
					Express.MessageBox('送单还没有分派给送单处理，不能直接执行回单登记!');
					return;
				}
				if(Ext.getCmp('odf-statusRemark').getValue()=='')
				{
					Express.MessageBox('送单失败时必须填写备注!');
					return;
				}
				f.submit('../order1/changeStatus.do', {
					'status.oid' : data.id,
					'status.status' : orderStatusStore[3][0]
						// '成功'
					}, win, function(res) {
					if (res.success) {
						Express.MessageBox('保存成功!');
						if(refreshGrid!=null)
							Ext.getCmp(refreshGrid).getStore().reload();
						else
							Ext.getCmp('order-list-operate-grid').getStore().reload();
					} else {
						Express.MessageBox(res.exception, 'error');
					}
				});
			},
			
			listeners : {
				beforerender : function() {
					return data&&data.status==orderStatusStoreOpterate[1][0]&&data.editable==true//待处理
							? true
							: false;
				}
			}
		
		},{
			
			id : 'odf-btnCancel',
			text : '取消送单',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('order-detail-form');
				var win = Ext.getCmp('order-edit-win');
				f.submit('../order1/changeStatus.do', {
					'status.oid' : data.id,
					'status.status' : data.type=='一次单'?orderStatusStore[1][0]:orderStatusStore[0][0]
						// '成功'
					}, win, function(res) {
					if (res.success) {
						Express.MessageBox('保存成功!');
						Ext.getCmp('order-list-operate-grid').getStore().reload();
					} else {
						Express.MessageBox(res.exception, 'error');
					}
				});
			},
			
			listeners : {
				beforerender : function() {
					return data&&data.status==orderStatusStoreOpterate[2][0]&&data.editable==true//成功
							? true
							: false;
				}
			}
		
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderDetailForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.OrderDetailForm, Express.Form);
// 送单礼品表
Express.UI.OrderProductGrid = Ext.extend(Express.Grid, {
	config : {
		id : 'order-product-grid',
		frame : true,
		title : '礼品列表',
		autoHeight : true,
		defaults : {
			width : 100,
			sortable : true
		},
		listeners : {
			beforerender : function() {
				return $.inArray('/order1/productList', permissions) > -1
						? true
						: false;
			}
		},
		columns : [{
					id : 'opg_name',
					header : '名称',
					dataIndex : 'productName',
					sortable : true
				}, {
					id : 'opg_qty',
					header : '数量',
					dataIndex : 'quantity',
					sortable : true
				}, {
					id : 'opg_qtySent',
					header : '已送数量',
					dataIndex : 'sentQuantity',
					sortable : true
				}, {
					id : 'opg_status',
					header : '状态',
					dataIndex : 'status',
					sortable : true
					/*
					 * , renderer:function(v,a,b){ var p=b.data; return
					 * p.sentQuantity==0?orderProductStatusStore[0]:(p.quantity>p.sentQuantity?orderProductStatusStore[2]:orderProductStatusStore[1]); }
					 */
			}	, {
					id : 'opg_remark',
					header : '备注',
					dataIndex : 'remark',
					sortable : true
				}, {
					id : '',
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						// debugger;
						var url = '../order1/delProduct.do';
						var gridId = 'order-product-grid';
						var h = "<input type='button' value='删除' onclick=\"Express.UI.orderDel('"
								+ url + "'," + v + ",'" + gridId + "')\">";
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
					return $.inArray('/order1/manageProduct', permissions) > -1
							? true
							: false;
				}
			},
			items : [{
						xtype : 'button',
						text : '新增',
						iconCls : 'icon-add',
						handler : function() {
							// var
							// record=Ext.getCmp('order-status-grid').getStore().getAt(0);
							var data = Ext.getCmp('order-detail-form').data;
							if (data == null || data.id == ''
									|| data.id == null) {
								Express.MessageBox('请先录入送单信息，再新增礼品', 'error');
								return;
							}
							var f = new Express.UI.OrderProductMngForm();
							var win = new Express.Window({
										id : 'opm-edit-win',
										title : '礼品管理',
										items : [f]
									});
							win.show();
						}
					}, {

						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('order-product-grid')
									.getSelectionModel();
							if (s.hasSelection()) {
								var record = s.getSelected();
								// var
								// record=Ext.getCmp('order-status-grid').getStore().getAt(0);
								var f = new Express.UI.OrderProductMngForm({
											data : record.data
										});
								var win = new Express.Window({
											id : 'opm-edit-win',
											title : '礼品管理',
											items : [f]
										});
								win.show();
							} else {
								Express.MessageBox('请先选择一行记录', 'error');
							}
						}

					}]
		},
		bbar : {
// xtype : 'paging',
		// pageSize : 20
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Express.UI.OrderProductGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Express.UI.OrderProductGrid.superclass.initComponent.call(this);
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
		// var
		// record1={"address":null,"assurer":null,"businessNo":null,"compulsoryNo":null,"deliveryMan":"小明","feedbacks":[],"insuranceType":null,"leader":null,"linker":null,"orderDate":"2013-12-11T00:00:00","payWay":null,"plateNumber":null,"products":[{"id":52,"order":null,"productName":"DQB","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":51,"order":null,"productName":"GJX","quantity":2,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":50,"order":null,"productName":"佐登妮丝","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":49,"order":null,"productName":"PAS","quantity":3,"sentQuantity":0,"sid":0,"status":"待处理"}]};

		return new Express.JsonStore({
					// url : '../gift/list.do',
					// remoteSort:true,
					root : 'products',
					data : this.productList,
					totalProperty : 'totalCount',
					fields : ['id', 'productName', 'quantity', 'status',
							'sentQuantity', 'remark'],
					autoLoad : true
				});
	},
	loadData : function() {
		var g = Ext.getCmp('order-product-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('order-product-grid');
		return g.store;
	}
});
// 反馈列表
Express.UI.OrderFeedbackGrid = Ext.extend(Express.Grid, {
	config : {
		id : 'order-feedback-grid',
		frame : true,
		title : '反馈列表',
		autoHeight : true,
		defaults : {
			width : 100,
			sortable : true
		},
		listeners : {
			beforerender : function() {
				return $.inArray('/order1/postFeedback', permissions) > -1
						? true
						: false;
			}
		},
		columns : [{
					id : 'ofg_time',
					header : '时间',
					dataIndex : 'happenTime',
					sortable : true
				}, {
					id : 'ofg_receiver',
					header : '反馈人',
					dataIndex : 'receiver',
					sortable : true
				}, {
					id : 'ofg_content',
					header : '内容',
					dataIndex : 'feedback',
					sortable : true
				}, {
					id : '',
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						// debugger;
						var url = '../order1/delFeedback.do';
						var gridId = 'order-feedback-grid';
						var h = "<input type='button' value='删除' onclick=\"Express.UI.orderDel('"
								+ url + "'," + v + ",'" + gridId + "')\">";
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
						text : '发表反馈',
						iconCls : 'icon-add',
						handler : function() {
							// var
							// record=Ext.getCmp('order-status-grid').getStore().getAt(0);
							var f = new Express.UI.OrderFeedbackPostForm();
							var win = new Express.Window({
										id : 'ofp-edit-win',
										title : '反馈管理',
										items : [f]
									});
							win.show();
						}
					}]
		},
		bbar : {
// xtype : 'paging',
		// pageSize : 20
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Express.UI.OrderFeedbackGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Express.UI.OrderFeedbackGrid.superclass.initComponent.call(this);
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
		// var
		// record1={"address":null,"assurer":null,"businessNo":null,"compulsoryNo":null,"deliveryMan":"小明","feedbacks":[],"insuranceType":null,"leader":null,"linker":null,"orderDate":"2013-12-11T00:00:00","payWay":null,"plateNumber":null,"products":[{"id":52,"order":null,"productName":"DQB","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":51,"order":null,"productName":"GJX","quantity":2,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":50,"order":null,"productName":"佐登妮丝","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":49,"order":null,"productName":"PAS","quantity":3,"sentQuantity":0,"sid":0,"status":"待处理"}]};

		return new Express.JsonStore({
					// url : '../gift/list.do',
					// remoteSort:true,
					root : 'feedbacks',
					data : this.feedbackList,
					totalProperty : 'totalCount',
					fields : ['id', 'feedback', 'receiver', 'happenTime'],
					autoLoad : true
				});
	},
	loadData : function() {
		var g = Ext.getCmp('order-feedback-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('order-feedback-grid');
		return g.store;
	}
});
// 回单登记修改记录
Express.UI.OrderStatusGrid = Ext.extend(Express.Grid, {
			config : {
				id : 'order-status-grid',
				frame : true,
				title : '回单登记修改记录(以最新的为准)',
				autoHeight : true,
				defaults : {
					width : 100,
					sortable : true
				},
				listeners : {
					beforerender : function() {
						return $
								.inArray('/order1/orderStatusGrid', permissions) > -1
								? true
								: false;
					}
				},
				columns : [{
							id : 'osg_time',
							header : '时间',
							dataIndex : 'happenDate',
							sortable : true
						}, {
							id : 'osg_operator',
							header : '反馈人',
							dataIndex : 'operator',
							sortable : true
						}, {
							id : 'osg_status',
							header : '状态',
							dataIndex : 'status',
							sortable : true
						}, {
							id : 'osg_remark',
							header : '备注',
							dataIndex : 'remark',
							sortable : true
						}],
				tbar : {
					style : 'padding:2px 10px;',
					defaults : {
						xtype : 'button'
					},
					listeners : {
						beforerender : function() {
							return $.inArray('/order1/changeStatus',
									permissions) > -1 ? true : false;
						}
					},
					items : [{
						xtype : 'button',
						text : '修改送单状态',
						iconCls : 'icon-add',
						handler : function() {
							var record = Ext.getCmp('order-status-grid')
									.getStore().getAt(0);
							var f = new Express.UI.OrderStatusChangeForm({
										data : record.data
									});
							var win = new Express.Window({
										id : 'osc-edit-win',
										title : '状态管理',
										items : [f]
									});
							win.show();
						}
					}]
				},
				bbar : {
// xtype : 'paging',
				// pageSize : 20
				}
			},
			constructor : function(itemConfig) {
				config = Ext.apply(this.config, itemConfig || {});
				Express.UI.OrderStatusGrid.superclass.constructor.call(this,
						config);
			},
			// 初始化方法
			initComponent : function() {
				this.init();
				Express.UI.OrderStatusGrid.superclass.initComponent.call(this);
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
				// var
				// record1={"address":null,"assurer":null,"businessNo":null,"compulsoryNo":null,"deliveryMan":"小明","feedbacks":[],"insuranceType":null,"leader":null,"linker":null,"orderDate":"2013-12-11T00:00:00","payWay":null,"plateNumber":null,"products":[{"id":52,"order":null,"productName":"DQB","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":51,"order":null,"productName":"GJX","quantity":2,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":50,"order":null,"productName":"佐登妮丝","quantity":1,"sentQuantity":0,"sid":0,"status":"待处理"},{"id":49,"order":null,"productName":"PAS","quantity":3,"sentQuantity":0,"sid":0,"status":"待处理"}]};

				return new Express.JsonStore({
							// url : '../gift/list.do',
							// remoteSort:true,
							root : 'statuses',
							data : this.statusList,
							totalProperty : 'totalCount',
							fields : ['id', 'remark', 'status', 'happenDate',
									'operator'],
							autoLoad : true
						});
			},
			loadData : function() {
				var g = Ext.getCmp('order-status-grid');
			},
			getStore : function() {
				var g = Ext.getCmp('order-status-grid');
				return g.store;
			}
		});
// 状态管理
Express.UI.OrderStatusChangeForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'order-status-change-form',
		frame : true,
		// title : '状态管理(以最新的为准)',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
			// autoWidth : true
		},
		defaultType : 'textfield',

		items : [{
					xtype : 'combo',
					fieldLabel : '类型',
					blankText : '送单类型不能为空',
					id : 'cb-status',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					displayField : 'text',
					valueField : 'text',
					allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['text'],
								data : orderStatusStore
							}),
					value : data ? data.status : '未分派'
				}, {
					fieldLabel : '备注',
					id : 'ta-remark',
					xtype : 'textarea'
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '修改',
			handler : function() {
				var g = Ext.getCmp('order-status-grid');
				var g1 = Ext.getCmp('order-list-grid');
				var f = Ext.getCmp('order-status-change-form');
				var win = Ext.getCmp('osc-edit-win');
				var remark = Ext.getCmp('ta-remark').getValue();
				var status = Ext.getCmp('cb-status').getValue();
				f.submit('../order1/changeStatus.do', {
							'status.oid' : Ext.getCmp('order-detail-form').data.id,
							'status.remark' : Ext.getCmp('ta-remark')
									.getValue(),
							'status.status' : Ext.getCmp('cb-status')
									.getValue()
						}, win, function(res) {
							if (res.success) {
								var s = new Status({
											'id' : res.data.id,
											'remark' : remark,
											'status' : status,
											'happenDate' : res.data.happenDate,
											'operator' : res.data.operator
										}, res.data.id);
								g.getStore().insert(0, s);
								g1.getStore().reload();
								Ext.getCmp('odf-status').setValue(status);
								Express.MessageBox('保存成功!');

							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});

			}
		}, {
			text : '取消',
			handler : function() {
				var k = Ext.getCmp('cb-type');
				k.setValue('一次单');
				k = Ext.getCmp('tb-seqNo');
				k.setValue('');
				k = Ext.getCmp('tb-deliveryMan');
				k.setValue('');
				k = Ext.getCmp('tb-assurer');
				k.setValue('');
				k = Ext.getCmp('tb-address');
				k.setValue('');
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderStatusChangeForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.OrderStatusChangeForm, Express.Form);
// 批量状态管理
Express.UI.OrderStatusesChangeForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'order-statuses-change-form',
		frame : true,
		// title : '状态管理(以最新的为准)',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
			// autoWidth : true
		},
		defaultType : 'textfield',

		items : [{
					xtype : 'combo',
					fieldLabel : '送单员',
					blankText : '送单类型不能为空',
					id : 'cb-dm',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
							displayField : 'realName',
							valueField : 'realName',
							allowBlank:false,
							store : new Express.JsonStore({
										autoLoad : true,
										url : '../user/list.do?roleId=2&limit=1000',// 送单员组
										root : 'data',
										fields : ['realName', 'loginName'],
										listeners : {
											beforeload : function() {
												return $.inArray(
														'/order1/detailForm',
														permissions) > -1
														? true
														: false;
											}
										}
									})
				}, {
					fieldLabel : '备注',
					id : 'ta-remark',
					xtype : 'textarea'
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '修改',
			handler : function() {
				var g1 = Ext.getCmp('order-list-operate-grid');
				var f = Ext.getCmp('order-statuses-change-form');
				var win = Ext.getCmp('osc-multiedit-win');
				var remark = Ext.getCmp('ta-remark').getValue();
				var dm = Ext.getCmp('cb-dm').getValue();
				f.submit('../order1/changeStatuses.do' + data, {
							'status.remark' : Ext.getCmp('ta-remark')
									.getValue(),
							'status.status' :'待处理',
							'deliveryMan':dm
						}, win, function(res) {
							if (res.success) {
								g1.getStore().reload();
								if (res.data != null) {
									var msg = "";
									for (var j = 0; j < res.data.length; j++) {
										var item = res.data[j];
										msg += "序号为"
												+ item.key
												+ "的送单修改状态"
												+ (item.result == 0
														? "成功"
														: "失败") + "<br />";
									}
									Express.MessageBox(msg);
								} else
									Express.MessageBox('批量删除失败!');

							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});

			}
		}, {
			text : '取消',
			handler : function() {
				var k = Ext.getCmp('cb-type');
				k.setValue('一次单');
				k = Ext.getCmp('tb-seqNo');
				k.setValue('');
				k = Ext.getCmp('tb-deliveryMan');
				k.setValue('');
				k = Ext.getCmp('tb-assurer');
				k.setValue('');
				k = Ext.getCmp('tb-address');
				k.setValue('');
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderStatusesChangeForm.superclass.constructor
			.call(this, config);
}

Ext.extend(Express.UI.OrderStatusesChangeForm, Express.Form);
// 反馈管理
Express.UI.OrderFeedbackPostForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'order-feedback-post-form',
		frame : true,
		// title : '状态管理(以最新的为准)',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
			// autoWidth : true
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '备注',
					id : 'ofp-remark',
					xtype : 'textarea'
				}],
		buttonAlign : 'center',
		buttons : [{
			text : '发表',
			handler : function() {
				var g = Ext.getCmp('order-feedback-grid');
				var f = Ext.getCmp('order-feedback-post-form');
				var win = Ext.getCmp('ofp-edit-win');
				var remark = Ext.getCmp('ofp-remark').getValue();
				f.submit('../order1/postFeedback.do', {
							'feedback.oid' : Ext.getCmp('order-detail-form').data.id,
							'feedback.feedback' : remark
						}, win, function(res) {
							if (res.success) {
								var s = new Feedback({
											'id' : res.data.id,
											'feedback' : remark,
											'happenTime' : res.data.happenTime,
											'receiver' : res.data.receiver
										}, res.data.id);
								g.getStore().insert(0, s);
								Express.MessageBox('保存成功!');

							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});

			}
		}, {
			text : '取消',
			handler : function() {
				var win = Ext.getCmp('ofp-edit-win');
				win.close();
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderFeedbackPostForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.OrderFeedbackPostForm, Express.Form);

// 礼品管理
Express.UI.OrderProductMngForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		id : 'order-product-mng-form',
		frame : true,
		// title : '礼品管理',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
			// autoWidth : true
		},
		defaultType : 'textfield',

		items : [{
			id : 'opm-combo',
			disabled : data ? true : false,
			xtype : 'combo',
			fieldLabel : '礼品名',
			name : 'product.productName',
			blankText : '不能为空',
			editable : true,
			triggerAction : 'all',
			displayField : 'name',
			hiddenName : 'product.productName',
			valueField : 'code',
			allowBlank : false,
			value : data ? data.productName : '',
			store : new Express.JsonStore({
						autoLoad : false,
						url : '../gift/listNamesAndCodes.do',
						root : 'data',
						fields : ['id', 'name', 'code']
					}),
			listeners : {
				select : function(a, data) {
					var g = Ext.getCmp('order-product-grid').getStore();
					var rs = g.query('productName', data.data.code);
					if (rs.getCount() > 0) {
						Express.MessageBox('礼品' + data.data.name
								+ '已在列表中，请选择未被添加的礼品!');
						this.setValue('');
						return;
					}
					// var params={'s.product.id':data.id};
					// Ext.getCmp('stock-grid').getStore().reload({'params':params});
				}
			}
		}, {
			fieldLabel : '数量',
			id : 'opmf-qty',
			name : 'product.quantity',
			xtype : 'numberfield',
			regex : /^[1-9]+[0-9]*$/,
			allowBlank : false,
			blankText : '不能为空',
			regexText : '请输入一个大于0的正数',
			value : data ? data.quantity : ''
		}, {

			fieldLabel : '已发送数量',
			id : 'opmf-sentQty',
			name : 'product.sentQuantity',
			xtype : 'numberfield',
			regex : /^[0-9]+[0-9]*$/,
			allowBlank : false,
			blankText : '不能为空',
			regexText : '请输入一个大于0的正数',
			value : data ? data.sentQuantity : '',
			hidden : data ? false : true,
			hideLabel : data ? false : true,
			disabled : data ? false : true
		}, {
			fieldLabel : '备注',
			id : 'opm_remark',
			name : 'product.remark',
			value : data ? data.remark : ''
		}],
		buttonAlign : 'center',
		buttons : [{
			text : '保存',
			handler : function() {
				var g = Ext.getCmp('order-product-grid');
				var f = Ext.getCmp('order-product-mng-form');
				var win = Ext.getCmp('opm-edit-win');
				if (data != null) {
					var qty = Ext.getCmp('opmf-qty').getValue();
					var sentQty = Ext.getCmp('opmf-sentQty').getValue();
					if (qty < sentQty) {
						Express.MessageBox('总量不能小于已发送量', 'error');
						return;
					}
				}
				// var remark=Ext.getCmp('ofp-remark').getValue();
				var pid = data ? data.id : null;
				f.submit('../order1/manageProduct.do', {
							'product.oid' : Ext.getCmp('order-detail-form').data.id,
							'product.id' : pid
						}, win, function(res) {
							if (res.success) {
								var s = new Product({
											'id' : res.data.id,
											'productName' : res.data.productName,
											'quantity' : res.data.quantity,
											'sentQuantity' : res.data.sentQuantity,
											'status' : res.data.status,
											'remark' : res.data.remark
										}, res.data.id);
								if (pid == null) {
									g.getStore().insert(0, s);
								} else {
									// alert(g.getStore().getById(pid));
									g.getStore().getById(pid).set("quantity",
											s.data.quantity);
									g.getStore().getById(pid)
											.set("sentQuantity",
													s.data.sentQuantity);
									g.getStore().getById(pid).set("remark",
											s.data.remark);
									g.getStore().getById(pid).set("status",
											s.data.status);
								}
								Express.MessageBox('保存成功!');

							} else {
								Express.MessageBox(res.exception, 'error');
							}
						});

			}
		}, {
			text : '取消',
			handler : function() {
				var win = Ext.getCmp('opm-edit-win');
				win.close();
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Express.UI.OrderProductMngForm.superclass.constructor.call(this, config);
}

Ext.extend(Express.UI.OrderProductMngForm, Express.Form);