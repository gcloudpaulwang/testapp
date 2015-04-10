package com.aok.base.dao.impl;

import org.springframework.stereotype.Repository;

import com.aok.base.dao.ProductDao;
import com.aok.entity.Product;
import com.sp.common.hibernate3.BaseDaoImpl;
@Repository
public class ProductDaoImpl extends BaseDaoImpl<Product> implements ProductDao{

}
