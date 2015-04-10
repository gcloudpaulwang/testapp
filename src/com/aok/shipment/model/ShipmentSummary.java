package com.aok.shipment.model;

import java.util.Date;

import com.sp.common.util.StringUtils;

public class ShipmentSummary {
	private String zone;
	private String storeName;
	private String storeId;
	private Long total;
	private Long send;
	private Date takeDate;
	public ShipmentSummary(){}
	public ShipmentSummary(String storeId){
		this.storeId=storeId;
	}
	public ShipmentSummary(Date takeDate, String storeId,String storeName,String zone,Long total,Long send){
		this.takeDate=takeDate;
		this.storeId=storeId;
		this.storeName=storeName;
		this.zone=zone;
		this.total=total;
		this.send=send;
	}
	public String getStakeDate(){
		return StringUtils.formatDate(takeDate);
	}
	public String getZone() {
		return zone;
	}
	public String getStoreName() {
		return storeName;
	}
	public Long getTotal() {
		return total;
	}
	public Long getSend() {
		return send;
	}
	public void setZone(String zone) {
		this.zone = zone;
	}
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
	public void setSend(Long send) {
		this.send = send;
	}
	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}
	public Long getUnsend(){
		return this.total-this.send;
	}
	public Date getTakeDate() {
		return takeDate;
	}
	public void setTakeDate(Date takeDate) {
		this.takeDate = takeDate;
	}
}
