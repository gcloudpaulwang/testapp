package com.aok.order.mng;

import com.aok.entity.AccessoryChange;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.page.Pagination;

public interface AccessoryChangeMng extends BaseManager<AccessoryChange>{
	Pagination findByOid(String oid,int pageNo,int pageSize);
}
