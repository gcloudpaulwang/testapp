package com.aok.shipment.mng.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.common.AokProperties;
import com.aok.entity.AccessoryShipment;
import com.aok.shipment.dao.AccessoryShipmentDao;
import com.aok.shipment.mng.AccessoryShipmentMng;
import com.aok.shipment.model.AccessoryShipmentSummary;
import com.aok.shipment.model.ExportAShipment;
import com.aok.shipment.model.ExportShipment;
import com.aok.user.entity.ERole;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.page.Pagination;
import com.sp.user.entity.User;
@Service
@Transactional
public class AccessoryShipmentMngImpl extends BaseManagerImpl<AccessoryShipment> implements AccessoryShipmentMng{
	private AokProperties aokProperties;

	public AokProperties getAokProperties() {
		return aokProperties;
	}
	@Autowired
	public void setAokProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	public AccessoryShipmentDao getDao(){
		return (AccessoryShipmentDao)super.getDao();
	}
	@Autowired
	public void setDao(AccessoryShipmentDao dao){
		super.setDao(dao);
	}
	@Override
	public AccessoryShipment find(Date date,String storeId, String pid) {
		// TODO Auto-generated method stub
		return getDao().find(date, storeId, pid);
	}
	@Override
	public List<AccessoryShipment> find(Date date, String storeId) {
		// TODO Auto-generated method stub
		return getDao().find(date, storeId);
	}
	public List<AccessoryShipmentSummary> listShipSummary(Date date,String storeId){
		List<AccessoryShipment> shipments=find(date, storeId);
		Map<String,AccessoryShipmentSummary> map =new HashMap<String,AccessoryShipmentSummary>();
		for(AccessoryShipment shipment:shipments){
			AccessoryShipmentSummary tmp;
			String key=shipment.getStore().getId()+"_"+shipment.getProduct().getId();
			tmp=map.get(key);
			if(tmp==null){
				tmp=new AccessoryShipmentSummary(date,shipment.getStore().getId(),shipment.getStore().getName(),shipment.getProduct().getId(),shipment.getProduct().getName());
			}
			/*if(shipment.getSendTime().equals(aokProperties.getFirst())){
				tmp.addFirst(shipment.getQty());
				tmp.addFristSend(shipment.getSend());
			}else if(shipment.getSendTime().equals(aokProperties.getSecond())){
				tmp.setSecond(shipment.getQty());
				tmp.addSecondSend(shipment.getSend());
			}else{
				continue;
			}*/
			map.put(key, tmp);
		}
		List<AccessoryShipmentSummary> result=new ArrayList<AccessoryShipmentSummary>(map.values());
		return result;
	}
	@Override
	public Pagination listStoreShipment(User u, Date date, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		if(u.getERole()==ERole.admin)
			return getDao().listStoreShipment(date, pageNo, pageSize);
		else if(u.getERole()==ERole.factroy)
			return getDao().listStoreShipment(u.getAokUser().getFactory().getId(), date, pageNo, pageSize);
		return null;
	}
	
	@Override
	public List<ExportShipment> export(String storeId,String time,Date takeDate)
	{
		return getDao().export(storeId, time, takeDate);
	}
	@Transactional(rollbackFor=Exception.class)
	public void send(List<AccessoryShipment> shipments,String firstMan,String secondMan,Date firstDate,Date secondDate){
		for(AccessoryShipment item:shipments){
			AccessoryShipment shipment= find(item.getSendDate(), item.getStore().getId(),item.getProduct().getId());
			if(shipment==null)
				continue;
			shipment.setFirstSend(item.getFirstSend());
			shipment.setSecondSend(item.getSecondSend());
			shipment.setFirstMarkDate(firstDate);
			shipment.setSecondMarkDate(secondDate);
			shipment.setFirstOperator(firstMan);
			shipment.setSecondOperator(secondMan);
			shipment.setRemark(item.getRemark());
			update(shipment);
		}
	}
	
	@Override
	public List<ExportAShipment> exportAccessory(String storeId,Date takeDate)
	{
		return getDao().exportAccessory(storeId,takeDate);
	}
}
