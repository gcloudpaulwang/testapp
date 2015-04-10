package com.sp.tool.office.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

@Target({ElementType.METHOD,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME) 
public @interface ProductExcelMapping {
	String methodName();//处理集合对象的方法名
	Class commandClass();
	boolean required() default true;
}
