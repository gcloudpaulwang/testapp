Ext.namespace("edu.UI");
var yearStore=[['2012年'],['2013年'],['2014年'],['2015年'],['2016年'],['2017年'],['2018年'],['2019年'],['2020年']];
//图片urls                        
var imgUrls={},imgUrls2={};


//图片观览-窗口
edu.UI.imageWindow = function(itemConfig){
	var config={
        id: 'image-window',
        index:1,
        max:0,
        title : '图片浏览',
        modal:true,
        maximizable:true,
        width : 750,
        height : 500,
        resizable : false,
        items:[{
            img_view_id : this.id + '_img',
            tbar:{
                items:[{
                      text : "上一张",
                      iconCls:'icon-previous',
                      handler:function(){
                      	var items=imgUrls.items;
                      	if(!items)
                      	   return Edu.MessageBox('没有相关电子课本页码数据','error');
                      	var com=Ext.getCmp('image-window');
                        var page=com.index-1;
                        if(page==0){
                            return Edu.MessageBox('已经是第一页','error');
                        }
                        --com.index;
                        var url=getImageUrl(page);
                        var win=Ext.getCmp('image-window');
                        win.setTitle('电子课本第'+page+'页' );
                        if(url<0){
                            return Edu.MessageBox('此页不存在','error');
                        }
                        Ext.get('win_view-image').dom.src=url;
                      }
                },{
                      text : "下一张",
                      iconCls:'icon-next',
                      handler:function(){
                      	var items=imgUrls.items;
                      	if(!items)
                      	   return Edu.MessageBox('没有相关电子课本页码数据','error');
                      	var com=Ext.getCmp('image-window');
                        var page=com.index+1;
                        if(page>com.max){
                            return Edu.MessageBox('已经是最后一页','error');
                        }
                        ++com.index;
                        var url=getImageUrl(page);
                        var win=Ext.getCmp('image-window');
                        win.setTitle('电子课本第'+page+'页' );
                        if(url<0){
                            return Edu.MessageBox('此页不存在','error');
                        }
                        Ext.get('win_view-image').dom.src=url;
                      }
                },'->',{
                	id:'win_page_sum',
                	xtype:'label'
                },'-',{
                    xtype:'label',
                    text:'转至:'
                },{
                    id:'win_positive_page',
                    width:30,
                    xtype:'numberfield',
					regex:/^[1-9]+[0-9]*$/,
					regexText:'请输入一个大于0的正数'
                },{
                    xtype:'button',
                    iconCls:'icon-positive',
                    text:'确定',
                    handler:function(){
                        var page=parseInt(Ext.getCmp('win_positive_page').getValue(),10);
                        if(page<=0)return Edu.MessageBox('页码必须大于0','error');
                        if(!page)return Edu.MessageBox('请先输入页码','error');
                        var com=Ext.getCmp('image-window');
                        if(page>com.max){
                            return Edu.MessageBox('本书总页数为:'+com.max,'error');
                        }
                        com.index=page;
                        var url=getImageUrl(page);
                        var win=Ext.getCmp('image-window');
                        win.setTitle('电子课本第'+page+'页' );
                        if(url<0){
                            return Edu.MessageBox('此页不存在','error');
                        }
                        Ext.get('win_view-image').dom.src=url;
                    }
                }]
            },
            xtype: 'panel',
            region: 'center',
            layout:'fit',
            bodyStyle : 'background-color:#E5E3DF;',
            frame:false,
            border:false,
            html :'<div id="wmapPic"><div class="nav">'
                +'<div class="up" id="wup"></div><div class="right" id="wright"></div>'
                +'<div class="down" id="wdown"></div><div class="left" id="wleft"></div>'
                +'<div class="zoom" id="wzoom"></div><div class="in" id="win"></div>'
                +'<div class="out" id="wout"></div></div>'
                +'<img id="win_view-image" border="0" style="cursor: url(../images/openhand_8_8.cur), default;" > </div>'
        }],
/*        buttons: [{
            text: '取消',
            handler: function() {
                image_window.hide();
            }
        }],*/
        listeners: {
            'show': function(c) {
                c.init();
            }
        },
        init:function(){
            var imageMove=function(direction,el){
                el.move(direction, 50, true);
            },
            zoom=function(el,type,offset){
                var width = el.getWidth();
                var height = el.getHeight();
                var nwidth = type ? (width * offset) : (width / offset);
                var nheight = type ? (height * offset) : (height / offset);
                var left = type ? -((nwidth - width) / 2):((width - nwidth) / 2);
                var top =  type ? -((nheight - height) / 2):((height - nheight) / 2);
                el.animate(
                    {
                        height: {to: nheight, from: height},
                        width: {to: nwidth, from: width},
                        left: {by:left},
                        top: {by:top}
                    },
                    null,
                    null,
                    'backBoth',
                    'motion'
                );
            },
            restore=function(el){
                var size = el.osize;
                //自定义回调函数
                function center(el,callback){
                    el.center();
                    callback(el);
                }
                el.fadeOut({
                    callback:function(){
                        el.setSize(size.width,size.height,{
                            callback:function(){
                                center(el,function(ee){
                                    ee.fadeIn();
                                });
                            }
                        });
                    }
                });
            };

            var image = Ext.get('win_view-image');
            Ext.get('win_view-image').on({
                'mousedown':{fn:function(){this.setStyle('cursor','url(../images/closedhand_8_8.cur),default;');},scope:image},
                'mouseup':{fn:function(){this.setStyle('cursor','url(../images/openhand_8_8.cur),move;');},scope:image},
                'dblclick':{fn:function(){
                    zoom(image,true,1.2);
                }
            }});
            new Ext.dd.DD(image, 'pic');
            //image.center();//图片居中
            //获得原始尺寸
            image.osize = {
                width:615,
                height:873
            };
            Ext.get('wup').on('click',function(){imageMove('up',image);}); 		//向上移动
            Ext.get('wdown').on('click',function(){imageMove('down',image);});	//向下移动
            Ext.get('wleft').on('click',function(){imageMove('left',image);});	//左移
            Ext.get('wright').on('click',function(){imageMove('right',image);});	//右移动
            Ext.get('win').on('click',function(){zoom(image,true,1.5);});		//放大
            Ext.get('wout').on('click',function(){zoom(image,false,1.5);});		//缩小
            Ext.get('wzoom').on('click',function(){restore(image);});			//还原
        }
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.imageWindow.superclass.constructor.call(this, config);
}
Ext.extend(edu.UI.imageWindow,Edu.Window);


//学案
edu.UI.imagePanel = function(itemConfig){
	var config={
        id: 'image-panel',
        index:1,
        max:0,
        title : '学案',
        img_view_id : this.id + '_img',
        bodyStyle : 'background-color:#E5E3DF;',
        listeners: {
            'afterrender': function(c) {
                c.init();
                var params={
                	'preId':c.pid
                };
                Ajaxx('listSectionPage.do',params,function(res){
                	imgUrls2=res.data;
                	c.max=imgUrls2.items.length;
                	var url=getImageUrl2(c.index);
                	if(url<0){
              			return Edu.MessageBox('此页不存在','error');
              		}
                	Ext.get('view-image').dom.src =url;
                	Ext.getCmp('panel_page_sum').setText('总页数:'+res.data.items.length);
                });                
            }
        },
        init:function(){
            var imageMove=function(direction,el){
                el.move(direction, 50, true);
            },
            zoom=function(el,type,offset){
                var width = el.getWidth();
                var height = el.getHeight();
                var nwidth = type ? (width * offset) : (width / offset);
                var nheight = type ? (height * offset) : (height / offset);
                var left = type ? -((nwidth - width) / 2):((width - nwidth) / 2);
                var top =  type ? -((nheight - height) / 2):((height - nheight) / 2);
                el.animate(
                    {
                        height: {to: nheight, from: height},
                        width: {to: nwidth, from: width},
                        left: {by:left},
                        top: {by:top}
                    },
                    null,
                    null,
                    'backBoth',
                    'motion'
                );
            },
            restore=function(el){
                var size = el.osize;
                //自定义回调函数
                function center(el,callback){
                    el.center();
                    callback(el);
                }
                el.fadeOut({
                    callback:function(){
                        el.setSize(size.width,size.height,{
                            callback:function(){
                                center(el,function(ee){
                                    ee.fadeIn();
                                });
                            }
                        });
                    }
                });
            };

            var image = Ext.get('view-image');
            Ext.get('view-image').on({
                'mousedown':{fn:function(){this.setStyle('cursor','url(../images/closedhand_8_8.cur),default;');},scope:image},
                'mouseup':{fn:function(){this.setStyle('cursor','url(../images/openhand_8_8.cur),move;');},scope:image},
                'dblclick':{fn:function(){
                    zoom(image,true,1.2);
                }
            }});
            new Ext.dd.DD(image, 'pic');
            //image.center();//图片居中
            //获得原始尺寸
            image.osize = {
                width:615,
                height:873
            };
            Ext.get('up').on('click',function(){imageMove('up',image);}); 		//向上移动
            Ext.get('down').on('click',function(){imageMove('down',image);});	//向下移动
            Ext.get('left').on('click',function(){imageMove('left',image);});	//左移
            Ext.get('right').on('click',function(){imageMove('right',image);});	//右移动
            Ext.get('in').on('click',function(){zoom(image,true,1.5);});		//放大
            Ext.get('out').on('click',function(){zoom(image,false,1.5);});		//缩小
            Ext.get('zoom').on('click',function(){restore(image);});			//还原
        },	        
        tbar:{
            items:[{
			iconCls:'icon-add',
			text:'上传学案',
			handler:function(){
				var com=Ext.getCmp('image-panel');
				var win=new Edu.Window({
					id:'studyPlanFormWin',
					title:'上传学案',
					items:[new edu.UI.studyPlanForm({pid:com.pid})]
				});
				win.show();				
			}
		},{
			iconCls:'icon-download',
			text:'下载学案',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				window.open('../preparation/downSection.do?preId='+com.pid);
			}
		},{
                  text : "上一张",
                  iconCls:'icon-previous',
                  handler:function(){
                  	var com=Ext.getCmp('image-panel');
                    var page=com.index-1;
                    if(page==0){
                        return Edu.MessageBox('已经是第一页','error');
                    }
                    --com.index;
                    var url=getImageUrl2(page);
                    if(url<0){
                        return Edu.MessageBox('此页不存在','error');
                    }
                    Ext.get('view-image').dom.src=url;
                  }
            },{
                  text : "下一张",
                  iconCls:'icon-next',
                  handler:function(){
                  	var com=Ext.getCmp('image-panel');
                    var page=com.index+1;
                    if(page>com.max){
                        return Edu.MessageBox('已经是最后一页','error');
                    }
                    ++com.index;
                    var url=getImageUrl2(page);
                    if(url<0){
                        return Edu.MessageBox('此页不存在','error');
                    }
                    Ext.get('view-image').dom.src=url;
                  }
            },'->',{
            	id:'panel_page_sum',
            	xtype:'label'
            },'-',{
                xtype:'label',
                text:'转至:'
            },{
                id:'positive_page',
                width:30,
                xtype:'numberfield',
				regex:/^[1-9]+[0-9]*$/,
				regexText:'请输入一个大于0的正数'
            },{
                xtype:'button',
                iconCls:'icon-positive',
                text:'确定',
                handler:function(){
                    var page=parseInt(Ext.getCmp('positive_page').getValue(),10);
                    if(page<=0)return Edu.MessageBox('页码必须大于0','error');
                    if(!page)return Edu.MessageBox('请先输入页码','error');
                    var com=Ext.getCmp('image-panel');
                    if(page>com.max){
                        return Edu.MessageBox('学案总页数为:'+com.max,'error');
                    }
                    com.index=page;
                    var url=getImageUrl2(page);
                    if(url<0){
                        return Edu.MessageBox('此页不存在','error');
                    }
                    Ext.get('view-image').dom.src=url;
                }
            }]
        },
        html :'<div id="mapPic"><div class="nav">'
            +'<div class="up" id="up"></div><div class="right" id="right"></div>'
            +'<div class="down" id="down"></div><div class="left" id="left"></div>'
            +'<div class="zoom" id="zoom"></div><div class="in" id="in"></div>'
            +'<div class="out" id="out"></div></div>'
            +'<img id="view-image" border="0" style="cursor: url(../images/openhand_8_8.cur), default;" > </div>'      
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.imagePanel.superclass.constructor.call(this, config);
}
Ext.extend(edu.UI.imagePanel,Ext.Panel);

function getImageUrl(page){
	var items=imgUrls.items;
	if(items){
		for(var i=0;i<items.length;i++){
			var n=parseInt(items[i].no,10);
			if(n==page){
				var item=items[i];
				if(item.storageUrl>0){
					return imgUrls.imgStoragePath+item.storageUrl;
				}else{
					return imgUrls.relativeLocalPath+item.no+"."+item.picType
				}
			}
		}
		return -1;
	}
	return -1;
}

function getImageUrl2(page){
	var items=imgUrls2.items;
	if(items){
		for(var i=0;i<items.length;i++){
			var n=parseInt(items[i].index,10);
			if(n==page){
				var item=items[i];
				if(item.storageId>0){
					return imgUrls2.imgStoragePath+item.storageId;
				}else{
					return imgUrls2.relativeLocalPath+item.fileName
				}
			}
		}
		return -1;
	}
}

edu.UI.Tab=Ext.extend(Ext.Panel, {
	frame:false,
	border:false,
	renderTo:'maindiv',
	activeTab:0
});

//user infomation form
edu.UI.userInfoFrom = function(itemConfig) {
	var config = {
		header:true,
		title:'帐户信息',
		frame:false,
		layout:'column',
		defaults:{
			xtype:'myform',
			frame:false,
			border:false,
			bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px'
		},
		items:[{
				defaults:{
					xtype:'textfield',
					anchor:'99%'
				},
				width:600,
				items:[{
						fieldLabel: '用户名',
						value:itemConfig.username
					},{
						fieldLabel: '系统角色',
						value:itemConfig.roleName
					},{
						fieldLabel: '学校',
						value:itemConfig.schoolname
					},{
						fieldLabel : '科组',
						value:itemConfig.ugroup
					},{
						fieldLabel : '姓别',
						value:itemConfig.sex
					},{
						fieldLabel: '真实姓名',
						value:itemConfig.realname
					},{
						fieldLabel: '手机',
						value:itemConfig.mobile
					}]
				},{
					width:160,
					items:[{
			            name:'photo',
			            xtype: 'box',
			            width:150,
			            height: 150,
			            anchor:'100%',
			            autoEl:{
			                tag:'img',
			                title:'相片',
			                //src:"../images/login/photo-head.jpg",
			               	src:(itemConfig.avatarurl==''||itemConfig.avatarurl==null)?"../images/login/photo-head.jpg":"http://113.98.255.59/SchoolManageSystem"+itemConfig.avatarurl,
			                style:'border:1px solid;padding:1px'
			            }
					}]
		}]//,
		//buttonAlign:'center',
		//buttons:[{text:'保存'}]
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.userInfoFrom.superclass.constructor.call(this, config);
}
Ext.extend(edu.UI.userInfoFrom,Edu.Panel);

//user school information form
edu.UI.userSchoolFrom = function(itemConfig) {
	var config = {
		header:true,
		title:'学校信息',
		frame:false,
		layout:'column',
		defaults:{
			xtype:'myform',
			frame:false,
			border:false,
			bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px'
		},
		items:[{
				defaults:{
					xtype:'textfield',
					anchor:'99%'
				},
				width:600,
				items:[{
						fieldLabel: '学校名称',
						value:itemConfig.schoolName
						},{
						fieldLabel: '类型',
						value:itemConfig.type
						},{
						xtype:'textarea',
						fieldLabel: '校训',
						value:itemConfig.motto,
						height:130
						},{
						xtype:'textarea',
						fieldLabel: '校风',
						value:itemConfig.spirit,
						height:130
						},{
						xtype:'textarea',
						fieldLabel: '备注',
						value:itemConfig.remark,
						height:130
						}]
				},{
					width:160,
					items:[{
			            name:'photo',
			            xtype: 'box',
			            width:150,
			            height: 150,
			            anchor:'100%',
			            autoEl:{
			                tag:'img',
			                title:'校徽',
			                src:'../images/badge.jpeg',
			                style:'border:1px solid;padding:1px'
			            }
					}]
		}]//,
		//buttonAlign:'center',
		//buttons:[{text:'保存'}]
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.userSchoolFrom.superclass.constructor.call(this, config);
}
Ext.extend(edu.UI.userSchoolFrom,Edu.Panel);

//user class information form
edu.UI.userClassFrom = function(itemConfig) {
	var config = {
		header:true,
		title:'班级信息',
		frame:false,
		bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px',
		defaults:{
			xtype:'textfield',
			anchor:'78%'
		},
		items:[{
			fieldLabel:'学号',
			value:'12345'		
		},{
			fieldLabel:'学生姓名',
			value:'小明'
		},{
			fieldLabel:'班级名称',
			value:'初三(1)班'
		},{
			fieldLabel:'出生日期',
			value:'1990.1.1'
		},{
			fieldLabel:'性别',
			value:'男'
		},{
			fieldLabel:'籍贯',
			value:'广东东莞'
		},{
			fieldLabel:'入学时间',
			value:'1997.9.1'
		}],
		buttonAlign:'center',
		buttons:[{text:'保存'}]
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.userClassFrom.superclass.constructor.call(this, config);
}
Ext.extend(edu.UI.userClassFrom,Edu.Form);

//user class grid
edu.UI.userClassesGrid = Ext.extend(Edu.Grid,{
	config:{
		id:'userClassesGrid',
		frame:true,
		title:'我的班级',
		width:768,
		defaults:{
			width : 100
		},
		columns:[{
			id : 'grade_name',
			header : '年级',
			dataIndex : 'iclass.grade.gradename',
			sortable:true
		},{
			id : 'class_name',
			header : '班级',
			dataIndex : 'classname',
			sortable:true
		},{
			id : 'subject_name',
			header : '科目',
			dataIndex : 'subjectName',
			sortable:true
		}],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'textfield'
			},
			items:[{
				xtype:'label',
				text:'课程表:'
				},{
				id:'pre_scheduleSid',
				xtype:'combo',
				mode:'local',
				width:100,
				listWidth:200,
				editable : false,
				triggerAction:'all',
				displayField:'schedulename',
				valueField:'sid',
				listeners:{
					select:function(com,b,c){
						var params={
							'schId':Ext.getCmp('pre_scheduleSid').getValue()
						};
						var s=Ext.getCmp('userClassesGrid').getStore();
						s.reload({'params':params});
					}
				}
			}]
		}
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.userClassesGrid.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.userClassesGrid.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.tbar.items[1].store=this.getScheduleStore();
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		return new Edu.JsonStore({
			autoLoad:true,
			url:'classes.do',
			//remoteSort:true,
			root:'data',
			//totalProperty:'totalCount',
			fields:['iclass.grade.gradename','classname','subjectName'],
			 listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
								var scom=Ext.getCmp('pre_scheduleSid');
								if(!scom.getStore().getCount())
				  					scom.getStore().load();
							}
						}
		});
	},
	getScheduleStore:function(){
		return new Edu.JsonStore({
				autoLoad:false,
				url:'../schedule/list.do',
				root:'data',
		        fields:['schedulename', 'sid'],
		        listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
				  				var scom=Ext.getCmp('pre_scheduleSid');
								var store=Ext.getCmp('userClassesGrid').getStore();
								if(store.reader.jsonData.schId)
								  scom.setValue(store.reader.jsonData.schId);
							}
						}
		    });
	},
	loadData:function(){
		var g=Ext.getCmp('userClassesGrid');
	},	
	getStore:function(){
		var g=Ext.getCmp('userClassesGrid');
		return g.store;
	}
});


