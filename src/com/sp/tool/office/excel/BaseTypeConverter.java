package com.sp.tool.office.excel;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Map;

public abstract class BaseTypeConverter<T> {
	public static String COLUMN_NAME_KEY="colName";
	public static String VALUE_NAME_KEY="colValue";
	public abstract void setValue(T obj,Map<String,String> valueMap,Method method) throws ExcelException;
//	protected void match(T obj,String value,String colName) throws ExcelException
//	{
//		for(Field item:obj.getClass().getFields())
//		{
//			ExcelMapping anno=item.getAnnotation(ExcelMapping.class);
//			if(colName!=null&&colName.equals(anno.name()))
//			{
//				String setMethod="set"+item.getName().substring(0,1).toUpperCase()+item.getName().substring(0,item.getName().length());
//				try {
//					Method method=obj.getClass().getMethod(setMethod);
//					this.setValue(obj, value, method);
//				} catch (Exception e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//					throw new ExcelException(e);
//				}
//			}
//		}
//	}
}
