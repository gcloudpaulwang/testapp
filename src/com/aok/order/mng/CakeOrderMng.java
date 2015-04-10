package com.aok.order.mng;

import java.util.Date;
import java.util.List;

import com.aok.entity.CakeOrder;
import com.aok.order.model.OrderQueryParam;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.model.ShipmentSummary;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;
import com.sp.user.entity.User;

public interface CakeOrderMng extends BaseManager<CakeOrder>{
	int getMaxSeq();
	Pagination query(OrderQueryParam qaram,int pageNo,int pageSize,OrderBy... orders);
	Pagination listShipmentSummary(User u,Date takeDate,int pageNo,int pageSize);
	public List<CakeStatistics> statistics(List<String> storeList,Date starttime,Date endtime);
	List<CakeOrder> findByIds(List<String> ids);
	public List<CakeStatistics> finance(List<String> storeList , String zone,Date startTime,Date endTime);
	public Pagination statistics(List<String> storeList,Date starttime,Date endtime,int pageNo,int pageSize);
	public Pagination finance(List<String> storeList , String zone,Date startTime,Date endTime,int pageNo,int pageSize);
	List<CakeOrder> findEditble(String time);
	int countOrglNo(String orglNo);
	void print(List<CakeOrder> orders);
}
