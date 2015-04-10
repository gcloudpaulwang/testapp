package com.aok.order.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.FactoryMng;
import com.aok.base.mng.ProductMng;
import com.aok.base.mng.StoreMng;
import com.aok.common.AokConst;
import com.aok.entity.Factory;
import com.aok.entity.Store;
import com.aok.order.mng.AccessoryOrderMng;
import com.aok.order.mng.CakeOrderChangeMng;
import com.aok.order.mng.CakeOrderMng;
import com.aok.order.model.FinanceQueryParam;
import com.aok.production.model.AccessoryStatistics;
import com.aok.production.model.CakeForExcel;
import com.aok.production.model.CakeStatistics;
import com.sp.common.entity.Dict;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.mng.DictMng;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;

public class FinanceAction extends AokAction{
	
	private FinanceQueryParam fqp;	
	
	@Autowired
	private CakeOrderMng orderMng;
	@Autowired 
	private StoreMng storeMng;
	@Autowired
	private AccessoryOrderMng accorderMng;
	@Autowired
	private FactoryMng factoryMng;
	@Autowired
	private DictMng dmng;
	
	public String finance()
	{
		if(fqp==null)
		{
			
			fqp = new FinanceQueryParam();
		}
		try
		{
			if(!StringUtils.isBlank(fqp.getZone()))
			{
				List<Factory> fs = factoryMng.findByProperty("zone", fqp.getZone());
				if(fs!=null&&fs.size()>0)
				{
					fqp.setFactory(fs.get(0).getId());
				}
			}
			if(getUser().getRole().getId()==2)
			{
				fqp.setFactory(getUser().getAokUser().getFactory().getId());
//				fqp.setZone(getUser().getAokUser().get)
			}
			if(getUser().getRole().getId()==3)
			{
				fqp.setStore(getUser().getAokUser().getStore().getId());
//				fqp.setZone(getUser().getAokUser().get)
			}
			List<Store> store = storeMng.findByProperty("factory.id", fqp.getFactory());
			List<String> storeList = new ArrayList<String>();
			if(store!=null&&store.size()>0)
			{
				for(Store s:store)
				{
					storeList.add(s.getId());
				}
				
			}
			jsonRoot.put("success", true);
			if(!StringUtils.isBlank(fqp.getFactory())&&!StringUtils.isBlank(fqp.getStore())&&!storeList.contains(fqp.getStore()))
			{
				jsonRoot.put("data",new ArrayList<CakeStatistics>());
				return SUCCESS;
			}
			if(!StringUtils.isBlank(fqp.getStore()))
			{
				storeList.clear();
				storeList.add(fqp.getStore());
			}
//			jsonRoot.put("data",orderMng.finance(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime()));
			Pagination pagin=orderMng.finance(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);						
			jsonRoot.put("totalCount",pagin.getTotalCount());
			jsonRoot.put("data",pagin.getList());
		}
		catch(Exception e)
		{
			jsonRoot.put("success", false);
			jsonRoot.put("exception","查询失败");
		}

		return SUCCESS;
	}
	
	public String accessory()
	{
		if(fqp==null)
		{
			
			fqp = new FinanceQueryParam();
		}
		try
		{
			if(!StringUtils.isBlank(fqp.getZone()))
			{
				List<Factory> fs = factoryMng.findByProperty("zone", fqp.getZone());
				if(fs!=null&&fs.size()>0)
				{
					fqp.setFactory(fs.get(0).getId());
				}
			}
			if(getUser().getRole().getId()==2)
			{
				fqp.setFactory(getUser().getAokUser().getFactory().getId());
//				fqp.setZone(getUser().getAokUser().get)
			}
			if(getUser().getRole().getId()==3)
			{
				fqp.setStore(getUser().getAokUser().getStore().getId());
			}
			List<Store> store = storeMng.findByProperty("factory.id", fqp.getFactory());
			List<String> storeList = new ArrayList<String>();
			if(store!=null&&store.size()>0)
			{
				for(Store s:store)
				{
					storeList.add(s.getId());
				}
				
			}
			jsonRoot.put("success", true);
			if(!StringUtils.isBlank(fqp.getFactory())&&!StringUtils.isBlank(fqp.getStore())&&!storeList.contains(fqp.getStore()))
			{
				jsonRoot.put("data",new ArrayList<CakeStatistics>());
				return SUCCESS;
			}
			if(!StringUtils.isBlank(fqp.getStore()))
			{
				storeList.clear();
				storeList.add(fqp.getStore());
			}
//			jsonRoot.put("data",accorderMng.accessory(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime()));
			Pagination pagin=accorderMng.accessory(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime(),getStart()/getLimit()+1, (getLimit()!=null&&getLimit()!=0)?getLimit():AokConst.ORDER_PAGE_SIZE);						
			jsonRoot.put("totalCount",pagin.getTotalCount());
			jsonRoot.put("data",pagin.getList());
		}
		catch(Exception e)
		{
			jsonRoot.put("success", false);
			jsonRoot.put("exception","查询失败");
		}

		return SUCCESS;
	}
	
