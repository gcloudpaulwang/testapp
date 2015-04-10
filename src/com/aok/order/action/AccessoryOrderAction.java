package com.aok.order.action;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.ProductMng;
import com.aok.base.mng.StoreMng;
import com.aok.common.AokConst;
import com.aok.common.mng.CommonMng;
import com.aok.entity.AccessoryChange;
import com.aok.entity.AccessoryChangeItem;
import com.aok.entity.AccessoryOrder;
import com.aok.entity.CakeOrder;
import com.aok.entity.OrderAccessory;
import com.aok.entity.Product;
import com.aok.entity.Store;
import com.aok.order.mng.AccessoryChangeItemMng;
import com.aok.order.mng.AccessoryChangeMng;
import com.aok.order.mng.AccessoryOrderMng;
import com.aok.order.mng.OrderAccessoryMng;
import com.aok.order.model.AccessoryBatchPost;
import com.aok.order.model.OrderQueryParam;
import com.aok.order.model.ProductionQueryParam;
import com.aok.production.model.AccessoryStatistics;
import com.aok.user.entity.ERole;
import com.sp.common.entity.Dict;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.mng.DictMng;
import com.sp.common.page.Pagination;
import com.sp.common.util.SPException;
import com.sp.common.util.StringUtils;
import com.sp.user.entity.User;

public class AccessoryOrderAction extends AokAction{
	private String oid;
	private Integer aid;
	private String cid;
	private OrderQueryParam oqp;
	private AccessoryOrder order;
	private OrderAccessory accessory;
	private ProductionQueryParam pqp;
	private AccessoryBatchPost batch;
	@Autowired
	private AccessoryOrderMng orderMng;
	@Autowired
	private OrderAccessoryMng accessoryMng;
	@Autowired 
	private StoreMng storeMng;
	@Autowired
	private CommonMng commonMng;
	@Autowired
	private DictMng dictMng;
	@Autowired
	private ProductMng productMng;
	@Autowired
	private AccessoryChangeMng changeMng;
	@Autowired
	private AccessoryChangeItemMng changeItemMng;
	
	private String factoryId;
//	private List<AccessoryStatistics> asList = new ArrayList<AccessoryStatistics>();
	