//schedule grid
edu.UI.scheduleInfoGrid = Ext.extend(Edu.Grid,{
	config:{
		id:'scheduleInfoGrid',
		frame:true,
		title:'课程计划',
		autoHeight : true,
		defaults:{
			width : 100,
			sortable : true
		},
		columns:[
		{
			id : 'schedule_term',
			header : '名称',
			dataIndex : 'schedulename',
			sortable:true
		},{
			id : 'schedule_grade',
			header : '年级',
			dataIndex : 'gradename',
			sortable:true
		},{
			id : 'schedule_term',
			header : '学期',
			dataIndex : 'term',
			sortable:true
		},{
			id : 'schedule_sourcePath',
			header : 'Excel源文件',
			dataIndex : 'sourcePath',
			renderer : function(v){
         		var h = '<a href="../'+v+'">下载</a>';
         		return h;
         	}
		},{
			id : 'schedule_remark',
			header : '备注',
			dataIndex : 'remark',
			sortable:true
		},{
			id : 'schedule_operate',
			header : '操作',
        	dataIndex:"sid",
         	renderer : function(v){
         		uploadSchedulePlan=function(id){
 					var win=new Edu.Window({
						id:'schedulePlanWin',
						title:'上传课程计划文件',
						items:[new edu.UI.schedulePlanForm({'sid':id})]
					});
					win.show();        			
         		};
         		var h='';
         		if($.inArray('schedule/uploadFile.do',funs)>-1)
         			h+='<input type="button" value="上传计划" onclick="uploadSchedulePlan('+v+');">';
         		return h;
         	}
		}],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'button'
			},
			items:[{
				text:'新建',
				hidden:true,
				iconCls:'icon-add',
				handler:function(){
				var f=new edu.UI.newScheduleForm();
				var win=new Edu.Window({
					id:'newScheduleWin',
					title:'新建课程计划',
					items:[f]
				});
				win.show();
					
				f.getForm().load({ 
				    url : "../schedule/listDefaultTerm.do",
				    method : "get",
				    waitTitle :'提示',
				    waitMsg :'加载数据中,请稍候',
				    success : function (form, action) {
				    	var com=Ext.getCmp('schedule_year');
						com.setValue(action.result.data["year"]);
						com=Ext.getCmp('schedule_term');
						com.setValue(action.result.data["term"]);
				    },
				    failure : function(form, action){
				    	//var jnRes = Ext.util.JSON.decode(action.response.responseText);
				    	//Edu.MessageBox(jnRes.exception,'error');
				    }
			    });
				}
			},{
				text:'删除',
				hidden:true,
				iconCls:'icon-del',
				handler:function(){
					var s=Ext.getCmp('scheduleInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						Ext.Msg.confirm('提示','确定将删除该计划相关所有课程数据,请确认',function(bn){
							if(bn=='yes'){
								Ajaxx('../schedule/delete.do',{'schedule.sid':rd.data.sid},function(res){
									Edu.MessageBox('删除成功');
									Ext.getCmp('scheduleInfoGrid').getStore().reload();
								});
							}
						});					
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}
				}
			},{
				text:'编辑',
				iconCls:'icon-edit',
				handler:function(){
					var s=Ext.getCmp('scheduleInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						var units=rd.data.term.split('年');
						var tmp=clone(rd.data);
						tmp.year=units[0];
						tmp.term=units[1];
						var win=new Edu.Window({
							id:'editScheduleWin',
							title:'编辑课程计划',
							items:[new edu.UI.newScheduleForm({data:tmp})]
						});
						win.show();					
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}					
				}
			},{
				text:'设置当前学期',
				hidden:true,
				iconCls:'icon-edit',
				handler:function(){
					var f=new edu.UI.termForm();
					var win=new Edu.Window({
						id:'newTermWin',
						title:'设置当前学期',
						items:[f]
					});
					win.show();
					
				f.getForm().load({ 
				    url : "../schedule/listDefaultTerm.do",
				    method : "get",
				    waitTitle :'提示',
				    waitMsg :'加载数据中,请稍候',
				    success : function (form, action) {
				    	var com=Ext.getCmp('schedule_year');
						com.setValue(action.result.data["year"]);
						com=Ext.getCmp('schedule_term');
						com.setValue(action.result.data["term"]);
				    },
				    failure : function(form, action){
				    	var jnRes = Ext.util.JSON.decode(action.response.responseText);
				    	Edu.MessageBox(jnRes.exception,'error');
				    }
			    });
				}
			},{
				text:'下载模板',
				iconCls:'icon-download',
				handler:function(){
					var url='../downloads/course.xls';
					window.open(url);
				}
			}]
		},
		bbar:{
			xtype:'paging',
			pageSize:10
		},
		listeners:{
			headerclick:function(g){
				g.headerclick=true;
			}
		}		
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			if($.inArray('schedule/create.do',funs)>-1)
				config.tbar.items[0].hidden=false;
			if($.inArray('schedule/delete.do',funs)>-1)
				config.tbar.items[1].hidden=false;	
			if($.inArray('schedule/createTermInfo.do',funs)>-1)
				config.tbar.items[3].hidden=false;
			config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.scheduleInfoGrid.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.scheduleInfoGrid.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.bbar.store=this.getStore();
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		var g=this;
		return new Edu.JsonStore({
			url:'list.do',
			//remoteSort:true,
			root:'data',
			totalProperty:'totalCount',
			fields:['gradeid','gradename','latestUpdate','remark','schedulename','schoolid','schoolname','sid','term','sourcePath'],
			listeners:{
				loadexception:function(a,b,response){
					Edu.MessageBox(response.responseJSON.exception);
				},
				beforeload:function(){
				},
				load:function(s){
				}
			}
		});
	},
	loadData:function(){
		var g=Ext.getCmp('scheduleInfoGrid');
	},	
	getStore:function(){
		var g=Ext.getCmp('scheduleInfoGrid');
		return g.store;
	}
});

