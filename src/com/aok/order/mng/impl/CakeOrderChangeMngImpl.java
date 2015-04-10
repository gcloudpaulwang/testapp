package com.aok.order.mng.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.entity.CakeOrderChange;
import com.aok.order.dao.CakeOrderChangeDao;
import com.aok.order.mng.CakeOrderChangeMng;
import com.sp.common.hibernate3.BaseManagerImpl;
@Transactional
@Service
public class CakeOrderChangeMngImpl extends BaseManagerImpl<CakeOrderChange> implements CakeOrderChangeMng{
	public CakeOrderChangeDao getDao(){
		return (CakeOrderChangeDao)super.getDao();
	}
	@Autowired
	public void setDao(CakeOrderChangeDao dao){
		super.setDao(dao);
	}
	@Override
	public List<CakeOrderChange> listByOid(String oid) {
		// TODO Auto-generated method stub
		return getDao().listByOid(oid);
	}
}
