package com.aok.order.dao;

import java.util.Date;
import java.util.List;

import com.aok.entity.CakeOrder;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.model.ShipmentSummary;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface CakeOrderDao extends BaseDao<CakeOrder>{
	boolean isIdExist(String id);
	int getMaxSeq();
	Pagination listShipmentSummary(Date takeDate,int pageNo,int pageSize);
	Pagination listShipmentSummary(String fid,Date takeDate, int pageNo,int pageSize);
	public List<CakeStatistics> statistics(List<String> storeList,Date starttime,Date endtime);
	public List<CakeStatistics> finance(List<String> storeList, String zone,Date startTime,Date endTime);
	public Pagination statistics(List<String> storeList,Date starttime,Date endtime,int pageNo,int pageSize);
	public Pagination finance(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize);
	List<CakeOrder> findByIds(List<String> ids);
	List<CakeOrder> findEditble(Date date,String time);
}
