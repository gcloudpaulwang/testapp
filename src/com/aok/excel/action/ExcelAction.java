package com.aok.excel.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.aok.action.AokAction;
import com.sp.common.excel.ExcelUitl;
import com.sp.common.excel.Model1;


public class ExcelAction extends AokAction {	
	
	public String export(){
		List<Model1> list = new ArrayList<Model1>();
		Model1 t = new Model1();
		t.setName("123");
		list.add(t);
		Map<String ,Object> val = new HashMap<String , Object>();
		String config = "\\WEB-INF\\xls\\example1.xls";
		val.put("list", list);
		ExcelUitl.handleExportExcel(val,config);
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
	
}
