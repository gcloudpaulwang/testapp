package com.sp.tool.office.excel;

public abstract class BaseExcelColumnHandler {
		public abstract boolean match(String colName) throws ExcelException;
		public abstract void initData() throws ExcelException;
		public abstract String[] getcols();
}
