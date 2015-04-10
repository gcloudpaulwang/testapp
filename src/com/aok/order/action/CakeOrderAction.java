package com.aok.order.action;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.FactoryMng;
import com.aok.base.mng.ProductMng;
import com.aok.base.mng.StoreMng;
import com.aok.common.AokConst;
import com.aok.common.CommonUtils;
import com.aok.common.mng.CommonMng;
import com.aok.entity.CakeOrder;
import com.aok.entity.CakeOrderChange;
import com.aok.entity.Product;
import com.aok.entity.Store;
import com.aok.order.mng.CakeOrderChangeMng;
import com.aok.order.mng.CakeOrderMng;
import com.aok.order.model.OrderQueryParam;
import com.aok.order.model.ProductionQueryParam;
import com.aok.production.model.CakeForExcel;
import com.aok.production.model.CakeStatistics;
import com.aok.user.entity.ERole;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.page.Pagination;
import com.sp.common.util.SPException;
import com.sp.common.util.StringUtils;
import com.sp.user.entity.User;

public class CakeOrderAction extends AokAction{
	private OrderQueryParam oqp;
	private CakeOrder order;
	private CakeOrderChange change;
	private String id;
	private Integer cId;
	private List<String> ids;
	private ProductionQueryParam pqp;
	@Autowired
	private CakeOrderMng orderMng;
	@Autowired 
	private StoreMng storeMng;
	@Autowired
	private CakeOrderChangeMng changeMng;
	@Autowired
	private ProductMng productMng;
	@Autowired
	private FactoryMng factoryMng;
	@Autowired
	private CommonMng commonMng;
	
	
	
//	private List<CakeStatistics> csList = new ArrayList<CakeStatistics>();
//	private String factoryName = null;
	
	public String list(){
		User user=getUser();
		if(oqp==null)
			oqp=new OrderQueryParam();
		oqp.setUser(user);
		Pagination pagin=orderMng.query(oqp, getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE,OrderBy.desc("id"));
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("data",pagin.getList());
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
		Product product =productMng.findById(order.getCake().getId());
		String[] strs=null;
		if(product==null){
			jsonRoot.put("success", false);
			jsonRoot.put("exception", "蛋糕不存在");
			return SUCCESS;
		}else{
			strs=CommonUtils.splitCakeName(product.getName());
		}
		if(order.getId()==null){
			if(orderMng.countOrglNo(order.getOrglNo())>0){
				jsonRoot.put("success", false);
				jsonRoot.put("exception", "原单号已存在");
				return SUCCESS;
			}
			synchronized (AokConst.CAKE_ORDER_ID_LOCK) {
				int seq=orderMng.getMaxSeq();
				order.setSeq(seq+1);
				order.setId(getAokProperties().getCakeOrderIdPerfix()+StringUtils.seq(seq+1, getAokProperties().getCakeOrderIdLen()));
				order.setCreateDate(new Date());
				order.setZone(placeStore.getZone());
				if(strs!=null){
					order.setCakeName(strs[0]);
					order.setCakeSize(strs[1]);
				}else{
					order.setCakeName(product.getName());
				}
				if(order.getHasPaid()!=null&&order.getHasPaid()==true){
					order.setOwnerStore(order.getPlaceStore());
					order.setOwnerStoreName(order.getPlaceStoreName());
				}else{
					order.setOwnerStore(order.getTakeStore());
					order.setOwnerStoreName(order.getTakeStoreName());
				}
				order =orderMng.save(order);
				jsonRoot.put("data", order);
			}
		}else{
			CakeOrder orgl=orderMng.findById(order.getId());
			if(orgl==null){
				jsonRoot.put("success", false);
				jsonRoot.put("exception",String.format("找不到订单编号:%s",order.getId()));
				return SUCCESS;
			}else{
				if(!orgl.getOrglNo().equals(order.getOrglNo())){
					if(orderMng.countOrglNo(order.getOrglNo())>0){
						jsonRoot.put("success", false);
						jsonRoot.put("exception", "原单号已存在");
						return SUCCESS;
					}
				}
				orgl.setBfCode(order.getBfCode());
				orgl.setCake(order.getCake());
				orgl.setCustomerName(order.getCustomerName());
				orgl.setCustomerTel(order.getCustomerTel());
				orgl.setDeposit(order.getDeposit());
				orgl.setGreeting(order.getGreeting());
				orgl.setGroup(order.getGroup());
				orgl.setHasPaid(order.getHasPaid());
				orgl.setOperator(order.getOperator());
				orgl.setPlaceDate(order.getPlaceDate());
				orgl.setPlaceStore(order.getPlaceStore());
				orgl.setPlaceStoreName(order.getPlaceStoreName());
				orgl.setPlaceStoreTel(order.getPlaceStoreTel());
				orgl.setPlain(order.getPlain());
				orgl.setRequest(order.getRequest());
				orgl.setTakeDate(order.getTakeDate());
				orgl.setTakeStore(order.getTakeStore());
				orgl.setTakeStoreName(order.getTakeStoreName());
				orgl.setZone(placeStore.getZone());
				orgl.setTakeTime(order.getTakeTime());
				orgl.setOrglNo(order.getOrglNo());
				if(order.getHasPaid()!=null&&order.getHasPaid()==true){
					orgl.setOwnerStore(order.getPlaceStore());
					orgl.setOwnerStoreName(order.getPlaceStoreName());
				}else{
					orgl.setOwnerStore(order.getTakeStore());
					orgl.setOwnerStoreName(order.getTakeStoreName());
				}
				if(strs!=null){
					orgl.setCakeName(strs[0]);
					orgl.setCakeSize(strs[1]);
				}else{
					orgl.setCakeName(product.getName());
				}
				order=  orderMng.update(orgl);
			}
		}
		jsonRoot.put("success", true);
		
		return SUCCESS;
	}
	
