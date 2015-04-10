package com.aok.shipment.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.aok.entity.AccessoryShipment;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.dao.AccessoryShipmentDao;
import com.aok.shipment.model.ExportAShipment;
import com.aok.shipment.model.ExportShipment;

import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
@Repository
public class AccessoryShipmentDaoImpl extends BaseDaoImpl<AccessoryShipment> implements AccessoryShipmentDao{
	public AccessoryShipment find(Date date,String storeId,String pid){
		String hql="from AccessoryShipment where sendDate=? and store.id=? and product.id=?";
		return findUnique(hql,date,storeId,pid);
	}
	public List<AccessoryShipment> find(Date date,String storeId){
		String hql="from AccessoryShipment where sendDate=? and store.id=?";
		return find(hql, date,storeId);
	}
	public Pagination listStoreShipment(Date date,int pageNo,int pageSize){
		String hql="select new com.aok.entity.AccessoryShipment(a.sendDate,a.store,sum(a.first)+sum(a.second),sum(a.firstSend)+sum(a.secondSend)) from AccessoryShipment a where a.sendDate=:sendDate group by a.sendDate,a.store.id";
		String countSql="select count(*) from (select store_id from `aok_accessory_shipment` where send_date='%s' group by send_date,store_id) as t";
		Query query = getSession().createSQLQuery(String.format(countSql,StringUtils.formatDate(date)));
		List l= query.list();
		int count=0;
		if(l.size()!=0){
			BigInteger bitInt=(BigInteger)l.get(0);
			count= bitInt.intValue();
		}
		Pagination p = new Pagination(pageNo, pageSize, count);
		if (count < 1) {
			p.setList(new ArrayList());
			return p;
		}
		Query q = getSession().createQuery(hql);
		q.setParameter("sendDate", date);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}
	public Pagination listStoreShipment(String fid,Date date,int pageNo,int pageSize){
		String hql="select new com.aok.entity.AccessoryShipment(a.sendDate,a.store,sum(a.first)+sum(a.second),sum(a.firstSend)+sum(a.secondSend)) from AccessoryShipment a where a.sendDate=:sendDate and a.store.factory.id=:fid group by a.sendDate,a.store.id";
		String countSql="select count(*) from (select store_id from `aok_accessory_shipment` where send_date='%s' and store_id in(select s.id from aok_store as s where s.factory_id='%s')  group by send_date,store_id) as t";
		Query query = getSession().createSQLQuery(String.format(countSql,StringUtils.formatDate(date),fid));
		List l= query.list();
		int count=0;
		if(l.size()!=0){
			BigInteger bitInt=(BigInteger)l.get(0);
			count= bitInt.intValue();
		}
		Pagination p = new Pagination(pageNo, pageSize, count);
		if (count < 1) {
			p.setList(new ArrayList());
			return p;
		}
		Query q = getSession().createQuery(hql);
		q.setParameter("sendDate", date);
		q.setParameter("fid", fid);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}
	
	@Override
	public List<ExportShipment> export(String storeId,String time,Date takeDate)
	{        
		String hql="select new com.aok.shipment.model.ExportShipment(co.orglNo,co.cake.name,co.cakeSize,co.bfCode,co.greeting,co.takeStoreName,co.placeStoreName,count(co.id)) from CakeOrder co ";
		hql += " where co.takeStore.id  ='" + storeId  + "' ";
		if(time.equals("12:00"))
		{
			hql += " and co.takeTime = '12:00' ";
		}
		else if(time.equals("18:00"))
		{
			hql += " and (co.takeTime = '12:00' or co.takeTime = '18:00') ";
		}
		String now = StringUtils.formatDate(takeDate);
		hql += "and co.takeDate = '" +now+" 00:00:00'";
		hql += "and co.nhasSend = 0 ";
		hql += " group by co.orglNo,co.cake.name,co.cakeSize,co.bfCode,co.greeting,co.takeStoreName,co.placeStoreName order by co.cake.name";
		List<ExportShipment> result = find(hql);
		return result;
	}
	
	@Override
	public List<ExportAShipment> exportAccessory(String storeId,Date takeDate)
	{        
		String hql="select new com.aok.shipment.model.ExportAShipment(co.product.id,co.product.name,co.product.unit,co.first,co.second,co.firstSend,co.remark,co.product.type) from AccessoryShipment co ";
		hql += " where co.store.id  ='" + storeId  + "' ";
//		if(time.equals("12:00"))
//		{
//			hql += " and co.takeTime = '12:00' ";
//		}
//		else if(time.equals("18:00"))
//		{
//			hql += " and (co.takeTime = '12:00' or co.takeTime = '18:00') ";
//		}
		String now = StringUtils.formatDate(takeDate);
		hql += "and co.sendDate = '" +now+"' ";
//		hql += " group by co.id,co.cake.name,co.cakeSize,co.bfCode,co.greeting,co.takeStoreName,co.placeStoreName order by co.cake.name";
		List<ExportAShipment> result = find(hql);
		return result;
	}
}
