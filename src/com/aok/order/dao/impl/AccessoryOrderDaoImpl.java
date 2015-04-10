package com.aok.order.dao.impl;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.aok.entity.AccessoryOrder;
import com.aok.entity.CakeOrder;
import com.aok.order.dao.AccessoryOrderDao;
import com.aok.production.model.AccessoryStatistics;
import com.aok.production.model.CakeStatistics;
import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
@Repository
public class AccessoryOrderDaoImpl extends BaseDaoImpl<AccessoryOrder> implements AccessoryOrderDao{
	@Override
	public int getMaxSeq() {
		// TODO Auto-generated method stub
		String sql="select max(seq) from aok_accessory_order";
		Query q=getSession().createSQLQuery(sql);
		List l= q.list();
		if(l.get(0)==null)
			return 0;
		return (Integer)l.get(0);
	}
	
	public void dd(){
		String hql="";
	}
	
	@Override
	public List<AccessoryStatistics> statistics(List<String> storeList,String type, Date starttime,Date endtime)
	{
		String ids = "";
        for(String id:storeList)
        {
            ids += "'"+id + "',";
        }        
		String hql="select co.id from AccessoryOrder co ";
		hql += " where co.placeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		if(starttime!=null)
		{
			hql += "and (co.takeDate>= '" +StringUtils.formatDate(starttime)+"') ";
		}
		if(endtime!=null)
		{
			hql += "and (co.takeDate<= '" +StringUtils.formatDate(endtime)+"') ";
		}
		String hql2="select new com.aok.production.model.AccessoryStatistics(co.product.name,co.product.type,sum(co.qty),co.product.unit) from OrderAccessory co ";
		hql2 += " where co.od.id  in(" + hql  + ") ";
		if(!StringUtils.isBlank(type))
		{
			hql2 += " and co.product.type = '"+type+"' ";
		}
		hql2 += " group by co.product.name order by co.product.name";
		
		return find(hql2);
	}
	
	@Override
	public List<AccessoryStatistics> accessory(List<String> storeList, String zone,Date startTime,Date endTime)
	{
		
		SimpleDateFormat sformat = new SimpleDateFormat("yyyy-MM-dd");
		String ids = "";
        for(String id:storeList)
        {
            ids += "'"+id + "',";
        }        
//        String hql2="select new com.aok.production.model.AccessoryStatistics(co.product.name,co.product.type,sum(co.first),sum(co.second),sum(co.firstSend),sum(co.secondSend),co.product.unit) from AccessoryShipment co where 1=1 ";
        String hql2="select new com.aok.production.model.AccessoryStatistics(co.product.id,co.product.name,co.product.unit,sum(co.firstSend),sum(co.secondSend)) from AccessoryShipment co where 1=1 ";
		if(!StringUtils.isBlank(ids))
		{
			hql2 += " and co.store.id  in(" + ids.substring(0, ids.length()-1)  + ") ";			
		}			
		
		if(startTime!=null)
		{
			hql2 += " and co.sendDate >= '"+StringUtils.formatDate(startTime)+"' ";
		}
		if(endTime!=null)
		{
			hql2 += " and co.sendDate <= '"+StringUtils.formatDate(endTime)+"' ";
		}				
		hql2 += " group by co.product.id order by co.product.id";
		
		List<AccessoryStatistics> result = find(hql2);
		return result;
	}
	
	@Override
	public Pagination statistics(List<String> storeList,String type, Date starttime,Date endtime,int pageNo,int pageSize)
	{
		String ids = "";
        for(String id:storeList)
        {
            ids += "'"+id + "',";
        }        
		String hql="select co.id from AccessoryOrder co ";
		hql += " where co.placeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";
		if(starttime!=null)
		{
			hql += "and (co.takeDate>= '" +StringUtils.formatDate(starttime)+"') ";
		}
		if(endtime!=null)
		{
			hql += "and (co.takeDate<= '" +StringUtils.formatDate(endtime)+"') ";
		}

		String hql2="select new com.aok.production.model.AccessoryStatistics(co.product.name,co.product.type,sum(co.qty),co.product.unit) from OrderAccessory co ";
		hql2 += " where co.od.id  in(" + hql  + ") ";
		String counthql="select count(co.id) from OrderAccessory co ";
		counthql += " where co.od.id  in(" + hql  + ") ";
		if(!StringUtils.isBlank(type))
		{
			hql2 += " and co.product.type = '"+type+"' ";
			counthql += " and co.product.type = '"+type+"' ";
		}
		hql2 += " group by co.product.name order by co.product.name";
				
		counthql += " group by co.product.name order by co.product.name";
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
		Query q = getSession().createQuery(hql2);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}
	
	@Override
	public Pagination accessory(List<String> storeList, String zone,Date startTime,Date endTime,int pageNo,int pageSize)
	{
		String ids = "";
        for(String id:storeList)
        {
            ids += "'"+id + "',";
        }        
//		String hql="select co.id from AccessoryOrder co where 1=1 ";
//		if(!StringUtils.isBlank(ids))
//		{
//			hql += " and co.placeStore.id  in(" + ids.substring(0, ids.length()-1)  + ") ";		
//		}
//		if(!StringUtils.isBlank(zone))
//		{
//			hql += " and co.zone = '"+zone+"' ";
//		}
//		if(startTime!=null)
//		{
//			hql += " and co.takeDate >= '"+sformat.format(startTime)+"' ";
//		}
//		if(endTime!=null)
//		{
//			hql += " and co.takeDate <= '"+sformat.format(endTime)+"' ";
//		}				
		
		String hql2="select new com.aok.production.model.AccessoryStatistics(co.product.name,co.product.type,sum(co.first),sum(co.second),sum(co.firstSend),sum(co.secondSend),co.product.unit) from AccessoryShipment co where 1=1 ";
		String counthql="select count(*) from AccessoryShipment co where 1=1 ";
		if(!StringUtils.isBlank(ids))
		{
			hql2 += " and co.store.id  in(" + ids.substring(0, ids.length()-1)  + ") ";		
			counthql += " and co.store.id  in(" + ids.substring(0, ids.length()-1)  + ") ";		
		}			
		
		if(startTime!=null)
		{
			hql2 += " and co.sendDate >= '"+StringUtils.formatDate(startTime)+"' ";
			counthql += " and co.sendDate >= '"+StringUtils.formatDate(startTime)+"' ";
		}
		if(endTime!=null)
		{
			hql2 += " and co.sendDate <= '"+StringUtils.formatDate(endTime)+"' ";
			counthql += " and co.sendDate <= '"+StringUtils.formatDate(endTime)+"' ";
		}				
		hql2 += " group by co.product.name order by co.product.name";
		counthql += " group by co.product.name";
		
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
		Query q = getSession().createQuery(hql2);
		q.setFirstResult(p.getFirstResult());
		q.setMaxResults(p.getPageSize());
		List list = q.list();
		p.setList(list);
		return p;
	}

	@Override
	public List<AccessoryOrder> findEditble(Date date,String time){
		String hql=null;
		if(time==null){
			hql="from AccessoryOrder where (takeDate <? or takeDate=?) and (editable=null or editable=true)";
			return find(hql,date,date);
		}
		else{
			hql="from AccessoryOrder where (takeDate <? or (takeDate=? and takeTime=?)) and (editable=null or editable=true)";
			return find(hql,date,date,time);
		}
	}
	
}
