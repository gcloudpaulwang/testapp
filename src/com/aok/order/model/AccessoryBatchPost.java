package com.aok.order.model;

import java.util.ArrayList;
import java.util.List;

public class AccessoryBatchPost {
	private String oid;
	private String operator;
	List<AccessoryPostItem> items=new ArrayList<AccessoryPostItem>();
	public List<AccessoryPostItem> getItems() {
		return items;
	}
	public void setItems(List<AccessoryPostItem> items) {
		this.items = items;
	}
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
}
