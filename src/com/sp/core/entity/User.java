package com.sp.core.entity;

public class User {
	//public static final String USER_KEY = "_user_key";
	//public static final String USER_PWD = "_user_pwd";
	//public static final String USER_INFO="_user_info";
	//public static final String RIGHTS_KEY="_rights_key";
	private int id;
	private String loginName;
	private String email;
	private String password;
	public int getId() {
		return id;
	}
	public String getLoginName() {
		return loginName;
	}
	public String getEmail() {
		return email;
	}
	public String getPassword() {
		return password;
	}
	public void setId(int id) {
		this.id = id;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
