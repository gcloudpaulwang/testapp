package com.sp.tool.office.excel;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class FieldReflection{
	private Field field;
	private Method sMethod;
	private Method gMethod;
	private BaseTypeConverter converter;
	public Field getField() {
		return field;
	}
	public Method getSMethod() {
		return sMethod;
	}
	public Method getGMethod() {
		return gMethod;
	}
	public void setField(Field field) {
		this.field = field;
	}
	public void setSMethod(Method method) {
		sMethod = method;
	}
	public void setGMethod(Method method) {
		gMethod = method;
	}
	public BaseTypeConverter getConverter() {
		return converter;
	}
	public void setConverter(BaseTypeConverter converter) {
		this.converter = converter;
	}
}
