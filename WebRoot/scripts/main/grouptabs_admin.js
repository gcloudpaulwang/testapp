/*
 * ! Ext JS Library 3.0.0 Copyright(c) 2006-2009 Ext JS, LLC licensing@extjs.com
 * http://www.extjs.com/license
 */
var permissions;
var user;
Ext.onReady(function() {
	Ext.QuickTips.init();
	// create some portlet tools using built in Ext tool ids
	var tools = [{
				id : 'gear',
				handler : function() {
					Ext.Msg.alert('Message', 'The Settings tool was clicked.');
				}
			}, {
				id : 'close',
				handler : function(e, target, panel) {
					panel.ownerCt.remove(panel, true);
				}
			}];
	Ajaxx('../profile/infoWithPermissions.do', null, function(res) {
		if (res.success) {
			permissions = res.permissions;
			user = res.data;
			var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [{
					id : 'header',
					region : 'north',
					html : "<h1 class='x-panel-header' style='padding:5px 30px'>当前登陆用户:"
							+ res.data.aokUser.realName
							+ ",欢迎使用A-OK果色管理系统       <a href='../public/logout.jspx'>退出</a></h1>",
					autoHeight : true,
					border : false,
					margins : '0 0 5 0'
				}, {
					layout : 'fit',
					// autoHeight: true,
					border : false,
					autoHeight : false,
					height : 630,
					autoScroll : true,
					margins : '0 0 5 0',
					region : 'south',
					items : [{
						xtype : 'grouptabpanel',
						tabWidth : 130,
						activeGroup : 0,
						items : [{
							mainItem : 0,
							items : [{
								xtype : 'portal',
								title : '基础',
								tabTip : '基础数据',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/base.jpg'/></div>"
									}]
								}]
							}, {

								title : '基础数据',
								layout : 'fit',
								iconCls : 'icon-add',
								tabTip : '基础数据',
								xtype : 'portal',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:0px 0 10px 10px',
											items : [new Aok.UI.DictQueryForm(),new Aok.UI.DictMng()
											]
										}]

							}, {

								title : '商品管理',
								layout : 'fit',
								iconCls : 'icon-add',
								tabTip : '商品管理',
								xtype : 'portal',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:0px 0 10px 10px',
											items : [new Aok.UI.ProductQueryForm(),new Aok.UI.ProductMng()]
										}]

							}, {
								title : '用户管理',
								iconCls : 'x-icon-users',
								tabTip : '用户管理',
								disabled : $.inArray('/user/edit', permissions) > -1
										? false
										: true,
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Aok.UI.UserGrid()]
										}],
								listeners : {
									activate : function(a, data) {
										Ext.getCmp('user-grid').getStore()
												.reload();
									}
								}
							}]
						},  {
							expanded : true,
							items : [{
								xtype : 'portal',
								title : '订单',
								tabTip : '订单',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/order.jpg'/></div>"
									}]
								}]
							}, {
								title : '蛋糕订单',
								xtype : 'portal',
								layout : 'fit',
								//disabled:$.inArray('/gift/list',permissions)>-1?false:true,
								iconCls : 'icon-gift',
								tabTip : '蛋糕订单',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:0px 0 10px 10px',
											items : [new Aok.UI.CakeOrderQueryForm(),new Aok.UI.CakeOrderMng()]
										}],
								listeners : {
								/*activate : function(a, data) {
									Ext.getCmp('gift-grid')
											.getStore().reload();
								}
								 */
								}
							},{
								title : '配件订单',
								xtype : 'portal',
								layout : 'fit',
								//disabled:$.inArray('/gift/list',permissions)>-1?false:true,
								iconCls : 'icon-gift',
								tabTip : '配件订单',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:0px 0 10px 10px',
											items : [new Aok.UI.AccessoryOrderQueryForm(),new Aok.UI.AccessoryOrderMng()]
										}],
								listeners : {
								/*activate : function(a, data) {
									Ext.getCmp('gift-grid')
											.getStore().reload();
								}
								 */
								}
							}]
						},{
							expanded : true,
							items : [{
								xtype : 'portal',
								title : '生产计划',
								tabTip : '生产计划',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/cake_maker.jpg'/></div>"
									}]
								}]
							}, {
								title : '蛋糕生产',
								xtype : 'portal',
								layout : 'fit',
								//disabled:$.inArray('/gift/list',permissions)>-1?false:true,
								iconCls : 'icon-gift',
								tabTip : '蛋糕生产',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Aok.UI.CakeProductionQueryForm(),new Aok.UI.CakeProductionGrid()]
										}],
								listeners : {
								/*activate : function(a, data) {
									Ext.getCmp('gift-grid')
											.getStore().reload();
								}
								 */
								}
							}, {
								title : '配件生产',
								xtype : 'portal',
								iconCls : 'icon-stock',
								tabTip : '配件生产',
								//disabled:$.inArray('/stock/list',permissions)>-1?false:true,
								style : 'padding: 10px;',
								layout : 'fit',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Aok.UI.AccessoryProductionQueryForm(),new Aok.UI.AccessoryProductionGrid()]
										}]
							}]
						},{
							expanded : true,
							items : [{
								xtype : 'portal',
								title : '发货',
								tabTip : '发货',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/shipment.jpg'/></div>"
									}]
								}]
							}, {
								title : '蛋糕发货',
								xtype : 'portal',
								layout : 'fit',
								//disabled:$.inArray('/gift/list',permissions)>-1?false:true,
								iconCls : 'icon-gift',
								tabTip : '蛋糕发货',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											//items : [new Aok.UI.CakeShipmentQueryForm(),new Aok.UI.CakeStoreShipmentGrid()]
											items:[new Aok.UI.CakeShipmentTab()]
										}],
								listeners : {
								/*activate : function(a, data) {
									Ext.getCmp('gift-grid')
											.getStore().reload();
								}
								 */
								}
							}, {
								title : '配件发货',
								xtype : 'portal',
								iconCls : 'icon-stock',
								tabTip : '配件发货',
								//disabled:$.inArray('/stock/list',permissions)>-1?false:true,
								style : 'padding: 10px;',
								layout : 'fit',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Aok.UI.AccessoryShipmentTab()]
										}]
							}]
						}, {
							expanded : true,
							items : [{
								xtype : 'portal',
								title : '财务',
								tabTip : '财务',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/finance.jpg'/></div>"
									}]
								}]
							}, {
								title : '蛋糕订单',
								xtype : 'portal',
								layout : 'fit',
								//disabled:$.inArray('/gift/list',permissions)>-1?false:true,
								iconCls : 'icon-gift',
								tabTip : '蛋糕订单',
								style : 'padding: 10px;',
								items : [{
									columnWidth : .80,
									style : 'padding:10px 0 10px 10px',
									items : [new Aok.UI.CakeFinanceQueryForm(),new Aok.UI.CakeFinanceGrid()]
								}],
								listeners : {
//									activate : function(a, data) {
//										Ext.getCmp('gift-grid').getStore()
//												.reload();
//									}
								}
							}, {
								title : '配件订单',
								xtype : 'portal',
								iconCls : 'icon-stock',
								tabTip : '配件订单',
								//disabled:$.inArray('/stock/list',permissions)>-1?false:true,
								style : 'padding: 10px;',
								layout : 'fit',
								items : [{
									columnWidth : .80,
									style : 'padding:10px 0 10px 10px',
									items : [new Aok.UI.AccessoryFinanceQueryForm(),new Aok.UI.AccessoryFinanceGrid()]
								}]
							}]
						}, {
							expanded : true,
							items : [{
								title : '设置',
								iconCls : 'x-icon-configuration',
								tabTip : 'Configuration tabtip',
								layout : 'fit',
								items : [{
									//columnWidth : .9,
									style : 'padding:10px 10px 10px 10px;',
									items : [{
										html : "<div style='text-align:center;margin:50px 0px;'><img src='../images/main/setting.jpg'/></div>"
									}]
								}]
							}, {
								title : '个人信息',
								iconCls : 'x-icon-user',
								tabTip : '个人信息',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Aok.UI.ProfileForm()]
										}],
								listeners : {
									activate : function(tab) {
										Aok.UI.ProfileLoad();
									}
								}
							}]
						}]
					}]
				}]
			});
		} else {
			Sp.MessageBox(res.exception, 'error');
		}
	});
});
