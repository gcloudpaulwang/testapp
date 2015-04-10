package com.aok.base.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.aok.base.dao.StoreDao;
import com.aok.entity.Store;
import com.sp.common.hibernate3.BaseDaoImpl;

@Repository
public class StoreDaoImpl extends BaseDaoImpl<Store> implements StoreDao{

	@Override
	public List<Store> listStoreIdName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Store> listStoreName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> listStoreIdByFactory(String fId) {
		// TODO Auto-generated method stub
		String hql="select s.id from Store s where s.factory.id=?";
		return find(hql,fId);
	}
	
	public List<Store> listStoreByFid(String fid){
		String hql="from Store s where s.factory.id=?";
		return find(hql,fid);
	}
}
