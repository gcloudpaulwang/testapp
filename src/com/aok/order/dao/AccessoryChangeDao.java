package com.aok.order.dao;

import com.aok.entity.AccessoryChange;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface AccessoryChangeDao extends BaseDao<AccessoryChange>{
	Pagination findByOid(String oid,int pageNo,int pageSize);
}
