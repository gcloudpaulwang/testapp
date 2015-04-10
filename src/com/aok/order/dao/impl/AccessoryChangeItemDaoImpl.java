package com.aok.order.dao.impl;

import org.springframework.stereotype.Repository;
import com.aok.entity.AccessoryChangeItem;
import com.aok.order.dao.AccessoryChangeItemDao;
import com.sp.common.hibernate3.BaseDaoImpl;
import com.sp.common.hibernate3.Finder;
import com.sp.common.page.Pagination;
@Repository
public class AccessoryChangeItemDaoImpl extends BaseDaoImpl<AccessoryChangeItem> implements AccessoryChangeItemDao{
	public Pagination findByChangeId(String changeId,int pageNo,int pageSize){
		String hql="from AccessoryChangeItem where change.id=:cid";
		Finder finder=new Finder(hql);
		finder.setParam("cid", changeId);
		return find(finder, pageNo, pageSize);
	}
}
