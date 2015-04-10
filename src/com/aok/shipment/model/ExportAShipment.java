package com.aok.shipment.model;

public class ExportAShipment {
	private String code;
	private String name;
	private String unit;
	private Double firstNum;
	private Double firstsend;
	private Double secondNum;
	private String remark;
	private String type;
	private Double tNum;
	private Double sendNum;
	
	public ExportAShipment(String code,String name,String unit,Double firstNum,Double secondNum,Double firstsend,String remark,String type)
	{
		this.code = code;
		this.name = name;
		this.unit = unit;
		this.firstNum = firstNum;
		this.firstsend = firstsend;
		this.secondNum = secondNum; 
		this.remark = remark;
		this.type = type;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public Double getFirstNum() {
		return firstNum;
	}
	public void setFirstNum(Double firstNum) {
		this.firstNum = firstNum;
	}
	public Double getSecondNum() {
		return secondNum;
	}
	public void setSecondNum(Double secondNum) {
		this.secondNum = secondNum;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Double gettNum() {
		return tNum;
	}
	public void settNum(Double tNum) {
		this.tNum = tNum;
	}
	public Double getSendNum() {
		return sendNum;
	}
	public void setSendNum(Double sendNum) {
		this.sendNum = sendNum;
	}

	public Double getFirstsend() {
		return firstsend;
	}

	public void setFirstsend(Double firstsend) {
		this.firstsend = firstsend;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	
}
