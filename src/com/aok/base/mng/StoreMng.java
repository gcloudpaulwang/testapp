package com.aok.base.mng;

import java.util.List;

import com.aok.entity.Store;
import com.sp.common.hibernate3.BaseManager;

public interface StoreMng extends BaseManager<Store>{
	List<String> listStoreIdByFactory(String fId);
	List<Store> listStoreByFid(String fid);
}
