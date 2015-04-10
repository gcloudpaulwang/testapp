package com.sp.tool.office.excel;

public class ExcelError {
	private int rowIndex;//-1代表所有行
	private int colIndex;//-1代表所有列
	private String message;
	
	public ExcelError(int rowIndex, int colIndex, String message) {
		super();
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		this.message = message;
	}
	public int getRowIndex() {
		return rowIndex;
	}
	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}
	public int getColIndex() {
		return colIndex;
	}
	public void setColIndex(int colIndex) {
		this.colIndex = colIndex;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public ExcelError(String message) {
		super();
		this.message = message;
	}
	@Override
	public String toString()
	{
		return String.format("第%s行记录的%s", rowIndex,message);
	}
}
