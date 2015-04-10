package com.aok.entity;

import com.googlecode.jsonplugin.annotations.JSON;

/**
 * OrderAccessory entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class OrderAccessory implements java.io.Serializable {

	// Fields

	private Integer id;
	//private String oid;
	private AccessoryOrder od;
	private Product product;
	private Double qty;
	private Short firstMark;
	private Long firstSendQty;
	private String remark;
	
	public String  getOid(){
		return od.getId();
	}

	// Constructors

	/** default constructor */
	public OrderAccessory() {
	}
	
	public OrderAccessory(AccessoryOrder od,Product product,Double qty){
		this.od=od;
		this.product=product;
		this.qty=qty;
	}


	// Property accessors

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getQty() {
		return this.qty;
	}

	public void setQty(Double qty) {
		this.qty = qty;
	}

	public Short getFirstMark() {
		return this.firstMark;
	}

	public void setFirstMark(Short firstMark) {
		this.firstMark = firstMark;
	}

	public Long getFirstSendQty() {
		return this.firstSendQty;
	}

	public void setFirstSendQty(Long firstSendQty) {
		this.firstSendQty = firstSendQty;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}


	@JSON(serialize=false)
	public AccessoryOrder getOd() {
		return od;
	}



	public void setOd(AccessoryOrder od) {
		this.od = od;
	}

}