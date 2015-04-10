package com.aok.shipment.dao;

import java.util.Date;
import java.util.List;

import com.aok.entity.AccessoryShipment;
import com.aok.shipment.model.ExportAShipment;
import com.aok.shipment.model.ExportShipment;
import com.sp.common.hibernate3.BaseDao;
import com.sp.common.page.Pagination;

public interface AccessoryShipmentDao extends BaseDao<AccessoryShipment>{
	AccessoryShipment find(Date date,String storeId,String pid);
	List<AccessoryShipment> find(Date date,String storeId);
	Pagination listStoreShipment(String fid,Date date,int pageNo,int pageSize);
	Pagination listStoreShipment(Date date,int pageNo,int pageSize);
	public List<ExportShipment> export(String storeId,String time,Date takeDate);
	public List<ExportAShipment> exportAccessory(String storeId,Date takeDate);
}
