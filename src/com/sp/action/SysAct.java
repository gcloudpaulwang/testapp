package com.sp.action;



import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.sp.common.util.MD5Util;
import com.sp.core.IndeBaseAction;
import com.sp.user.entity.User;
import com.sp.user.mng.UserMng;


public class SysAct extends IndeBaseAction {

	private String username;
	private String password;
	private String validatecode;
	@Autowired
	private UserMng userMng;
	
	public String loginInput(){
		return handleResult("login");
	}
	public String registerInput(){
		return handleResult("register");
	}
	public String login(){
		//String h=this.contextPvd.getRequest().getHeader("User-Agent");
		/*String sCode =(String)contextPvd.getSessionAttr("checkCode");
		if((sCode==null||!validatecode.toLowerCase().equals(sCode.toLowerCase()))){
			this.jsonRoot.put("error", "验证码错误！");
			return SUCCESS;
		}*/
		User user=userMng.authenticate(username, MD5Util.MD5(password));
		if(user!=null){
			contextPvd.logout();
			contextPvd.setSessionAttr(User.USER_KEY, username);
			contextPvd.setSessionAttr(User.RIGHTS_KEY, user.getPermissionsUris());
			contextPvd.setSessionAttr(User.USER_INFO,user);
			this.jsonRoot.put("ui", user);
		}
		else{
			this.jsonRoot.put("error", "帐号密码错误！");
		}
		return SUCCESS;
	}
	public String logout(){
		contextPvd.logout();
		return handleResult("login");
	}
	
	public String listPermissionsUris(){
		String result = checkLoginAndError();
		if (result != null) {
			jsonRoot.put("success", false);
			jsonRoot.put("exception", " 登录超时,请重新登录");
			return SUCCESS;
		}
		List<String> permissionsUris=(List<String>)contextPvd.getSessionAttr(User.RIGHTS_KEY);
		jsonRoot.put("success",true);
		jsonRoot.put("data",permissionsUris);
		return SUCCESS;
	}
	
	public String test(){
		User user=userMng.findById(1);
		List<User> users=userMng.findAll();
		
		jsonRoot.put("success",true);
		jsonRoot.put("data",users);
		return SUCCESS;
	}
	
	public String test2(){
		User user= userMng.findUnique("loginName", "sdfdsf9931");
		user.setEmail("ddafd@dfd");
		userMng.saveOrUpdate(user);
		jsonRoot.put("success",true);
		jsonRoot.put("data",user);
		return SUCCESS;
	}
	
	public String add(){
		for(int i=0;i<100;i++){
			User u=new User();
			u.setCreateTime(new Date());
			u.setEmail("sdfdsf"+i);
			u.setLastLoginIp("aaa"+i);
			u.setLoginName("sdfdsf"+i);
			u.setPwd("sdfdsf"+i);
			userMng.saveOrUpdate(u);
		}
		jsonRoot.put("success",true);
		return SUCCESS;
	}
	
	@Override
	protected String getSolution() {
		// TODO Auto-generated method stub
		return "default";
	}

	@Override
	protected String getSysType() {
		// TODO Auto-generated method stub
		return "public";
	}
	public String getUsername() {
		return username;
	}
	public String getPassword() {
		return password;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getValidatecode() {
		return validatecode;
	}
	public void setValidatecode(String validatecode) {
		this.validatecode = validatecode;
	}


}
