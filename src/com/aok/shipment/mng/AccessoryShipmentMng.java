package com.aok.shipment.mng;

import java.util.Date;
import java.util.List;

import com.aok.entity.AccessoryShipment;
import com.aok.shipment.model.AccessoryShipmentSummary;
import com.aok.shipment.model.ExportAShipment;
import com.aok.shipment.model.ExportShipment;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.page.Pagination;
import com.sp.user.entity.User;

public interface AccessoryShipmentMng extends BaseManager<AccessoryShipment>{
	AccessoryShipment find(Date date,String storeId,String pid);
	List<AccessoryShipment> find(Date date,String storeId);
	Pagination listStoreShipment(User u,Date date,int pageNo,int pageSize);
	List<AccessoryShipmentSummary> listShipSummary(Date date,String storeId);
	public List<ExportShipment> export(String storeId,String time,Date takeDate);
	void send(List<AccessoryShipment> shipments,String firstMan,String secondMan,Date firstDate,Date secondDate);
	public List<ExportAShipment> exportAccessory(String storeId ,Date takeDate);
}
