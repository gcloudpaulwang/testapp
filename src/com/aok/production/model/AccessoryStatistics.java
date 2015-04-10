package com.aok.production.model;

public class AccessoryStatistics {
	private String name;
	private String type;
	private Double num;
	private String unit;
//	private Double first;
//	private Double second;
//	private Double firstSend;
//	private Double secondSend;
	private Double send;
	private String objId;
	
	public AccessoryStatistics(String objId,String name,String unit,Double firstSend,Double secondSend)
	{
		this.name = name;
		this.objId = objId;
		this.send = firstSend+secondSend;
		this.unit = unit;
	}
	
	public AccessoryStatistics(String name,String type,Double num,String unit)
	{
		this.name = name;
		this.type = type;
		this.num = num;
		this.unit = unit;
	}
	
	public AccessoryStatistics(String name,String type,Double first,Double second,Double firstSend,Double secondSend,String unit)
	{
		this.name = name;
		this.type = type;
		this.num = first+second;
		this.unit = unit;
		this.send = firstSend+secondSend;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Double getNum() {
		return num;
	}
	public void setNum(Double num) {
		this.num = num;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getSend() {
		return send;
	}

	public void setSend(Double send) {
		this.send = send;
	}

	public String getObjId() {
		return objId;
	}

	public void setObjId(String objId) {
		this.objId = objId;
	}
	
}
