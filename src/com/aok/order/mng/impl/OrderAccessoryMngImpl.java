package com.aok.order.mng.impl;

import java.io.Serializable;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.common.AokProperties;
import com.aok.entity.AccessoryChange;
import com.aok.entity.AccessoryChangeItem;
import com.aok.entity.AccessoryOrder;
import com.aok.entity.AccessoryShipment;
import com.aok.entity.OrderAccessory;
import com.aok.entity.Product;
import com.aok.order.dao.OrderAccessoryDao;
import com.aok.order.mng.AccessoryChangeMng;
import com.aok.order.mng.AccessoryOrderMng;
import com.aok.order.mng.OrderAccessoryMng;
import com.aok.order.model.AccessoryBatchPost;
import com.aok.order.model.AccessoryPostItem;
import com.aok.shipment.mng.AccessoryShipmentMng;
import com.sp.common.crypto.Crypto;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.page.Pagination;
import com.sp.common.util.SPException;
import com.sp.common.util.StringUtils;
@Transactional
@Service
public class OrderAccessoryMngImpl extends BaseManagerImpl<OrderAccessory> implements OrderAccessoryMng{
	private AokProperties aokProperties;
	public AokProperties getAokProperties() {
		return aokProperties;
	}
	@Autowired
	public void setAokProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	@Autowired
	private AccessoryShipmentMng accessoryShipmentMng;
	@Autowired
	private AccessoryOrderMng orderMng;
	@Autowired
	private AccessoryChangeMng accessoryChangeMng;
	@Override
	public Pagination findByOid(String oid, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return getDao().findByOid(oid, pageNo, pageSize);
	}
	@Override
	public boolean isExist(String oid, String pid) {
		// TODO Auto-generated method stub
		return getDao().isExist(oid, pid);
	}
	@Override
	public OrderAccessory findByOidPid(String oid, String pid) {
		// TODO Auto-generated method stub
		return getDao().findByOidPid(oid, pid);
	}
	@Transactional(rollbackFor=Exception.class)
	public OrderAccessory save(OrderAccessory entity,String oid) {
		// TODO Auto-generated method stub
		AccessoryOrder order=orderMng.findById(oid);
		AccessoryShipment shipment= accessoryShipmentMng.find(order.getTakeDate(),order.getTakeStore().getId(), entity.getProduct().getId());
		if(shipment==null){
			shipment=new AccessoryShipment(order.getTakeDate(),order.getTakeStore(),entity.getProduct());
			if(order.getTakeTime().equals(aokProperties.getFirst())){
				shipment.addFirst(entity.getQty());
			}else if(order.getTakeTime().equals(aokProperties.getSecond())){
				shipment.addSecond(entity.getQty());
			}
			accessoryShipmentMng.save(shipment);
		}else{
			if(order.getTakeTime().equals(aokProperties.getFirst())){
				shipment.addFirst(entity.getQty());
			}else if(order.getTakeTime().equals(aokProperties.getSecond())){
				shipment.addSecond(entity.getQty());
			}
			accessoryShipmentMng.update(shipment);
		}
		return super.save(entity);
	}
	@Transactional(rollbackFor=Exception.class)
	public OrderAccessory update(OrderAccessory entity,String oid,Double orglQty){
		AccessoryOrder order=orderMng.findById(oid);
		AccessoryShipment shipment= accessoryShipmentMng.find(order.getTakeDate(),order.getTakeStore().getId(), entity.getProduct().getId());
		if(shipment==null){
			shipment=new AccessoryShipment(order.getTakeDate(),order.getTakeStore(),entity.getProduct());
			if(order.getTakeTime().equals(aokProperties.getFirst())){
				shipment.addFirst(entity.getQty());
			}else if(order.getTakeTime().equals(aokProperties.getSecond())){
				shipment.addSecond(entity.getQty());
			}
			accessoryShipmentMng.save(shipment);
		}else{
			if(order.getTakeTime().equals(aokProperties.getFirst())){
				shipment.addFirst(entity.getQty()-orglQty);
			}else if(order.getTakeTime().equals(aokProperties.getSecond())){
				shipment.addSecond(entity.getQty()-orglQty);
			}
			accessoryShipmentMng.update(shipment);
		}
		return super.merge(entity);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public OrderAccessory deleteById(Serializable id) {
		// TODO Auto-generated method stub
		OrderAccessory accessory= this.findById(id);
		AccessoryOrder order=orderMng.findById(accessory.getOid());
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
		super.delete(accessory);
		return accessory;
	}
	@Transactional(rollbackFor=Exception.class)
	public void batchSave(AccessoryBatchPost batch)throws SPException{
		AccessoryChange change=new AccessoryChange();
		Long count=this.countByOid(batch.getOid());
		boolean isChange=false;
		for(AccessoryPostItem item:batch.getItems()){
			if(item==null) continue;
			if(StringUtils.isBlank(item.getPid()))
				continue;
			if(item.getAction().equals("modify")){
				if(item.getModifyQty()!=null&&item.getModifyQty()!=0D){
					OrderAccessory orgl=this.findByOidPid(batch.getOid(), item.getPid());
					if(orgl==null) continue;
					Double newQty=orgl.getQty()+item.getModifyQty();
					if(newQty<0){
						//throw new SPException(String.format("", ));
					}
					AccessoryChangeItem changeItem=new AccessoryChangeItem(orgl.getQty(),newQty);
					changeItem.setProduct(orgl.getProduct());
					changeItem.setChange(change);
					change.getItems().add(changeItem);
					isChange=true;
					if(newQty==0D)
						this.deleteById(orgl.getId());
					else{
						Double orglQty=orgl.getQty();
						orgl.setQty(newQty);
						this.update(orgl,orgl.getOid(),orglQty);
					}
				}
			}else if(item.getAction().equals("new")){
				if(item==null||item.getNewQty()==null||item.getNewQty()==0D) continue;
				AccessoryChangeItem changeItem=new AccessoryChangeItem("新增",0D,item.getNewQty());
				changeItem.setChange(change);
				changeItem.setProduct(new Product(item.getPid()));
				change.getItems().add(changeItem);
				isChange=true;
				OrderAccessory oa=new OrderAccessory(new AccessoryOrder(batch.getOid()),new Product(item.getPid()),item.getNewQty());
				this.save(oa, batch.getOid());
				isChange=true;
			}
		}
		if(isChange&&count>0){
			change.setId(Crypto.generateResourceId("CH"));
			change.setChangeDate(new Date());
			change.setOid(batch.getOid());
			change.setOperator(batch.getOperator());
			accessoryChangeMng.saveOrUpdate(change);
			AccessoryOrder order= orderMng.findById(batch.getOid());
			if(order!=null){
				Integer changeTime=order.getChangeTime()==null?0:order.getChangeTime();
				order.setChangeTime(++changeTime);
				orderMng.update(order);
			}	
		}
	}
	
	public Long countByOid(String oid){
		return getDao().countByOid(oid);
	}
	
	public OrderAccessoryDao getDao(){
		return (OrderAccessoryDao)super.getDao();
	}
	@Autowired
	public void setDao(OrderAccessoryDao dao){
		super.setDao(dao);
	}
}