var clone = function(data) {
    var obj = {};
    for(key in data) {
        obj[key] = data[key];
    }
   
    return obj;
};

//上传课程计划文件
edu.UI.schedulePlanForm = function(itemConfig){
	var config = {
		id:'schedulePlanForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false
		},		
		items:[{
			fieldLabel:'选择Excel文件',
			inputType:'file',
		    name:'upload'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
				var startImport=function(res){
					var base='将要导入'+res.sheets.join(',')+'的表数据,请确认';
					var msg=res.warning?base+'<br/>警告:'+res.warning:base;
					Ext.Msg.confirm('提示',msg,function(bn){
						if(bn=='yes'){
						var f=Ext.getCmp('schedulePlanForm'),win=Ext.getCmp('schedulePlanWin');
						f.submit('../schedule/startImport.do',{'schedule.sid':res.sid},win,function(res){
							var str='';
							for(var i in res.data){
								str+=i+':'+(res.data[i]=='success'?'成功':res.data[i])+'<br/>';
							}
							Edu.MessageBox(str);
						});
						}
					});	
				};
				var f=Ext.getCmp('schedulePlanForm'),win=Ext.getCmp('schedulePlanWin');
				var params={
					'schedule.sid':f.sid
				};
				f.submit('../schedule/uploadFile.do',params,null,startImport);
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.schedulePlanForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.schedulePlanForm,Edu.Form);

//新建课程计划
edu.UI.newScheduleForm = function(itemConfig) {
	var data=itemConfig?itemConfig.data:null;
	var config = {
		id:data?'editScheduleForm':'newScheduleForm',
		//bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},
		items:[{
			fieldLabel:'名称',
			name:'schedule.schedulename',
			value:data?data.schedulename:''
		},{
			id:'schedule_year',
			xtype:'combo',
			fieldLabel:'学年',
			mode:'local',
			editable : false,
			triggerAction:'all',
			displayField:'text',
			valueField:'text',
			store:new Ext.data.ArrayStore({
		        fields:['text'],
		        data:yearStore
		    }),
		    value:data?data.year+'年':''
		},{
			xtype:'hidden',
			name:'schedule.sid',
			value:data?data.sid:''
		},{
			id:'schedule_gradeName',
			xtype:'hidden',
			name:'schedule.gradename',
			value:data?data.gradename:''
		},{
			id:'schedule.grade.combo',
			xtype:'combo',
			fieldLabel:'年级',
			hiddenName:'schedule.gradeid',
			mode:'local',
			editable : false,
			selectOnFocus : true,
			triggerAction:'all',
			displayField:'gradename',
			valueField:'gradeId',
			store:new Edu.JsonStore({
				autoLoad:false,
				url:'gradesGet.do',
				root:'data',
		        fields:['gradeId', 'gradename']
		    }),
		    listeners:{
		    	select:function(com,rd){
		    		Ext.getCmp('schedule_gradeName').setValue(rd.data.gradename);
		    	},
		    	render:function(com,b){
		    		com.store.load({
		    			callback:function(){
		    				 Ext.getCmp('schedule.grade.combo').setValue(data?data.gradeid:'');
		    			}
		    		});
		    	}
		    }//,
		    //value:data?data.gradename:''
		},{
			id:'schedule_term',
			xtype:'combo',
			fieldLabel:'学期',
			editable : false,
			mode:'local',
			triggerAction:'all',
			displayField:'text',
			valueField:'text',
			store:new Ext.data.ArrayStore({
		        fields:['text'],
		        data:[
		        	['上学期'],
		        	['下学期']
		        ] 
		    }),
		    value:data?data.term:''
		},{
			xtype:'textarea',
			fieldLabel:'备注',
			name:'schedule.remark',
			value:data?data.remark:'',
			allowBlank:true,
			height:40
		}],
		buttonAlign:'center',
		buttons:[{
			text:data?'编辑':'创建',
			handler:function(){
				var params={
					'schedule.term':Ext.getCmp('schedule_year').getValue()+Ext.getCmp('schedule_term').getValue()
				};
				var f=Ext.getCmp(data?'editScheduleForm':'newScheduleForm'),win=Ext.getCmp(data?'editScheduleWin':'newScheduleWin');
				f.submit('../schedule/'+(data?'edit':'create')+'.do',params,win,function(res){
					Ext.getCmp('scheduleInfoGrid').getStore().reload();
				});
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.newScheduleForm.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.newScheduleForm,Edu.Form);
//设置当前学期
edu.UI.termForm = function(itemConfig) {
	var data=itemConfig?itemConfig.data:null;
	var config = {
		id:'termForm',
		//bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},
		items:[{
			id:'schedule_year',
			xtype:'combo',
			fieldLabel:'学年',
			mode:'local',
			editable : false,
			hiddenName:'year',
			triggerAction:'all',
			displayField:'text',
			valueField:'text',
			store:new Ext.data.ArrayStore({
		        fields:['text'],
		        data:yearStore
		    }),
		    value:data?data.year:''
		},{
			id:'schedule_term',
			xtype:'combo',
			fieldLabel:'学期',
			editable : false,
			mode:'local',
			triggerAction:'all',
			displayField:'text',
			valueField:'text',
			hiddenName:'term',
			store:new Ext.data.ArrayStore({
		        fields:['text'],
		        data:[
		        	['上学期'],
		        	['下学期']
		        ] 
		    }),
		    value:data?data.term:''
		}],
		buttonAlign:'center',
		buttons:[{
			text:data?'编辑':'设置',
			handler:function(){
				var val=Ext.getCmp('schedule_year').getValue()+Ext.getCmp('schedule_term').getValue();
				var params={
					'ti.value':val
				};
				var f=Ext.getCmp('termForm'),win=Ext.getCmp('newTermWin');
				f.submit('../schedule/'+(data?'editTermInfo':'createTermInfo')+'.do',params,win,function(res){
					Edu.MessageBox("操作成功");
					var str=$('#realname').text().substr(0,10);
					$('#realname').text(str+val);
				});
			}
		}]
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.termForm.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.termForm,Edu.Form);
/*
    var myData = [
        ['一','','数学','','',''],
        ['二','数学','','数学','',''],
        ['三','','数学','','',''],
        ['四','','','数学','',''],
        ['','','','',''],
        ['五','数学','','','','数学'],
        ['六','','','','',''],
        ['七','','','数学','',''],
        ['八','数学','','','','']
    ];

    // create the data store
    var myStore = new Ext.data.ArrayStore({
        fields: [
           {name:'seq'},
           {name: 'monday'},
           {name: 'tuesday'},
           {name: 'wednesday'},
           {name: 'thursday'},
           {name: 'friday'}
        ]
    });
    myStore.loadData(myData);
*/
edu.UI.myTable=function(itemConfig){
	var myStore=new Edu.JsonStore({
		//autoLoad:false,
		url:'listMy.do',
		fields:['courseSeq','friday','monday','saturday','thursday','tuesday','wednesday','sunday'],
		root:'data',
		listeners:{
			loadexception:function(a,b,response){
				var res = Ext.util.JSON.decode(response.responseText);
				Edu.MessageBox(res.exception,'error');
				var scom=Ext.getCmp('myTable_schedule');
				if(!scom.getStore().getCount())
				  scom.getStore().load();
			},
			load:function(s,rds){
				var scom=Ext.getCmp('myTable_schedule');
				if(!scom.getStore().getCount())
				  scom.getStore().load();
				var uid=s.reader.jsonData.userId;
				//if(uid) uid=parseInt(uid,10);
				s.uid=uid;
			}
		}		
	});
	var renderer=function(v){
		if(!v)return v;
		var units=v.split(':');
		if(units.length==5 &&units[4]=='true'){
			return '<font  title="'+(units[2]!='null'?units[2]:'')+'">'+units[3]+'</font>';
		}
		return '<font title="'+(units[2]!='null'?units[2]:'')+'">'+units[3]+'</font>';
	};
    var config ={
    	id:'myTable',
    	title:'我的课程表',
        height:275,  	
    	store: myStore,
        columns: [
        	{header:"节次",dataIndex:'courseSeq',width:50},
        	{header:"星期一",dataIndex:'monday',renderer:renderer},
        	{header:"星期二",dataIndex:'tuesday',renderer:renderer},
        	{header:"星期三",dataIndex:'wednesday',renderer:renderer},
        	{header:"星期四",dataIndex:'thursday',renderer:renderer},
        	{header:"星期五",dataIndex:'friday',renderer:renderer},
        	{header:"星期六",dataIndex:'saturday',renderer:renderer},
        	{header:"星期日",dataIndex:'sunday',renderer:renderer}        	       	
        ],
        stripeRows: true,
           tbar:{
        	defaults:{
        		width:80
        	},
	        items:[{
					xtype:'label',
					text:'课程表选择:'
				},{
					id:'myTable_schedule',
					xtype:'combo',
					editable:false,
					mode:'local',
					triggerAction:'all',
					displayField:'schedulename',
					listWidth:160,
					width:200,
					valueField:'sid',
					listeners:{
					select:function(com,b,c){
						var params={
							'schedule.sid':Ext.getCmp('myTable_schedule').getValue()
						};
						var s=Ext.getCmp('myTable').getStore();
						s.reload({'params':params});
					}
				},
					store:new Edu.JsonStore({
						autoLoad:false,
						url:'list.do',
						root:'data',
				        fields:['sid', 'schedulename'],
						listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
								var scom=Ext.getCmp('myTable_schedule');
								var store=Ext.getCmp('myTable').getStore();
								if(store.reader.jsonData.sid)
								  scom.setValue(store.reader.jsonData.sid);
							}
						}
				    })
				},'->',{
					xtype:'button',
					text:'查询',
					iconCls:'icon-search',
					handler:function(){
						var g=Ext.getCmp('myTable'),s=g.getStore();
						var params={
							'schedule.sid':Ext.getCmp('myTable_schedule').getValue()
							
						};
						s.reload({'params':params});
					}
				}]
           }
    
    };
    config = Ext.apply(config, itemConfig || {});
    edu.UI.myTable.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.myTable,Edu.Grid);

edu.UI.classTable=function(itemConfig){
	var store=new Edu.JsonStore({
		url:'listItem.do',
		fields:['courseSeq','friday','monday','saturday','thursday','tuesday','wednesday'],
		root:'data',
		listeners:{
			loadexception:function(a,b,response){
				var res = Ext.util.JSON.decode(response.responseText);
				Edu.MessageBox(res.exception,'error');
				var gcom=Ext.getCmp("classTable_grade");
				if(!gcom.getStore().getCount())
				   gcom.getStore().load();
			},
			load:function(s,rds){
				var ycom=Ext.getCmp("classTable_year");
				var tcom=Ext.getCmp("classTable_term");
				var gcom=Ext.getCmp("classTable_grade");
				
				if(s.reader.jsonData.year)
				   ycom.setValue(s.reader.jsonData.year);
				if(s.reader.jsonData.term)
				   tcom.setValue(s.reader.jsonData.term);
				//if(s.reader.jsonData.grade)
				if(!gcom.getStore().getCount())
				   gcom.getStore().load();
				  
				
			}
		}		
	});
	var renderer=function(v){
		if(!v)return v;
		var uid=store.reader.jsonData.userId;//parseInt(store.reader.jsonData.userId,10);
		var units=v.split(':');
		if(units[1]==uid){
			return '<font style="color:#339900" title="'+(units[2]!='null'?units[2]:'')+'">'+units[3]+'</font>';
		}
		return '<font title="'+(units[2]!='null'?units[2]:'')+'">'+units[3]+'</font>';
	};
    var config ={
    	id:'classTable',
    	title:'班级课程表',
        height:275,  	
    	store: store,
        columns: [
        	{header:"节次",dataIndex:'courseSeq',width:50},
        	{header:"星期一",dataIndex:'monday',renderer:renderer},
        	{header:"星期二",dataIndex:'tuesday',renderer:renderer},
        	{header:"星期三",dataIndex:'wednesday',renderer:renderer},
        	{header:"星期四",dataIndex:'thursday',renderer:renderer},
        	{header:"星期五",dataIndex:'friday',renderer:renderer},
        	{header:"星期六",dataIndex:'saturday',renderer:renderer},
        	{header:"星期日",dataIndex:'sunday',renderer:renderer}        	
        ],
        stripeRows: true,
        tbar:{
        	defaults:{
        		width:80
        	},
	        items:[{
					xtype:'label',
					text:'学年:'
				},{
					id:'classTable_year',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'text',
					valueField:'text',
					store:new Ext.data.ArrayStore({
				        fields:['text', 'value'],
				        data:yearStore
				    })
				},{
					xtype:'label',
					text:'学期:'
				},{
					id:'classTable_term',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'text',
					valueField:'text',
					store:new Ext.data.ArrayStore({
				        fields:['text', 'value'],
				        data:[
				        	['上学期',1],
				        	['下学期',2]
				        ] 
				    })
				},{
					xtype:'label',
					text:'年级:'
				},{
					id:'classTable_grade',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'gradename',
					valueField:'gradeId',
					store:new Edu.JsonStore({
						autoLoad:false,
						url:'gradesGet.do',
						root:'data',
				        fields:['gradeId', 'gradename'],
						listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
								var gcom=Ext.getCmp('classTable_grade');
								var store=Ext.getCmp('classTable').getStore();
								if(store.reader.jsonData.grade)
								  gcom.setValue(store.reader.jsonData.grade);
								var ccom=Ext.getCmp("classTable_class");  
								if(!ccom.getStore().getCount()){
									var params={
				    			       'grade':gcom.getValue()
				    		        };				    		
				                  ccom.getStore().load({'params':params}); 
								}
							}
						}
				    })
				},{
					xtype:'label',
					text:'班级:'
				},{
					id:'classTable_class',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'classname',
					valueField:'classkey',
					store:new Edu.JsonStore({
						autoLoad:false,
						url:'classGet.do',
						root:'data',
				        fields:['classkey','classname'],
						listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
								var ccom=Ext.getCmp('classTable_class');
								var store=Ext.getCmp('classTable').getStore();
								if(store.reader.jsonData.iclass)
								  ccom.setValue(store.reader.jsonData.iclass);
							}
						}
				    }),
				    listeners:{
				    	focus:function(com,b,c){
				    		var gid=Ext.getCmp('classTable_grade').getValue();
				    		if(!gid)return Edu.MessageBox('请先选择年级','error');
				    		var s=com.getStore();
				    		var params={
				    			'grade':gid
				    		};
				    		s.reload({'params':params});
				    	}
				    }
				},'->',{
					xtype:'button',
					text:'查询',
					iconCls:'icon-search',
					handler:function(){
						var g=Ext.getCmp('classTable'),s=g.getStore();
						var params={
							'schedule.term':Ext.getCmp('classTable_year').getValue()+Ext.getCmp('classTable_term').getValue(),
							'schedule.gradeid':Ext.getCmp('classTable_grade').getValue(),
							'scheduleItem.classid':Ext.getCmp('classTable_class').getValue()
						};
						s.reload({'params':params});
					}
				}]
        }        
    };
    config = Ext.apply(config, itemConfig || {});
    edu.UI.classTable.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.classTable,Edu.Grid);

//年级课程表
edu.UI.gradeTable=function(itemConfig){
	var store=new Edu.SyllabusStore({
		url:'listItem.do',
		fields:['classname','courseseq','subjectname','teacherName','teacherId'],
		root:'data',
		gridId:'gradeTable',
		baseParams:{'scheduleItem.scheduleday':'星期一'}
	});
    var config ={
    	id:'gradeTable',
    	title:'年级课程表',
        height:275,  	
    	store: store,
		loadMask:{
			msg:'加载数据中,请稍候...'
		},    	
        columns: [
        	{header:"节次",dataIndex:'row0',hidden:true,width:30}
        ],
        stripeRows: true,
        tbar:{
        	defaults:{
        		width:80
        	},
	        items:[{
					xtype:'label',
					text:'学年:'
				},{
					id:'gradeTable_year',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'text',
					valueField:'text',
					store:new Ext.data.ArrayStore({
				        fields:['text', 'value'],
				        data:yearStore
				    })
				},{
					xtype:'label',
					text:'学期:'
				},{
					id:'gradeTable_term',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'text',
					valueField:'text',
					store:new Ext.data.ArrayStore({
				        fields:['text', 'value'],
				        data:[
				        	['上学期',1],
				        	['下学期',2]
				        ] 
				    })
				},{
					xtype:'label',
					text:'年级:'
				},{
					id:'gradeTable_grade',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'gradename',
					valueField:'gradeId',
					store:new Edu.JsonStore({
						autoLoad:false,
						url:'gradesGet.do',
						root:'data',
				        fields:['gradeId', 'gradename'],
						listeners:{
							loadexception:function(a,b,response){
								var res = Ext.util.JSON.decode(response.responseText);
								Edu.MessageBox(res.exception,'error');
							},
							load:function(s,rds){
								
								var gcom=Ext.getCmp("gradeTable_grade");
								var store=Ext.getCmp('gradeTable').getStore();
								if(store.reader.jsonData.grade)
								   gcom.setValue(store.reader.jsonData.grade);
							}
						}
				    })
				},{
					xtype:'label',
					text:'星期:'
				},{
					id:'gradeTable_week',
					xtype:'combo',
					mode:'local',
					triggerAction:'all',
					displayField:'text',
					valueField:'text',
					store:new Ext.data.ArrayStore({
				        fields:['text', 'value'],
				        data:[
				        	['星期一',1],
				        	['星期二',2],
				        	['星期三',3],
				        	['星期四',3],
				        	['星期五',3],
				        	['星期六',3],
				        	['星期日',3]
				        ] 
				    })
				},'->',{
					xtype:'button',
					text:'查询',
					iconCls:'icon-search',
					handler:function(){
						var g=Ext.getCmp('gradeTable'),s=g.getStore();
						var params={
							'schedule.term':Ext.getCmp('gradeTable_year').getValue()+Ext.getCmp('gradeTable_term').getValue(),
							'scheduleItem.scheduleday':Ext.getCmp('gradeTable_week').getValue(),
							'schedule.gradeid':Ext.getCmp('gradeTable_grade').getValue()
						};
						s.reload({'params':params});
					}
				}]
        }
    };
    config = Ext.apply(config, itemConfig || {});
    edu.UI.gradeTable.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.gradeTable,Edu.Grid);

//备课管理
edu.UI.preparationManager=function(pid){
	var sm=Ext.getCmp('preparationInfoGrid').getSelectionModel();
	var rd=sm.getSelected();

	//Ajaxx('../public/listFunUri.do',{},function(res){
		var win=new Edu.Window({
			width:900,
			height:500,
			maximizable:true,
			title:rd.data.name,
			items:[new edu.UI.preparationTab({pid:pid,rights:funs})]
		});
		win.show();
	//},null,null,false,0);	
};

var preparData=[
				["1","285:101:(01)班:信息","","","","","",""],
				["2","","","","","","",""],
				["3","","","","","","",""],
				["4","","","","","","",""],
				["5","","","","","","",""],
				["6","298:102:(02)班:信息","","","","","",""],
				["7","299:102:(02)班:信息","","","","","",""],
				["8","300:102:(02)班:信息","","","","","",""]
				];
    var preparStore = new Ext.data.ArrayStore({
        fields: [
           {name:'seq'},
           {name: 'one'},
           {name: 'two'},
           {name: 'three'},
           {name: 'four'},
           {name: 'five'},
           {name: 'six'},
           {name: 'seven'}
        ]
    });
    preparStore.loadData(preparData);    

//备课对象
edu.UI.preparationPanel=Ext.extend(Edu.Grid,{
	config:{
		id:'preparationPanel',
		height:150,
    	//store: preparStore,
    	frame:true,
        columns: [
        	{header:"节次",dataIndex:'courseSeq',width:50},
        	{header:"星期一",dataIndex:'monday'},
        	{header:"星期二",dataIndex:'tuesday'},
        	{header:"星期三",dataIndex:'wednesday'},
        	{header:"星期四",dataIndex:'thursday'},
        	{header:"星期五",dataIndex:'friday'},
        	{header:"星期六",dataIndex:'saturday'},
        	{header:"星期日",dataIndex:'sunday'}
        ],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'textfield'
			},
			items:[{
				xtype:'label',
				text:'课程表:'
				},{
				id:'pre_scheduleSid',
				xtype:'combo',
				mode:'local',
				width:100,
				listWidth:200,
				editable : false,
				triggerAction:'all',
				displayField:'schedulename',
				valueField:'sid',
				listeners:{
					select:function(com,b,c){
						
						
					}
				}
			},{
				xtype:'label',
				text:'开始时间:'
			},{
				id:'startDate',
				xtype:'datefield',
				editable:false,
				format:'Y-m-d',
				disabledDays:[0,2,3,4,5,6],
				listeners:{
					select:function(com,date){
						var dt=new Date(date.getTime()+518400000);
						Ext.getCmp('endDate').setValue(dt.format('Y-m-d'));
						var params={
							'schedule.sid':Ext.getCmp('pre_scheduleSid').getValue(),
							'lessionDate':date.format('Y-m-d')
						};
						var s=Ext.getCmp('preparationPanel').getStore();
						s.reload({'params':params});
					}
				}
			},{
				xtype:'label',
				text:'结束时间:'
			},{
				id:'endDate',
				width:100,
				disabled:true
			}]
		},
		listeners:{
			celldblclick:function(g,rowIndex,columnIndex,e){
				var start=Ext.getCmp('startDate').getValue();
				if(!start)return Edu.MessageBox('请请选择开始日期','error');
			    var record = g.getStore().getAt(rowIndex);  // Get the Record
			    var fieldName = g.getColumnModel().getDataIndex(columnIndex); // Get field name
			    var data = record.get(fieldName);
			    if(!data) return;
				var secs=(new Date(start)).getTime()+86400000*parseInt(columnIndex-1);
				var dt=new Date(secs);
			    var units=data.split(":");//298:102:(02)班:信息:备课名称:[true]，最后一位表示这节课是否已备课
			    if(units[5]=='true')
			       return Edu.MessageBox('这节课已经备课','warning');
			     var sg=Ext.getCmp('preparationSelectedForm'),s=sg.getStore();
			    var count=s.queryBy(function(record,id){
			             return record.get('siid')==units[0]&&record.get('date')==dt.format('Y-m-d');
			    }).getCount();
			    if(count!=0)
			       return Edu.MessageBox('这节课已经被选择','warning');
			    Ext.MessageBox.confirm('提示','确定添加'+dt.format('Y-m-d')+'星期'+dt.format('D')+units[2]+'的课',function(bn){
						if(bn=='yes'){
						    var c=new Courseware({
						    	'plid':'-1',
						    	'scheduleItem.siid':units[0],
						    	'scheduleItem.scheduleid':Ext.getCmp('pre_scheduleSid').getValue(),
						    	'scheduleItem.courseseq':'第'+(rowIndex+1)+'节',
						    	'lessionDate':dt.format('Y-m-d'),
						    	'scheduleItem.scheduleday':'星期'+dt.format('D'),
						    	'scheduleItem.classname':units[2]
						    });		   
			    
			               saveLession(Ext.getCmp('preparationPanel').pid,c,s,Ext.getCmp('preparationPanel').getStore());
						}
					});
			    
			    //s.add(c);
			}
		}
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		edu.UI.preparationPanel.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.preparationPanel.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.tbar.items[1].store=this.getScheduleStore();
		this.columns[1].renderer=this.renderer;
		this.columns[2].renderer=this.renderer;
		this.columns[3].renderer=this.renderer;
		this.columns[4].renderer=this.renderer;
		this.columns[5].renderer=this.renderer;
		this.columns[6].renderer=this.renderer;
		this.columns[7].renderer=this.renderer;
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		var myDate = new Date();
		//Edu.MessageBox(myDate);
		var index=1-myDate.getDay();
		var newDate=myDate.add(Date.DAY,index);
		//Ext.getCmp('startDate').setValue(newDate);
		//Edu.MessageBox(newDate.format('Y-m-d'));
		var dateStr=newDate.format('Y-m-d');
		return new Edu.JsonStore({
			autoLoad:true,
			url:'../schedule/listMy.do',
			baseParams:{'lessionDate':dateStr},
			fields:['courseSeq','friday','monday','saturday','sunday','thursday','tuesday','wednesday'],
			root:'data',
			listeners:{
			loadexception:function(a,b,response){
				var res = Ext.util.JSON.decode(response.responseText);
				Edu.MessageBox(res.exception,'error');
				//加载课程表下拉框
				var scom=Ext.getCmp('pre_scheduleSid');
				if(!scom.getStore().getCount())
				 scom.getStore().load();
			},
			load:function(s,rds){
				//加载课程表下拉框
				var scom=Ext.getCmp('pre_scheduleSid');
				if(!scom.getStore().getCount())
				  scom.getStore().load();
				   
			    if(!Ext.getCmp('startDate').getValue()){
				Ext.getCmp('startDate').setValue(newDate);
				Ext.getCmp('endDate').setValue(newDate.add(Date.DAY,6).format('Y-m-d'));
			    }
				/*var uid=s.reader.jsonData.userId;
				if(uid) uid=parseInt(uid);
				s.uid=uid;*/
			}
		}		
		});
	},
	renderer:function(v){
		if(!v)return v;
		var units=v.split(':');
		if(units.length==6){
			return '<font style="color:#339900" title="'+(units[2]!='null'?units[2]+'['+(units[4]!=null?units[4]:'')+']':'')+'">'+units[3]+'</font>';
		}
		return '<font title="'+(units[2]!='null'?units[2]+'['+(units[4]!=null?units[4]:'')+']':'')+'">'+units[3]+'</font>';
	},
	getScheduleStore:function(){
		return new Edu.JsonStore({
			    autoLoad:false,
				url:'../schedule/list.do',
				root:'data',
		        fields:['schedulename', 'sid'],
			listeners:{
			loadexception:function(a,b,response){
				var res = Ext.util.JSON.decode(response.responseText);
				Edu.MessageBox(res.exception,'error');
			},
			load:function(s,rds){
				var scom=Ext.getCmp('pre_scheduleSid');
				var store=Ext.getCmp('preparationPanel').getStore();
				if(!scom.getValue())
				  scom.setValue(store.reader.jsonData.sid);
				//加载已备课列表
				if(!Ext.getCmp('preparationSelectedForm').getStore().getCount()){
				//Edu.MessageBox(Ext.getCmp('preparationSelectedForm').getStore().getCount());
				params={'bean.id':Ext.getCmp('preparationPanel').pid};
				Ext.getCmp('preparationSelectedForm').getStore().reload({'params':params});
				}
				
			}
		}
		    });
	},
	loadData:function(){
		var g=Ext.getCmp('preparationPanel');
		
	},	
	getStore:function(){
		var g=Ext.getCmp('preparationPanel');
		return g.store;
	}
});

	var coursewareData = [
    ];

