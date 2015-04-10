package com.aok.entity;

/**
 * CakeAccessoryId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class CakeAccessoryId implements java.io.Serializable {

	// Fields

	private String cakeId;
	private String accessoryId;

	// Constructors

	/** default constructor */
	public CakeAccessoryId() {
	}

	/** full constructor */
	public CakeAccessoryId(String cakeId, String accessoryId) {
		this.cakeId = cakeId;
		this.accessoryId = accessoryId;
	}

	// Property accessors

	public String getCakeId() {
		return this.cakeId;
	}

	public void setCakeId(String cakeId) {
		this.cakeId = cakeId;
	}

	public String getAccessoryId() {
		return this.accessoryId;
	}

	public void setAccessoryId(String accessoryId) {
		this.accessoryId = accessoryId;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof CakeAccessoryId))
			return false;
		CakeAccessoryId castOther = (CakeAccessoryId) other;

		return ((this.getCakeId() == castOther.getCakeId()) || (this
				.getCakeId() != null
				&& castOther.getCakeId() != null && this.getCakeId().equals(
				castOther.getCakeId())))
				&& ((this.getAccessoryId() == castOther.getAccessoryId()) || (this
						.getAccessoryId() != null
						&& castOther.getAccessoryId() != null && this
						.getAccessoryId().equals(castOther.getAccessoryId())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getCakeId() == null ? 0 : this.getCakeId().hashCode());
		result = 37
				* result
				+ (getAccessoryId() == null ? 0 : this.getAccessoryId()
						.hashCode());
		return result;
	}

}