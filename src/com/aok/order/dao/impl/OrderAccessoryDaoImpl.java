package com.aok.order.dao.impl;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.aok.entity.OrderAccessory;
import com.aok.order.dao.OrderAccessoryDao;
import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.hibernate3.Finder;
import com.sp.common.page.Pagination;
@Repository
public class OrderAccessoryDaoImpl extends BaseDaoImpl<OrderAccessory> implements OrderAccessoryDao{
	public Pagination findByOid(String oid,int pageNo,int pageSize){
		String hql="from OrderAccessory oa where oa.od.id='%s' order by oa.product.type";
		Finder f=new Finder(String.format(hql, oid));
		return find(f, pageNo, pageSize);
	}
	public boolean isExist(String oid,String pid){
		String hql="select count(*) from OrderAccessory oa where oa.od.id=:oid and oa.product.id=:pid";
		Finder f=new Finder(hql);
		f.setParam("oid", oid);
		f.setParam("pid", pid);
		return countQueryResult(f)>0?true:false;
	}
	@Override
	public OrderAccessory findByOidPid(String oid, String pid) {
		String hql="from OrderAccessory oa where oa.od.id=? and oa.product.id=?";
		return findUnique(hql, oid,pid);
	}
	
	public Long countByOid(String oid){
		String hql="select count(oa.id) from OrderAccessory oa where oa.od.id=:oid";
		Query query = getSession().createQuery(hql);
		query.setParameter("oid", oid);
		return (Long) query.uniqueResult();
	}
}
