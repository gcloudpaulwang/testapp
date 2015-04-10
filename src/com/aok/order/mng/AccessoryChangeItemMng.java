package com.aok.order.mng;

import com.aok.entity.AccessoryChangeItem;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.page.Pagination;

public interface AccessoryChangeItemMng extends BaseManager<AccessoryChangeItem>{
	Pagination findByChangeId(String changeId,int pageNo,int pageSize);
}
