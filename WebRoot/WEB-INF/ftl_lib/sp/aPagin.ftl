<#macro aPagin eduPagination callback action=''>
 <div class="toolBar blueC">
                                <div class="paging">
                                	
                                	<a href="javascript:_firstPage();" class="arrowT">
                                    </a>
                                    
                                    <a href="javascript:_prePage();" class="arrowL">
                                    </a>
                                    
                                    第<span class="num"><span class="bg" id="curentPage">1</span></span>页
                                    <span class="mL5">共${eduPagination.totalPage!}页</span>
                                    
                                    <a href="javascript:_nextPage();" class="arrowR">
                                    </a>
                                    
                                    <a href="javascript:_lastPage();" class="arrowD">
                                    </a>
                                </div>	
                            </div>
                            
<script language="javascript">
var totalPage=${eduPagination.totalPage!};
var curentPage=1;
function _gotoPage(pageNo) {
	curentPage=pageNo;
	overlay("show");
	try{
		$.ajax({
		datatype:"json",
		url:"${action!}",
		data:{"start":(pageNo-1)*10},
		type:"post",
		success:${callback!},
		error:function(){
			overlay("hide")
			return;
		}
	})
	} catch(e) {
		alert('gotoPage(pageNo)��������򲻴���');
	}
}
function _nextPage(){
	if(getCurentPageNo()==totalPage)
		return;
	_gotoPage(getCurentPageNo()+1);
}
function _prePage(){
	if(getCurentPageNo()==1)
		return;
	_gotoPage(getCurentPageNo()-1);
}
function _firstPage(){
	if(getCurentPageNo()==1)
		return;
	_gotoPage(1);
}
function _lastPage(){
	if(getCurentPageNo()==totalPage)
		return;
	_gotoPage(totalPage);
}
function getCurentPageNo(){
	return parseInt($("#curentPage").text());
}
</script>

</#macro>