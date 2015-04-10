package com.aok.order.dao;

import com.aok.entity.OrderAccessory;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface OrderAccessoryDao extends BaseDao<OrderAccessory>{
	Pagination findByOid(String oid,int pageNo,int pageSize);
	boolean isExist(String oid,String pid);
	OrderAccessory findByOidPid(String oid,String pid);
	Long countByOid(String oid);
}
