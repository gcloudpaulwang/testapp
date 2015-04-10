package com.aok.base.mng.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.base.dao.StoreDao;
import com.aok.base.mng.StoreMng;
import com.aok.entity.Store;
import com.sp.common.hibernate3.BaseManagerImpl;

@Transactional
@Service
public class StoreMngImpl extends BaseManagerImpl<Store> implements StoreMng{
	@Autowired
	public void setDao(StoreDao dao) {
		super.setDao(dao);
	}

	public StoreDao getDao() {
		return (StoreDao) super.getDao();
	}

	@Override
	public List<String> listStoreIdByFactory(String fid) {
		// TODO Auto-generated method stub
		return getDao().listStoreIdByFactory(fid);
	}

	@Override
	public List<Store> listStoreByFid(String fid) {
		// TODO Auto-generated method stub
		return getDao().listStoreByFid(fid);
	}
}
