package com.aok.shipment.action;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.base.mng.StoreMng;
import com.aok.entity.AccessoryShipment;
import com.aok.shipment.mng.AccessoryShipmentMng;
import com.aok.shipment.model.AccessoryShipmentSummary;
import com.aok.shipment.model.ExportAShipment;
import com.aok.shipment.model.ExportShipment;
import com.aok.shipment.model.ExportShipmentParam;
import com.aok.shipment.model.ListExportAShipment;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.page.Pagination;
import com.sp.common.util.StringUtils;

public class AccessoryShipmentAction extends AokAction {
	private Date date;
	private String storeId;
	private List<AccessoryShipment> shipments;
	@Autowired
	private AccessoryShipmentMng accessoryShipmentMng;
	@Autowired 
	private StoreMng storeMng;
	
	private ExportShipmentParam esp;
	
	public String storesInfo(){
		if(date==null){
			date=StringUtils.str2Date(StringUtils.formatDate(date),"yyyy-MM-dd");
		}
		
		Pagination pagin=accessoryShipmentMng.listStoreShipment(getUser(),date, getStart()/getLimit()+1,10);
		jsonRoot.put("totalCount",pagin.getTotalCount());
		jsonRoot.put("data",pagin.getList());
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String accessoryList(){
		if(date==null){
			date=StringUtils.str2Date(StringUtils.formatDate(date),"yyyy-MM-dd");
		}
		List<AccessoryShipment> list= accessoryShipmentMng.find(date, storeId);
		jsonRoot.put("data",list);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String send(){
		if(shipments==null||shipments.size()==0){
			jsonRoot.put("success", false);
			return SUCCESS;
		}
		String firstMan=shipments.get(0).getFirstOperator();
		Date firstDate=shipments.get(0).getFirstMarkDate();
		String secondMan=shipments.get(0).getSecondOperator();
		Date secondDate=shipments.get(0).getSecondMarkDate();
		accessoryShipmentMng.send(shipments, firstMan, secondMan, firstDate, secondDate);
		jsonRoot.put("success", true);
		return SUCCESS;
	}
	
	public String exportShipment(){
		if(esp!=null
				&&!StringUtils.isBlank(esp.getStoreId())
				&&!StringUtils.isBlank(esp.getTime()))
		{
			String separator = java.io.File.separator;
			String xls = separator+"WEB-INF"+separator+"xls"+separator+"exportAShipment.xls";
			Map<String ,Object> val = new HashMap<String , Object>();
			List<ExportAShipment> shiList = accessoryShipmentMng.exportAccessory(esp.getStoreId(),esp.getTakeDate());
			Map<String,List<ExportAShipment>> dList = new HashMap<String,List<ExportAShipment>>();
			if(shiList!=null&&shiList.size()>0)
			{
				for(ExportAShipment s:shiList)
				{
					List<ExportAShipment> d;
					if(dList.get(s.getType())==null)
					{
						d = new ArrayList<ExportAShipment>();						
					}
					else
					{
						d = dList.get(s.getType());
					}
					s.settNum(s.getFirstNum()+s.getSecondNum());
					if(esp.getTime().equals("12:00"))
					{
						s.setSendNum(s.getFirstNum());
					}
					else if(esp.getTime().equals("18:00"))
					{
						s.setSendNum(s.getSecondNum()+s.getFirstNum()-s.getFirstsend());
					}
					d.add(s);
					dList.put(s.getType(), d);
				}				
			}
			List<ListExportAShipment> data = new ArrayList<ListExportAShipment>();
			for(String key : dList.keySet())
			{
				ListExportAShipment l = new ListExportAShipment();
				l.setType(key);
				l.setEah(dList.get(key));
				data.add(l);
			}
			val.put("data", data);
			val.put("time", StringUtils.formatDate(esp.getTakeDate()));
			val.put("user",getUser().getAokUser().getRealName());
			val.put("driver", esp.getDriver());
			val.put("storeName", storeMng.findById(esp.getStoreId()).getName());
			String no = StringUtils.formatDate(new Date()).replaceAll("-","");
			String no2;
			if(esp.getTime().equals("12:00"))
			{
				no+="1";
				no2="第一次";
			}
			else
			{
				no+="2";
				no2="第二次";
				List<ListExportAShipment> now = new ArrayList<ListExportAShipment>();
				for(ListExportAShipment ls:(List<ListExportAShipment>)val.get("data"))
				{
					ListExportAShipment le = new ListExportAShipment();
					List<ExportAShipment> eah = new ArrayList<ExportAShipment>();
					for(ExportAShipment ea:ls.getEah())
					{
						if(ea.getSendNum().intValue()>0)
						{
							eah.add(ea);
						}
					}
					le.setEah(eah);
					le.setType(ls.getType());
					now.add(le);
				}
				val.put("data", now);
			}
			val.put("no", no);
			val.put("no2", no2);
			ExcelUitl.handleExportExcel(val,xls);
			return null;
		}
		jsonRoot.put("success", false);
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

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getStoreId() {
		return storeId;
	}

	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}

	public List<AccessoryShipment> getShipments() {
		return shipments;
	}

	public void setShipments(List<AccessoryShipment> shipments) {
		this.shipments = shipments;
	}

	public ExportShipmentParam getEsp() {
		return esp;
	}

	public void setEsp(ExportShipmentParam esp) {
		this.esp = esp;
	}

}
