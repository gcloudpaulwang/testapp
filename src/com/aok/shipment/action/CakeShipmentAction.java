package com.aok.shipment.action;


import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.StoreMng;
import com.aok.entity.CakeOrder;
import com.aok.order.mng.CakeOrderMng;
import com.aok.shipment.mng.AccessoryShipmentMng;
import com.aok.shipment.model.ExportShipment;
import com.aok.shipment.model.ExportShipmentParam;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;
import com.sp.user.entity.User;

public class CakeShipmentAction extends AokAction{
	private CakeOrder order;
	private List<String> ids;
	private Date date;
	
	private ExportShipmentParam esp;
	
	@Autowired
	private CakeOrderMng cakeOrderMng;
	@Autowired
	private AccessoryShipmentMng ashiMng;
	@Autowired 
	private StoreMng storeMng;
	
	public String storesInfo(){
		if(date==null){
			date=StringUtils.str2Date(StringUtils.formatDate(date),"yyyy-MM-dd");
		}
		User u=getUser();
		Pagination pagin= cakeOrderMng.listShipmentSummary(u,date,getStart()/getLimit()+1,10);
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("data",pagin.getList());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String send(){
		CakeOrder orgl=cakeOrderMng.findById(order.getId());
		if(orgl==null){
			jsonRoot.put("success", false);
			jsonRoot.put("exception",String.format("找不到订单编号:%s",order.getId()));
			return SUCCESS;
		}
		orgl.setSendDate(order.getSendDate());
		orgl.setSendMan(order.getSendMan());
		orgl.setSendRemark(order.getSendRemark());
		orgl.setNhasSend(1);
		cakeOrderMng.update(orgl);
		jsonRoot.put("send", true);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String batchSend(){
		List<CakeOrder> orders=cakeOrderMng.findByIds(ids);
		for(CakeOrder co:orders){
			co.setSendDate(order.getSendDate());
			co.setSendMan(order.getSendMan());
			co.setSendRemark(order.getSendRemark());
			co.setNhasSend(1);
			cakeOrderMng.update(co);
		}
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	public String unsend(){
		CakeOrder orgl=cakeOrderMng.findById(order.getId());
		if(orgl==null){
			jsonRoot.put("success", false);
			jsonRoot.put("exception",String.format("找不到订单编号:%s",order.getId()));
			return SUCCESS;
		}
		orgl.setSendDate(null);
		orgl.setSendMan(null);
		orgl.setSendRemark(null);
		orgl.setNhasSend(0);
		cakeOrderMng.update(orgl);
		jsonRoot.put("unsend", true);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String exportShipment(){
		if(esp!=null
				&&!StringUtils.isBlank(esp.getStoreId())
				&&!StringUtils.isBlank(esp.getTime()))
		{
			String separator = java.io.File.separator;
			String xls = separator+"WEB-INF"+separator+"xls"+separator+"exportShipment.xls";
			Map<String ,Object> val = new HashMap<String , Object>();
			List<ExportShipment> shiList = ashiMng.export(esp.getStoreId(), esp.getTime() , esp.getTakeDate());
			if(shiList!=null&&shiList.size()>0)
			{
				ExportShipment e = new ExportShipment();
				e.setOid("合计：");e.setNum(0L);
				for(ExportShipment s:shiList)
				{
					e.setNum(e.getNum()+s.getNum());
				}
				shiList.add(e);
			}
			val.put("list", shiList);
			val.put("time", StringUtils.formatDate(esp.getTakeDate()));
			val.put("user",getUser().getAokUser().getRealName());
			val.put("driver", esp.getDriver());
			val.put("storeName", storeMng.findById(esp.getStoreId()).getName());
			String no = StringUtils.formatDate(new Date()).replaceAll("-","");
			if(esp.getTime().equals("12:00"))
			{
				no+="1";
			}
			else
			{
				no+="2";
			}
			val.put("no", no);
			ExcelUitl.handleExportExcel(val,xls);
			return null;
		}
		jsonRoot.put("success", false);
		return SUCCESS;
	}
	
	public String export(){
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

	public CakeOrder getOrder() {
		return order;
	}

	public void setOrder(CakeOrder order) {
		this.order = order;
	}

	public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}

	public ExportShipmentParam getEsp() {
		return esp;
	}

	public void setEsp(ExportShipmentParam esp) {
		this.esp = esp;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}
