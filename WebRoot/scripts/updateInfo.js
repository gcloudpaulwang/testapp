var point = new Object();
function getUpdateWindow() {
//	alert(123);
	$.getJSON('/SchoolManageSystem/setCommonData.do');
//	alert('Height1:'+document.body.clientHeight+'Height2:'+document.body.offsetHeight+'Height3:'+window.screen.height+'Height4:'+window.screen.availHeight);
	var form = new Ext.form.FormPanel({
		frame : false,
		border : false,
		labelAlign:'right',
		layout:'form',
		items:[{
				border:false,
				layout:'column',
				items:[{
					columnWidth:.5,
					border:false,
			        bodyStyle:'padding:10px 200px 10px 10px; ',
			        xtype:'box',
			        autoEl : {   
	                        width : 132,   
	                        height : 195,   
	                        tag : 'img',     
	                        src : '/SchoolManageSystem/images/login/bsupdate.png'
	                } 
				},{
					columnWidth:.5,
					border:false,
			        xtype:'label',
			        style :'margin:15px 10px 0px 0px;',
			        height:195,
			        readOnly:true,
			        width:130,
			        hideLabel:true,
			        html : '1.狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗狗<br>2.在正在转正<br>2.在正在转正<br>2.在正在转正<br>2.在正在转正<br>2.在正在转正<br>2.在正在转正'
				}]
		}]
	});
	var win = new Ext.Window({
            title    : '互动教学备课平台更新信息',
            id: 'update-szxy',
            closable : true,
            modal: false,
            resizable: false,
//            height   : 450,
            width    : 380,  
            height: 242,
//            autoScroll :true,
//            x:Ext.getCmp("update-szxy").getX()-370,
//            y:Ext.getCmp("update-szxy").getY()-232,
//            draggable: false,
			frame:true,
			autoDestroy:true,
            items    : [form],
             border:false
//			buttonAlign : 'right'
           /* buttons : [{
			text : '关闭',
			id:'btn_tcinfo_close',
			height: 20,
			handler : function(){win.close();}}]*/
        });
        win.setPosition(( window.screen.availWidth-win.width-20),( window.screen.availHeight-1.6*win.height));
		win.show();
		setPosition();
}

 function setPosition(){  
 		var win = Ext.getCmp('update-szxy');
 		 if(typeof window.pageYOffset != undefined) { 
  			 point.x = window.pageXOffset; 
  			 point.y = window.pageYOffset; 
		  }  else {
		  	point.y = document.body.scrollTop;
		  	point.x = document.body.scrollLeft;
		  }
         if(win!=null){  
         	win. setPagePosition(window.screen.availWidth+point.x-400,window.screen.availHeight+point.y-407) ;
            window.setTimeout("setPosition()",800);  
        }  
 }