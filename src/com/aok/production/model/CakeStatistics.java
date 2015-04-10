package com.aok.production.model;

public class CakeStatistics {
	private int no;
	private String cakeName;
	private Long cakeNum;
//	private Boolean plain;
//    private Boolean group;
    private String bfCode;
//    private String type;
    private String cakeSize;
    
    private String unit;
    private Long send;
    private String cakeId;
    
    public CakeStatistics(String cakeId,String cakeName,String unit,Long send)
	{
		this.cakeName = cakeName;
		this.cakeId = cakeId;
		this.send = send;
		this.unit = unit;
	}
	
	public CakeStatistics(String cakeName,Long cakeNum,String bfCode,String cakeSize,String unit)
	{
		this.cakeName = cakeName;
		this.cakeNum = cakeNum;
//		this.plain = plain;
//		this.group = group;
		this.bfCode = bfCode;
		this.cakeSize = cakeSize;
		this.unit = unit;
	}

	public String getCakeName() {
		return cakeName;
	}

	public void setCakeName(String cakeName) {
		this.cakeName = cakeName;
	}

	public Long getCakeNum() {
		return cakeNum;
	}

	public void setCakeNum(Long cakeNum) {
		this.cakeNum = cakeNum;
	}

	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
	}

//	public Boolean getPlain() {
//		return plain;
//	}
//
//	public void setPlain(Boolean plain) {
//		this.plain = plain;
//	}
//
//	public Boolean getGroup() {
//		return group;
//	}
//
//	public void setGroup(Boolean group) {
//		this.group = group;
//	}

	public String getBfCode() {
		return bfCode;
	}

	public void setBfCode(String bfCode) {
		this.bfCode = bfCode;
	}

	public String getCakeSize() {
		return cakeSize;
	}

	public void setCakeSize(String cakeSize) {
		this.cakeSize = cakeSize;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Long getSend() {
		return send;
	}

	public void setSend(Long send) {
		this.send = send;
	}

	public String getCakeId() {
		return cakeId;
	}

	public void setCakeId(String cakeId) {
		this.cakeId = cakeId;
	}

//	public String getType() {
//		return type;
//	}
//
//	public void setType(String type) {
//		this.type = type;
//	}
	
}
