package com.aok.entity;

import java.util.Date;

import com.sp.common.util.StringUtils;

/**
 * AccessoryShipment entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AccessoryShipment implements java.io.Serializable {

	// Fields

	private Integer id;
	private Date sendDate;
	private Store store;
	private Product product;
	private Double first=0D;
	private Double second=0D;
	private Double firstSend=0D;
	private Double secondSend=0D;
	private String remark;
	private String firstOperator;
	private String secondOperator;
	private Date firstMarkDate;
	private Date secondMarkDate;

	// Constructors

	/** default constructor */
	public AccessoryShipment() {
	}
	
	public AccessoryShipment(Date sendDate,Store store,Double qty,Double send) {
		this.sendDate=sendDate;
		this.store=store;
		this.first=qty;
		this.firstSend=send;
	}
	public AccessoryShipment(Date sendDate,Store store,Product product){
		this.sendDate=sendDate;
		this.store=store;
		this.product=product;
	}
	public String  getSsendDate(){
		return StringUtils.formatDate(sendDate);
	}
	public void addFirst(Double qty){
		this.first+=qty;
	}
	public void addFristSend(Double qty){
		this.firstSend+=qty;
	}
	public void addSecond(Double qty){
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
	public Boolean getFinished(){
		if(getTotal()>getTotalSend())
			return false;
		return true;
	}
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Date getSendDate() {
		return this.sendDate;
	}

	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}



	public Store getStore() {
		return store;
	}

	public Product getProduct() {
		return product;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public void setProduct(Product product) {
		this.product = product;
	}


	public Double getFirst() {
		return first;
	}

	public Double getSecond() {
		return second;
	}
	public Double getSecondV(){
		return second+first-firstSend;
	}

	public Double getFirstSend() {
		return firstSend;
	}

	public Double getSecondSend() {
		return secondSend;
	}


	public String getFirstOperator() {
		return firstOperator;
	}

	public String getSecondOperator() {
		return secondOperator;
	}

	public Date getFirstMarkDate() {
		return firstMarkDate;
	}

	public Date getSecondMarkDate() {
		return secondMarkDate;
	}

	public void setFirst(Double first) {
		this.first = first;
	}

	public void setSecond(Double second) {
		this.second = second;
	}

	public void setFirstSend(Double firstSend) {
		this.firstSend = firstSend;
	}

	public void setSecondSend(Double secondSend) {
		this.secondSend = secondSend;
	}


	public void setFirstOperator(String firstOperator) {
		this.firstOperator = firstOperator;
	}

	public void setSecondOperator(String secondOperator) {
		this.secondOperator = secondOperator;
	}

	public void setFirstMarkDate(Date firstMarkDate) {
		this.firstMarkDate = firstMarkDate;
	}

	public void setSecondMarkDate(Date secondMarkDate) {
		this.secondMarkDate = secondMarkDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}