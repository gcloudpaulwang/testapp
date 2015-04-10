package com.sp.common.mng.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sp.common.entity.Dict;
import com.sp.common.dao.DictDao;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.mng.DictMng;
@Transactional
@Service
public class DictMngImpl extends BaseManagerImpl<Dict> implements DictMng{
	@Autowired
	public void setDao(DictDao dao) {
		super.setDao(dao);
	}

	public DictDao getDao() {
		return (DictDao) super.getDao();
	}
}
