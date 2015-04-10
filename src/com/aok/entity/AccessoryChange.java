package com.aok.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.sp.common.util.StringUtils;

/**
 * AccessoryChange entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AccessoryChange implements java.io.Serializable {

	// Fields

	private String id;
	private String oid;
	private Date changeDate;
	private String operator;
	private Set<AccessoryChangeItem> items=new HashSet<AccessoryChangeItem>();

	// Constructors

	/** default constructor */
	public AccessoryChange() {
		
	}

	/** full constructor */
	public AccessoryChange(String oid, Date changeDate, String operator) {
		this.oid = oid;
		this.changeDate = changeDate;
		this.operator = operator;
	}

	// Property accessors
	
	public String getSchangeDate(){
		if(changeDate!=null)
    		return StringUtils.formatDate(changeDate, "yyyy-MM-dd HH:mm");
    	return "";
	}
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOid() {
		return this.oid;
	}

	public void setOid(String oid) {
		this.oid = oid;
	}

	public Date getChangeDate() {
		return this.changeDate;
	}

	public void setChangeDate(Date changeDate) {
		this.changeDate = changeDate;
	}

	public String getOperator() {
		return this.operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public Set<AccessoryChangeItem> getItems() {
		return items;
	}

	public void setItems(Set<AccessoryChangeItem> items) {
		this.items = items;
	}

}