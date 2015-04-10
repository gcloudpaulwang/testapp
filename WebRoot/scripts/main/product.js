var productType = [['蛋糕', '蛋糕'], ['点心', '点心'], ['干货', '干货'],
		['工场用料', '工场用料'], ['湿货', '湿货'], ['水果', '水果'], ['特殊', '特殊']];

Aok.UI.ProductMng = function(itemConfig) {
	var config = {
		autoHeight : true,
		anchor : '100%',
		title : '产品管理',
		viewConfig : {
		// forceFit:true
		},
		autoScroll : true,
		items : [ new Aok.UI.ProductGrid]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.ProductMng.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.ProductMng, Ext.Panel);

Aok.UI.ProductQueryForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 100, // label settings here cascade unless overridden
		// id : 'order-query-form',
		frame : true,
		// title : '查询条件',
		bodyStyle : 'padding:5px 5px 0',
		items : [{
					layout : "column",
					items : [{
								columnWidth : .32,
								layout : "form",
								items : [{
											xtype : 'combo',
											fieldLabel : '类型',
											width : 230,
											id : 'dict-type',
											hiddenName : 'order.type',
											name : 'order.type',
											mode : 'local',
											editable : true,
											triggerAction : 'all',
											displayField : 'text',
											valueField : 'value',
											// allowBlank : false,
											store : new Ext.data.ArrayStore({
														fields : ['value',
																'text'],
														data : productType
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
											fieldLabel : '名称',
											name : 'order.seqNo',
											xtype : 'textfield',
											width : 230,
											id : 'ogqf-seqNo'
										}]

							}, {

								columnWidth : .32,
								layout : "form",
								defaults : {
									width : 210
								},
								items : [{
											fieldLabel : '代码',
											name : 'order.deliveryNo',
											xtype : 'textfield',
											width : 230,
											id : 'ogqf-deliveryNo'
										}]

							}]

				}],
		buttonAlign : 'left',
		buttons : [{
					text : '搜索',
					handler : function() {
						var g = Ext.getCmp('product-grid');
						var f = Ext.getCmp('product-form');
						var name = Ext.getCmp('ogqf-seqNo').getValue();
						var type = Ext.getCmp('dict-type').getValue();
						var zjCode = Ext.getCmp('ogqf-deliveryNo').getValue();
						g.getStore().load({
									params : {
										start : 0,
										limit : ORDER_PAGE_SIZE,
										'p.name' : name,
										'p.type' : type,
										'p.zjCode' : zjCode
									}
								});
					}
				}]
	}, config = Ext.apply(config, {});
	Aok.UI.ProductQueryForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.ProductQueryForm, Sp.Form);

Aok.UI.ProductGrid = Ext.extend(Sp.Grid, {
	config : {
		id : 'product-grid',
		frame : true,
		// title : '基础数据管理',
		autoHeight : false,
		height : 500,
		autoScoll : true,
		defaults : {
			width : 100,
			sortable : true
		},
		columns : [{
					header : '名称',
					dataIndex : 'name',
					sortable : true
				}, {
					header : '产品编号',
					dataIndex : 'id',
					sortable : true
				}, {
					header : '规格',
					dataIndex : 'spec',
					sortable : true
				}, {
					header : '单位',
					dataIndex : 'unit',
					sortable : true
				}, {
					header : '类别',
					dataIndex : 'type',
					sortable : true
				}, {
					header : '性质',
					dataIndex : 'prop',
					sortable : true
				}, {
					header : '助记码',
					dataIndex : 'zjCode',
					sortable : true
				}, {
					header : '其他描述',
					dataIndex : 'remark',
					sortable : true
				},{
					header : '操作',
					dataIndex : 'id',
					renderer : function(v, a, b) {
						var h = "<input type='button' value='删除' onclick='Sp.UI.userDel("
								+ v + ")'>";
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
							var f = new Aok.UI.ProductForm();
							var win = new Sp.Window({
										id : 'product-edit-win',
										title : '新建商品',
										items : [f]
									});
							win.show();
						}
					}, {
						xtype : 'button',
						text : '编辑',
						iconCls : 'icon-edit',
						handler : function() {
							var s = Ext.getCmp('product-grid').getSelectionModel();
							if (s.hasSelection()) {
								var rd = s.getSelected();
								// var tmp=clone(rd.data);
								var f = new Aok.UI.ProductForm(rd.data);
								var win = new Sp.Window({
											id : 'product-edit-win',
											title : '编辑商品',
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
			pageSize : 12
		}
	},
	constructor : function(itemConfig) {
		config = Ext.apply(this.config, itemConfig || {});
		Aok.UI.ProductGrid.superclass.constructor.call(this, config);
	},
	// 初始化方法
	initComponent : function() {
		this.init();
		Aok.UI.ProductGrid.superclass.initComponent.call(this);
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
					url : '../product/list.do',
					// remoteSort:true,
					autoLoad : false,
					root : 'data',
					totalProperty : 'totalCount',
					fields : ['id', 'name', 'spec', 'unit',
							'type', 'zjCode', 'prop',
							'remark'],
					listeners : {
						loadexception : function(a, b, response) {
							Sp.MessageBox(response.responseJSON.exception);
						},
						beforeload : function() {
						},
						load : function(s) {
						}
					}
				});
	},
	loadData : function() {
		var g = Ext.getCmp('product-grid');
	},
	getStore : function() {
		var g = Ext.getCmp('product-grid');
		return g.store;
	}
});

Aok.UI.userDel = function(id) {
	Ext.Msg.confirm('提示', '确定将删除该商品,请确认', function(bn) {
				if (bn == 'yes') {
					Ext.MessageBox.wait("正在删除,请稍侯...");
					Ajaxx('../user/del.do', {
								'u.id' : id
							}, function(res) {
								if (res.success) {
									Sp.MessageBox('删除成功!');
									Ext.getCmp('product-grid').getStore().reload();
								} else {
									Sp.MessageBox(res.exception, 'error');
								}
							});
				}
			});

};

Aok.UI.ProductForm = function(itemConfig) {
	var data = itemConfig ? itemConfig : null;
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'product-form',
		frame : true,
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '名称',
					name : 'p.name',
					blankText : '名称不能为空',
					value : data ? data["name"] : '',
					allowBlank : false
				}, {
					fieldLabel : '产品编号',
					name : 'p.id',
					blankText : '产品编号不能为空',
					value : data ? data["id"] : '',
					allowBlank : false
				}, {
					fieldLabel : '规格',
					name : 'p.spec',
					blankText : '规格不能为空',
					value : data ? data["spec"] : '',
					allowBlank : false
				}, {
					fieldLabel : '单位',
					name : 'p.unit',
					blankText : '单位不能为空',
					value : data ? data["unit"] : '',
					allowBlank : false
				}, {
					id : 'type',
					xtype : 'combo',
					fieldLabel : '类别',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					displayField : 'text',
					hiddenValue : data ? data["type"] : '',
					valueField : 'value',
					value : data ? data["type"] : '',
					blankText : '工厂不能为空',
					hiddenName : 'p.type',
					allowBlank : false,
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : productType
							})
				}, {
					fieldLabel : '性质',
					name : 'p.prop',
					blankText : '性质不能为空',
					value : data ? data["prop"] : '',
					allowBlank : false
				}, {
					fieldLabel : '助记码',
					name : 'p.zjCode',
					blankText : '助记码不能为空',
					value : data ? data["zjCode"] : '',
					allowBlank : false
				}, {
					fieldLabel : '其他描述',
					name : 'p.remark',
					value : data ? data["remark"] : '',
					allowBlank : true
				}],
		buttonAlign : 'center',
		buttons : [{
			text : data ? '编辑' : '创建',
			iconCls : 'icon-save',
			handler : function() {
				var f = Ext.getCmp('product-form');
				var win = Ext.getCmp('product-edit-win');
				f.submit(data ? '../product/edit.do' : '../product/add.do',  null, win, function(res) {
							if (res.success) {
								Sp.MessageBox('保存成功!');
								Ext.getCmp('product-grid').getStore().reload();
							} else {
								Sp.MessageBox(res.exception, 'error');
							}
						});
			}
		}]
	};
	config = Ext.apply(config, {});
	Aok.UI.ProductForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.ProductForm, Sp.Form);
