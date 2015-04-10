package com.aok.action;


import org.springframework.beans.factory.annotation.Autowired;

import com.aok.common.AokProperties;
import com.sp.core.IndeBaseAction;

public abstract class AokAction extends IndeBaseAction {
	
	private Integer limit;
	private AokProperties aokProperties;

	public AokProperties getAokProperties() {
		return aokProperties;
	}

	@Autowired
	public void setAokProperties(AokProperties aokProperties) {
		this.aokProperties = aokProperties;
	}
	public Integer getLimit() {
		if(limit==null||limit==0)
			return 12;
		return limit;
	}
	public void setLimit(Integer limit) {
		this.limit = limit;
	}

}
