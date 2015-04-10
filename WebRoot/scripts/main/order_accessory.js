Aok.UI.OrderAccessoryTabForm = function(itemConfig) {
	var oid = itemConfig ? itemConfig.oid : null;
	var editable = itemConfig ? itemConfig.editable : null;
	var productTypes = itemConfig ? itemConfig.productTypes : null;
	var accessories = itemConfig ? itemConfig.accessories : null;
	var products = itemConfig ? itemConfig.products : null;
	var addmode = itemConfig ? itemConfig.addmode : null;
	var config = {
		labelWidth : 75,
		height : 450,
		autoScroll : true,
		id : 'order-accessory-tab-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		//bodystyle:'overflow:auto;overflow-x:hidden;overflow-y:auto;border:1px solid #99bbe8;',
		items : [new Aok.UI.AccessoryItemTab2({
					oid : oid,
					productTypes : productTypes,
					accessories : accessories,
					products : products,
					addmode : addmode
				})],
		buttonAlign : 'center',
		buttons : [{
			text : addmode ? '添加' : '调整',
			hidden : !editable,
			handler : function(a, b, c) {
				var f = Ext.getCmp('order-accessory-tab-form');
				var win = Ext.getCmp('accessory-manager-win');
				f.submit('../accessory/order/batch_save_accessory.do', {
							'batch.oid' : oid
						}, win, function(res) {
							if (res.success) {
								Sp.MessageBox(addmode ? '添加成功' : '调整成功!');
								if (!addmode) {
									Ext.getCmp('accessory-change-grid')
											.getStore().reload();
									Ext.getCmp('accessory-order-grid')
											.getStore().reload();
								}
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.OrderAccessoryTabForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.OrderAccessoryTabForm, Sp.Form);

Aok.UI.AccessoryItemTab2 = function(itemConfig) {
	var oid = itemConfig ? itemConfig.oid : null;
	var productTypes = itemConfig ? itemConfig.productTypes : null;
	var accessories = itemConfig ? itemConfig.accessories : null;
	var products = itemConfig ? itemConfig.products : null;
	var addmode = itemConfig ? itemConfig.addmode : null;
	var exist_accessories = [];
	var product_map = new Map();
	for (var i = 0; i < products.length; i++) {
		var products_byType = product_map.get(products[i].type);
		if (products_byType == null) {
			products_byType = [];
			product_map.put(products[i].type, products_byType);
		}
		products_byType.push([products[i].id, products[i].name]);
	}
	for (var i = 0; i < accessories.length; i++) {
		exist_accessories.push(accessories[i].product.name);
	}
	var tab_items = [];
	var index = 0;
	var makeHeader=function(){
		var header_item = {
				defaults : {
					width : 50,
					style : {
						'text-align' : 'center'
					},
					labelWidth : 0,
					hideLable : true
				},
				layout : "column",
				items : [{
							columnWidth : .27,
							items : [new Ext.form.DisplayField({
										value : '名称'
									})]
						}, {
							columnWidth : .22,
							items : [new Ext.form.DisplayField({
										hidden : addmode ? true : false,
										value : '订货数量'
									})]
						}, {
							columnWidth : .22,
							items : [new Ext.form.DisplayField({
										value : addmode ? '数量' : '调整数量'
									})]
						}, {
							columnWidth : .22,
							items : [new Ext.form.DisplayField({
										hidden : addmode ? true : false,
										value : '合计数量'
									})]
						}]
			};
		return header_item;
	};
	for (var i = 0; i < productTypes.length; i++) {
		var title = productTypes[i].value;
		// var typeKey= productTypes[i].key;
		if (title == '蛋糕'||title=='工场用料')
			continue;
		var accessory_items = [];
		
		
		//accessory_items.push(header_item);
		for (var j = 0; j < accessories.length; j++) {//已添加过的
			// debugger;
			if (title == accessories[j].product.type) {
				var item = {
					defaults : {
						width : 50,
						style : {
							'text-align' : 'center'
						},
						labelWidth : 0,
						hideLable : true
					},
					layout : "column",
					items : [{
						columnWidth : .27,
						items : [new Ext.form.DisplayField({
											value : accessories[j].product.name
										}), {
									xtype : 'hidden',
									value : accessories[j].product.id,
									name : 'batch.items[' + index + '].'
											+ 'pid'
								}, {
									xtype : 'hidden',
									value : 'modify',
									name : 'batch.items[' + index + '].'
											+ 'action'
								}]
					}, {
						columnWidth : .22,
						items : [new Ext.form.DisplayField({
									id : 'orgl_' + index,
									hidden : addmode ? true : false,
									value : accessories[j].qty
								})]
					}, {
						columnWidth : .22,
						items : [{
							xtype : 'numberfield',
							//value : 0,
							width : 50,
							name : 'batch.items[' + index + '].' + 'modifyQty',
							allowBlank : true,
							decimalPrecision : 2,
							myIndex : index,
							listeners : {
								change : function(cmp, v) {
									if (!addmode) {
										var onglCmp = Ext.getCmp('orgl_'
												+ this.myIndex);
										var newCmp = Ext.getCmp('new_'
												+ this.myIndex);
										newCmp.setValue(parseFloat(onglCmp
												.getValue()==''?0:onglCmp
														.getValue())
												+ parseFloat(v));
									}
								}
							}
						}]
					}, {
						columnWidth : .22,
						items : [new Ext.form.DisplayField({
									hidden : addmode ? true : false,
									id : 'new_' + index,
									value : accessories[j].qty
								})]
					}]
				};
				var item_with_hr={
						items:[item,{ xtype: 'displayfield', value: '<hr width=800/>' }]
				};
				accessory_items.push(item_with_hr);
				index++;
			}
		}
		for (var j = 0; j < products.length; j++) {//未添加过的
			if (title == products[j].type) {
				if ($.inArray(products[j].name, exist_accessories) >= 0) {
					continue;
				}
				var item = {
					defaults : {
						width : 50,
						style : {
							'text-align' : 'center'
						},
						labelWidth : 0,
						hideLable : true
					},
					layout : "column",
					items : [{
						columnWidth : .27,
						items : [new Ext.form.DisplayField({
											value : products[j].name
										}), {
									xtype : 'hidden',
									value : products[j].id,
									name : 'batch.items[' + index + '].'
											+ 'pid'
								}, {
									xtype : 'hidden',
									value : 'new',
									name : 'batch.items[' + index + '].'
											+ 'action'
								}]
					}, {
						columnWidth : .22,
						items : [new Ext.form.DisplayField({
									hidden : addmode ? true : false,
									id : 'orgl_' + index,
									value : ''
								})]
					}, {
						columnWidth : .22,
						items : [{
							xtype : 'numberfield',
							//value : 0,
							width : 50,
							name : 'batch.items[' + index + '].' + 'newQty',
							allowBlank : true,
							decimalPrecision : 2,
							myIndex : index,
							listeners : {
								change : function(cmp, v) {
									if (!addmode) {
										var onglCmp = Ext.getCmp('orgl_'
												+ this.myIndex);
										var newCmp = Ext.getCmp('new_'
												+ this.myIndex);
										//debugger;
										newCmp.setValue(parseFloat(onglCmp
												.getValue()==''?0:onglCmp
														.getValue())
												+ parseFloat(v));
									}
								}
							}
						}]
					}, {
						columnWidth : .22,
						items : [new Ext.form.DisplayField({
									hidden : addmode ? true : false,
									id : 'new_' + index,
									value : ''
								})]
					}]
				};
				var item_with_hr={
						items:[item,{ xtype: 'displayfield', value: '<hr width=800/>' }]
				};
				accessory_items.push(item_with_hr);
				index++;
			}
		}
		var items_max_length=30;
		var items_length=accessory_items.length;
		for(var k=0;k<=items_length/items_max_length;k++){
			var new_title;
			if(items_length>items_max_length)
				new_title=title+(k+1);
			else
				new_title=title;
			var tab_items_tmp=accessory_items.slice(k*items_max_length,(k+1)*items_max_length);
			tab_items_tmp.splice(0,0,makeHeader());
			tab_items.push({
				layout : "anchor",
				title : new_title,
				id : new_title,
				width:500,
				autoScroll : true,
				items : tab_items_tmp
			});
			if(items_length%items_max_length==0&&(k+1)*items_max_length==items_length)
				break;
		}
		
	}
	var config = {
		id : 'order-accessory-tab-2',
		autoScroll : true,
		enableTabScroll:true,
		items : tab_items
	}
	config = Ext.apply(config, {});
	Aok.UI.AccessoryItemTab2.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryItemTab2, Sp.Tab);

Aok.UI.AccessoryItemTab = function(itemConfig) {
	var oid = itemConfig ? itemConfig.oid : null;
	var productTypes = itemConfig ? itemConfig.productTypes : null;
	var accessories = itemConfig ? itemConfig.accessories : null;
	var products = itemConfig ? itemConfig.products : null;
	var exist_accessories = [];
	var product_map = new Map();
	for (var i = 0; i < products.length; i++) {
		var products_byType = product_map.get(products[i].type);
		if (products_byType == null) {
			products_byType = [];
			product_map.put(products[i].type, products_byType);
		}
		products_byType.push([products[i].id, products[i].name]);
	}
	for (var i = 0; i < accessories.length; i++) {
		exist_accessories.push(accessories[i].product.name);
	}
	var tab_items = [];
	var index = 0;
	for (var i = 0; i < productTypes.length; i++) {
		var title = productTypes[i].value;
		// var typeKey= productTypes[i].key;
		if (title == '蛋糕')
			continue;
		var accessory_items = [];
		var header_item = {
			defaults : {
				width : 50,
				style : {
					'text-align' : 'center'
				},
				labelWidth : 0,
				hideLable : true
			},
			layout : "column",
			items : [{
						columnWidth : .25,
						items : [new Ext.form.DisplayField({
									value : '名称'
								})]
					}, {
						columnWidth : .2,
						items : [new Ext.form.DisplayField({
									value : '订货数量'
								})]
					}, {
						columnWidth : .2,
						items : [new Ext.form.DisplayField({
									value : '调整数量'
								})]
					}, {
						columnWidth : .2,
						items : [new Ext.form.DisplayField({
									value : '合计数量'
								})]
					}]
		};
		accessory_items.push(header_item);
		for (var j = 0; j < accessories.length; j++) {
			// debugger;
			if (title == accessories[j].product.type) {
				var item = {
					defaults : {
						width : 50,
						style : {
							'text-align' : 'center'
						},
						labelWidth : 0,
						hideLable : true
					},
					layout : "column",
					items : [{
						columnWidth : .25,
						items : [new Ext.form.DisplayField({
											value : accessories[j].product.name
										}), {
									xtype : 'hidden',
									value : accessories[j].product.id,
									name : 'batch.items[' + index + '].'
											+ 'pid'
								}, {
									xtype : 'hidden',
									value : 'modify',
									name : 'batch.items[' + index + '].'
											+ 'action'
								}]
					}, {
						columnWidth : .2,
						items : [new Ext.form.DisplayField({
									id : 'orgl_' + index,
									value : accessories[j].qty
								})]
					}, {
						columnWidth : .2,
						items : [{
							xtype : 'numberfield',
							value : 0,
							width : 50,
							name : 'batch.items[' + index + '].' + 'modifyQty',
							allowBlank : false,
							decimalPrecision : 2,
							myIndex : index,
							listeners : {
								change : function(cmp, v) {
									var onglCmp = Ext.getCmp('orgl_'
											+ this.myIndex);
									var newCmp = Ext.getCmp('new_'
											+ this.myIndex);
									newCmp.setValue(parseFloat(onglCmp
											.getValue())
											+ parseFloat(v));
								}
							}
						}]
					}, {
						columnWidth : .2,
						items : [new Ext.form.DisplayField({
									id : 'new_' + index,
									value : accessories[j].qty
								})]
					}]
				};
				accessory_items.push(item);
				index++;
			}
		}
		accessory_items.push(buildInputItem(product_map, title, index));
		index++;
		/*
		 * tab_items.push(new Sp.Panel({ // height:500, layout : "anchor", title :
		 * title, id : title, items : accessory_items }));
		 */
		tab_items.push({
					layout : "anchor",
					title : title,
					id : title,
					items : accessory_items
				});
	}
	function buildInputItem(product_map, title, index) {
		var input_item = {
			id : 'input_' + index,
			defaults : {
				width : 50,
				style : {
					'text-align' : 'center'
				},
				labelWidth : 0,
				hideLable : true
			},
			layout : "column",
			items : [{
				columnWidth : .25,
				items : [{
					id : 'product_' + index,
					xtype : 'combo',
					displayField : 'text',
					valueField : 'value',
					width : 100,
					mode : 'local',
					triggerAction : 'all',
					hiddenName : 'batch.items[' + index + '].' + 'pid',
					myIndex : index,
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : product_map.get(title)
							}),
					listeners : {
						beforeselect : function(cmp, record) {
							if ($.inArray(record.json[1], exist_accessories) >= 0) {
								Sp.MessageBox('配件' + record.json[1] + '已存在');
								Ext.getCmp()
								return false;
							} else {
								if (cmp.lastSelectionText == undefined
										|| cmp.lastSelectionText == '')
									Ext.getCmp('order-accessory-tab')
											.addAccessory(title);
								else {
									exist_accessories
											.remove(cmp.lastSelectionText);
								}
								exist_accessories.push(record.json[1]);
							}
						}
					}
				}, {
					xtype : 'hidden',
					value : 'new',
					name : 'batch.items[' + index + '].' + 'action'
				}]
			}, {
				columnWidth : .2,
				items : [{
							xtype : 'numberfield',
							value : 0,
							width : 50,
							name : 'batch.items[' + index + '].' + 'newQty',
							allowBlank : false,
							decimalPrecision : 2,
							myIndex : index,
							listeners : {
								change : function(cmp, v) {
									var newCmp = Ext.getCmp('new_'
											+ this.myIndex);
									newCmp.setValue(v);
								}
							}

						}]
			}, {
				columnWidth : .2,
				items : [new Ext.form.DisplayField({
							value : '0'
						})]
			}, {
				columnWidth : .2,
				items : [new Ext.form.DisplayField({
							id : 'new_' + index,
							value : '0'
						})]
			}, {
				// id : 'opt_' + index,
				columnWidth : .1,
				html : "<a href='javascript:void(0);' onclick='removeAccessory(\""
						+ title + "\"," + index + ")'>移除</a>"
			}]
		};
		return input_item;
	}

	// debugger;
	var config = {
		id : 'order-accessory-tab',
		items : tab_items,
		myIndex : index,
		addAccessory : function(title) {
			Ext.getCmp(title).add(buildInputItem(product_map, title,
					this.myIndex));
			this.myIndex++;
			Ext.getCmp(title).doLayout();
			Ext.getCmp('accessory-manager-win').doLayout();
			Ext.getCmp('order-accessory-tab-form').doLayout();
			Ext.getCmp('order-accessory-tab').doLayout();
		},
		removeAccessory : function(title, index) {
			var selectCmp = Ext.getCmp('product_' + index);
			if (selectCmp.value == '')
				return;
			for (var i = 0; Ext.getCmp(title).items.items.length; i++) {
				if (Ext.getCmp(title).items.items[i].id == 'input_' + index) {
					Ext.getCmp(title).remove(i);
					Ext.getCmp(title).doLayout();
					exist_accessories.remove(selectCmp.lastSelectionText);
					return;
				}
			}
		}
	}

	config = Ext.apply(config, {});
	Aok.UI.AccessoryItemTab.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.AccessoryItemTab, Sp.Tab);
function removeAccessory(title, index) {
	Ext.getCmp('order-accessory-tab').removeAccessory(title, index);
}

Aok.UI.AccessoryChangeGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'accessory-change-grid',
		frame : true,
		title : '配件调整记录',
		autoHeight : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [new Ext.grid.CheckboxSelectionModel({
							singleSelect : true
						}), new Ext.grid.RowNumberer(), {
					header : '调整时间',
					dataIndex : 'schangeDate',
					sortable : true
				}, {
					header : '操作人',
					dataIndex : 'operator',
					sortable : true
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
				text : '详情',
				iconCls : 'icon-edit',
				listeners : {
					beforerender : function() {
						var g = Ext.getCmp('accessory-change-grid');
						if (g.editable == false) {
							if (user.role.id == 3)
								return false;
						}
						return true;
					}
				},
				handler : function() {
					var s = Ext.getCmp('accessory-change-grid')
							.getSelectionModel();
					if (s.hasSelection()) {
						var record = s.getSelected();
						var g = new Aok.UI.AccessoryChangeItemGrid({
									cid : record.data.id
								});
						var win = new Sp.Window({
									width : 600,
									id : 'accessory-change-item-win',
									title : record.data.schangeDate + ' 调整内容',
									items : [g]
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
		Aok.UI.AccessoryChangeGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.AccessoryChangeGrid.superclass.initComponent.call(this);
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
					url : '../accessory/order/list_changes.do',
					baseParams : {
						'oid' : this.oid
					},
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'oid', 'schangeDate', 'operator'],
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
		var g = Ext.getCmp('accessory-change-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('accessory-change-grid');
		return g.store;
	}
});

Aok.UI.AccessoryChangeItemGrid = Ext.extend(Sp.Grid, {
			config : {
				id : 'accessory-change-item-grid',
				frame : true,
				// title : '调整详情',
				autoHeight : true,
				defaults : {
					width : 100,
					sortable : true
				},
				columns : [new Ext.grid.RowNumberer(), {
							header : '配件',
							dataIndex : 'product.name',
							sortable : true
						}, {
							header : '操作类型',
							dataIndex : 'action',
							sortable : true
						}, {
							header : '调整前数量',
							dataIndex : 'orglQty',
							sortable : true
						}, {
							header : '调整数',
							dataIndex : 'dif',
							sortable : true
						}, {
							header : '调整后数量',
							dataIndex : 'newQty',
							sortable : true
						}],
				bbar : {
					xtype : 'paging',
					pageSize : 10
				}
			},
			constructor : function(itemConfig) {
				config = Ext.apply(this.config, itemConfig || {});
				Aok.UI.AccessoryChangeItemGrid.superclass.constructor.call(
						this, config);
			},
			// 初始化方法
			initComponent : function() {
				this.init();
				Aok.UI.AccessoryChangeItemGrid.superclass.initComponent
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
							url : '../accessory/order/list_change_items.do',
							baseParams : {
								'cid' : this.cid
							},
							root : 'data',
							totalProperty : 'totalCount',
							fields : ['id', 'change.id', 'newQty', 'orglQty',
									'action', 'dif', 'product.name'],
							autoLoad : true,
							listeners : {
								loadexception : function(a, b, response) {
									Sp
											.MessageBox(response.responseJSON.exception);
								},
								beforeload : function() {
									if (g.cid == null)
										return false;
								},
								load : function(s) {
									Ext.getCmp('accessory-change-item-win')
											.doLayout();
								}
							}
						});
			},
			loadData : function() {
				var g = Ext.getCmp('accessory-change-item-grid');
			},
			getStore : function() {
				var g = Ext.getCmp('accessory-change-item-grid');
				return g.store;
			}
		});
