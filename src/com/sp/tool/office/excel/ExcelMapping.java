package com.sp.tool.office.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

@Target({ElementType.METHOD,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME) 
public @interface ExcelMapping {
	String[] name();//excel单元格对应名
	boolean required() default false;
}
