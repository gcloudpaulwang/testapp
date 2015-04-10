package com.sp.user.action;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.sp.core.IndeBaseAction;
import com.sp.user.entity.Role;
import com.sp.user.mng.RoleMng;

public class UserAction extends IndeBaseAction {
	@Autowired
	private RoleMng roleMng;
	public String listRoles(){
		List<Role> roles= roleMng.findAll();
		jsonRoot.put("data",roles);
		jsonRoot.put("success", true);
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
