package com.aok.order.model;

public class AccessoryPostItem {
	private String pid;
	private String action;
	private Double modifyQty;
	private Double newQty;
	public String getPid() {
		return pid;
	}
	public String getAction() {
		return action;
	}
	public Double getModifyQty() {
		return modifyQty;
	}
	public Double getNewQty() {
		return newQty;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public void setModifyQty(Double modifyQty) {
		this.modifyQty = modifyQty;
	}
	public void setNewQty(Double newQty) {
		this.newQty = newQty;
	}
}