var coursewareStore = new Ext.data.ArrayStore({
    fields: [
       {name:'id'},
       {name:'siid'},
       {name: 'date'},
       {name:'seq'},
       {name:'grade'}
    ]
});
var Courseware = Ext.data.Record.create([{
	name: 'scheduleItem.courseseq',
    type: 'string'
},{
    name: 'plid',
    type: 'string'
},  {
    name: 'scheduleItem.siid',
    type: 'string'
}, {
    name: 'lessionDate',
    type: 'string'
}, {
    name: 'scheduleItem.scheduleday',
    type: 'string'
}, {
    name: 'scheduleItem.classname',
    type: 'string'
}]);
//已选择备课对象
var	saveLession=function(preid,record,store,storepre){
	
	var params={
						'targetLessionBean.scheduleItem.siid':record.get('scheduleItem.siid'),
						'targetLessionBean.lessionDate':record.get('lessionDate'),
						'targetLessionBean.preparation.id':preid
					};
					Ajaxx('../preparation/createTargetLesstion.do',params,function(res){
	  				/*tab=new edu.UI.Tab({
						items:[new edu.UI.userInfoFrom(res.data)]
					});	*/
						//Edu.MessageBox(res.data.id+'','info');
						record.set('plid',res.data.id);
						store.add(record);
						var sd=Ext.getCmp('startDate').getValue();
						var params1={
							'schedule.sid':Ext.getCmp('pre_scheduleSid').getValue(),
							'lessionDate':sd.format('Y-m-d')
						};
						storepre.reload({'params':params1});
				});
};

