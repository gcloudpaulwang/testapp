package com.aok.common;

import org.springframework.stereotype.Service;

import com.sp.common.SpProperties;

@Service
public class AokProperties extends SpProperties{
	private String cakeOrderIdPerfix;
	private String accessoryOrderIdPerfix;
	private int cakeOrderIdLen;
	private int accessoryOrderIdLen;
	private String deadline;
	private String first;
	private String second;
	public int getCakeOrderIdLen() {
		return cakeOrderIdLen;
	}
	public int getAccessoryOrderIdLen() {
		return accessoryOrderIdLen;
	}
	public String getDeadline() {
		return deadline;
	}
	public void setCakeOrderIdLen(int cakeOrderIdLen) {
		this.cakeOrderIdLen = cakeOrderIdLen;
	}
	public void setAccessoryOrderIdLen(int accessoryOrderIdLen) {
		this.accessoryOrderIdLen = accessoryOrderIdLen;
	}
	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}
	public String getCakeOrderIdPerfix() {
		return cakeOrderIdPerfix;
	}
	public String getAccessoryOrderIdPerfix() {
		return accessoryOrderIdPerfix;
	}
	public void setCakeOrderIdPerfix(String cakeOrderIdPerfix) {
		this.cakeOrderIdPerfix = cakeOrderIdPerfix;
	}
	public void setAccessoryOrderIdPerfix(String accessoryOrderIdPerfix) {
		this.accessoryOrderIdPerfix = accessoryOrderIdPerfix;
	}
	public String getFirst() {
		return first;
	}
	public String getSecond() {
		return second;
	}
	public void setFirst(String first) {
		this.first = first;
	}
	public void setSecond(String second) {
		this.second = second;
	}
}
