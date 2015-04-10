package com.sp.tool.office.excel.export;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ExportExcelInfo {
	
	String colName();
	int colNum();//列数大于1且连续不重复
	
}