	public String test(){
		List<CakeOrder> orders= orderMng.findByProperty("placeStoreName","大涌");
		jsonRoot.put("data", orders);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String test2(){
		orderMng.findById("A000001");
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String statistics()
	{
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
//					factoryName = factoryMng.findById(id).getName();
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
					if(storeList.size()!=0)
					{
						Pagination pagin=orderMng.statistics(storeList,pqp.getStarttime(),pqp.getEndtime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);
						jsonRoot.put("totalCount",pagin.getTotalCount());
						jsonRoot.put("data",pagin.getList());
						jsonRoot.put("success", true);
					}
					else
					{
						jsonRoot.put("data", new ArrayList<CakeStatistics>());
						jsonRoot.put("success", true);
					}
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
//				factoryName = getUser().getAokUser().getFactory().getName();
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
				if(storeList.size()!=0)
				{
					Pagination pagin=orderMng.statistics(storeList,pqp.getStarttime(),pqp.getEndtime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);
					jsonRoot.put("totalCount",pagin.getTotalCount());
					jsonRoot.put("data",pagin.getList());
					jsonRoot.put("success", true);
				}
				else
				{
					jsonRoot.put("data", new ArrayList<CakeStatistics>());
					jsonRoot.put("success", true);
				}
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
		String xls = separator+"WEB-INF"+separator+"xls"+separator+"cakeProduction.xls";
		Map<String ,Object> val = new HashMap<String , Object>();
		String factoryName = null;
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
					factoryName = factoryMng.findById(pqp.getFactory()).getName();
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
					List<CakeStatistics> cake = new ArrayList<CakeStatistics>();
					if(storeList.size()!=0)
					{
						cake = orderMng.statistics(storeList,pqp.getStarttime(),pqp.getEndtime());
					}					
					val.put("list", cake );
					val.put("data", getSecondExcel(cake));
					val.put("all", getMinExcel(cake));
					val.put("factory", factoryName);
					ExcelUitl.handleExportExcel(val,xls);
				}
				catch(Exception e)
				{
					jsonRoot.put("success", false);
					jsonRoot.put("exception","导出失败");
				}				
			}
		}
		else if(getUser().getRole().getId()==2)
		{
			try
			{
				List<Store> store = storeMng.findByProperty("factory.id", getUser().getAokUser().getFactory().getId());
				factoryName = getUser().getAokUser().getFactory().getName();
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
				List<CakeStatistics> cake = new ArrayList<CakeStatistics>();
				if(storeList.size()!=0)
				{
					cake = orderMng.statistics(storeList,pqp.getStarttime(),pqp.getEndtime());
				}
				val.put("list", cake );
				val.put("data", getSecondExcel(cake));
				val.put("all", getMinExcel(cake));
				val.put("factory", factoryName);
				ExcelUitl.handleExportExcel(val,xls);
			}
			catch(Exception e)
			{
				jsonRoot.put("success", false);
				jsonRoot.put("exception","导出失败");
			}
			
		}
//		val.put("list", csList );
//		val.put("data", getSecondExcel(csList));
//		val.put("all", getMinExcel(csList));
		
