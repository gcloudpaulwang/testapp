package com.aok.base.mng.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aok.base.dao.ProductDao;
import com.aok.base.mng.ProductMng;
import com.aok.entity.Product;
import com.sp.common.hibernate3.BaseManagerImpl;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
@Transactional
@Service
public class ProductMngImpl extends BaseManagerImpl<Product> implements ProductMng{
	@Autowired
	public void setDao(ProductDao dao) {
		super.setDao(dao);
	}

	public ProductDao getDao() {
		return (ProductDao) super.getDao();
	}

	@Override
	public Pagination search(Product p, int pageNo, int pageSize,
			OrderBy... orders) {
		// TODO Auto-generated method stub
		if(p==null){
			return findAll(pageNo, pageSize, orders);
		}else{
			Criteria crit =getDao().createCriteria();
			if(!StringUtils.isBlank(p.getName())){
				crit.add(Restrictions.eq("name", p.getName()));
			}
			if(!StringUtils.isBlank(p.getType())){
				crit.add(Restrictions.eq("type", p.getType()));
			}
			if(!StringUtils.isBlank(p.getZjCode())){
				crit.add(Restrictions.eq("zjCode", p.getZjCode()));
			}

			Map<String,String> condition=new HashMap<String, String>();

			return getDao().findByLike(crit, condition, true, pageNo, pageSize, orders);
		}
	}
}
