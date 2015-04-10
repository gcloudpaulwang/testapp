package com.aok.base.mng.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.aok.base.dao.FactoryDao;
import com.aok.base.mng.FactoryMng;
import com.aok.entity.Factory;
import com.sp.common.hibernate3.BaseManagerImpl;

@Transactional
@Service
public class FactoryMngImpl extends BaseManagerImpl<Factory> implements FactoryMng{
	@Autowired
	public void setDao(FactoryDao dao) {
		super.setDao(dao);
	}

	public FactoryDao getDao() {
		return (FactoryDao) super.getDao();
	}
}
