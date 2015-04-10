package com.aok.action;

import com.sp.user.entity.User;

public class ManageAction extends AokAction {
	public String main(){
		User u=getUser();
		switch (u.getERole()) {
			case admin:
				return handleResult("admin_main");
			case factroy:
				return handleResult("factory_main");
			case store:
				return handleResult("store_main");
			case finance:
				return handleResult("finance_main");
		}
		return redirect("../public/loginInput.jspx");
	}

	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return "default";
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return "manage";
	}
	
}
