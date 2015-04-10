package com.aok.order.dao;

import com.aok.entity.AccessoryChangeItem;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface AccessoryChangeItemDao extends BaseDao<AccessoryChangeItem>{
	Pagination findByChangeId(String changeId,int pageNo,int pageSize);
}
