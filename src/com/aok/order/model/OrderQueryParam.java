package com.aok.order.model;

import java.util.Date;

import com.sp.user.entity.User;

public class OrderQueryParam {
	private String oid;
	private String zone;
	private String cakeId;
	private String placeStoreId;
	private String takeStoreId;
	private Boolean hasSend;
	private Date takeDate;
	private String takeTime;
	private User user;
	private Boolean modified;
	public String getOid() {
		return oid;
	}
	public String getZone() {
		return zone;
	}
	public String getPlaceStoreId() {
		return placeStoreId;
	}
	public String getTakeStoreId() {
		return takeStoreId;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public void setZone(String zone) {
		this.zone = zone;
	}
	public void setPlaceStoreId(String placeStoreId) {
		this.placeStoreId = placeStoreId;
	}
	public void setTakeStoreId(String takeStoreId) {
		this.takeStoreId = takeStoreId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getCakeId() {
		return cakeId;
	}
	public void setCakeId(String cakeId) {
		this.cakeId = cakeId;
	}
	public Boolean getHasSend() {
		return hasSend;
	}
	public void setHasSend(Boolean hasSend) {
		this.hasSend = hasSend;
	}
	public Date getTakeDate() {
		return takeDate;
	}
	public void setTakeDate(Date takeDate) {
		this.takeDate = takeDate;
	}
	public String getTakeTime() {
		return takeTime;
	}
	public void setTakeTime(String takeTime) {
		this.takeTime = takeTime;
	}
	public Boolean getModified() {
		return modified;
	}
	public void setModified(Boolean modified) {
		this.modified = modified;
	}
	
}
