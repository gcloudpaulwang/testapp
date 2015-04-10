package com.aok.base.dao;

import java.util.List;

import com.aok.entity.Store;
import com.sp.common.hibernate3.BaseDao;

public interface StoreDao extends BaseDao<Store>{
	List<Store> listStoreName();
	List<Store> listStoreIdName();
	List<String> listStoreIdByFactory(String fId);
	List<Store> listStoreByFid(String fid);
}
