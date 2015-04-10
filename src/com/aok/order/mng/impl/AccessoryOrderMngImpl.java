package com.aok.order.mng.impl;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.base.mng.StoreMng;
import com.aok.common.AokProperties;
import com.aok.entity.AccessoryOrder;
import com.aok.entity.AccessoryShipment;
import com.aok.entity.CakeOrder;
import com.aok.entity.OrderAccessory;
import com.aok.order.dao.AccessoryOrderDao;
import com.aok.order.mng.AccessoryChangeMng;
import com.aok.order.mng.AccessoryOrderMng;
import com.aok.order.mng.OrderAccessoryMng;
import com.aok.order.model.OrderQueryParam;
import com.aok.production.model.AccessoryStatistics;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.mng.AccessoryShipmentMng;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
@Transactional
@Service("AccessoryOrder")
public class AccessoryOrderMngImpl extends BaseManagerImpl<AccessoryOrder> implements AccessoryOrderMng{
	private AokProperties aokProperties;
	public AokProperties getAokProperties() {
		return aokProperties;
	}
	@Autowired
	public void setAokProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	@Autowired
	private StoreMng storeMng;
	@Autowired
	private OrderAccessoryMng orderAccessoryMng;
	@Autowired
	private AccessoryShipmentMng accessoryShipmentMng;
	public AccessoryOrderDao getDao(){
		return (AccessoryOrderDao)super.getDao();
	}
	@Autowired
	public void setDao(AccessoryOrderDao dao){
		super.setDao(dao);
	}
	public int getMaxSeq(){
		return getDao().getMaxSeq();
	}
	@Override
	public Pagination query(OrderQueryParam qaram, int pageNo, int pageSize,
			OrderBy... orders) {
		// TODO Auto-generated method stub
		Criteria crit =getDao().createCriteria();
		switch (qaram.getUser().getERole()) {
			case factroy:
				String fId=qaram.getUser().getAokUser().getFactory().getId();
				List<String> sIds=storeMng.listStoreIdByFactory(fId);
				if(sIds.size()>0){
					Disjunction dj = Restrictions.disjunction();
					dj.add(Restrictions.in("placeStore.id",sIds));
					dj.add(Restrictions.in("takeStore.id",sIds));
					crit.add(dj);
				}
				break;
			case store:
				Disjunction dj = Restrictions.disjunction();
				dj.add(Restrictions.eq("placeStore.id",qaram.getUser().getAokUser().getStore().getId()));
				dj.add(Restrictions.eq("takeStore.id",qaram.getUser().getAokUser().getStore().getId()));
				crit.add(dj);
				break;
		}
		if(!StringUtils.isBlank(qaram.getPlaceStoreId())){
			crit.add(Restrictions.eq("placeStore.id", qaram.getPlaceStoreId()));
		}
		if(!StringUtils.isBlank(qaram.getTakeStoreId())){
			crit.add(Restrictions.eq("takeStore.id", qaram.getTakeStoreId()));
		}
		if(!StringUtils.isBlank(qaram.getZone())){
			crit.add(Restrictions.eq("zone", qaram.getZone()));
		}
		if(!StringUtils.isBlank(qaram.getTakeTime())){
			crit.add(Restrictions.eq("takeTime",qaram.getTakeTime()));
		}
		if(qaram.getTakeDate()!=null){
			crit.add(Restrictions.eq("takeDate",qaram.getTakeDate()));
		}
		if(qaram.getModified()){
			crit.add(Restrictions.gt("changeTime", 0));
		}
		Map<String,String> condition=new HashMap<String, String>();
		condition.put("id",qaram.getOid());
		return getDao().findByLike(crit, condition, true, pageNo, pageSize, orders);
	}
	@Transactional(rollbackFor=Exception.class)
	public void update(AccessoryOrder orgl,AccessoryOrder newO,String zone){
		if(!orgl.getTakeStore().getId().equals(newO.getTakeStore().getId())||
				!StringUtils.formatDate(orgl.getTakeDate()).equals(StringUtils.formatDate(newO.getTakeDate()))||
				!orgl.getTakeTime().equals(newO.getTakeTime())){
			for(OrderAccessory accessory: orgl.getAccessories()){
				//旧的shipment减
				AccessoryShipment shipment= accessoryShipmentMng.find(orgl.getTakeDate(),orgl.getTakeStore().getId(), accessory.getProduct().getId());
				if(shipment!=null){
					if(orgl.getTakeTime().equals(aokProperties.getFirst())){
						Double tmp= shipment.getFirst()-accessory.getQty();
						if(tmp>0){
							shipment.setFirst(tmp);
							accessoryShipmentMng.update(shipment);
						}else{
							accessoryShipmentMng.delete(shipment);
						}
					}else if(orgl.getTakeTime().equals(aokProperties.getSecond())){
						Double tmp= shipment.getSecond()-accessory.getQty();
						if(tmp>0){
							shipment.setFirst(tmp);
							accessoryShipmentMng.update(shipment);
						}else{
							accessoryShipmentMng.delete(shipment);
						}
					}
				}
				//更新新的shipment
				shipment= accessoryShipmentMng.find(newO.getTakeDate(),newO.getTakeStore().getId(), accessory.getProduct().getId());
				if(shipment==null){
					shipment=new AccessoryShipment(newO.getTakeDate(),newO.getTakeStore(),accessory.getProduct());
					if(newO.getTakeTime().equals(aokProperties.getFirst())){
						shipment.addFirst(accessory.getQty());
					}else if(newO.getTakeTime().equals(aokProperties.getSecond())){
						shipment.addSecond(accessory.getQty());
					}
					accessoryShipmentMng.save(shipment);
				}else{
					if(newO.getTakeTime().equals(aokProperties.getFirst())){
						shipment.addFirst(accessory.getQty());
					}else if(newO.getTakeTime().equals(aokProperties.getSecond())){
						shipment.addSecond(accessory.getQty());
					}
					accessoryShipmentMng.update(shipment);
				}
			}
		}
		orgl.setOperator(newO.getOperator());
		orgl.setPlaceDate(newO.getPlaceDate());
		orgl.setPlaceStore(newO.getPlaceStore());
		orgl.setPlaceStoreName(newO.getPlaceStoreName());
		orgl.setPlaceStoreTel(newO.getPlaceStoreTel());
		orgl.setTakeDate(newO.getTakeDate());
		orgl.setTakeStore(newO.getTakeStore());
		orgl.setTakeStoreName(newO.getTakeStoreName());
		orgl.setZone(zone);
		orgl.setTakeTime(newO.getTakeTime());
		this.update(orgl);
	}
	@Transactional(rollbackFor=Exception.class)
	@Override
	public AccessoryOrder deleteById(Serializable id) {
		AccessoryOrder order=this.findById(id);
		for(OrderAccessory accessory:order.getAccessories()){
			AccessoryShipment shipment= accessoryShipmentMng.find(order.getTakeDate(),order.getTakeStore().getId(), accessory.getProduct().getId());
			if(shipment!=null){
				if(order.getTakeTime().equals(aokProperties.getFirst())){
					Double tmp= shipment.getFirst()-accessory.getQty();
					if(tmp>0){
						shipment.setFirst(tmp);
						accessoryShipmentMng.update(shipment);
					}else{
						accessoryShipmentMng.delete(shipment);
					}
				}else if(order.getTakeTime().equals(aokProperties.getSecond())){
					Double tmp= shipment.getSecond()-accessory.getQty();
					if(tmp>0){
						shipment.setFirst(tmp);
						accessoryShipmentMng.update(shipment);
					}else{
						accessoryShipmentMng.delete(shipment);
					}
				}
			}
		}
		return super.deleteById(id);
	}
	
	@Override
	public List<AccessoryStatistics> statistics(List<String> storeList,String type, Date starttime,Date endtime)
	{
		return getDao().statistics(storeList,type,starttime,endtime);
	}
	
	@Override
	public List<AccessoryStatistics> accessory(List<String> storeList, String zone,Date startTime,Date endTime)
	{
		return getDao().accessory(storeList, zone, startTime, endTime);
	}
	
	@Override
	public Pagination statistics(List<String> storeList,String type,Date starttime,Date endtime,int pageNo,int pageSize)
	{
		return getDao().statistics(storeList, type,starttime,endtime,pageNo, pageSize);
	}
	
	@Override
	public Pagination accessory(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize)
	{
		return getDao().accessory(storeList, zone, startTime, endTime, pageNo, pageSize);
	}
	@Override
	public List<AccessoryOrder> findEditble(String flag) {
		// TODO Auto-generated method stub
		Date now =new Date();
		Date today=StringUtils.str2Date(StringUtils.formatDate(now),"yyyy-MM-dd");
		if(flag.equals("first")){
			return getDao().findEditble(today,null);
		}else if(flag.equals("deadline")){
			return getDao().findEditble(today,aokProperties.getFirst());
		}
		return null;
		
	}
}
