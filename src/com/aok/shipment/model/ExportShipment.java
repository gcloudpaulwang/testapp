package com.aok.shipment.model;

public class ExportShipment {
	private String oid;
	private String cakeName;
	private String cakeSize;
	private String bfCode;
	private Long num;
	private String greeting;
	private String takeStore;
	private String placeStore;
	
	public ExportShipment()
	{
		
	}
	
	public ExportShipment(String oid,String cakeName,String cakeSize,String bfCode,String greeting,String takeStore,String placeStores,Long num)
	{
		this.oid = oid;
		this.cakeName = cakeName;
		this.cakeSize = cakeSize;
		this.bfCode = bfCode;
		this.num = num;
		this.greeting = greeting;
		this.takeStore = takeStore;
		this.placeStore = placeStores;
	}
	
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public String getCakeName() {
		return cakeName;
	}
	public void setCakeName(String cakeName) {
		this.cakeName = cakeName;
	}
	public String getCakeSize() {
		return cakeSize;
	}
	public void setCakeSize(String cakeSize) {
		this.cakeSize = cakeSize;
	}
	public String getBfCode() {
		return bfCode;
	}
	public void setBfCode(String bfCode) {
		this.bfCode = bfCode;
	}
	public Long getNum() {
		return num;
	}
	public void setNum(Long num) {
		this.num = num;
	}
	public String getGreeting() {
		return greeting;
	}
	public void setGreeting(String greeting) {
		this.greeting = greeting;
	}
	public String getTakeStore() {
		return takeStore;
	}
	public void setTakeStore(String takeStore) {
		this.takeStore = takeStore;
	}
	public String getPlaceStore() {
		return placeStore;
	}
	public void setPlaceStore(String placeStore) {
		this.placeStore = placeStore;
	}
	
}