		return null;
	}
	
	private List<List<String>> getSecondExcel(List<CakeStatistics> cake)
	{
		List<List<String>> data = new ArrayList<List<String>>();
		if(cake==null||cake.size()==0)
		{
			return data;
		}
		Map<String,Integer> typeIndex = new HashMap<String,Integer>();		
		//添加表头
		List<String> rowOne = new ArrayList<String>();
		rowOne.add("名称");
		rowOne.add("吋数");
		rowOne.add("单位");
		rowOne.add("汇总数量");
		int index = 4;
		for(CakeStatistics c:cake)
		{
			if(typeIndex.get(c.getBfCode())!=null)
			{
				continue;
			}
			else
			{
				typeIndex.put(c.getBfCode(), index);
				rowOne.add(c.getBfCode());
				index++;
			}
		}
		rowOne.add("小计");
		data.add(rowOne);
		//添加数据
		Map<String,List<String>> d = new HashMap<String,List<String>>();
		List<String> all = new ArrayList<String>();
		//初始化一行数据
		for(int i=0;i<=index;i++)
		{
			all.add(0+"");
		}
		all.set(0, "合计:");
		all.set(1, "-");
		all.set(2, "-");
		for(CakeStatistics c:cake)
		{
			List<String> row;
			if(d.get(c.getCakeName()+c.getCakeSize())==null)
			{
				row = new ArrayList<String>();
				//初始化一行数据
				for(int i=0;i<=index;i++)
				{
					row.add(0+"");
				}
				row.set(0, c.getCakeName());
				row.set(1, c.getCakeSize());
				row.set(2, c.getUnit());
				row.set(3, c.getCakeNum()+"");				
				row.set(index, c.getCakeNum()+"");				
				
				if(typeIndex.get(c.getBfCode())==null)
				{
					continue;
				}
				int in = typeIndex.get(c.getBfCode());
				row.set(in, Integer.valueOf(row.get(in))+c.getCakeNum()+"");
				all.set(in, Integer.valueOf(all.get(in))+c.getCakeNum()+"");
				all.set(3, Integer.valueOf(all.get(3))+c.getCakeNum()+"");
				all.set(index, Integer.valueOf(all.get(index))+c.getCakeNum()+"");
			}
			else
			{
				row = d.get(c.getCakeName()+c.getCakeSize());
				if(typeIndex.get(c.getBfCode())==null)
				{
					continue;
				}
				int in = typeIndex.get(c.getBfCode());
				row.set(in, Integer.valueOf(row.get(in))+c.getCakeNum()+"");
				row.set(3, Integer.valueOf(row.get(3))+c.getCakeNum()+"");
				row.set(index, Integer.valueOf(row.get(index))+c.getCakeNum()+"");
				all.set(in, Integer.valueOf(all.get(in))+c.getCakeNum()+"");
				all.set(3, Integer.valueOf(all.get(3))+c.getCakeNum()+"");
				all.set(index, Integer.valueOf(all.get(index))+c.getCakeNum()+"");
			}
			d.put(c.getCakeName()+c.getCakeSize(), row);
		}
		//d.put("all", all);
		for(String key:d.keySet())
		{
			data.add(d.get(key));
		}
		data.add(all);
		return data;
	}
	
	private List<CakeForExcel> getMinExcel(List<CakeStatistics> cake)
	{
		List<CakeForExcel> data = new ArrayList<CakeForExcel>();
		if(cake==null||cake.size()==0)
		{
			return data;
		}
		Map<String,CakeForExcel> d = new HashMap<String,CakeForExcel>();
		for(CakeStatistics c:cake)
		{
			CakeForExcel row;
			if(d.get(c.getCakeSize())==null)
			{
				row = new CakeForExcel();
				row.setCakeSize(c.getCakeSize());
				row.setAllNum(row.getAllNum()+Integer.valueOf(c.getCakeNum().toString()));
				if(c.getBfCode().equals("团购"))
				{
					row.settNum(row.gettNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
				else if(c.getBfCode().equals("原味"))
				{
					row.setyNum(row.getyNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
				else
				{
					row.setmNum(row.getmNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
			}
			else
			{
				row = d.get(c.getCakeSize());
				row.setAllNum(row.getAllNum()+Integer.valueOf(c.getCakeNum().toString()));
				if(c.getBfCode().equals("团购"))
				{
					row.settNum(row.gettNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
				else if(c.getBfCode().equals("原味"))
				{
					row.setyNum(row.getyNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
				else
				{
					row.setmNum(row.getmNum()+Integer.valueOf(c.getCakeNum().toString()));
				}
			}
			d.put(c.getCakeSize(), row);
		}
		
		for(String key:d.keySet())
		{
			data.add(d.get(key));
		}
		
		return data;
	}
	
	public String print(){
		if((ids==null||ids.size()==0)&&oqp==null){
			jsonRoot.put("exception","请重新在系统中选择订单。");
		}else{
			List<CakeOrder> orders=new ArrayList<CakeOrder>();
			if(ids!=null&&ids.size()>0){
				orders=orderMng.findByIds(ids);
				orderMng.print(orders);
			}else if(oqp!=null){
				oqp.setUser(getUser());
				orders=orderMng.query(oqp, 1, 9999, OrderBy.desc("id")).getList();
				orderMng.print(orders);
			}
			if(orders.size()==0){
				jsonRoot.put("exception","查无记录。");
			}
			jsonRoot.put("orders", orders);
		}
		return handleResult("cake_order_print");
	}
	public String listChanges(){
		List<CakeOrderChange> changes=changeMng.listByOid(id);
		jsonRoot.put("data",changes);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String saveChange(){
		changeMng.saveOrUpdate(change);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String delChange(){
		changeMng.deleteById(cId);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String del(){
		orderMng.deleteById(id);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return "default";
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return "order";
	}

	public OrderQueryParam getOqp() {
		return oqp;
	}

	public void setOqp(OrderQueryParam oqp) {
		this.oqp = oqp;
	}
	public CakeOrder getOrder() {
		return order;
	}
	public void setOrder(CakeOrder order) {
		this.order = order;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public CakeOrderChange getChange() {
		return change;
	}

	public void setChange(CakeOrderChange change) {
		this.change = change;
	}

	public ProductionQueryParam getPqp() {
		return pqp;
	}

	public void setPqp(ProductionQueryParam pqp) {
		this.pqp = pqp;
	}

	public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}

	public Integer getCId() {
		return cId;
	}

	public void setCId(Integer id) {
		cId = id;
	}

}
