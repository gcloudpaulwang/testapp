package com.aok.base.mng;

import com.aok.entity.Product;
import com.sp.common.hibernate3.BaseManager;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;

public interface ProductMng extends BaseManager<Product>{
	Pagination search(Product p,int pageNo,int pageSize,OrderBy... orders);
}