	public String list(){
		User user=getUser();
		oqp.setUser(user);
		Pagination pagin=orderMng.query(oqp, getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE,OrderBy.desc("id"));
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("data",pagin.getList());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String del(){
		orderMng.deleteById(oid);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String save(){
		if(getUser().getERole()!=ERole.admin&&getUser().getERole()!=ERole.factroy){
			try{
				commonMng.checkTakeDate(order.getTakeDate(),order.getTakeTime());
			}catch (SPException e) {
				jsonRoot.put("success", false);
				jsonRoot.put("exception", e.getMessage());
				return SUCCESS;
			}
		}
		Store placeStore=storeMng.findById(order.getPlaceStore().getId());
		if(placeStore==null){
			jsonRoot.put("success", false);
			jsonRoot.put("exception", "下单商店不存在");
			return SUCCESS;
		}
		if(order.getId()==null){
			synchronized (AokConst.ACCESSORY_ORDER_ID_LOCK) {
				int seq=orderMng.getMaxSeq();
				order.setSeq(seq+1);
				order.setId(getAokProperties().getAccessoryOrderIdPerfix()+StringUtils.seq(seq+1,getAokProperties().getAccessoryOrderIdLen()));
				order.setCreateDate(new Date());
				order.setZone(placeStore.getZone());
				order =orderMng.save(order);
				jsonRoot.put("data", order);
			}
		}else{
			AccessoryOrder orgl=orderMng.findById(order.getId());
			if(orgl==null){
				jsonRoot.put("success", false);
				jsonRoot.put("exception",String.format("找不到订单编号:%s",order.getId()));
				return SUCCESS;
			}else{
				/*orgl.setOperator(order.getOperator());
				orgl.setPlaceDate(order.getPlaceDate());
				orgl.setPlaceStore(order.getPlaceStore());
				orgl.setPlaceStoreName(order.getPlaceStoreName());
				orgl.setPlaceStoreTel(order.getPlaceStoreTel());
				orgl.setTakeDate(order.getTakeDate());
				orgl.setTakeStore(order.getTakeStore());
				orgl.setTakeStoreName(order.getTakeStoreName());
				orgl.setZone(placeStore.getZone());
				orgl.setTakeTime(order.getTakeTime());
				order=  orderMng.update(orgl);*/
				orderMng.update(orgl, order, placeStore.getZone());
			}
		}
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String listAccessories(){
		Pagination pagin=accessoryMng.findByOid(getOid(), getStart()/getLimit()+1, 10);
		List<Dict> productTypes= dictMng.findByProperty("type",AokConst.DictType.PRODUCT_TYPE.name());
		List<Product> products=productMng.findAll();
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("data",pagin.getList());
		jsonRoot.put("productTypes", productTypes);
		jsonRoot.put("products", products);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String saveAccessory(){
		if(accessory.getId()==null){
			OrderAccessory exist= accessoryMng.findByOidPid(accessory.getOd().getId(),accessory.getProduct().getId());
			if(exist!=null){
				jsonRoot.put("exception",String.format("%s已存在此配件单中",exist.getProduct().getName()));
				jsonRoot.put("success", false);
				return SUCCESS;
			}
			//accessoryMng.save(accessory);
			accessoryMng.save(accessory, accessory.getOd().getId());
		}else{
			OrderAccessory orgl= accessoryMng.findById(accessory.getId());
			if(!orgl.getProduct().getId().equals(accessory.getProduct().getId())){
				OrderAccessory exist= accessoryMng.findByOidPid(accessory.getOd().getId(),accessory.getProduct().getId());
				if(exist!=null){
					jsonRoot.put("exception",String.format("%s已存在此配件单中",exist.getProduct().getName()));
					jsonRoot.put("success", false);
					return SUCCESS;
				}
			}
			Double orglQty=orgl.getQty();
			orgl.setProduct(accessory.getProduct());
			orgl.setQty(accessory.getQty());
			orgl.setRemark(accessory.getRemark());
			accessoryMng.update(accessory, accessory.getOd().getId(), orglQty);
		}
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String batchSaveAccessory(){
		batch.setOperator(getUser().getAokUser().getRealName());
		try{
			accessoryMng.batchSave(batch);
		}catch(SPException e){
			jsonRoot.put("exception",e.getMessage());
			jsonRoot.put("success", false);
		}
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String delAccessory(){
		accessoryMng.deleteById(aid);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String listChanges(){
		//List<AccessoryChange> changes= changeMng.findByProperty("oid", oid);
		Pagination pagin=changeMng.findByOid(oid, getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():10);
		jsonRoot.put("data", pagin.getList());
		jsonRoot.put("totalCount", pagin.getTotalCount());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String listChangeItems(){
		//List<AccessoryChangeItem> items=changeItemMng.findByProperty("", "");
		Pagination pagin=changeItemMng.findByChangeId(cid, getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():10);
		jsonRoot.put("data", pagin.getList());
		jsonRoot.put("totalCount", pagin.getTotalCount());
		jsonRoot.put("success", true);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String statistics()
	{
		if(!StringUtils.isBlank(pqp.getType())&&pqp.getType().equals("所有"))
		{
			pqp.setType("");
		}
		if(getUser().getRole().getId()==1)
		{
			if(pqp==null||StringUtils.isBlank(pqp.getFactory()))
			{
				jsonRoot.put("success", false);
				jsonRoot.put("exception","找不到要查找的工厂");
			}
			else
			{
				try
				{
					List<Store> store = storeMng.findByProperty("factory.id", pqp.getFactory());
					List<String> storeList = new ArrayList<String>();
					if(store!=null&&store.size()>0)
					{
						for(Store s:store)
						{
							storeList.add(s.getId());
						}						
					}
					if(!StringUtils.isBlank(pqp.getFactory())&&!StringUtils.isBlank(pqp.getStore())&&!storeList.contains(pqp.getStore()))
					{
						storeList.clear();
					}
					else if(!StringUtils.isBlank(pqp.getStore()))
					{
						storeList.clear();
						storeList.add(pqp.getStore());
					}
					if(storeList.size()>0)
					{
						Pagination pagin=orderMng.statistics(storeList,pqp.getType(),pqp.getStarttime(),pqp.getEndtime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);
						jsonRoot.put("totalCount",pagin.getTotalCount());
						jsonRoot.put("data",pagin.getList());
					}
					else
					{
						jsonRoot.put("data",new ArrayList<AccessoryStatistics>());
					}
					jsonRoot.put("success", true);
				}
				catch(Exception e)
				{
					jsonRoot.put("success", false);
					jsonRoot.put("exception","查询失败");
				}				
			}
		}
		else if(getUser().getRole().getId()==2)
		{
			try
			{
				List<Store> store = storeMng.findByProperty("factory.id", getUser().getAokUser().getFactory().getId());
				List<String> storeList = new ArrayList<String>();
				if(store!=null&&store.size()>0)
				{
					for(Store s:store)
					{
						storeList.add(s.getId());
					}
				}
				if(!StringUtils.isBlank(pqp.getStore())&&!storeList.contains(pqp.getStore()))
				{
					storeList.clear();
				}
				else if(!StringUtils.isBlank(pqp.getStore()))
				{
					storeList.clear();
					storeList.add(pqp.getStore());
				}
				if(storeList.size()>0)
				{
					Pagination pagin=orderMng.statistics(storeList,pqp.getType(),pqp.getStarttime(),pqp.getEndtime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);
					jsonRoot.put("totalCount",pagin.getTotalCount());
					jsonRoot.put("data",pagin.getList());
				}
				else
				{
					jsonRoot.put("data",new ArrayList<AccessoryStatistics>());
				}
				jsonRoot.put("success", true);
			}
			catch(Exception e)
			{
				jsonRoot.put("success", false);
				jsonRoot.put("exception","查询失败");
			}
			
		}
		return SUCCESS;
	}
	
	public String exportStatistics()
	{
		String separator = java.io.File.separator;
		String xls = separator+"WEB-INF"+separator+"xls"+separator+"accessoryProduction.xls";
		Map<String ,Object> val = new HashMap<String , Object>();
		if(!StringUtils.isBlank(pqp.getType())&&pqp.getType().equals("所有"))
		{
			pqp.setType("");
		}
		if(getUser().getRole().getId()==1)
		{
			if(pqp==null||StringUtils.isBlank(pqp.getFactory()))
			{
				jsonRoot.put("success", false);
				jsonRoot.put("exception","找不到要查找的工厂");
			}
			else
			{
				try
				{
					List<Store> store = storeMng.findByProperty("factory.id", pqp.getFactory());
					List<String> storeList = new ArrayList<String>();
					if(store!=null&&store.size()>0)
					{
						for(Store s:store)
						{
							storeList.add(s.getId());
						}						
					}
					if(!StringUtils.isBlank(pqp.getFactory())&&!StringUtils.isBlank(pqp.getStore())&&!storeList.contains(pqp.getStore()))
					{
						storeList.clear();
					}
					else if(!StringUtils.isBlank(pqp.getStore()))
					{
						storeList.clear();
						storeList.add(pqp.getStore());
					}
					if(storeList.size()>0)
					{
						val.put("list", orderMng.statistics(storeList,pqp.getType(),pqp.getStarttime(),pqp.getEndtime()));
					}
					else
					{
						val.put("list",new ArrayList<AccessoryStatistics>());
					}
				}
				catch(Exception e)
				{
					jsonRoot.put("success", false);
					jsonRoot.put("exception","导出失败");
					val.put("list", new ArrayList<AccessoryStatistics>());
				}				
			}
		}
		else if(getUser().getRole().getId()==2)
		{
			try
			{
				List<Store> store = storeMng.findByProperty("factory.id", getUser().getAokUser().getFactory().getId());
				List<String> storeList = new ArrayList<String>();
				if(store!=null&&store.size()>0)
				{
					for(Store s:store)
					{
						storeList.add(s.getId());
					}										
				}
				if(!StringUtils.isBlank(pqp.getStore())&&!storeList.contains(pqp.getStore()))
				{
					storeList.clear();
				}
				else if(!StringUtils.isBlank(pqp.getStore()))
				{
					storeList.clear();
					storeList.add(pqp.getStore());
				}
				if(storeList.size()>0)
				{
					val.put("list", orderMng.statistics(storeList,pqp.getType(),pqp.getStarttime(),pqp.getEndtime()));
				}
				else
				{
					val.put("list",new ArrayList<AccessoryStatistics>());
				}
			}
			catch(Exception e)
			{
				jsonRoot.put("success", false);
				jsonRoot.put("exception","导出失败");
				val.put("list", new ArrayList<AccessoryStatistics>());
			}
			
		}
		String time ="";
		if(pqp.getStarttime()!=null&&pqp.getEndtime()!=null)
		{
			time = StringUtils.formatDate(pqp.getStarttime())+"到"+StringUtils.formatDate(pqp.getEndtime());
		}
		else if(pqp.getStarttime()!=null)
		{
			time = StringUtils.formatDate(pqp.getStarttime());
			
		}
		else if(pqp.getEndtime()!=null)
		{
			time = StringUtils.formatDate(pqp.getEndtime());
		}
		val.put("time", time);
		if(getUser().getRole().getId()==2||getUser().getRole().getId()==1)
		{
			ExcelUitl.handleExportExcel(val,xls);
		}		
		return null;
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
	public AccessoryOrder getOrder() {
		return order;
	}
	public void setOrder(AccessoryOrder order) {
		this.order = order;
	}
	public OrderQueryParam getOqp() {
		return oqp;
	}
	public void setOqp(OrderQueryParam oqp) {
		this.oqp = oqp;
	}
	public OrderAccessory getAccessory() {
		return accessory;
	}
	public void setAccessory(OrderAccessory accessory) {
		this.accessory = accessory;
	}
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public String getFactoryId() {
		return factoryId;
	}
	public void setFactoryId(String factoryId) {
		this.factoryId = factoryId;
	}
	public ProductionQueryParam getPqp() {
		return pqp;
	}
	public void setPqp(ProductionQueryParam pqp) {
		this.pqp = pqp;
	}
	public Integer getAid() {
		return aid;
	}
	public void setAid(Integer aid) {
		this.aid = aid;
	}
	public AccessoryBatchPost getBatch() {
		return batch;
	}
	public void setBatch(AccessoryBatchPost batch) {
		this.batch = batch;
	}
	public String getCid() {
		return cid;
	}
	public void setCid(String cid) {
		this.cid = cid;
	}

}
