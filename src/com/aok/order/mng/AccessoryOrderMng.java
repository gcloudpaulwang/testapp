package com.aok.order.mng;

import java.util.Date;
import java.util.List;

import com.aok.entity.AccessoryOrder;
import com.aok.order.model.OrderQueryParam;
import com.aok.production.model.AccessoryStatistics;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;

public interface AccessoryOrderMng extends BaseManager<AccessoryOrder> {
	int getMaxSeq();
	Pagination query(OrderQueryParam qaram,int pageNo,int pageSize,OrderBy... orders);
	public List<AccessoryStatistics> statistics(List<String> storeList, String type, Date starttime,Date endtime);
	public List<AccessoryStatistics> accessory(List<String> storeList, String zone,Date startTime,Date endTime);
	public Pagination statistics(List<String> storeList,String type, Date starttime,Date endtime,int pageNo,int pageSize);
	public Pagination accessory(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize);
	List<AccessoryOrder> findEditble(String flag);
	void update(AccessoryOrder orgl,AccessoryOrder newO,String zone);
}
