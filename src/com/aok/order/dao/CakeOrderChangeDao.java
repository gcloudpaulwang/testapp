package com.aok.order.dao;

import java.util.List;

import com.aok.entity.CakeOrderChange;
import com.sp.common.hibernate3.BaseDao;

public interface CakeOrderChangeDao extends BaseDao<CakeOrderChange>{
	List<CakeOrderChange> listByOid(String oid);
}