edu.UI.preparationSelectedForm=Ext.extend(Edu.Grid,{
	config:{
		id:'preparationSelectedForm',
		title:'已选择备课对象',
    	//store: coursewareStore,
    	frame:true,
        columns: [{
        	header:"课程表",
        	dataIndex:'scheduleItem.scheduleid',
        	width:50,
        	renderer:function(v){
        		var s=Ext.getCmp('pre_scheduleSid');
        		
        		//Edu.MessageBox(s.getValue());
        		//Edu.MessageBox(s.getStore().query('sid',v).itemAt(0).get('schedulename'));
        		return s.getStore().query('sid',v).itemAt(0).get('schedulename');//tmp.get('schedulename');
        	}
        	},
        	{
        	header:"日期",
        	dataIndex:'lessionDate',
        	sortable:true,
        	width:30
        	},{
        	header:"星期",
        	dataIndex:'scheduleItem.scheduleday',
        	sortable:true,
        	width:30
        	},{
        	header:"节次",
        	dataIndex:'scheduleItem.courseseq',
        	sortable:true,
        	width:30
        	},{
        	header:"班级",
        	dataIndex:'scheduleItem.classname',
        	sortable:true,
        	width:30
        	}],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'textfield'
			},
			items:[{
				iconCls:'icon-del',
				xtype:'button',
				text:'删除',
				handler:function(){
					var g=Ext.getCmp('preparationSelectedForm');
					var sm=g.getSelectionModel();
					if(sm.hasSelection()){
						var rd=sm.getSelected();
						Ext.Msg.confirm('提示','将会删除该备课对象的数据,请确认',function(bn){
							if(bn=='yes'){
								Ajaxx('../preparation/deleteTargetLession.do',{'targetLessionBean.id':rd.data.plid},function(res){
									Edu.MessageBox('删除成功');
									params={'bean.id':Ext.getCmp('preparationPanel').pid};
									g.getStore().reload({'params':params});
									var sd=Ext.getCmp('startDate').getValue();
									var params1={
										'schedule.sid':Ext.getCmp('pre_scheduleSid').getValue(),
										'lessionDate':sd.format('Y-m-d')
									};
									if(params1['schedule.sid']!=''&&params1.lessionDate!='')
									   Ext.getCmp('preparationPanel').getStore().reload({'params':params1});
								});
							}
						});
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}					
				}			
			}]
		},
		listeners:{
			celldblclick:function(g,b,c,d,e){
			}
		}
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.preparationSelectedForm.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.preparationSelectedForm.superclass.initComponent.call(this);
	},
	init:function(){
		//params={'bean.id':Ext.getCmp('preparationPanel').pid};
		this.store=this.createStore();
		//this.store.reload({'params':params});
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		var g=this;
		return new Edu.JsonStore({
			url:'../preparation/listTargetLesstions.do',
			autoLoad:false,
			//remoteSort:true,
			root:'data',
			//totalProperty:'totalCount',
			fields:['plid','scheduleItem.siid','lessionDate','scheduleItem.scheduleday','scheduleItem.courseseq','scheduleItem.classname','scheduleItem.scheduleid'],
			listeners:{
				loadexception:function(a,b,response){
					//Edu.MessageBox(response.responseJSON.exception);
				},
				beforeload:function(){
				},
				load:function(s,rd){
					
				}
			}
		});
	},
	loadData:function(){
		var g=Ext.getCmp('preparationSelectedForm');
	},	
	getStore:function(){
		var g=Ext.getCmp('preparationSelectedForm');
		return g.store;
	}
});