	public String exportAccessory()
	{	
		String separator = java.io.File.separator;
		String xls = separator+"WEB-INF"+separator+"xls"+separator+"accessoryFinance.xls";
		Map<String ,Object> val = new HashMap<String , Object>();
		String factoryName = null;
		String storeName = null;
		if(fqp==null)
		{
			
			fqp = new FinanceQueryParam();
		}
		try
		{
			if(!StringUtils.isBlank(fqp.getZone()))
			{
				List<Factory> fs = factoryMng.findByProperty("zone", fqp.getZone());
				if(fs!=null&&fs.size()>0)
				{
					fqp.setFactory(fs.get(0).getId());
				}
			}
			if(getUser().getRole().getId()==2)
			{
				fqp.setFactory(getUser().getAokUser().getFactory().getId());
//				fqp.setZone(getUser().getAokUser().get)
			}
			if(getUser().getRole().getId()==3)
			{
				fqp.setStore(getUser().getAokUser().getStore().getId());
			}
			List<Store> store = storeMng.findByProperty("factory.id", fqp.getFactory());
			if(fqp.getFactory()!=null)
			{
				Factory ff = factoryMng.findById(fqp.getFactory());
				if(ff!=null)
				{
					factoryName = ff.getName();
				}
			}
			if(!StringUtils.isBlank(fqp.getStore()))
			{
				Store s = storeMng.findById(fqp.getStore());
				if(s!=null)
				{
					storeName = s.getName();
				}
			}
			
			List<String> storeList = new ArrayList<String>();
			if(store!=null&&store.size()>0)
			{
				for(Store s:store)
				{
					storeList.add(s.getId());
				}
				
			}
			jsonRoot.put("success", true);
			List<AccessoryStatistics> result ;
			if(!StringUtils.isBlank(fqp.getFactory())&&!StringUtils.isBlank(fqp.getStore())&&!storeList.contains(fqp.getStore()))
			{
				result = new ArrayList<AccessoryStatistics>();
			}
			else
			{
				if(!StringUtils.isBlank(fqp.getStore()))
				{
					storeList.clear();
					storeList.add(fqp.getStore());
				}
				result = accorderMng.accessory(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime());
			}		
			
			val.put("list", result);
		}
		catch(Exception e)
		{
			jsonRoot.put("success", false);
			jsonRoot.put("exception","查询失败");
			val.put("list", new ArrayList<AccessoryStatistics>());
		}
		SimpleDateFormat sformat = new SimpleDateFormat("yyyy-MM-dd");
		String key = "";
		if(!StringUtils.isBlank(storeName))
		{
			key += "门店"+storeName+"; ";
		}
		if(!StringUtils.isBlank(factoryName))
		{
			key += "工场"+factoryName+"; ";
		}
		if(fqp.getStartTime()!=null)
		{
			key += "开始时间"+sformat.format(fqp.getStartTime())+"; ";
		}
		if(fqp.getEndTime()!=null)
		{
			key += "结束时间"+sformat.format(fqp.getEndTime())+"; ";
		}
		if(!StringUtils.isBlank(key))
		{
			val.put("key", "(查询:"+key+")");
		}
//		val.put("name", "123");
		if(!StringUtils.isBlank(fqp.getFileName()))
		{
			ExcelUitl.handleExportExcel(val,xls,fqp.getFileName());
		}
		else
		{
			ExcelUitl.handleExportExcel(val,xls);
		}
		
		return null;
	}
	
