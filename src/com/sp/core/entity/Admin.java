package com.sp.core.entity;

public class Admin {
	public static final String ADMIN_KEY = "_admin_key";
	private User user;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