//上传学案
edu.UI.studyPlanForm = function(itemConfig){
	var config = {
		id:'studyPlanForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},		
		items:[{
			fieldLabel:'选择文件',
			inputType:'file',
		    name:'upload'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
					var f=Ext.getCmp('studyPlanForm');
					var c=Ext.getCmp('image-panel');
					var params={
						'preparationId':f.pid
					};
					f.submit('../preparation/processSection.do',params,null,function(){
						Ext.getCmp('studyPlanFormWin').close();
						Edu.MessageBox('上传成功');
		                var params={
		                	'preId':c.pid
		                };
		                c.index=1;
		                Ajaxx('listSectionPage.do',params,function(res){
		                	imgUrls2=res.data;
		                	c.max=imgUrls2.items.length;
		                	var url=getImageUrl2(c.index);
		                	if(url<0){
		              			return Edu.MessageBox('此页不存在','error');
		              		}
		                	Ext.get('view-image').dom.src =url;
		                	Ext.getCmp('panel_page_sum').setText('总页数:'+res.data.items.length);
		                }); 						
					});						
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.studyPlanForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.studyPlanForm,Edu.Form);


//学案
edu.UI.studyPlanPanel = function(itemConfig){
	var config={
		id:'studyPlanPanel',
		title:'学案',
		height:500,
		tbar:[{
			iconCls:'icon-add',
			text:'上传学案',
			handler:function(){
				var com=Ext.getCmp('studyPlanPanel');
				var win=new Edu.Window({
					id:'studyPlanFormWin',
					title:'上传学案',
					items:[new edu.UI.studyPlanForm({pid:com.pid})]
				});
				win.show();				
			}
		},'-',{
			iconCls:'icon-download',
			text:'下载学案',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				window.open('../preparation/downSection.do?preId='+com.pid);
			}
		}],
        items:[{
        	id:'sectionImgBox',
			xtype:'panel',
			width:800,
			autoEl:{
			   tag: 'div',
			   html:"<img id='wordImg' src='../preparation/sectionImg.do?preId="+itemConfig.pid+"'/>"
			   
			}/*,
			listeners:{
				afterrender:function(){
					new Ext.Resizable('wordImg', {
					    wrap:true,
					    pinned:true,
					    minWidth:50,
					    minHeight: 50,
					    preserveRatio: true
					});					
				}
			}*/
		}],
		initComponent:function(){
			this.loadScctionImg();
			edu.UI.studyPlanPanel.superclass.initComponent.call(this);
		},
		loadScctionImg:function(){
			//var com=Ext.getCmp('sectionImgBox');
			//debugger;
			//this.load("http://baidu.com");
		}
		
	};
    config = Ext.apply(config, itemConfig || {});
    edu.UI.studyPlanPanel.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.studyPlanPanel,Edu.Form);

//上传课件Form
edu.UI.coursewareForm = function(itemConfig){
	var config = {
		id:'coursewareForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		layout:'form',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false
		},		
		items:[{
			fieldLabel:'选择文件',
			inputType:'file',
		    name:'upload'
		},{
			id:'unzip',
			name:'unzip',
			labelStyle:'width:150px',
			xtype:'checkbox',
			inputValue:'true',
			fieldLabel:'是否解压(仅适合zip包)'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
				var f=Ext.getCmp('coursewareForm'),win=Ext.getCmp('coursewareFormWin');
				var params={
					'preparationId':f.pid
				};
				f.submit('../preparation/proccessCourseware.do',params,win,function(){
					
					Ext.getCmp('coursewarePanel').getStore().reload();
					//alert("dd");
					//Edu.MessageBox('上传成功');
					Ext.MessageBox.show({
						title:'提示',
						msg:"上传成功",
						buttons:{"ok":"确定"},
						width:200,
						fn:function(e){
							var grid=Ext.getCmp('coursewarePanel');
							grid.getBottomToolbar().moveLast();
						}
					});
				});
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.coursewareForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.coursewareForm,Edu.Form);

//课件
edu.UI.coursewarePanel = Ext.extend(Edu.Grid,{
	config:{
		id:'coursewarePanel',
		title:'课件',
    	store: coursewareStore,
    	frame:true,
        columns: [{
        	header:"序号",
        	dataIndex:'index',
        	sortable:true,
        	width:30,
        	renderer : function(v){
        		var len=Ext.getCmp('coursewarePanel').getStore().getTotalCount();
        		if(len==1){
        			if(v==0)
        				v=1;
        		}else{
        			++v;
        		}
        		return v;
        	  }
        	},{
        	header:"文件名",
        	dataIndex:'fileName',
        	sortable:true,
        	width:50
        	},{
        	header:"操作",
        	dataIndex:'index',
        	width:30,
			renderer:function(v){
				downCourseWare=function(i){
					var com=Ext.getCmp('coursewarePanel');
					window.open("downCourseWare.do?preId="+com.pid+"&cwIndex="+i);
				};
         		var h = '<input type="button" value="下载" onclick="downCourseWare(\''+v+'\')">';
         		return h;
         	}
         }],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'button'
			},
			items:[{
				text:'上传',
				iconCls:'icon-add',
				handler:function(){
					var com=Ext.getCmp('coursewarePanel');
					var win=new Edu.Window({
						id:'coursewareFormWin',
						title:'上传课件',
						items:[new edu.UI.coursewareForm({pid:com.pid})]
					});
					win.show();					
				}
			},{
				text:'删除',
				iconCls:'icon-del',
				handler:function(){
					var s=Ext.getCmp('coursewarePanel').getSelectionModel();
					var com=Ext.getCmp('coursewarePanel');
					if(s.hasSelection()){
						var rd=s.getSelected();
						Ext.Msg.confirm('提示','确定将删除该课件,请确认',function(bn){
							if(bn=='yes'){
								Ajaxx('../preparation/deleteCourseWare.do',{'preId':com.pid,'cwIndex':rd.data.index},function(res){
									Edu.MessageBox('删除成功');
									var s=Ext.getCmp('coursewarePanel').getStore();
									if(s.getTotalCount()==1){
										s.removeAll();
									}else{
										s.reload();
									}
								});
							}
						});					
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}				
				}
			},{
				text:'下载PPT转换插件',
				iconCls:'icon-download',
				handler:function(){
					var url='../downloads/ppt2flash.rar';
					window.open(url);
				   }
			}/*,{
				text:'编辑',
				iconCls:'icon-edit'
			}*/]
		},
		bbar:{
			xtype:'frontPaging',
			pageSize:10
		}         
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			//config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.coursewarePanel.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.coursewarePanel.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.bbar.store=this.getStore();
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		var g=this;
		return new Edu.JsonStore({
			url:'listCourseWares.do',
			//remoteSort:true,
			root:'data',
			//totalProperty:'totalCount',
			fields:['index','fileName'],
			baseParams:{'preId':g.pid},
			listeners:{
				loadexception:function(a,b,response){
					//var res = Ext.util.JSON.decode(response.responseText);
					//Edu.MessageBox(res.exception,'error');
				},
				beforeload:function(){
					//debugger;
					//var com=Ext.getCmp('coursewarePanel');
					//this.params={'preId':com.pid};
				},
				load:function(s){
				}
			}
		});
	},
	loadData:function(){
		var g=Ext.getCmp('coursewarePanel');
	},	
	getStore:function(){
		var g=Ext.getCmp('coursewarePanel');
		return g.store;
	}
});

//上传课堂测练
edu.UI.courseWorkForm = function(itemConfig){
	var config = {
		id:'courseWorkForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false
		},		
		items:[{
			fieldLabel:'选择文件',
			inputType:'file',
		    name:'upload'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
					var f=Ext.getCmp('courseWorkForm'),win=Ext.getCmp('courseWorkFormWin');
					var params={
						'preparationId':f.pid
					};
					
					f.submit('../preparation/processTest.do',params,win,function(){
						Edu.MessageBox('上传成功');
						var p=Ext.getCmp('courseWorkPanel');
						p.loadData();
					});						
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.courseWorkForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.courseWorkForm,Edu.Form);

//课堂测练
edu.UI.courseWorkPanel = function(itemConfig){
	html='<table class="topics">'
		+'<tr>'
		+	'<td class="title">题号</td>'
		+	'<td class="content">1</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题型</td>'
		+	'<td>填空题</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题目</td>'
		+	'<td><img src="../images/1.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">答案</td>'
		+	'<td><img src="../images/2.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">解析</td>'
		+	'<td><img src="../images/3.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">回答方式</td>'
		+	'<td></td>'
		+'</tr>'		
		+'</table>'
		+'<table class="topics">'
		+'<tr>'
		+	'<td class="title">题号</td>'
		+	'<td class="content">2</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题型</td>'
		+	'<td>填空题</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题目</td>'
		+	'<td><img src="../images/1.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">答案</td>'
		+	'<td><img src="../images/2.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">解析</td>'
		+	'<td><img src="../images/3.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">回答方式</td>'
		+	'<td></td>'
		+'</tr>'		
		+'</table>';
	var config={
		id:'courseWorkPanel',
		title:'课堂测练',
		height:500,
		width:900,
		bodyStyle:'width:872px;background:#fff;',
		tbar:[{
			iconCls:'icon-add',
			text:'上传课堂测练',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				var win=new Edu.Window({
					id:'courseWorkFormWin',
					title:'上传课堂测练',
					items:[new edu.UI.courseWorkForm({pid:com.pid})]
				});
				win.show();				
			}
		},'-',{
			iconCls:'icon-download',
			text:'下载课堂测练',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				window.open('../preparation/downTest.do?preId='+com.pid);
			}
		},'-',{
			text:'下载模板',
			iconCls:'icon-download',
			handler:function(){
				var url='../downloads/courseTest.doc';
				window.open(url);
			}
		}],
        items:[{
        	id:'testQuesPanel',
			xtype:'panel',
			width:800,
			autoLoad:'../preparation/listTest.do?preId='+itemConfig.pid+'&random='+Math.random()
			//html:html
		}],
		loadData:function(){
			var p=Ext.getCmp('testQuesPanel');
			p.load("../preparation/listTest.do?preId="+this.pid+'&random='+Math.random());
		}
	};
    config = Ext.apply(config, itemConfig || {});
    edu.UI.courseWorkPanel.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.courseWorkPanel,Edu.Form);

//上传课后作业
edu.UI.homeworkForm = function(itemConfig){	
	var config = {
		id:'homeworkForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false
		},		
		items:[{
			fieldLabel:'选择文件',
			inputType:'file',
		    name:'upload'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
					var f=Ext.getCmp('homeworkForm'),win=Ext.getCmp('homeworkFormWin');
					var params={
						'preparationId':f.pid
					};
					f.submit('../preparation/processHomework.do',params,win,function(){
						Edu.MessageBox('上传成功');
						var p=Ext.getCmp('homeworkPanel');
						p.loadData();
					});						
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.homeworkForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.homeworkForm,Edu.Form);

//课后作业
edu.UI.homeworkPanel = function(itemConfig){
	html='<table class="topics">'
		+'<tr>'
		+	'<td class="title">题号</td>'
		+	'<td class="content">1</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题型</td>'
		+	'<td>填空题</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题目</td>'
		+	'<td><img src="../images/1.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">答案</td>'
		+	'<td><img src="../images/2.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">解析</td>'
		+	'<td><img src="../images/3.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">回答方式</td>'
		+	'<td></td>'
		+'</tr>'		
		+'</table>'
		+'<table class="topics">'
		+'<tr>'
		+	'<td class="title">题号</td>'
		+	'<td class="content">2</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题型</td>'
		+	'<td>填空题</td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">题目</td>'
		+	'<td><img src="../images/1.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">答案</td>'
		+	'<td><img src="../images/2.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">解析</td>'
		+	'<td><img src="../images/3.jpg"/></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="title">回答方式</td>'
		+	'<td></td>'
		+'</tr>'		
		+'</table>';	
	var config={
		id:'homeworkPanel',
		title:'课后作业',
		bodyStyle:'width:872px;background:#fff;',
		height:500,
		tbar:[{
			iconCls:'icon-add',
			text:'上传课后作业',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				var win=new Edu.Window({
					id:'homeworkFormWin',
					title:'上传课后作业',
					items:[new edu.UI.homeworkForm({pid:com.pid})]
				});
				win.show();				
			}
		},'-',{
			iconCls:'icon-download',
			text:'下载课后作业',
			handler:function(){
				var com=Ext.getCmp('courseWorkPanel');
				window.open('../preparation/downHomework.do?preId='+com.pid);
			}
		},'-',{
			text:'下载模板',
			iconCls:'icon-download',
			handler:function(){
				var url='../downloads/courseTest.doc';
				window.open(url);
			}
		}],
        items:[{
        	id:'homeworkQuesPanel',
			xtype:'panel',
			width:800,
			autoLoad:'../preparation/listHomework.do?preId='+itemConfig.pid+'&random='+Math.random()
			//html:html
		}],
		loadData:function(){
			var p=Ext.getCmp('homeworkQuesPanel');
			p.load("../preparation/listHomework.do?preId="+this.pid+'&random='+Math.random());
		}
	};
    config = Ext.apply(config, itemConfig || {});
    edu.UI.homeworkPanel.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.homeworkPanel,Edu.Form);

//电子课本Form
edu.UI.elecTextbookForm = function(itemConfig){
	var store=new Edu.JsonStore({
		url:'../ebook/listAll.do',
		remoteSort:true,
		root:'data',
		totalProperty:'totalCount',
		fields:['id','name','latestUpdate','maxPage','target','type','version','remark','failCount']
	});	
	var config={
		id:'ebookForm',
		frame:false,
		bodyStyle:'padding-left:200px;padding-top:10px;',
		border:false,
		layout:'table',
		layoutConfig:{columns:2},
		defaultType:'container',
		defaults:{
			layout:'form'
		},
		reader : new Ext.data.JsonReader({  
		root : 'data',  
		success : '@success'  
		}, [  
		{  
		name : 'book.maxPage',  
		mapping : 'maxPage'  
		},{  
		name : 'book.beginIndex',  
		mapping : 'beginIndex'  
		},{  
		name : 'book.endIndex',  
		mapping : 'endIndex'  
		},{  
		name : 'book.bid',  
		mapping : 'bid'  
		},{  
		name : 'book.localPath',  
		mapping : 'localPath'  
		},{  
		name : 'book.storageUrl',  
		mapping : 'storageUrl'  
		},{  
		name : 'book.type',  
		mapping : 'type'  
		}]),  
		items:[{
			colspan:2,
			defaults:{
				allowBlank:false,
				msgTarget:'qtip',
				width:285
			},
			items:[{
				xtype:'combo',
				id:'cbbook',
				fieldLabel:'电子课本选择',
				mode:'local',
				hiddenName:'book.bid ',
				editable : false,
				triggerAction:'all',
				displayField:'name',
				valueField:'id',
				store:store,
				listeners:{
					select:function(com,record,num){
						if(record.get('failCount')>0){							
							Ext.getCmp('btnSave').setDisabled(true);
							Ext.getCmp('btnP1').setDisabled(true);
							Ext.getCmp('btnP2').setDisabled(true);
						   return Edu.MessageBox("该电子课本没有同步到云存储中，请到电子课本管理模块进行同步操作！","warning");
						}
						Ext.getCmp('btnSave').setDisabled(false);
						Ext.getCmp('btnP1').setDisabled(false);
							Ext.getCmp('btnP2').setDisabled(false);
						var com=Ext.getCmp('tbPage');
						com.setValue(record.get('maxPage'));
					}
				}
			}]
		},{
			colspan:2,
			defaults:{
				allowBlank:false,
				msgTarget:'qtip',
				width:285
			},
			items:[{
				id:'tbPage',
				name:'book.maxPage',
				xtype:'textfield',
				readOnly:true,
				fieldLabel:'页数'
			}]
		},{
			defaults:{
				allowBlank:false,
				msgTarget:'qtip',
				width:285
			},
			items:[{
				id:'nf_beginIndx',
				xtype:'numberfield',
				name:'book.beginIndex',
				regex:/^[1-9]+[0-9]*$/,
				regexText:'请输入一个大于0的正数',
				fieldLabel:'开始页数'
			}]
		},{
			items:[{
				id:'btnP1',
				xtype:'button',
				text:'预览',
				//hidden:true,
				handler:function(){
					var id=Ext.getCmp('cbbook').getValue();
					if(!id)return Edu.MessageBox('请选择一本电子书','error');
					var input=Ext.getCmp('nf_beginIndx').getValue();
					if(input<=0) return Edu.MessageBox('预览页码必须大于0','error');
					if(!input)return Edu.MessageBox('请输入预览页码','error');
					var win=new edu.UI.imageWindow();
					win.show();
					var com=Ext.getCmp('image-window');
					com.index=input;
					com.max=Ext.getCmp('tbPage').getValue();
					Ext.getCmp('ebookForm').index=com.index;
					if(!com.index)return Edu.MessageBox('请输入预览页码','error');
					if(com.index>com.max){
						win.close();
						return Edu.MessageBox('开始页码不能大于最大页码','error');
					}
                    win.setTitle('电子课本第'+com.index+'页' );
                    var params={
                    	'bean.id':id
                    };
                    Ajaxx('../ebook/listBookPageInfo.do',params,function(res){
                    	imgUrls=res.data;
                    	var url=getImageUrl(com.index);
                    	if(url<0){
                  			return Edu.MessageBox('此页不存在','error');
                  		}
                    	Ext.get('win_view-image').dom.src =url;
                    	Ext.getCmp('win_page_sum').setText('总页数:'+res.totalCount);
                    },function(res){
						imgUrls={};
						var url=getImageUrl(1);
						if(url<0){
							return Edu.MessageBox('没有相关电子课本页码数据','error');
						}
						//Edu.MessageBox(res.exception,'error');
					});
				}
			}]
		},{
			defaults:{
				allowBlank:false,
				msgTarget:'qtip',
				width:285
			},
			items:[{
				name:'book.endIndex',
				xtype:'numberfield',
				fieldLabel:'结束页数',
				regex:/^[1-9]+[0-9]*$/,
				regexText:'请输入一个大于0的正数',
				id:'nf_endIndx'
			}]
		},{
			items:[{
				id:'btnP2',
				xtype:'button',
				text:'预览',
				handler:function(){
					var id=Ext.getCmp('cbbook').getValue();
					if(!id)return Edu.MessageBox('请选择一本电子书','error');
					var input=Ext.getCmp('nf_endIndx').getValue();
					if(input<=0) return Edu.MessageBox('预览页码必须大于0','error');
					if(!input)return Edu.MessageBox('请输入预览页码','error');
					var win=new edu.UI.imageWindow();
					win.show();					
					var com=Ext.getCmp('image-window');
					com.index=input;
					com.max=Ext.getCmp('tbPage').getValue();
					Ext.getCmp('ebookForm').index=com.index;
					if(com.index>com.max){
						win.close();
						return Edu.MessageBox('结束页码不能大于最大页码','error');
					}
                    win.setTitle('电子课本第'+com.index+'页' );
                    var params={
                    	'bean.id':id
                    };
                    Ajaxx('../ebook/listBookPageInfo.do',params,function(res){
                    	imgUrls=res.data;
                    	var url=getImageUrl(com.index);
                    	if(url<0){
                  			return Edu.MessageBox('此页不存在','error');
                  		}
                    	Ext.get('win_view-image').dom.src =url;
                    	Ext.getCmp('win_page_sum').setText('总页数:'+res.totalCount);
                    },function(res){
						imgUrls={};
						var url=getImageUrl(1);
						if(url<0){
							return Edu.MessageBox('没有相关电子课本页码数据','error');
						}
						//Edu.MessageBox(res.exception,'error');
					});
				}
				}]
		},{			
			items:[{
			id:'hd_localPath',
			xtype:'hidden',
			name:'book.localPath'
			}]
		},{
			items:[{xtype:'hidden',
			id:'hd_storageUrl',
			name:'book.storageUrl'
			}]
		},{
			items:[{xtype:'hidden',
			id:'hd_type',
			name:'book.type'
			}]
		}],
			buttonAlign:'center',
		buttons:[{
			id:'btnSave',
			text:'保存',
			handler:function(){
				var begin=Ext.getCmp('nf_beginIndx').getValue();
				var end=Ext.getCmp('nf_endIndx').getValue();
				var page=Ext.getCmp('tbPage').getValue();
				if(begin>page||end>page)
				{
					Edu.MessageBox('开始页或结束页不能大于最大页数','error');
					return;
				}
				if(begin>end)
				{
					Edu.MessageBox('开始页不能大于结束页','error');
					return;
				}
				var params={'book.preparationId':Ext.getCmp('preparationPanel').pid
				};
				var f=Ext.getCmp('ebookForm');
				f.submit('../preparation/createEbook.do',params,null,function(res){
					Edu.MessageBox('操作成功');
				});
			}
		}]		
	};
    config = Ext.apply(config, itemConfig || {});
    edu.UI.elecTextbookForm.superclass.constructor.call(this, config);		
};
Ext.extend(edu.UI.elecTextbookForm,Edu.Form);

//电子课本
edu.UI.elecTextbookPanel = function(itemConfig){
	var config={
		title:'电子课本',
		layout:'form',
		items:[new edu.UI.elecTextbookForm()
		]
	};
	config = Ext.apply(config, itemConfig || {});
    edu.UI.elecTextbookPanel.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.elecTextbookPanel,Ext.Panel);

//备课tab
edu.UI.preparationTab = function(itemConfig){
	var items=[],rights=itemConfig.rights;
	if($.inArray('preparation/preLession.do',rights)>-1){
		items.push(new Ext.Panel({
	        title:'备课对象',
    		items:[
    			new edu.UI.preparationPanel(itemConfig),
    			new edu.UI.preparationSelectedForm(itemConfig)	
    		]
		}));
	}
	if($.inArray('preparation/section.do',rights)>-1){
		items.push(new edu.UI.imagePanel(itemConfig));
	}
	if($.inArray('preparation/test.do',rights)>-1){
		items.push(new edu.UI.courseWorkPanel(itemConfig));
	}
	if($.inArray('preparation/homework.do',rights)>-1){
		items.push(new edu.UI.homeworkPanel(itemConfig));
	}
	if($.inArray('preparation/courseware.do',rights)>-1){
		items.push(new edu.UI.coursewarePanel(itemConfig));
	}
	if($.inArray('preparation/ebook.do',rights)>-1){
		items.push(new edu.UI.elecTextbookPanel(itemConfig));
	}		
	var config={
		activeTab: 0,
		plain:true,
		height:450,
		autoScroll:true,
		defaults:{autoScroll: true},
		listeners:{
		   tabchange:function(tabp,tab){
		   	     if(tab.title=='电子课本'){
		   	         var params={'bean.id':Ext.getCmp('preparationPanel').pid
				};
				var f=Ext.getCmp('ebookForm');
				f.getForm().load({ 
				    url : "../preparation/listEbook.do",
				    params:params,
				    method : "get",
				    waitTitle :'提示',
				    waitMsg :'加载数据中,请稍候',
				    success : function (form, action) {
				    	var com=Ext.getCmp('cbbook');
						com.setValue(action.result.data["book.bid"]);
				    },
				    failure : function(form, action){
				    	var jnRes = Ext.util.JSON.decode(action.response.responseText);
				    	Edu.MessageBox(jnRes.exception,'error');
				    }
			    });
		   	     }
		   }
		},
        items:items
	};
    config = Ext.apply(config, itemConfig || {});
    edu.UI.preparationTab.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.preparationTab,Edu.TabPanel);

//备课from
edu.UI.preparationForm = function(itemConfig) {
	var data=itemConfig?itemConfig.data:null;
	var config = {
		id:'preparationForm',
		//bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},
		items:[{
			fieldLabel:'名称',
			name:'bean.name',
			value:data?data.name:''
		}],
		buttonAlign:'center',
		buttons:[{
			text:data?'编辑':'创建',
			handler:function(){
				var params=data?{'bean.id':data.id}:{};
				var f=Ext.getCmp('preparationForm'),win=Ext.getCmp('preparationFormWin');
				f.submit('../preparation/'+(data?'update':'create')+'.do',params,win,function(res){
					Ext.getCmp('preparationInfoGrid').getStore().reload();
				});
			}
		}]
	};
	config = Ext.apply(config, null || {});
	edu.UI.preparationForm.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.preparationForm,Edu.Form);

//同步备课
edu.UI.SyncPreparation=function(pid){
	Ext.MessageBox.wait("正在同步中,请稍侯...");
	Ajaxx('../preparation/sync2Storage.do',{'preparationId':pid},function(res){
								Ext.MessageBox.hide();
								var result='';
								for(var i=0;i<res.data.length;i++)
									result+=res.data[i]+'</br>';
								if(res.error)
									Edu.MessageBox(result,'error');
								else
									Edu.MessageBox(result);
								},null,null,undefined,60000);
}

//在线备课grid
edu.UI.preparationInfoGrid = Ext.extend(Edu.Grid,{
	//paulwang 20121016 set row style
	viewConfig:{
		forceFit:true,
		autoScroll:true,
		getRowClass:function(record,index)  
            {  
                //todo:缺少为每种类型配置一种颜色表示  
            	//debugger;
                if(record.get('need2Sync')==true)  
                    return 'x-grid-record-red';  
                else  
                    return '';  
            }  
	},
	config:{
		id:'preparationInfoGrid',
		frame:true,
		title:'在线备课',
		width:768,
		defaults:{
			width : 100,
			sortable : true
		},
		columns:[{
			id : 'preparation_name',
			header : '名称',
			dataIndex : 'name',
			sortable:true
		},{
			id : 'preparation_time',
			header : '更新日期',
			dataIndex : 'latestUpdate',
			sortable:true
		},{
			id : 'preparation_teacher',
			header : '教师',
			dataIndex : 'teacherName',
			sortable:true
		},{
			id : 'preparation_operate',
			header : '操作',
        	dataIndex:'id',
         	renderer : function(v,a,b){
         		var time=0,
         			fs=['preparation/preLession.do',
         				'preparation/section.do',
         				'preparation/test.do',
         				'preparation/homework.do',
         				'preparation/courseware.do',
         				'preparation/ebook.do'
         				];
         		for(var i=0;i<fs.length;i++){
         			if($.inArray(fs[i],funs)>-1){
         				++time;
         			}
         		}
         		var h="";
         		if(time){
         			h = "<input type='button' value='备课' onclick='edu.UI.preparationManager("+v+")'>";
         		}
         		if(b.json.need2Sync)
         			h=h+" <input type='button' value='同步云存储' onclick='edu.UI.SyncPreparation("+v+")'>";
         		return h;
         	}
		}],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'button'
			},
			items:[{
				text:'新建',
				hidden:true,
				iconCls:'icon-add',
				handler:function(){
					var win=new Edu.Window({
						id:'preparationFormWin',
						title:'新建备课',
						items:[new edu.UI.preparationForm()]
					});
					win.show();
				}
			},{
				text:'删除',
				hidden:true,
				iconCls:'icon-del',
				handler:function(){
					var s=Ext.getCmp('preparationInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						Ext.Msg.confirm('提示','确定将删除该备课相关所有相关数据,请确认',function(bn){
							if(bn=='yes'){
								Ajaxx('../preparation/delete.do',{'bean.id':rd.data.id},function(res){
									Edu.MessageBox('删除成功');
									Ext.getCmp('preparationInfoGrid').getStore().reload();
								});
							}
						});
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}
				}
			},{
				text:'编辑',
				iconCls:'icon-edit',
				handler:function(){
					var s=Ext.getCmp('preparationInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						var win=new Edu.Window({
							id:'preparationFormWin',
							title:'编辑备课',
							items:[new edu.UI.preparationForm(rd)]
						});
						win.show();
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}
				}
			}]
		},
		bbar:{
			xtype:'paging',
			pageSize:10
		},
		listeners:{
			headerclick:function(g){
				g.headerclick=true;
			}
		}
		
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			if($.inArray('preparation/create.do',funs)>-1)
				config.tbar.items[0].hidden=false;
			if($.inArray('preparation/delete.do',funs)>-1)
				config.tbar.items[1].hidden=false;				
			config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.preparationInfoGrid.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.preparationInfoGrid.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.bbar.store=this.getStore();
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		return new Edu.JsonStore({
			url:'list.do',
			//remoteSort:true,
			root:'data',
			totalProperty:'totalCount',
			fields:['id','latestUpdate','name','teacherName','tid','need2Sync']
		});
	},
	loadData:function(){
		var g=Ext.getCmp('preparationInfoGrid');
	},	
	getStore:function(){
		var g=Ext.getCmp('preparationInfoGrid');
		return g.store;
	}
});

