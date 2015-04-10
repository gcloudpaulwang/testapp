Ext.namespace("Aok.UI");
var ORDER_PAGE_SIZE = 50;
if  (!Ext.grid.GridView.prototype.templates) {  
    Ext.grid.GridView.prototype.templates = {};  
}  
Ext.grid.GridView.prototype.templates.cell =  new  Ext.Template(  
     '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>' ,  
     '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>' ,  
     '</td>'  
);
$(document).keydown(function(e) {
	var doPrevent;
	if (e.keyCode == 8) {
		var d = e.srcElement || e.target;
		if (d.tagName.toUpperCase() == 'INPUT'
				|| d.tagName.toUpperCase() == 'TEXTAREA') {
			doPrevent = d.readOnly || d.disabled;
		} else
			doPrevent = true;
	} else
		doPrevent = false;

	if (doPrevent)
		e.preventDefault();
});

var getNextDate=function(n){
	var now =new Date();
	var a=now.valueOf();
	a = a + n * 24 * 60 * 60 * 1000  ;
	a=new Date(a);
	var month=a.getMonth()+1;
	var date=a.getDate();
	if(month<10)
		month="0"+month;
	if(date<10)
		date="0"+date;
	return a.getFullYear()+"-"+month+"-"+date;
};