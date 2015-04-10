package com.aok.order.mng;

import com.aok.entity.OrderAccessory;
import com.aok.order.model.AccessoryBatchPost;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.page.Pagination;
import com.sp.common.util.SPException;

public interface OrderAccessoryMng extends BaseManager<OrderAccessory>{
	Pagination findByOid(String oid,int pageNo,int pageSize);
	boolean isExist(String oid,String pid);
	OrderAccessory findByOidPid(String oid,String pid);
	OrderAccessory save(OrderAccessory entity,String oid);
	OrderAccessory update(OrderAccessory entity,String oid,Double orglQty);
	void batchSave(AccessoryBatchPost batch)throws SPException;
}
