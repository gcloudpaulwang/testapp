package com.aok.order.mng.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.entity.AccessoryChangeItem;
import com.aok.order.dao.AccessoryChangeItemDao;
import com.aok.order.mng.AccessoryChangeItemMng;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.page.Pagination;
@Service
@Transactional
public class AccessoryChangeItemMngImpl extends BaseManagerImpl<AccessoryChangeItem> implements AccessoryChangeItemMng{
	public AccessoryChangeItemDao getDao(){
		return (AccessoryChangeItemDao)super.getDao();
	}
	@Autowired
	public void setDao(AccessoryChangeItemDao dao){
		super.setDao(dao);
	}
	@Override
	public Pagination findByChangeId(String changeId, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return getDao().findByChangeId(changeId, pageNo, pageSize);
	}
}
