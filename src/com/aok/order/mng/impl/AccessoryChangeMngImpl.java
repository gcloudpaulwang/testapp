package com.aok.order.mng.impl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.entity.AccessoryChange;
import com.aok.order.dao.AccessoryChangeDao;
import com.aok.order.mng.AccessoryChangeMng;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.page.Pagination;
@Service
@Transactional
public class AccessoryChangeMngImpl extends BaseManagerImpl<AccessoryChange> implements AccessoryChangeMng{
	public AccessoryChangeDao getDao(){
		return (AccessoryChangeDao)super.getDao();
	}
	@Autowired
	public void setDao(AccessoryChangeDao dao){
		super.setDao(dao);
	}
	@Override
	public Pagination findByOid(String oid, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return getDao().findByOid(oid, pageNo, pageSize);
	}
}
