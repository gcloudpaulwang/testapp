package com.sp.common.entity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class Dict implements Serializable{
	private String key;
	private String value;
	private String type;
	private String typeCn;
	private static Map<String,String> cnMap = new HashMap<String,String>();
	static
	{
		cnMap.put("CAKE_PATTERN","蛋糕裱花");
		cnMap.put("UNIT","单位");
		cnMap.put("ZONE","地区");
		cnMap.put("PRODUCT_TYPE","产品");
	}
	public String getKey() {
		return key;
	}
	public String getValue() {
		return value;
	}
	public String getType() {
		return type;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTypeCn() {
		return typeCn;
	}
	public void setTypeCn(String type) {
		this.typeCn = cnMap.get(type);
	}
}