	public String exportFinance()
	{	
		String separator = java.io.File.separator;
		String xls = separator+"WEB-INF"+separator+"xls"+separator+"cakeFinance.xls";
		Map<String ,Object> val = new HashMap<String , Object>();
		String factoryName = null;
		String storeName = null;
		if(fqp==null)
		{
			
			fqp = new FinanceQueryParam();
		}
		try
		{
			if(!StringUtils.isBlank(fqp.getZone()))
			{
				List<Factory> fs = factoryMng.findByProperty("zone", fqp.getZone());
				if(fs!=null&&fs.size()>0)
				{
					fqp.setFactory(fs.get(0).getId());
				}
			}
			if(getUser().getRole().getId()==2)
			{
				fqp.setFactory(getUser().getAokUser().getFactory().getId());
//				fqp.setZone(getUser().getAokUser().get)
			}
			if(getUser().getRole().getId()==3)
			{
				fqp.setStore(getUser().getAokUser().getStore().getId());
			}
			if(!StringUtils.isBlank(fqp.getFactory()))
			{
				Factory ff = factoryMng.findById(fqp.getFactory());
				if(ff!=null)
				{
					factoryName = ff.getName();
				}
			}
			if(!StringUtils.isBlank(fqp.getStore()))
			{
				Store s = storeMng.findById(fqp.getStore());
				if(s!=null)
				{
					storeName = s.getName();
				}
			}
			List<Store> store = storeMng.findByProperty("factory.id", fqp.getFactory());
			List<String> storeList = new ArrayList<String>();
			if(store!=null&&store.size()>0)
			{
				for(Store s:store)
				{
					storeList.add(s.getId());
				}
				
			}
			List<CakeStatistics> cake ;
			jsonRoot.put("success", true);
			if(!StringUtils.isBlank(fqp.getFactory())&&!StringUtils.isBlank(fqp.getStore())&&!storeList.contains(fqp.getStore()))
			{
				cake = new ArrayList<CakeStatistics>();
			}
			else
			{
				if(!StringUtils.isBlank(fqp.getStore()))
				{
					storeList.clear();
					storeList.add(fqp.getStore());
				}
				cake = orderMng.finance(storeList, fqp.getZone(), fqp.getStartTime(), fqp.getEndTime());
			}			
			val.put("list", cake );
//			val.put("data", getSecondExcel(cake));
//			val.put("all", getMinExcel(cake));
		}
		catch(Exception e)
		{
			jsonRoot.put("success", false);
			jsonRoot.put("exception","查询失败");
			val.put("list", new ArrayList<CakeStatistics>() );
			val.put("data", getSecondExcel(new ArrayList<CakeStatistics>()));
			val.put("all", getMinExcel(new ArrayList<CakeStatistics>()));
		}
		SimpleDateFormat sformat = new SimpleDateFormat("yyyy-MM-dd");
		String key = "";
		if(!StringUtils.isBlank(storeName))
		{
			key += "门店"+storeName+"; ";
		}
		if(!StringUtils.isBlank(factoryName))
		{
			key += "工场"+factoryName+"; ";
		}
		if(fqp.getStartTime()!=null)
		{
			key += "开始时间"+sformat.format(fqp.getStartTime())+"; ";
		}
		if(fqp.getEndTime()!=null)
		{
			key += "结束时间"+sformat.format(fqp.getEndTime())+"; ";
		}
		if(!StringUtils.isBlank(key))
		{
			val.put("key", "(查询:"+key+")");
		}
		
		if(!StringUtils.isBlank(fqp.getFileName()))
		{
			ExcelUitl.handleExportExcel(val,xls,fqp.getFileName());
		}
		else
		{
			ExcelUitl.handleExportExcel(val,xls);
		}
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
		d.put("all", all);
		for(String key:d.keySet())
		{
			data.add(d.get(key));
		}
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

	public FinanceQueryParam getFqp() {
		return fqp;
	}

	public void setFqp(FinanceQueryParam fqp) {
		this.fqp = fqp;
	}

}
