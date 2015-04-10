package com.aok.order.dao;

import java.util.Date;
import java.util.List;

import com.aok.entity.AccessoryOrder;
import com.aok.production.model.AccessoryStatistics;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface AccessoryOrderDao extends BaseDao<AccessoryOrder>{
	int getMaxSeq();
	public List<AccessoryStatistics> statistics(List<String> storeList,String type,Date starttime,Date endtime);
	public List<AccessoryStatistics> accessory(List<String> storeList, String zone,Date startTime,Date endTime);
	public Pagination statistics(List<String> storeList,String type,Date starttime,Date endtime,int pageNo,int pageSize);
	public Pagination accessory(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize);
	List<AccessoryOrder> findEditble(Date date,String time);
}
