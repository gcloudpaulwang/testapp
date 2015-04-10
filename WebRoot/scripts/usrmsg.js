var ovstr = new Array();
var pParams = new Object();
var prsregex = '\',\'';
var cprsregex = '\'，';
var cpprsregex = /\'\,/g;
var prsappregex = '\'&\'';
var avatarurl = '';
var avatarurlCg = '';
function getPersonWindow(type) {
//	type = usertype;
	var fLabel = getPersonLabel(type);
	var fields = getPersonField(type);
	var store = new Ext.data.JsonStore({
		url: '/SchoolManageSystem/usermg/userinfo.do?type='+type,
		root: 'rows',
		totalProperty: 'total',
		idProperty: getPersonId(type),
		fields: fields
	});
	var bl = !(type && type!='1');
	var isTeacher = (type=='3');
	var vtype = 'email';
	var telregex = /^((13[0-9])|(15[^4,\D])|(18[0,5-9]))\d{8}$/;
	var phoneregex = /^((\d{3,4}(\s|-){0,1}\d{3,8})|(\d{3,8}))$/;
	var regex2 = ['','','',telregex];
	if(type&&type=='3')  {
		vtype=null;
//		regex = /^[\d-+]*$/;
	}
	
	
	
	
	var form = new Ext.form.FormPanel({
			id: 'personform',
			labelWidth: 80, 
			labelAlign : 'right',
	   		region : 'center',
			border : false,
			plain : true,
			see: true,
			bodyStyle : 'padding:10px 8px 8px 8px;',
			items: [{
						xtype : 'textfield',
						id: 'field1',
						fieldLabel : fLabel[0],
						name: fields[0],
						readOnly: true,
						anchor : '94%'
						
					},{
						xtype : 'textfield',
						id: 'aliasname',
						fieldLabel : fLabel[6],
						name:  fields[6],
						anchor : '94%',
						blankText: '请输入30位以内的登录别名，推荐使用邮箱或者QQ号作为登录别名!',
						regex: /^[0-9a-zA-Z_,@#$.]{1,30}$/,
						regexText:'登录别名中不允许出现特殊字符',
						enableKeyEvents: true,         
						listeners:{                            
						     'blur':function(){  
						    	 if(Ext.getCmp('aliasname').validate())
									 Ext.Ajax.request({
									  url:'/SchoolManageSystem/checkalisa.do?alisa='+Ext.getCmp('aliasname').getValue(),
									  success: function(response,opts){
									  var respText=Ext.util.JSON.decode(response.responseText);
									  if(respText.success==false){
									             Ext.MessageBox.alert('错误', '该别名已被使用，请重新填写！');
									             Ext.getCmp('aliasname').setValue('');
									        }
									     }
									   });  
		                }      
						}
					},{
						xtype : 'textfield',
						id: 'field2',
						maxLength: 15,
						fieldLabel : fLabel[1],
						regex: /^([\u4E00-\u9FFF]{1,}|([a-zA-Z]{1,}\s{0,1}){1,})$/,
						regexText:'姓名格式:中文(XXX),英文(XXX XXX XXX)',
						allowBlank:false,
						blankText:'姓名不能为空',
						name: fields[1],
						readOnly: bl,
						anchor : '94%'
						
					},{
						xtype : 'textfield',
						id: 'field3',
						fieldLabel : fLabel[2],
						name: fields[2],
						readOnly: true,
						anchor : '94%'
						
					},{
						xtype : 'textfield',
						id: 'field4',
						fieldLabel : fLabel[3],
						vtype: vtype,
						maxLength:30,
						regex: regex2[type],
						regexText:'请输入正确的手机号码（18912345678）',
						name: fields[3],
						anchor : '94%'
						
					},{
						xtype : 'textfield',
						id: 'field5',
						fieldLabel : fLabel[4],
						name: fields[4],
						maxLength:30,
						regex: phoneregex,
						regexText:'请输入正确的电话号码（0769-12345678）',
						readOnly: bl,
						anchor : '94%'
						
					},{
						xtype : 'textfield',
						id: 'field6',
						fieldLabel : fLabel[5],
						name: fields[5],
						maxLength:40,
						readOnly: bl,
						anchor : '94%'
					},{
						xtype : 'textfield',
						fieldLabel : '电子邮箱',
						vtype: 'email',
						maxLength:30,
						hidden: !isTeacher,
						readOnly:!isTeacher,
						name: 'EMAIL',
						anchor : '94%'
						
					},{
						xtype: 'fieldset',
                		title: '修改密码',
                		id: 'xmfieldset',
                		collapsible: true,
                		labelWidth: 69,
                		collapsed: true,
                		listeners: {
                			expand: function(p) {
                				Ext.getCmp('btn_win_password').setDisabled(false);
                			},
                			collapse: function(p) {
                				Ext.getCmp('btn_win_password').setDisabled(true);
                			}
                		},
                		items: [{
						xtype : 'textfield',
						id: 'password',
						maxLength: 10,
						maxLengthText: '密码最长为10位',
						fieldLabel : '旧密码',
						vtype:'alphanum',
						inputType: 'password',
						name: 'password',
						anchor : '96%'
					},{
							xtype : 'textfield',
							fieldLabel : "新密码",
							id: 'npassword',
							inputType: 'password',
							maxLength: 10,
							vtype:'alphanum',
							maxLengthText: '密码最长为10位',
							name: 'npassword',
							anchor : '96%'
						},{
							xtype : 'textfield',
							id: 'cpassword',
							fieldLabel : "确认密码",
							maxLength: 10,
							vtype:'alphanum',
							maxLengthText: '密码最长为10位',
							name: 'npassword',
							inputType: 'password',
							anchor : '96%'//,
						}]
				}]		
		});
		store.load({
			callback: function(record,options,success) {
				if(!success) return Ext.Msg.alert('提示','数据加载失败,请刷新后重试!');
				var r = store.getAt(0);
				var stemp = '';
				for(var i=0; i< fields.length;i++) {
					stemp = r.get(fields[i]);
					pParams[fields[i]] = (stemp&&stemp!=null) ? stemp : '';
				}
				form.getForm().loadRecord(r);
				var alisa = Ext.getCmp('aliasname').getValue();
				if(alisa!=''){
					Ext.getCmp('aliasname').disable();
				}
			}
		});
		
		
		
		var imageform = new Ext.FormPanel({
			id: 'imageform',
			labelWidth: 80, 
			labelAlign : 'right',
			border : false,
			fileUpload: true,
			bodyStyle : 'padding:10px 8px 8px 8px;',
			items:[{
				xtype: 'fieldset',
	            title: '设置头像',
	            collapsible: true,
	            labelWidth: 69,
	            collapsed: true,
	            layout:'form',
	            items: [{
	            	xtype: 'fileuploadfield',
	                id: 'upload',
	                name: 'upload',
	                emptyText: '选择相片地址',
	                fieldLabel: '上传路径',
	                buttonText: '',
	                width:440,
	                buttonCfg: {
	                    iconCls: 'upload-avatar'
	                },
	                anchor : '96%'
	            },{
	            	border:false,
	                layout:'form',
	                fieldLabel : "预览图片",      
	                items:[
	                     {
	                    xtype:'panel',
	                    border:false,
	                    layout:'column',
	                    items:[{
	                    		xtype : 'box',      
			                    id : 'browseImage',   
			                    columnWidth:.35,
			                    bodyStyle:'padding:10px 10px 10px 10px;',
			                    autoEl : {   
			                        width : 102,   
			                        height : 125,   
			                        tag : 'img',     
			                        src : avatarurl
			                    }  
	                    },{
	                    columnWidth:.5,
	                    labelAlign :'left',
	                    border:false,
	                    buttonAlign:'center',
	                    bodyStyle:'margin-left:10px;padding:5px',
	                    items:[{
	        					xtype : 'label',
	        					fieldLabel:'',
	        				    html: '<ul><li>1、图片格式只能是jpg格式。</li></ul><br/>'
	                    },{
	        					xtype : 'label',
	        					fieldLabel:'',
	        				    html: '<ul><li>2、图片大小不超过300K。</li></ul><br/>'
                    },{
	        					xtype : 'label',
	        					fieldLabel:'',
	        					html: '<ul><li>3、图片默认分辨率为102*125。</li></ul><br/>'
                    }]	,
                    buttons:[{
    					xtype : 'button',
    					fieldLabel:'',
    					text:'上传头像',
    					handler: function(){
    		 				var file_path = Ext.getCmp('upload').getValue();
    		 				var str = file_path.substr(file_path.lastIndexOf('.')+1,file_path.length);
    		 				if(str==''){
    		 					Ext.Msg.alert('错误', "请选择要上传的图片！"); 
    		 					return false;
    		 				}
    		 				if(str!='JPG'&&str!='jpg'){
    		 					Ext.Msg.alert('错误', "上传的图像只能是jpg格式！"); 
    		 					return false;
    		 				}							
    		 				if(imageform.getForm().isValid()){
    		 					imageform.getForm().submit({
    		 	                    url: '/SchoolManageSystem/upLoadAvatar.do',
    		 	                   success:function(form, action){   
    		 	                       var isSuc = action.result.success;
    		 	                       var message = action.result.message; 
    		 	                       var image_url = "/SchoolManageSystem"+ action.result.avatarurl;   
									   if(isSuc=='true' ||  isSuc){
									   }else{
										Ext.Msg.alert('错误', message);   
									   }
    		 	                       Ext.getCmp("browseImage").getEl().dom.src=image_url;
    		 	                  },   
    		 	                  failure:function(form, action){   
    		 	                      var isSuc = action.result.success;
    		 	                      var message = action.result.message;  
									  if(isSuc=='true'){
    		 	                        Ext.Msg.alert('消息', message);
									   }else{
										Ext.Msg.alert('错误', message);   
									   }
									   Ext.getCmp("browseImage").getEl().dom.src=image_url;
    		 	                  }   
    		 	                });
    		                 }
    		             }
                    	}
                	]
	                    }]
	                	
	                }]
	           }]
			}]
		});
	var win = new Ext.Window({
			id: 'personwin',
			width:500,
            title    : '个人设置',
            closable : true,
            items : [form,imageform],
			border : false,
			modal: true,
			buttonAlign : 'right',		
			buttons : [{
				id: 'btn_win_password',
				text : '修改密码',
				disabled: true,
				handler : function(){
					modifyPassword(type);
				}
			},{
				text : '保存',
				handler : function(){
					submitUserForm(type);
				}
			},{
				text : '关闭',
				handler : function(){
					win.close();
				}
			}]
        });
        return win;
}
function getPersonField(type) {
	if(!type || !(/^[0-9]*$/.test(type))) return '';
	var field = [[],['STKEY','STNAME','GRADENAME','STEMAIL','STHOMETEL','STHOMEADDR','ALIASSTU'],
				['GUARDIAID','GUARDIANAME','GRADENAME','STEMAIL','STHOMETEL','STHOMEADDR','ALIASPAR'],
				['uid','UNICKNAME','UGROUP','UMOBILE','TCTEL','TCADDR','ALIASNAME','EMAIL']];
	if(type<0 || type>field.length) return '';
	return field[type];
}
function getPersonLabel(type) {
	if(!type || !(/^[0-9]*$/.test(type))) return '';
	var label = [[],['用户名','姓名','年级','邮箱','电话号码','家庭住址','登录别名'],
				['用户名','姓名','年级','邮箱','电话号码','家庭住址','登录别名'],
				['用户名','姓名','科组','手机','办公电话','联系地址','登录别名','邮箱']];
	if(type<0 || type>label.length) return '';
	return label[type];
}
function getPersonId(type) {
	if(!type || !(/^[0-9]*$/.test(type))) return '';
	var id = [[],['STKEY'],
				['GUARDIAID'],
				['UID']];
	if(type<0 || type>id.length) return '';
	return id[type];
}
function modifyPassword(type) {
	var form = Ext.getCmp('personform');
	var str = form.findById('password').getValue();
	str = (str) ? str : '';
	if(str.length<1 || str.length>10) 
		return Ext.Msg.alert('提示','请输入1-10位字符或数字的旧密码!');
	var str1 = form.findById('npassword').getValue();
	var str2 = form.findById('cpassword').getValue();
	str1 = (str1) ? str1 : '';
	str2 = (str2) ? str2 : '';
	if(str1.length<1 || str1.length>10 || str2.length<1 || str2.length>10) 
		return Ext.Msg.alert('提示','密码必须是1-10位字符或数字!');
	if(str1!=str2) return Ext.Msg.alert('提示','两次输入的密码不一致!');
	if(str1==str) return Ext.Msg.alert('提示','新密码跟旧密码相同!');
	var jsonString = 'password,npassword&'+str+','+str1;
	Ext.Ajax.request({
		url: '/SchoolManageSystem/usermg/modifyUserinfo.do?type='+type,
		method: 'post',
		params: {jsonString: jsonString},
		success: function(type, action) {
			var response = Ext.util.JSON.decode(type.responseText);
			var bool = -1;
			if(response.code != undefined && response.code !=null)bool = response.code.code;
			if(bool == 0) {
				Ext.Msg.alert('提示','密码已修改,请记住新密码!');
			} else {
				Ext.Msg.alert('提示',response.code.message);
			}
		}
	});
}
function submitUserForm(type) {
	var form = Ext.getCmp('personform');
	var str1='';
	var str2='';
	var i = 0;
	var params = new Object();
	var atemp = new Array();
	if(!form.form.isValid()) return Ext.Msg.alert('提示','请按提示输入信息!');
	Ext.iterate(form.form.getValues(), function(key, value) {
				i++;
				if (key != 'password' && key !='npassword'&&key!='aliasname' &&  value!=pParams[key] ) {
					atemp[i-1] = key;
					value = value.replace(cpprsregex,cprsregex).replace(/\'/g,'\'\'');
					params[key] = value;
					str1 += key + prsregex;
					str2 += value + prsregex;
				}
			}, form.getForm());
    if(str1=='') return;
	var jsonString = str1+prsappregex+str2;
	Ext.Ajax.request({
		url: '/SchoolManageSystem/usermg/modifyUserinfo.do?type='+type,
		method: 'post',
		params: {jsonString: jsonString},
		success: function(type, action) {
			var response = Ext.util.JSON.decode(type.responseText);
			avatarurl = avatarurlCg;
			var bool = -1;
			if(response.code != undefined && response.code !=null)bool = response.code.code;
			if(bool == 0) {
				Ext.Msg.alert('提示','您的个人信息已修改!');
				for(var i=0;i<atemp.length;i++) {
					var key = atemp[i];
					pParams[key] = params[key];
				}
			} else {
				Ext.Msg.alert('提示',response.code.message);
			}
		}
	});
}