//电子课本Form
edu.UI.textbookForm = function(itemConfig) {
	var data=itemConfig?itemConfig.json:null;
	var config = {
		id:'textbookForm',
		//bodyStyle:'padding:5px,0px,0px,10px;background:#E1F1FF;padding-top:10px;padding-bottom:10px',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},
		items:[{
			fieldLabel:'名称',
			name:'bean.name',
			value:data?data.name:''
		},{
			xtype:'combo',
			fieldLabel:'类型',
			mode:'local',
			hiddenName:'bean.type ',
			editable : false,
			triggerAction:'all',
			displayField:'subjectname',
			valueField:'subjectname',
			value:data?data.type:'',
			store:new Edu.JsonStore({
				url:'../ebook/listSubjects.do',
				root:'data',
		        fields:['sid','subjectname']
		    })
		},{
			xtype:'combo',
			fieldLabel:'适合对象',
			mode:'local',
			hiddenName:'bean.target ',
			editable : false,
			triggerAction:'all',
			displayField:'gradename',
			valueField:'gradename',
			value:data?data.target:'',
			store:new Edu.JsonStore({
				url:'../ebook/listTargets.do',
				root:'data',
		        fields:['gradeId','gradename']
		    })			
		},{
			xtype:'numberfield',
			fieldLabel:'总页数',
			name:'bean.maxPage',
			value:data?data.maxPage:'',
			regex:/^[1-9]+[0-9]*$/,
			regexText:'请输入一个大于0的正数'
		},{
			xtype:'combo',
			fieldLabel:'图片类型',
			mode:'local',
			hiddenName:'bean.picType ',
			editable : false,
			triggerAction:'all',
			displayField:'text',
			valueField:'text',
			value:data?data.picType:'',
			store:new Ext.data.ArrayStore({
		        fields:['text'],
		        data:[
		        	['gif'],['jpeg'],['png']
		        ] 
		    })
		},{
			fieldLabel:'教材版本',
			name:'bean.version ',
			value:data?data.version:''
		},{
			fieldLabel:'描述',
			name:'bean.remark',
			value:data?data.remark:''
		}],
		buttonAlign:'center',
		buttons:[{
			text:data?'编辑':'创建',
			handler:function(){
				var params=data?{'bean.id':data.id}:{};
				var f=Ext.getCmp('textbookForm'),win=Ext.getCmp('textbookFormWin');
				f.submit('../ebook/'+(data?'update':'create')+'.do',params,win,function(res){
					Ext.getCmp('textbookInfoGrid').getStore().reload();
				});
			}
		}]
	};
	config = Ext.apply(config, null || {});
	edu.UI.textbookForm.superclass.constructor.call(this, config);
};
Ext.extend(edu.UI.textbookForm,Edu.Form);

