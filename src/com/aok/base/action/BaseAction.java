package com.aok.base.action;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.FactoryMng;
import com.aok.base.mng.StoreMng;
import com.aok.entity.Factory;
import com.aok.entity.Store;
import com.sp.common.entity.Dict;
import com.sp.common.hibernate3.OrderBy;
import com.sp.common.mng.DictMng;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;

public class BaseAction extends AokAction{
	private String fid;
	@Autowired
	private FactoryMng fmng;
	@Autowired
	private StoreMng smng;
	@Autowired
	private DictMng dmng;
	
	private Dict d;
	private String type;
	private String factory;
	private String zone;
	
	public String listFactory(){
//		fmng.findAll();
		jsonRoot.put("data",fmng.findAll());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String listStore(){
//		smng.findAll();
		if(StringUtils.isBlank(fid))
			jsonRoot.put("data",smng.findAll());
		else
			jsonRoot.put("data",smng.listStoreByFid(fid));
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String listFactorySelect(){
//		fmng.findAll();;
		List<Factory> result = new ArrayList<Factory>();
		Factory s = new Factory();
		s.setName("所有");
		s.setId("");
		result.add(s);
		result.addAll(fmng.findAll());
		jsonRoot.put("data",result);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String listStoreSelect(){
//		smng.findAll();
		List<Store> result = new ArrayList<Store>();
		Store s = new Store();
		s.setName("所有");
		s.setId("");
		result.add(s);
		if(!StringUtils.isBlank(zone))
		{
			List<Factory> fs = fmng.findByProperty("zone", zone);
			if(fs!=null&&fs.size()>0)
			{
				factory = fs.get(0).getId();
			}
			else
			{
				jsonRoot.put("data",new ArrayList<Store>());
				jsonRoot.put("success", true);
				return SUCCESS;
			}
		}
		if(StringUtils.isBlank(factory)&&getUser().getRole().getId()==1)
		{
			result.addAll(smng.findAll());
		}
		else if(getUser().getRole().getId()==2)
		{
			result.addAll(smng.findByProperty("factory.id", getUser().getAokUser().getFactory().getId()));
		}
		else
		{
			result.addAll(smng.findByProperty("factory.id", factory));
		}
		jsonRoot.put("data",result);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String listDict(){
		if(StringUtils.isBlank(type)){
//			jsonRoot.put("data",dmng.findAll());
			Pagination pagin = dmng.findAll(getStart()/getLimit()+1, getLimit() , OrderBy.desc("key"));
			List<Dict> data = pagin.getList();
			if(data!=null)
			{
				for(Dict t:data)
				{
					t.setTypeCn(t.getType());
				}
			}
			jsonRoot.put("data",data);
			jsonRoot.put("totalCount",pagin.getTotalCount());
		}
		else{
			Dict i = new Dict();
			i.setType(type);
			Pagination pagin = dmng.findByEg(i,getStart()/getLimit()+1, getLimit());
			List<Dict> data = pagin.getList();
			if(data!=null)
			{
				for(Dict t:data)
				{
					t.setTypeCn(t.getType());
				}
			}
			jsonRoot.put("data",data);
		}
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String addDict(){
		try{
			dmng.save(d);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","添加数据失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String editDict(){
		try{
			dmng.saveOrUpdate(d);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","编辑数据失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	

	public String deleteDict(){
		try{
			Dict di = dmng.findUnique("key", d.getKey());
			dmng.delete(di);
			jsonRoot.put("success", true);
		}catch(Exception e){
			jsonRoot.put("exception","删除数据失败");
			jsonRoot.put("success", false);
		}
		return SUCCESS;
	}
	
	public String listProdectType(){
		Dict i = new Dict();
		Dict all = new Dict();
		all.setValue("所有");
		i.setType("PRODUCT_TYPE");
		List<Dict> data = new ArrayList<Dict>();
		data.add(all);
		data.addAll(dmng.findByEgList(i));
		if(data!=null)
		{
			for(Dict t:data)
			{
				t.setTypeCn(t.getType());
			}
		}
		jsonRoot.put("data",data);
		jsonRoot.put("success", true);
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

	public Dict getD() {
		return d;
	}

	public void setD(Dict d) {
		this.d = d;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFid() {
		return fid;
	}

	public void setFid(String fid) {
		this.fid = fid;
	}

	public String getFactory() {
		return factory;
	}

	public void setFactory(String factory) {
		this.factory = factory;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

}
