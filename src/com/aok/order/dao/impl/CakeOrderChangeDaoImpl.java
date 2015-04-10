package com.aok.order.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.aok.entity.CakeOrderChange;
import com.aok.order.dao.CakeOrderChangeDao;
import com.sp.common.hibernate3.BaseDaoImpl;
@Repository
public class CakeOrderChangeDaoImpl extends BaseDaoImpl<CakeOrderChange> implements CakeOrderChangeDao{
	public List<CakeOrderChange> listByOid(String oid){
		String hql="from CakeOrderChange coc where coc.oid=? order by coc.changeDate";
		return find(hql,oid);
	}
}
