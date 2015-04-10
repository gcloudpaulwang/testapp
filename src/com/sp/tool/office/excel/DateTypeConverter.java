package com.sp.tool.office.excel;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;

public class DateTypeConverter<T> extends BaseTypeConverter<T> {

	@Override
	public void setValue(T obj, Map<String,String> map, Method method) throws ExcelException{
		// TODO Auto-generated method stub
		try {
			String value=map.get(VALUE_NAME_KEY);
			if(value==null||value.trim().equals("")) return;
			Date dt=null;
			try
			{//非正规日期格式
				dt=HSSFDateUtil.getJavaDate(Double.parseDouble(value));
			}catch(Exception ex)
			{//正日期格式
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
				dt=sdf.parse(value);
			}
			
			method.invoke(obj, dt);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new  ExcelException(e);
		}
		
	}

}
