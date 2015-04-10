package com.aok.user.entity;

public enum ERole {
	admin(1),
	factroy(2),
	store(3),
	finance(4);
	private int roleId;
	ERole(int roleId){
		this.roleId=roleId;
	}
	public int getRoleId(){
		return roleId;
	}
}
