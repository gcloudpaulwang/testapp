package com.aok.common;

public enum DictType {
	CAKE_PATTERN("蛋糕裱花"),
	ZONE("地区"),
	UNIT("单位");
	private String cnName;
	DictType(String cnName){
		this.cnName=cnName;
	}
	public String getCnName(){
		return this.cnName;
	}
}
