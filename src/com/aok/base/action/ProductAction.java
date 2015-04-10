package com.aok.base.action;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.ProductMng;
import com.aok.common.AokConst;
import com.aok.entity.Product;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;

public class ProductAction extends AokAction{
	private Product p;
	@Autowired
	private ProductMng productMng;
	
	public String list(){
		Pagination pagin=productMng.search(p ,getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE,OrderBy.asc("id"));
		jsonRoot.put("data",pagin.getList());
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String del(){
		return SUCCESS;
	}
	public String add(){
		try{
			productMng.save(p);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","添加商品失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String edit(){
		try{
			productMng.saveOrUpdate(p);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","添加商品失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return null;
	}
	public Product getP() {
		return p;
	}
	public void setP(Product p) {
		this.p = p;
	}

}
