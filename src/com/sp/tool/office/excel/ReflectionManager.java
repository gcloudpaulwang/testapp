package com.sp.tool.office.excel;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class ReflectionManager {
	private static Map<Class,Map<String,FieldReflection>> refClazz=new HashMap<Class, Map<String,FieldReflection>>();
	//private Map<String,FieldReflection> map=new HashMap<String,FieldReflection>();
	public static void init(Class c){
		Map<String,FieldReflection> reflection=new HashMap<String, FieldReflection>();
		for(Field item:c.getDeclaredFields()){
			ExcelMapping anno=item.getAnnotation(ExcelMapping.class);
			if(anno!=null){
				try {
				BaseTypeConverter converter=(BaseTypeConverter) Class.forName("com.sp.tool.office.excel."+item.getType().getName().substring(item.getType().getName().lastIndexOf(".")+1)+"TypeConverter").newInstance();
				String setMethod="set"+item.getName().substring(0,1).toUpperCase()+item.getName().substring(1,item.getName().length());
				Method sMethod= c.getMethod(setMethod, item.getType());
					FieldReflection fr=new FieldReflection();
					fr.setField(item);
					fr.setSMethod(sMethod);
					fr.setConverter(converter);
					for(String colName:anno.name()){
						reflection.put(colName,fr);
					}
				} catch (Exception e) {
					e.printStackTrace();
					continue;
				} 
				
			}
			ProductExcelMapping pdtAnno=item.getAnnotation(ProductExcelMapping.class);
			if(pdtAnno!=null){
				try{
					BaseExcelColumnHandler baseCH=(BaseExcelColumnHandler) pdtAnno.commandClass().newInstance();
					baseCH.initData();
					BaseTypeConverter converter=(BaseTypeConverter) Class.forName("com.sp.tool.office.excel."+item.getType().getName().substring(item.getType().getName().lastIndexOf(".")+1)+"TypeConverter").newInstance();
					String setMethod=pdtAnno.methodName();
					Method sMethod= null;
					for(Method method:c.getDeclaredMethods()){
						if(method.getName().equals(setMethod)){
							sMethod=method;
						}
					}
					if(sMethod==null)
						continue;
					FieldReflection fr=new FieldReflection();
					fr.setField(item);
					fr.setSMethod(sMethod);
					fr.setConverter(converter);
					for(String colName:baseCH.getcols()){
						reflection.put(colName,fr);
					}
				}catch(Exception e){
					e.printStackTrace();
					continue;
				}
			}
		}
		refClazz.put(c, reflection);
	}
	public static Map<String,FieldReflection> getReflection(Class c){
		Map<String,FieldReflection> result=refClazz.get(c);
		if(result==null){
			init(c);
		}
		return refClazz.get(c);
	}
	
}
