package com.aok.order.mng;

import java.util.List;

import com.aok.entity.CakeOrderChange;
import com.sp.common.hibernate3.BaseManager;

public interface CakeOrderChangeMng extends BaseManager<CakeOrderChange> {
	List<CakeOrderChange> listByOid(String oid);
}
