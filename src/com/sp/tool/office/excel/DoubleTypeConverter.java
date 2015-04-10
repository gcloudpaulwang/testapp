package com.sp.tool.office.excel;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

public class DoubleTypeConverter<T> extends BaseTypeConverter<T> {

	@Override
	public void setValue(T obj, Map<String,String> map, Method method)
			throws ExcelException {
		// TODO Auto-generated method stub
		try {
			String value=map.get(VALUE_NAME_KEY);
			if(value==null||value.trim().equals("")) return;
			Double val=Double.parseDouble(value);
			method.invoke(obj, val);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new ExcelException(e);
		} 
	}


}
