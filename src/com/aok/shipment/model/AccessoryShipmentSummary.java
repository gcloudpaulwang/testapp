package com.aok.shipment.model;

import java.util.Date;

public class AccessoryShipmentSummary {
	private Date sendDate;
	private String storeId;
	private String storeName;
	private String pid;
	private String productName;
	private Double first=0D;
	private Double firstSend=0D;
	private Double second=0D;
	private Double secondSend=0D;
	public AccessoryShipmentSummary(){}
	public AccessoryShipmentSummary(Date sendDate,String storeId,String storeName,String pid,String productName){
		this.sendDate=sendDate;
		this.storeId=storeId;
		this.storeName=storeName;
		this.pid=pid;
		this.productName=productName;
	}
	public void addFirst(Double qty){
		this.first+=qty;
	}
	public void addFristSend(Double qty){
		this.firstSend+=qty;
	}
	public void addSceond(Double qty){
		this.second+=qty;
	}
	public void addSecondSend(Double qty){
		this.secondSend+=qty;
	}
	public Double getTotal(){
		return this.first+this.second;
	}
	public Double getTotalSend(){
		return this.firstSend+this.secondSend;
	}
	public Boolean finished(){
		if(getTotal()>getTotalSend())
			return false;
		return true;
	}
	public String getStoreId() {
		return storeId;
	}
	public String getStoreName() {
		return storeName;
	}
	public Double getFirst() {
		return first;
	}
	public Double getSecond() {
		return second;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	public void setFirst(Double first) {
		this.first = first;
	}
	public void setSecond(Double second) {
		this.second = second;
	}
	public Double getFirstSend() {
		return firstSend;
	}
	public Double getSecondSend() {
		return secondSend;
	}
	public void setFirstSend(Double firstSend) {
		this.firstSend = firstSend;
	}
	public void setSecondSend(Double secondSend) {
		this.secondSend = secondSend;
	}
	public String getPid() {
		return pid;
	}
	public String getProductName() {
		return productName;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public Date getSendDate() {
		return sendDate;
	}
	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}
}
