package com.aok.production.action;

import org.springframework.beans.factory.annotation.Autowired;

import com.aok.action.AokAction;
import com.aok.production.mng.ProductionMng;

public class ProductionAction extends AokAction{
	@Autowired
	private ProductionMng productionMng;
	
	public String list(){
		
		return SUCCESS;
	}
	
	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return null;
	}
}
