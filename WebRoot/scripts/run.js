Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL ="../Ext/resources/images/default/s.gif";
	tab=null;
	funs=null;//权限
	Ajaxx('../public/listFunUri.do',{},function(res){
		funs=res.data;
	 	$('.threebar li a').click(function(){
	 		$('.threebar li a').each(function(i,o){
	 			$(o).removeClass('checked');
	 		});
	 		var item=arguments[0].currentTarget;
	 		$(item).addClass('checked');
	 		var menu=$(item).attr('id');
	 		if(tab!=undefined)
				tab.destroy();
			var navBar=$('#maindiv .mainbody .adress');
	 		var text=navBar.text().substr(0,11);
	 		switch(menu){
	 			case 'user01':
		  			navBar.html(text+'帐户中心');
		  			Ajaxx('../profile/userinfo.do',{},function(res){
		  				tab=new edu.UI.Tab({
							items:[new edu.UI.userInfoFrom(res.data)]
						});	
					});
	 				break;
	 			case 'user02':
		 			navBar.html(text+'我的学校');
		 			Ajaxx('../profile/school.do',{},function(res){
		  				tab=new edu.UI.Tab({
							items:[new edu.UI.userSchoolFrom(res.data)]
						});	
					});
					break;
	  			case 'user03':
		 			navBar.html(text+'我的班级');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.userClassesGrid()]
					});		
	 				break;
	 			case 'user04':
		 			navBar.html(text+'我的课程表');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.myTable()]
					});  
	 				break;
	 			case 'user05':
		 			navBar.html(text+'班级课程表');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.classTable()]
					});
	 				break;
	 			case 'user06':
		 			navBar.html(text+'年级课程表');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.gradeTable()]
					});
	 				break;
	 			case 'user07':
		 			navBar.html(text+'课程计划录入');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.scheduleInfoGrid()]
					}); 			
	 				break;
	 			case 'user08':
		 			navBar.html(text+'在线备课');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.preparationInfoGrid()]
					}); 
	 				break;
	 			case 'user09':
		 			navBar.html(text+'电子课本管理');
		 			tab=new edu.UI.Tab({
						items:[new edu.UI.textbookInfoGrid()]
					}); 
	 				break; 				
	 		}
	 	});
	 	//默认点击第一个菜单
	 	$('.threebar li a:first').click();		
	},null,null,false,0);
});