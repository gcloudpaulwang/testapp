package com.sp.common.util;

public class MultiOpsResult {
	private String key;
	private Integer result;
	private String id;
	public MultiOpsResult(String id,String key, Integer result) {
		super();
		this.id=id;
		this.key = key;
		this.result = result;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public Integer getResult() {
		return result;
	}
	public void setResult(Integer result) {
		this.result = result;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
}
