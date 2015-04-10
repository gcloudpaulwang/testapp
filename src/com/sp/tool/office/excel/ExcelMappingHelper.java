package com.sp.tool.office.excel;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class ExcelMappingHelper {

	public static<T> void setValue(T obj,String colName,String value) throws ExcelException
	{
		try{
			for(Field item:obj.getClass().getDeclaredFields())
			{
				ExcelMapping anno=item.getAnnotation(ExcelMapping.class);
				if(anno!=null&&colNameExisted(anno.name(), colName))
				{
					BaseTypeConverter<T> converter=(BaseTypeConverter<T>) Class.forName("com.sp.tool.office.excel."+item.getType().getName().substring(item.getType().getName().lastIndexOf(".")+1)+"TypeConverter").newInstance();
					String setMethod="set"+item.getName().substring(0,1).toUpperCase()+item.getName().substring(1,item.getName().length());
					//Method method=obj.getClass().getDeclaredMethod(setMethod);
					for(Method method:obj.getClass().getDeclaredMethods())
					{
						if(method.getName().equals(setMethod))
						{
							Map<String,String> mapVal=new HashMap<String, String>();
							mapVal.put(BaseTypeConverter.COLUMN_NAME_KEY,colName);
							mapVal.put(BaseTypeConverter.VALUE_NAME_KEY, value);
							converter.setValue(obj, mapVal, method);	
							break;
						}
					}
					break;//throw new ExcelException("没定义方法:"+setMethod);
				}
				//处理礼品列
				ProductExcelMapping pdtAnno=item.getAnnotation(ProductExcelMapping.class);
				if(pdtAnno!=null){
					BaseExcelColumnHandler baseCH=(BaseExcelColumnHandler) pdtAnno.commandClass().newInstance();
					baseCH.initData();
					if(baseCH.match(colName)){
						BaseTypeConverter<T> converter=(BaseTypeConverter<T>) Class.forName("com.sp.tool.office.excel."+item.getType().getName().substring(item.getType().getName().lastIndexOf(".")+1)+"TypeConverter").newInstance();
						String setMethod=pdtAnno.methodName();
						//Method method=obj.getClass().getDeclaredMethod(setMethod);
						for(Method method:obj.getClass().getDeclaredMethods())
						{
							if(method.getName().equals(setMethod))
							{
								Map<String,String> mapVal=new HashMap<String, String>();
								mapVal.put(BaseTypeConverter.COLUMN_NAME_KEY,colName);
								mapVal.put(BaseTypeConverter.VALUE_NAME_KEY, value);
								converter.setValue(obj, mapVal, method);	
								break;
							}
						}
						break;//throw new ExcelException("没定义方法:"+setMethod);
					}
				}
			}
		}
		catch(Exception ex)
		{
			throw new ExcelException(ex);
		}

	}
	private static boolean colNameExisted(String[] arr,String key)
	{
		for(String item:arr)
		{
			if(item.trim().equals(key.trim()))
			{
				return true;
			}
		}
		return false;
	}
}
