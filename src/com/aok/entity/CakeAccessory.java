package com.aok.entity;

/**
 * CakeAccessory entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class CakeAccessory implements java.io.Serializable {

	// Fields

	private CakeAccessoryId id;
	private Integer rage;

	// Constructors

	/** default constructor */
	public CakeAccessory() {
	}

	/** full constructor */
	public CakeAccessory(CakeAccessoryId id, Integer rage) {
		this.id = id;
		this.rage = rage;
	}

	// Property accessors

	public CakeAccessoryId getId() {
		return this.id;
	}

	public void setId(CakeAccessoryId id) {
		this.id = id;
	}

	public Integer getRage() {
		return this.rage;
	}

	public void setRage(Integer rage) {
		this.rage = rage;
	}

}