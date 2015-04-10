package com.aok.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.googlecode.jsonplugin.annotations.JSON;

/**
 * AccessoryOrder entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class AccessoryOrder implements java.io.Serializable {

	// Fields

	private String id;
	private int seq;
	private Date createDate;
	private Store placeStore;
	private String placeStoreName;
	private String placeStoreTel;
	private String takeStoreName;
	private Store takeStore;
	private Date takeDate;
	private Date placeDate;
	private String takeTime;
	private String operator;
	private String sendOperator;
	private Date sendDate;
	private String driver;
	private String zone;
	private Boolean editable=true;
	private Integer changeTime;
	private Set<OrderAccessory> accessories=new HashSet<OrderAccessory>();
	private Set<AccessoryChange> changes=new HashSet<AccessoryChange>();

	// Constructors

	/** default constructor */
	public AccessoryOrder() {
	}

	/** minimal constructor */
	public AccessoryOrder(String id) {
		this.id = id;
	}


	// Property accessors

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}


	public String getPlaceStoreName() {
		return this.placeStoreName;
	}

	public void setPlaceStoreName(String placeStoreName) {
		this.placeStoreName = placeStoreName;
	}


	public Date getSendDate() {
		return this.sendDate;
	}

	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}

	public String getDriver() {
		return this.driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public Store getPlaceStore() {
		return placeStore;
	}

	public String getTakeStoreName() {
		return takeStoreName;
	}

	public Store getTakeStore() {
		return takeStore;
	}

	public void setPlaceStore(Store placeStore) {
		this.placeStore = placeStore;
	}

	public void setTakeStoreName(String takeStoreName) {
		this.takeStoreName = takeStoreName;
	}

	public void setTakeStore(Store takeStore) {
		this.takeStore = takeStore;
	}

	public Date getTakeDate() {
		return takeDate;
	}

	public void setTakeDate(Date takeDate) {
		this.takeDate = takeDate;
	}
	@JSON(deserialize=false)
	public Set<OrderAccessory> getAccessories() {
		return accessories;
	}

	public void setAccessories(Set<OrderAccessory> accessories) {
		this.accessories = accessories;
	}

	public Date getPlaceDate() {
		return placeDate;
	}

	public void setPlaceDate(Date placeDate) {
		this.placeDate = placeDate;
	}

	public String getPlaceStoreTel() {
		return placeStoreTel;
	}

	public void setPlaceStoreTel(String placeStoreTel) {
		this.placeStoreTel = placeStoreTel;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getSendOperator() {
		return sendOperator;
	}

	public void setSendOperator(String sendOperator) {
		this.sendOperator = sendOperator;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

	public String getTakeTime() {
		return takeTime;
	}

	public void setTakeTime(String takeTime) {
		this.takeTime = takeTime;
	}

	public Boolean getEditable() {
		return editable;
	}

	public void setEditable(Boolean editable) {
		this.editable = editable;
	}
	@JSON(serialize=false)
	public Set<AccessoryChange> getChanges() {
		return changes;
	}

	public void setChanges(Set<AccessoryChange> changes) {
		this.changes = changes;
	}

	public Integer getChangeTime() {
		return changeTime==null?0:changeTime;
	}

	public void setChangeTime(Integer changeTime) {
		this.changeTime = changeTime;
	}

}