Aok.UI.ProfileForm = function(itemConfig) {
	var data = itemConfig ? itemConfig.data : null;
	var gengerStore = [['男', true], ['女', false]];
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'profile-form',
		frame : true,
		title : '个人信息',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 300
		},
		layout : "column",

		items : [{
					layout : "form",
					defaults : {
						width : 300
					},
					items : [{
								fieldLabel : '登录名',
								xtype : 'textfield',
								name : 'loginName',
								value : data ? data.name : '',
								disabled : true
							}, {
								fieldLabel : '真实姓名',
								name : 'u.aokUser.realName',
								xtype : 'textfield',
								blankText : '真实姓名不能为空',
								value : data ? data.name : '',
								allowBlank : false
							}, {
								fieldLabel : '邮箱',
								name : 'u.email',
								xtype : 'textfield',
								blankText : '邮箱不能为空',
								value : data ? data.name : '',
								allowBlank : false
							}]
				}, {
					layout : "form",
					defaults : {
						width : 300
					},
					items : [{
								xtype : 'button',
								text : ' 修改登录密码',
								width : 100,
								handler : function() {
									var f = new Aok.UI.ProfilePwdForm();
									var win = new Sp.Window({
												id : 'profile-pwd-win',
												title : '修改密码',
												items : [f]
											});
									win.show();
								}
							}, {
								xtype : 'combo',
								fieldLabel : '姓别',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								displayField : 'text',
								valueField : 'value',
								blankText : '姓别不能为空',
								hiddenName : 'u.aokUser.gender',
								allowBlank : false,
								store : new Ext.data.ArrayStore({
											fields : ['text', 'value'],
											data : gengerStore
										})
							}, {
								fieldLabel : '电话号码',
								name : 'u.aokUser.mobile',
								xtype : 'textfield',
								blankText : '电话号码不能为空',
								value : data ? data.name : '',
								allowBlank : false

							}]
				}],
		buttonAlign : 'center',
		buttons : [{
					text : '更新',
					iconCls : 'icon-save',
					handler : function() {
						var f = Ext.getCmp('profile-form');
						f.submit('../profile/update.do', null, null, function(
										res) {
									Sp.MessageBox('个人信息更新成功!');
								});
					}
				}]
	};
	config = Ext.apply(config, itemConfig || {});
	Aok.UI.ProfileForm.superclass.constructor.call(this, config);
}

Ext.extend(Aok.UI.ProfileForm, Sp.Form);

Aok.UI.ProfileLoad = function() {
	Ajaxx('../profile/info.do', null, function(res) {
				if (res.success) {
					var f = Ext.getCmp('profile-form');
					f.form.findField('loginName').setValue(res.data.loginName);
					f.form.findField('u.aokUser.realName')
							.setValue(res.data.aokUser.realName);
					f.form.findField('u.email').setValue(res.data.email);
					f.form.findField('u.aokUser.mobile')
							.setValue(res.data.aokUser.mobile);
					f.form.findField('u.aokUser.gender')
							.setValue(res.data.aokUser.gender);
				} else {
					Sp.MessageBox(res.exception, 'error');
				}
			});
}

Ext.apply(Ext.form.VTypes, {
			password : function(val, field) {
				if (field.confirmTo) {
					var pwd = Ext.get(field.confirmTo);
					if (val.trim() == pwd.getValue().trim()) {
						return true;
					} else {
						return false;
					}
					return false;
				}
			}
		});

Aok.UI.ProfilePwdForm = function() {
	var config = {
		labelWidth : 75, // label settings here cascade unless overridden
		id : 'profile-pwd-form',
		frame : true,
		// title : '单项礼品录入',
		bodyStyle : 'padding:5px 5px 0',
		defaults : {
			width : 230
		},
		defaultType : 'textfield',

		items : [{
					fieldLabel : '原密码',
					name : 'orgin_pwd',
					blankText : '原密码不能为空',
					allowBlank : false,
					minLength : 6,
					minLengthText:'密码必须6个字符以上',
 					maxLength : 30,
 					maxLengthText:'密码必须30个字符以下',
					inputType : 'password'
				}, {
					fieldLabel : '新密码',
					id:'new_pwd',
					name : 'new_pwd',
					minLength : 6,  
 					minLengthText:'密码必须6个字符以上',
 					maxLength : 30,
 					maxLengthText:'密码必须30个字符以下',
					blankText : '新密码不能为空',
					allowBlank : false,
					inputType : 'password'
				}, {
					fieldLabel : '确认密码',
					name : 'confirm_pwd', 
					vtype:'password',  
        			vtypeText:"两次密码不一致！",  
        			confirmTo:'new_pwd', 
					inputType : 'password'
				}],
		buttonAlign : 'center',
		buttons : [{
					text :'确认',
					handler : function() {
						var f = Ext.getCmp('profile-pwd-form');
						var win = Ext.getCmp('profile-pwd-win');
						f.submit('../profile/updatePwd.do', null, win, function(res) {
									if (res.success) {
										Sp.MessageBox('密码修改成功!');
									} else {
										Sp.MessageBox(res.exception,
												'error');
									}
								});
					}
				}]
	};
	config = Ext.apply(config, {});
	Aok.UI.ProfilePwdForm.superclass.constructor.call(this, config);
}
Ext.extend(Aok.UI.ProfilePwdForm, Sp.Form);