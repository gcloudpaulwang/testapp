package com.aok.order.dao.impl;

import org.springframework.stereotype.Repository;

import com.aok.entity.AccessoryChange;
import com.aok.order.dao.AccessoryChangeDao;
import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.hibernate3.Finder;
import com.sp.common.page.Pagination;
@Repository
public class AccessoryChangeDaoImpl extends BaseDaoImpl<AccessoryChange> implements AccessoryChangeDao{
	public Pagination findByOid(String oid,int pageNo,int pageSize){
		String hql="from AccessoryChange where oid=:oid order by changeDate desc";
		Finder finder=new Finder(hql);
		finder.setParam("oid", oid);
		return find(finder, pageNo, pageSize);
	}
}
