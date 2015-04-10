package com.aok.entity;

import java.util.Date;

/**
 * CakeOrderChange entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class CakeOrderChange implements java.io.Serializable {

	// Fields

	private Integer id;
	//private CakeOrder order;
	private String oid;
	private String content;
	private String operator;
	private Date changeDate;

	// Constructors

	/** default constructor */
	public CakeOrderChange() {
	}

	/** minimal constructor */
	public CakeOrderChange(Integer id) {
		this.id = id;
	}


	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}


	public Date getChangeDate() {
		return this.changeDate;
	}

	public void setChangeDate(Date changeDate) {
		this.changeDate = changeDate;
	}
	/*
	public CakeOrder getOrder() {
		return order;
	}

	public void setOrder(CakeOrder order) {
		this.order = order;
	}
	*/
	public String getOid() {
		return oid;
	}

	public void setOid(String oid) {
		this.oid = oid;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

}