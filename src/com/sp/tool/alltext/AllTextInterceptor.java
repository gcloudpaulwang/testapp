package com.sp.tool.alltext;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.sp.common.util.SPException;

public class AllTextInterceptor<T> {
	public T process(T src) throws SPException
	{
		Class c=src.getClass();
		for(Field item:c.getDeclaredFields())
		{
			AllTextField atf=item.getAnnotation(AllTextField.class);
			if(atf!=null&&atf.query().length>0)
			{
				String getStr="get"+item.getName().substring(0,1).toUpperCase()+item.getName().substring(1,item.getName().length());
				try {
					Method getM=c.getDeclaredMethod(getStr);
					Object val=getM.invoke(src);
					if(val!=null &&!val.toString().trim().equals(""))
					{
						for(String str:atf.query())
						{
							String setStr="set"+str.substring(0,1).toUpperCase()+str.substring(1,str.length());
							for(Method method:c.getDeclaredMethods())
							{
								if(method.getName().equals(setStr))
								{
									try {
										if(method.getParameterTypes()[0].equals(Date.class))
										{
											SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
											val=sdf.parse(val.toString());
										}
										method.invoke(src,val);
									} catch (Exception e) {
										// TODO Auto-generated catch block
										//e.printStackTrace();
									}
									break;
								}
							}
						}
						break;
					}
				} catch (SecurityException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					throw new SPException("属性"+item.getName()+"没有相应的get/set方法");
				} catch (NoSuchMethodException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					throw new SPException("属性"+item.getName()+"没有相应的get/set方法");
				}catch(Exception ex)
				{
					throw new SPException(ex.getMessage());
				}
				
			}
		}
		return src;
	}
}
