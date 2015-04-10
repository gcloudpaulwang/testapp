<#macro pagin eduPagination pageNo=1 action=''>
 <div class="toolBar blueC">
                                <div class="paging">
                                
                                    <#if pageNo!=1><a href="javascript:_gotoPage(1);" class="arrowT">
                                    <#else><a href="#" class="arrowT">
                                    </#if></a>
                                    
                                    <#if eduPagination.prePage!=pageNo&&eduPagination.prePage!=0>
                                    <a href="javascript:_gotoPage(${eduPagination.prePage});" class="arrowL">
                                    <#else><a href="#" class="arrowL">
                                    </#if>
                                    </a>
                                    
                                    第<span class="num"><span class="bg">${pageNo!}</span></span>页
                                    <span class="mL5">共${eduPagination.totalPage!}页</span>
                                    
                                    <#if eduPagination.nextPage!=pageNo>
                                    <a href="javascript:_gotoPage(${eduPagination.nextPage});" class="arrowR">
                                    <#else><a href="#" class="arrowR">
                                    </#if>
                                    </a>
                                    
                                    <#if eduPagination.totalPage!=pageNo>
                                    <a href="javascript:_gotoPage(${eduPagination.totalPage});" class="arrowD">
                                     <#else><a href="#" class="arrowD">
                                    </#if>
                                    </a>
                                </div>	
                            </div>
<form  method="post" id="pageForm">
		<input type="hidden" id="pageNo" name="pageNo" value="${pageNo!}"/>
	</form>  
<script language="javascript">
function _gotoPage(pageNo) {
	try{
		var form = document.getElementById("pageForm");
		form.pageNo.value = pageNo;
		form.action="${action}";
		form.onsubmit=null;
		form.submit();
	} catch(e) {
	debugger;
		alert('gotoPage(pageNo)��������򲻴���');
	}
}
</script>
</#macro>