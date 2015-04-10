package com.aok.order.dao.impl;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.aok.order.dao.CakeOrderDao;
import com.aok.production.model.CakeStatistics;
import com.aok.shipment.model.ShipmentSummary;
import com.aok.entity.CakeOrder;
import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.hibernate3.Finder;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
@Repository
public class CakeOrderDaoImpl extends BaseDaoImpl<CakeOrder> implements CakeOrderDao{
	public boolean isIdExist(String id){
		String sql="select count(id) from aok_cake_order where id='%s'";
		Query q=getSession().createSQLQuery(String.format(sql, id));
		List l= q.list();
		BigInteger bitInt=(BigInteger)l.get(0);
		return bitInt.intValue()>0?true:false;
	}

	@Override
	public int getMaxSeq() {
		// TODO Auto-generated method stub
		String sql="select max(seq) from aok_cake_order";
		Query q=getSession().createSQLQuery(sql);
		List l= q.list();
		if(l.get(0)==null)
			return 0;
		return (Integer)l.get(0);
	}
	
	
	public Pagination listShipmentSummary(Date takeDate, int pageNo,int pageSize){
		String hql="select new com.aok.shipment.model.ShipmentSummary(co.takeDate,co.takeStore.id,co.takeStoreName,co.zone,count(*),sum(co.nhasSend)) from CakeOrder co where co.takeDate=:takeDate group by co.takeStore.id order by co.takeStore.id";
		String countSql="select count(t.take_store_id) from (SELECT take_store_id FROM `aok_cake_order` where take_date='%s' group by take_store_id) as t;";
		Query query = getSession().createSQLQuery(String.format(countSql, StringUtils.formatDate(takeDate)));
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
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		q.setParameter("takeDate",StringUtils.str2Date(StringUtils.formatDate(takeDate),"yyyy-MM-dd"));
		List list = q.list();
		p.setList(list);
		return p;
	}
	public Pagination listShipmentSummary(String fid,Date takeDate, int pageNo,int pageSize){
		String hql="select new com.aok.shipment.model.ShipmentSummary(co.takeDate,co.takeStore.id,co.takeStoreName,co.zone,count(*),sum(co.nhasSend)) from CakeOrder co where co.takeDate=:takeDate and co.takeStore.factory.id=:fid group by co.takeStore.id order by co.takeStore.id";
		String countSql="select count(t.take_store_id) from (SELECT take_store_id FROM `aok_cake_order` where take_date='%s' and take_store_id in(select s.id from aok_store as s where s.factory_id='%s') group by take_store_id) as t;";
		Query query = getSession().createSQLQuery(String.format(countSql, StringUtils.formatDate(takeDate),fid));
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
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		q.setParameter("takeDate",StringUtils.str2Date(StringUtils.formatDate(takeDate),"yyyy-MM-dd"));
		q.setParameter("fid", fid);
		List list = q.list();
		p.setList(list);
		return p;
	}
	
	@Override
	public List<CakeStatistics> statistics(List<String> storeList,Date starttime,Date endtime)
	{
		String ids = "";
        for(String id:storeList)
        {
            ids += "'"+ id + "',";
        }        
		String hql="select new com.aok.production.model.CakeStatistics(co.cake.name,count(co.id),co.bfCode,co.cakeSize,co.cake.unit) from CakeOrder co ";
		hql += " where co.takeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		if(starttime!=null)
		{
//			String t = StringUtils.formatDate(time);	
//			hql += " and co.placeDate LIKE '"+t+"%' ";
			hql += "and (co.takeDate>= '" +StringUtils.formatDate(starttime)+"') ";
		}
		if(endtime!=null)
		{
//			String t = StringUtils.formatDate(time);	
//			hql += " and co.placeDate LIKE '"+t+"%' ";
			hql += "and (co.takeDate<= '" +StringUtils.formatDate(endtime)+"') ";
		}
		hql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		List<CakeStatistics> result = find(hql);

		return result;
	}
	public List<CakeOrder> findByIds(List<String> ids){
		 return this.createCriteria(Restrictions.in("id", ids)).list();
	}
	
