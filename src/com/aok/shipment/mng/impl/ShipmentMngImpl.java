package com.aok.shipment.mng.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aok.base.mng.StoreMng;
import com.aok.entity.Store;
import com.aok.order.mng.AccessoryOrderMng;
import com.aok.order.mng.CakeOrderMng;
import com.aok.shipment.mng.ShipmentMng;
import com.sp.common.util.StringUtils;
@Service
public class ShipmentMngImpl implements ShipmentMng{
	@Autowired
	private StoreMng storeMng;
	@Autowired
	private CakeOrderMng cakeOrderMng;
	@Autowired
	private AccessoryOrderMng accessoryOrderMng;
	
	public void listCakeShipmentDetail(String factoryId,Date date){
		List<Store> stores;
		if(!StringUtils.isBlank(factoryId)){
			stores =storeMng.findByProperty("factory.id", factoryId);
		}
		
	}
	public void listAccessoryShipmentDetail(){
		
	}
}
