package com.aok.entity;

/**
 * AccessoryChangeItem entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AccessoryChangeItem implements java.io.Serializable {

	// Fields

	private Integer id;
	//private Integer changeId;
	private AccessoryChange change;
	//private String productId;
	private Product product;
	private Double orglQty;
	private Double newQty;
	private String action;

	// Constructors

	/** default constructor */
	public AccessoryChangeItem() {
	}
	
	public AccessoryChangeItem(Double orglQty,Double newQty){
		this.orglQty=orglQty;
		this.newQty=newQty;
		if(newQty==0D)
			this.action="移除";
		if(newQty>orglQty)
			this.action="增加";
		if(newQty<orglQty)
			this.action="减少";
	}
	
	public AccessoryChangeItem(String action,Double orglQty,Double newQty){
		this.action=action;
		this.orglQty=orglQty;
		this.newQty=newQty;
	}
	
	public Double getDif(){
		return newQty-orglQty;
	}

	// Property accessors

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getOrglQty() {
		return this.orglQty;
	}

	public void setOrglQty(Double orglQty) {
		this.orglQty = orglQty;
	}

	public Double getNewQty() {
		return this.newQty;
	}

	public void setNewQty(Double newQty) {
		this.newQty = newQty;
	}

	public AccessoryChange getChange() {
		return change;
	}

	public void setChange(AccessoryChange change) {
		this.change = change;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

}