//上传电子课本
edu.UI.textbookFileForm = function(itemConfig){
	var config = {
		id:'textbookFileForm',
		fileUpload:true,
		enctype:'multipart/form-data',
		defaults:{
			xtype:'textfield',
			msgTarget:'side',
			allowBlank:false,
			anchor:'78%'
		},		
		items:[{
			fieldLabel:'选择文件',
			inputType:'file',
		    name:'upload',
		    id:'fileInput'
		}],
		buttonAlign:'center',
		buttons:[{
			text:'上传',
			handler:function(){
				var fileName=Ext.getCmp('fileInput').getValue();
				if(fileName.substring(fileName.lastIndexOf(".")+1)!='zip')
				{
				   Edu.MessageBox("电子课本的上传文件格式必须为zip",'error');
				   return;
				}
				var f=Ext.getCmp('textbookFileForm'),win=Ext.getCmp('textbookFileFormWin');
				var params={
					'bean.id':f.tid
				};
				f.submit('../ebook/processEBook.do',params,win,function(){Edu.MessageBox('上传成功');Ext.getCmp('textbookInfoGrid').getStore().reload();});
			}
		}]		
	};
	config = Ext.apply(config, itemConfig || {});
	edu.UI.textbookFileForm.superclass.constructor.call(this, config);	
};
Ext.extend(edu.UI.textbookFileForm,Edu.Form);

function preview(id){
	var s=Ext.getCmp('textbookInfoGrid').getSelectionModel();
	var rd=s.getSelected();
	var image_window=new edu.UI.imageWindow();
	image_window.show();  
	image_window.setTitle('电子课本第1页' );	
	var com=Ext.getCmp('image-window');
	com.max=rd.data.maxPage;
	var params={
		'bean.id':id
	};
	Ajaxx('../ebook/listBookPageInfo.do',params,function(res){
		imgUrls=res.data;
		var url=getImageUrl(1);
		if(url<0){
			return Edu.MessageBox('此页不存在','error');
		}
		Ext.get('win_view-image').dom.src =url;
		Ext.getCmp('win_page_sum').setText('总页数:'+res.totalCount);
	},function(res){
		imgUrls={};
		var url=getImageUrl(1);
		if(url<0){
			return Edu.MessageBox('没有相关电子课本页码数据','error');
		}
		//Edu.MessageBox(res.exception,'error');
	});
};

function syncEbook(id){
	Ext.MessageBox.wait("正在同步中,请稍侯...");
	Ajaxx('../ebook/sync2Storage.do',{'bean.id':id},function(res){
								Ext.MessageBox.hide();
								var result='';
								for(var i=0;i<res.data.length;i++)
									result+=res.data[i]+'</br>';
								if(res.error)
									Edu.MessageBox(result,'error');
								else
									Edu.MessageBox(result);
								},null,null,undefined,60000);
}
//电子课本 grid
edu.UI.textbookInfoGrid = Ext.extend(Edu.Grid,{
	//paulwang 20121016 set row style
	viewConfig:{
		forceFit:true,
		autoScroll:true,
		getRowClass:function(record,index)  
            {  
                //todo:缺少为每种类型配置一种颜色表示  
            	//debugger;
                if(record.get('failCount')>0)  
                    return 'x-grid-record-red';  
                else  
                    return '';  
            }  
	},
	config:{
		id:'textbookInfoGrid',
		frame:true,
		title:'电子课本管理',
		width:768,
		defaults:{
			sortable : true
		},
		columns:[
		{
			id : 'textbook_name',
			header : '名称',
			dataIndex : 'name',
			sortable:true
		},{
			id : 'textbook_type',
			header : '类型',
			dataIndex : 'type',
			width:50,
			sortable:true
		},{
			id : 'textbook_target',
			header : '适合对象',
			dataIndex : 'target',
			sortable:true
		},{
			id : 'textbook_maxPage',
			header : '页数',
			sortable:true,
			width:50,
			dataIndex : 'maxPage'
		},{
			id : 'textbook_version',
			header : '教材版本',
			sortable:true,
			dataIndex : 'version'
		},{
			id : 'textbook_remark',
			header : '描述',
			sortable:true,
			dataIndex : 'remark'
		}/*,{
			id : 'textbook_time',
			header : '更新时间',
			dataIndex : 'latestUpdate',
			sortable:true
		}*/,{
			id : 'textbook_operate',
			header : '操作',
        	dataIndex:"id",
        	width:120,
         	renderer : function(v,a,b){
         		uploadTextbook=function(id){
 					var win=new Edu.Window({
						id:'textbookFileFormWin',
						title:'上传电子课本',
						items:[new edu.UI.textbookFileForm({'tid':id})]
					});
					win.show();  			
         		};
         		var h='';
         		if($.inArray('ebook/processEBook.do',funs)>-1){
         			h+="<input type='button' value='上传' onclick='uploadTextbook("+v+")'>";
         		}
         		h+="<input type='button' value='预览' onclick='preview("+v+")'>";
         		if(b.json.failCount>0)
         			h+="<input type='button' value='同步' onclick='syncEbook("+v+")'>";
         		return h;
         	}
		}],
		tbar:{
			style:'padding:2px 10px;',
			defaults:{
				xtype:'button'
			},
			items:[{
				text:'新建',
				hidden:true,
				iconCls:'icon-add',
				handler:function(){
					var win=new Edu.Window({
						id:'textbookFormWin',
						title:'新建电子课本',
						items:[new edu.UI.textbookForm()]
					});
					win.show();
				}
			},{
				text:'删除',
				hidden:true,
				iconCls:'icon-del',
				handler:function(){
					var s=Ext.getCmp('textbookInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						Ext.Msg.confirm('提示','确定将删除该电子课本,请确认',function(bn){
							if(bn=='yes'){
								Ajaxx('../ebook/delete.do',{'bean.id':rd.data.id},function(res){
									Edu.MessageBox('删除成功');
									Ext.getCmp('textbookInfoGrid').getStore().reload();
								});
							}
						});
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}					
				}
			},{
				text:'编辑',
				iconCls:'icon-edit',
				handler:function(){
					var s=Ext.getCmp('textbookInfoGrid').getSelectionModel();
					if(s.hasSelection()){
						var rd=s.getSelected();
						var win=new Edu.Window({
							id:'textbookFormWin',
							title:'编辑电子课本',
							items:[new edu.UI.textbookForm(rd)]
						});
						win.show();
					}else{
						Edu.MessageBox('请先选择一行记录','error');
					}
				}
			}]
		},
		bbar:{
			xtype:'paging',
			pageSize:10
		},
		listeners:{
			headerclick:function(g){
				g.headerclick=true;
			}
		}		
	},
	constructor:function(itemConfig){
		config = Ext.apply(this.config, itemConfig || {});
		if(!config.sm){
			config.sm=this.createSelModel({singleSelect:true});
			if($.inArray('ebook/create.do',funs)>-1)
				config.tbar.items[0].hidden=false;
			if($.inArray('ebook/delete.dp',funs)>-1)
				config.tbar.items[1].hidden=false;		
			config.columns.unshift(new Ext.grid.RowNumberer(),config.sm);
		}
		edu.UI.textbookInfoGrid.superclass.constructor.call(this,config);
	},
	//初始化方法
	initComponent:function(){
		this.init();
		edu.UI.textbookInfoGrid.superclass.initComponent.call(this);
	},
	init:function(){
		this.store=this.createStore();
		this.bbar.store=this.getStore();
		this.initListeners();
	},
	initListeners:function(){//获取相应部件,进行事件绑定
		this.on('afterrender',this.loadData);
	},
	createStore:function(){
		var g=this;
		return new Edu.JsonStore({
			url:'../ebook/list.do',
			//remoteSort:true,
			root:'data',
			totalProperty:'totalCount',
			fields:['id','name','latestUpdate','maxPage','target','type','version','remark','failCount']
		});
	},
	loadData:function(){
		var g=Ext.getCmp('textbookInfoGrid');
	},	
	getStore:function(){
		var g=Ext.getCmp('textbookInfoGrid');
		return g.store;
	}
});