	@Override
	public Pagination statistics(List<String> storeList,Date starttime,Date endtime,int pageNo,int pageSize)
	{
		String ids = "";
        for(String id:storeList)
        {
            ids +="'"+ id + "',";
        }        
		String hql="select new com.aok.production.model.CakeStatistics(co.cake.name,count(co.id),co.bfCode,co.cakeSize,co.cake.unit) from CakeOrder co ";
		hql += " where co.takeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		if(starttime!=null)
		{
			hql += "and (co.takeDate>= '" +StringUtils.formatDate(starttime)+"') ";
		}
		if(endtime!=null)
		{
			hql += "and (co.takeDate<= '" +StringUtils.formatDate(endtime)+"') ";
		}
		hql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		
		String counthql = "select count(co.id) from CakeOrder co ";
		counthql += " where co.takeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		if(starttime!=null)
		{
			counthql += "and (co.takeDate>= '" +StringUtils.formatDate(starttime)+"') ";
		}
		if(endtime!=null)
		{
			counthql += "and (co.takeDate<= '" +StringUtils.formatDate(endtime)+"') ";
		}
		counthql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		List cou = find(counthql);
		Long bitInt;
		if(cou!=null&&cou.size()>0)
		{
			bitInt=Long.valueOf(cou.size());
		}
		else
		{
			bitInt=0L;
		}

		int count= bitInt.intValue();
		Pagination p = new Pagination(pageNo, pageSize, count);
		if (count < 1) {
			p.setList(new ArrayList());
			return p;
		}
		Query q = getSession().createQuery(hql);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}
	
	@Override
	public List<CakeStatistics> finance(List<String> storeList , String zone,Date startTime,Date endTime)
	{
		SimpleDateFormat sformat = new SimpleDateFormat("yyyy-MM-dd");
		String ids = "";
		if(storeList!=null)
		{			
	        for(String id:storeList)
	        {
	            ids += "'"+ id + "',";
	        } 
		}		 
//		String hql="select new com.aok.production.model.CakeStatistics(co.cake.name,count(co.id),co.bfCode,co.cakeSize,co.cake.unit) from CakeOrder co where 1=1 ";
		String hql="select new com.aok.production.model.CakeStatistics(co.cake.id,co.cake.name,co.cake.unit,(select count(a.id) from CakeOrder a where a.cake.id=co.cake.id and a.nhasSend=1)) from CakeOrder co where 1=1 and co.nhasSend=1 ";
		if(!StringUtils.isBlank(ids))
		{
			hql += " and co.ownerStore.id is not null and co.ownerStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		}		
		if(!StringUtils.isBlank(zone))
		{
			hql += " and co.zone = '"+zone+"' ";
		}
		if(startTime!=null)
		{
			hql += " and co.takeDate >= '"+sformat.format(startTime)+"' ";
		}
		if(endTime!=null)
		{
			hql += " and co.takeDate <= '"+sformat.format(endTime)+"' ";
		}
//		hql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		hql += " group by co.cake.id order by co.cake.id";
		List<CakeStatistics> result = find(hql);

		return result;
	}
	
	@Override
	public Pagination finance(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize)
	{
		SimpleDateFormat sformat = new SimpleDateFormat("yyyy-MM-dd");
		String ids = "";
		if(storeList!=null)
		{			
	        for(String id:storeList)
	        {
	            ids += "'"+ id + "',";
	        } 
		}		       
		String hql="select new com.aok.production.model.CakeStatistics(co.cake.name,count(co.id),co.bfCode,co.cakeSize,co.cake.unit) from CakeOrder co where 1=1 and co.nhasSend=1 ";
		String counthql="select count(co.id) from CakeOrder co where 1=1 and co.nhasSend=1 ";
		if(!StringUtils.isBlank(ids))
		{
			hql += " and co.ownerStore.id is not null and co.ownerStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
			counthql += " and co.ownerStore.id is not null and co.ownerStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		}		
		if(!StringUtils.isBlank(zone))
		{
			hql += " and co.zone = '"+zone+"' ";
			counthql += " and co.zone = '"+zone+"' ";
		}
		if(startTime!=null)
		{
			hql += " and co.takeDate >= '"+sformat.format(startTime)+"' ";
			counthql += " and co.takeDate >= '"+sformat.format(startTime)+"' ";
		}
		if(endTime!=null)
		{
			hql += " and co.takeDate <= '"+sformat.format(endTime)+"' ";
			counthql += " and co.takeDate <= '"+sformat.format(endTime)+"' ";
		}
		hql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		counthql += " group by co.cake.name,co.bfCode,co.cakeSize order by co.cake.name";
		
		List cou = find(counthql);
		Long bitInt;
		if(cou!=null&&cou.size()>0)
		{
			bitInt=Long.valueOf(cou.size());
		}
		else
		{
			bitInt=0L;
		}

		int count= bitInt.intValue();
		Pagination p = new Pagination(pageNo, pageSize, count);
		if (count < 1) {
			p.setList(new ArrayList());
			return p;
		}
		Query q = getSession().createQuery(hql);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}
	
	public List<CakeOrder> findEditble(Date date,String time){
		String hql=null;
		if(time==null){
			hql="from CakeOrder where (takeDate <? or takeDate=?) and (editable=null or editable=true)";
			return find(hql,date,date);
		}
		else{
			hql="from CakeOrder where (takeDate <? or (takeDate=? and takeTime=?)) and (editable=null or editable=true)";
			return find(hql,date,date,time);
		}
	}
}
