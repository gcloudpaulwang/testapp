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
			permissions=res.permissions;
			user=res.data;
			var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [{
					id : 'header',
					region : 'north',
					html : "<h1 class='x-panel-header' style='padding:5px 30px'>当前登陆用户:"+ res.data.aokUser.realName + ",欢迎使用AOK果色订单管理系统       <a href='../public/logout.jspx'>退出</a></h1>",
					autoHeight : true,
					border : false,
					margins : '0 0 5 0'
				}, {
					layout : 'fit',
					// autoHeight: true,
					border : false,
					autoHeight : false,
					height : 630,
					autoScroll:true,
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
										title : '送单管理',
										tabTip : '送单管理',
										layout : 'fit',
										items : [{
											//columnWidth : .9,
											style : 'padding:10px 10px 10px 10px;' ,
												 items:[{html:"<div style='text-align:center;margin:50px 0px;'><img src='../images/main/delivery.jpg'/></div>"}]
											}]
									},/* {
										title : '送单操作',
										layout : 'fit',
										iconCls : 'icon-search',
										tabTip : '送单操作',
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													new Express.UI.OrderQueryForm(),
													new Express.UI.OrderListGrid()]
										}]
									},*/{

										title : '送单录入',
										layout : 'fit',
										iconCls : 'icon-add',
										tabTip : '送单录入',
										xtype : 'portal',
										disabled:$.inArray('/order1/summaryStatistics',permissions)>-1?false:true,
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:0px 0 10px 10px',
											items : [
													new Express.UI.OrderImportQueryForm(),
													new Express.UI.OrderListPanel({items:[new Express.UI.OrderImportListGrid()]})
													]
										}]

									}, {
										title : '送单处理',
										layout : 'fit',
										iconCls : 'icon-search',
										tabTip : '送单处理',
										xtype : 'portal',
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													new Express.UI.OrderQueryOperateForm(),
													new Express.UI.OrderListPanel({items:[new Express.UI.OrderListOperateGrid()]})
													]
										}]
									},{

										title : '综合查询',
										layout : 'fit',
										iconCls : 'icon-search',
										tabTip : '综合查询',
										xtype : 'portal',
										disabled:$.inArray('/order1/summaryStatistics',permissions)>-1?false:true,
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													new Express.UI.OrderGlobalQueryForm(),
													new Express.UI.OrderListPanel({items:[new Express.UI.OrderGlobalListGrid()]})
											]
										}]

									},{

										title : '当天送单',
										layout : 'fit',
										iconCls : 'icon-search',
										tabTip : '当天送单',
										xtype : 'portal',
										disabled:$.inArray('/order1/exportToday',permissions)>-1?false:true,
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													//new Express.UI.OrderTodayListGrid()
													new Express.UI.OrderListPanel({items:[new Express.UI.OrderTodayListGrid()]})
											]
										}]

									}, {

										title : '指标统计',
										layout : 'fit',
										iconCls : 'icon-statistics',
										tabTip : '指标统计',
										xtype : 'portal',
										disabled:$.inArray('/order1/summaryStatistics',permissions)>-1?false:true,
										style : 'padding: 10px;',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													new Express.UI.PointQueryForm(),
													new Express.UI.PointSummaryGrid(),
													new Express.UI.PointDeliverorGrid()]
										}]

									}]
						}, {
							expanded : true,
							items : [{
										xtype : 'portal',
										title : '库存管理',
										tabTip : '库存管理',
										layout : 'fit',
										items : [{
											//columnWidth : .9,
											style : 'padding:10px 10px 10px 10px;' ,
												 items:[{html:"<div style='text-align:center;margin:50px 0px;'><img src='../images/main/stock.jpg'/></div>"}]
											}]
									}, {
										title : '礼品管理',
										xtype : 'portal',
										layout : 'fit',
										disabled:$.inArray('/gift/list',permissions)>-1?false:true,
										iconCls : 'icon-gift',
										tabTip : '礼品管理',
										style : 'padding: 10px;',
										items : [{
													columnWidth : .80,
													style : 'padding:10px 0 10px 10px',
													items : [new Express.UI.GiftGrid()]
												}],
										listeners : {
											activate : function(a, data) {
												Ext.getCmp('gift-grid')
														.getStore().reload();
											}
										}
									}, {
										title : '库存',
										xtype : 'portal',
										iconCls : 'icon-stock',
										tabTip : '库存',
										disabled:$.inArray('/stock/list',permissions)>-1?false:true,
										style : 'padding: 10px;',
										layout : 'fit',
										items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [
													{
														xtype : 'portal',
														// title: 'Dashboard',
														style : 'padding:0px 30px 0px 0px',
														tabTip : '库存',
														items : [
																new Express.UI.StockSearchForm(),
																new Express.UI.StockInForm]
													},
													new Express.UI.StockGrid(),
													new Express.UI.StockRecordGrid()]
										}]
									}, {
										title : '出库管理',
										xtype : 'portal',
										iconCls : 'icon-stockout',
										tabTip : '出库管理',
										disabled:$.inArray('/stock/listStockOut',permissions)>-1?false:true,
										style : 'padding: 10px;',
										layout : 'fit',
										items : [{
													columnWidth : .80,
													style : 'padding:10px 0 10px 10px',
													id : 'stock-out-container',
													// items: [new
													// Express.UI.StockOutForm()]
													items : []
												}],
										listeners : {
											activate : function(a, data) {
												// var
												// abc=Ext.getCmp('stock-out-container');
												// /abc.add(new
												// Express.UI.StockGrid());
												// abc.doLayout();
												// debugger;
												Express.UI.StockOutGridInit();
											}
										}
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
											style : 'padding:10px 10px 10px 10px;' ,
												 items:[{html:"<div style='text-align:center;margin:50px 0px;'><img src='../images/main/setting.jpg'/></div>"}]
											}]
								}, {
								title : '个人信息',
								iconCls : 'x-icon-user',
								tabTip : '个人信息',
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Express.UI.ProfileForm()]
										}],
								listeners : {
									activate : function(tab) {
										Express.UI.ProfileLoad();
									}
								}
							}, {
								title : '用户管理',
								iconCls : 'x-icon-users',
								tabTip : '用户管理',
								disabled:$.inArray('/user/edit',permissions)>-1?false:true,
								style : 'padding: 10px;',
								items : [{
											columnWidth : .80,
											style : 'padding:10px 0 10px 10px',
											items : [new Express.UI.UserGrid()]
										}],
								listeners : {
									activate : function(a, data) {
										Ext.getCmp('user-grid').getStore()
												.reload();
									}
								}
							}]
						}]
					}]
				}]
			});
		} else {
			Express.MessageBox(res.exception, 'error');
		}
	});
});
