package com.sp.common.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;

public class BaseReflectUtil<S,D> {
	protected Class<S> srcClass=(Class<S>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	protected Class<D> destClass=(Class<D>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
	//只处理成员变量配套有get/set方法的
	public D copyValue(S obj) throws SPException
	{
		if(obj==null) throw new SPException("obj can't been null!");
		D dst=null;
		try {
			dst=destClass.newInstance();
			for(Field f:obj.getClass().getDeclaredFields())
			{
				String getM="get"+f.getName().toUpperCase().substring(0, 1)+f.getName().substring(1,f.getName().length());
				String setM="set"+f.getName().toUpperCase().substring(0, 1)+f.getName().substring(1,f.getName().length());
				Method gm=obj.getClass().getDeclaredMethod(getM);
				if(gm!=null)
				{
					try {
						Method sm=dst.getClass().getDeclaredMethod(setM, f.getType());
						if(sm!=null){
							Object gValue=gm.invoke(obj);
							if(gValue==null)
								continue;
							sm.invoke(dst, gValue);
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						//e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new SPException(e);
		}
		
		return dst;
		
	}
	public void copyValue(S src,D dst,boolean isNullEffect) throws SPException
	{
		S obj=src;
		if(obj==null) throw new SPException("obj can't been null!");
		try {
			for(Field f:obj.getClass().getDeclaredFields())
			{
				String getM="get"+f.getName().toUpperCase().substring(0, 1)+f.getName().substring(1,f.getName().length());
				String setM="set"+f.getName().toUpperCase().substring(0, 1)+f.getName().substring(1,f.getName().length());
				Method gm=obj.getClass().getDeclaredMethod(getM);
				if(gm!=null)
				{
					try {
						Method sm=dst.getClass().getDeclaredMethod(setM, f.getType());
						if(sm!=null){
							Object gValue=gm.invoke(obj);
							if(gValue==null&&!isNullEffect)
								continue;
							sm.invoke(dst, gValue);
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new SPException(e);
		}		
		
	}
	public static void main(String[] args) throws Exception {
		String str="未处理||改约||失败";
		String[] tmp=str.split("\\|\\|");
		System.out.println(tmp.length);
	}
}
